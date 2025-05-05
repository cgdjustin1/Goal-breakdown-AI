import anthropic
import json
from config import anthropic_api_key

# Initialize Claude client
client = anthropic.Anthropic(api_key=anthropic_api_key)

def classify_tasks_with_claude(descriptions, client):
    # Construct classification prompt
    prompt = f"""
Please classify the following task descriptions into two categories:

- "need_resource": if the task requires studying, learning, or reviewing content
- "no_resource": if the task is purely action or planning and doesn't require learning

Return a valid JSON object with this format:
{{
  "need_resource": [...],
  "no_resource": [...]
}}

Tasks:
{chr(10).join(f"- {desc}" for desc in descriptions)}
"""

    # Claude API call
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}]
    )

    # Parse response text
    text = response.content[0].text.strip()

    # Clean markdown
    if text.startswith("```json"):
        text = text.removeprefix("```json").strip()
    if text.endswith("```"):
        text = text.removesuffix("```").strip()

    try:
        classified = json.loads(text)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON after stripping markdown", "raw": text}

    # Transform into list of {"description": ..., "need_resource": True/False}
    final_result = []
    for desc in classified.get("need_resource", []):
        final_result.append({"description": desc, "need_resource": True})
    for desc in classified.get("no_resource", []):
        final_result.append({"description": desc, "need_resource": False})

    return final_result


# === EXAMPLE USAGE ===
if __name__ == "__main__":
    descriptions = [
        "Study the TOEFL scoring criteria",
        "Create a weekly study plan",
        "Book the TOEFL exam",
        "Practice TOEFL listening",
        "Review past mock exam mistakes"
    ]

    result = classify_tasks_with_claude(descriptions, client)

    print("=== Subtasks with Resource Flag ===")
    print(json.dumps(result, indent=2, ensure_ascii=False))
