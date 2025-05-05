import anthropic
import json
import re
from config import anthropic_api_key
# Initialize Claude client

client = anthropic.Anthropic(api_key= anthropic_api_key)  # Replace with your key

user_prompt = """
Please break down the following goal into multiple milestones. Each milestone should include:
- title: a concise description
- week_range: an array like [start_week, end_week]
- tasks: a list of tasks under the milestone, and each task should include:
  - description: what the task is about
  - estimated_time_hours: estimated time to complete this task (in hours)
  - resource_tags: a list of keywords related to this task, used for learning resource recommendation

Return the result as **valid JSON format only**, with no extra explanation or comments.

Goal: Pass the TOEFL exam in three months
"""

response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=2048,
    temperature=0.5,
    system="You are a smart task breakdown assistant that returns structured JSON.",
    messages=[{"role": "user", "content": user_prompt}]
)

text = response.content[0].text

# === JSON parse with fallback ===
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

parsed = parse_json_response(text)

# === Extract all subtasks into a flat list ===
def extract_subtasks(parsed_json):
    subtasks = []
    if isinstance(parsed_json, dict) and "milestones" in parsed_json:
        for milestone in parsed_json["milestones"]:
            milestone_title = milestone.get("title", "")
            for task in milestone.get("tasks", []):
                subtasks.append({
                    "milestone": milestone_title,
                    "description": task.get("description", ""),
                    "estimated_time_hours": task.get("estimated_time_hours", None),
                    "resource_tags": task.get("resource_tags", [])
                })
    return subtasks

# === Extract list of subtask descriptions ===
def subtask_descriptions(subtasks):
    return [task["description"] for task in subtasks]

# === Final result: list of subtask descriptions ===
subtasks = extract_subtasks(parsed)
descriptions = subtask_descriptions(subtasks)

print("\n=== Subtask Descriptions ===")
print(descriptions)
