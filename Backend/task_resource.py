import os
import requests
from dotenv import load_dotenv
from anthropic import Anthropic

# Load environment variables from .env file
load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def search_serpapi(query, num_results=5):
    params = {
        "q": query,
        "api_key": SERPAPI_KEY,
        "engine": "google",
        "num": num_results
    }
    response = requests.get("https://serpapi.com/search", params=params)
    results = response.json().get("organic_results", [])
    summaries = [
        f"Title: {r.get('title')}\nSnippet: {r.get('snippet')}\nLink: {r.get('link')}"
        for r in results
    ]
    return "\n\n".join(summaries)

def query_claude(task_description, context_text):
    client = Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        temperature=0.5,
        system="You are an AI assistant that summarizes provided resources relevant to a given task.",
        messages=[
            {
                "role": "user",
                "content": f"Task: {task_description}\n\nResources from online:\n{context_text}\n\nPlease summarize the key points from each of these resources relevant to the task, and provide the corresponding link for each resource."
            }
        ]
    )
    return message.content[0].text

if __name__ == "__main__":
    task = input("Enter the task description: ")
    if not task:
        print("Task description cannot be empty.")
        exit(1)
    if not ANTHROPIC_API_KEY or not SERPAPI_KEY:
        print("Please set the ANTHROPIC_API_KEY and SERPAPI_KEY environment variables.")
        exit(1)
    print(f"Task: {task}\n")

    print("[Step 1] Searching online resources...")
    search_results = search_serpapi(task)

    print("[Step 2] Querying Claude...")
    result = query_claude(task, search_results)
    print("\n[Claude's Plan/Assignment]\n")
    print(result)