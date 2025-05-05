from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import json
import re
import requests
from dotenv import load_dotenv
from anthropic import Anthropic

# === Load Keys ===
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

# === Setup Flask ===
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = Anthropic(api_key=ANTHROPIC_API_KEY)

# === Global CORS Headers ===
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response

# === Helper: Parse JSON safely ===
def parse_json_response(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                return {"error": "Partial JSON match failed", "raw": match.group(0)}
        return {"error": "Failed to parse JSON", "raw": text}

# === Helper: Extract Subtasks ===
def extract_subtasks(parsed_json):
    subtasks = []
    if isinstance(parsed_json, dict) and "milestones" in parsed_json:
        for milestone in parsed_json["milestones"]:
            milestone_title = milestone.get("title", "")
            for task in milestone.get("tasks", []):
                subtasks.append({
                    "milestone": milestone_title,
                    "description": task.get("description", ""),
                    "estimated_time_hours": task.get("estimated_time_hours", 1),
                    "resource_tags": task.get("resource_tags", []),
                    "need_resource": None,
                    "recommendations": None
                })
    return subtasks

# === Endpoint: /api/task-breakdown ===
@app.route('/api/task-breakdown', methods=['POST', 'OPTIONS'])
def task_breakdown():
    if request.method == 'OPTIONS':
        return make_response('', 200)

    goal = request.json.get('goal', '')
    if not goal:
        return jsonify({"error": "Missing goal"}), 400

    # Step 1: Claude breakdown
    user_prompt = f"""
    Please break down the following goal into multiple milestones.  at most 6 tasks total ❶
    Please break down the following goal into **at most 6 tasks total** ❶
    (If the goal logically needs more, merge or get those within 6 tasks。)    
    Each milestone should include:
    - title: a concise description
    - week_range: an array like [start_week, end_week]
    - tasks: a list of tasks under the milestone, and each task should include:
      - description
      - estimated_time_hours
      - resource_tags
    Return only valid JSON.
    Goal: {goal}
    """
    try:
        response = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=2048,
            temperature=0.5,
            system="You are a smart task breakdown assistant that returns structured JSON.",
            messages=[{"role": "user", "content": user_prompt}]
        )
        parsed = parse_json_response(response.content[0].text)
        subtasks = extract_subtasks(parsed)
    except Exception as e:
        return jsonify({"error": f"Claude breakdown failed: {str(e)}"}), 500

    # Step 2: Classification
    classification_prompt = """
    Please classify the following task descriptions into two categories:
    - "need_resource": if the task requires studying/learning
    - "no_resource": if it's only execution or planning

    Return JSON:
    {
      "need_resource": [...],
      "no_resource": [...]
    }

    Tasks:
    """ + "\n".join(f"- {t['description']}" for t in subtasks)

    try:
        classify_resp = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=1024,
            temperature=0.3,
            messages=[{"role": "user", "content": classification_prompt}]
        )
        classify_data = json.loads(classify_resp.content[0].text.strip())
        for task in subtasks:
            task["need_resource"] = task["description"] in classify_data.get("need_resource", [])
    except Exception as e:
        print("[Classification Error]", str(e))

    return jsonify(subtasks)

# === Endpoint: /api/task-resource ===
@app.route('/api/task-resource', methods=['POST', 'OPTIONS'])
def task_resource():
    if request.method == 'OPTIONS':
        return make_response('', 200)

    desc = request.json.get("description", "")
    tags = request.json.get("resource_tags", [])
    if not desc:
        return jsonify({"error": "Missing task description"}), 400

    try:
        query = desc + " " + " ".join(tags)
        search_resp = requests.get("https://serpapi.com/search", params={
            "q": query,
            "api_key": SERPAPI_KEY,
            "engine": "google",
            "num": 5
        })
        results = search_resp.json().get("organic_results", [])
        summary_text = "\n\n".join([
            f"Title: {r.get('title')}\nSnippet: {r.get('snippet')}\nLink: {r.get('link')}"
            for r in results
        ])

        claude_summary = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=1024,
            temperature=0.5,
            system="You are an AI assistant that summarizes resources relevant to a task.",
            messages=[{
                "role": "user",
                "content": f"Task: {desc}\n\nResources:\n{summary_text}\n\nSummarize key points with links."
            }]
        )
        summary = claude_summary.content[0].text
    except Exception as e:
        summary = f"Claude summary failed: {str(e)}"

    return jsonify({"summary": summary})

# === Run ===
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5100, debug=True)  # ✅ 换掉 5000

