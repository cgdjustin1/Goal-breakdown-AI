"""
Resource Finder Service.

This module provides functionality to find and summarize learning resources
for tasks using SerpAPI and the Claude AI model.
"""

import requests
import anthropic
from backend.config import ANTHROPIC_API_KEY, SERPAPI_KEY, CLAUDE_MODEL

class ResourceFinderService:
    """Service to find and summarize learning resources for tasks."""

    def __init__(self, anthropic_api_key=ANTHROPIC_API_KEY, 
                 serpapi_key=SERPAPI_KEY, model=CLAUDE_MODEL):
        """Initialize the service with API keys and model.
        
        Args:
            anthropic_api_key (str): Anthropic API key
            serpapi_key (str): SerpAPI key
            model (str): Claude model to use
        """
        self.anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
        self.serpapi_key = serpapi_key
        self.model = model
    
    def search_serpapi(self, query, num_results=5):
        """Search for resources using SerpAPI.
        
        Args:
            query (str): Search query
            num_results (int): Number of results to return
            
        Returns:
            tuple: (summaries, raw_results)
        """
        params = {
            "q": query,
            "api_key": self.serpapi_key,
            "engine": "google",
            "num": num_results
        }
        response = requests.get("https://serpapi.com/search", params=params)
        results = response.json().get("organic_results", [])
        summaries = [
            f"Title: {r.get('title')}\nSnippet: {r.get('snippet')}\nLink: {r.get('link')}"
            for r in results
        ]
        return summaries, results

    def summarize_resources(self, task_description, context_text):
        """Summarize resources for a task using Claude.
        
        Args:
            task_description (str): Description of the task
            context_text (str): Text context of found resources
            
        Returns:
            str: Summarized resources
        """
        message = self.anthropic_client.messages.create(
            model=self.model,
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

    def get_resources_for_task(self, task_description, resource_tags=None):
        """Get and summarize resources for a task.
        
        Args:
            task_description (str): Description of the task
            resource_tags (list): List of resource tags to use in search
            
        Returns:
            dict: Resources and summary for the task
        """
        search_query = task_description
        if resource_tags and isinstance(resource_tags, list) and len(resource_tags) > 0:
            search_query += " " + " ".join(resource_tags)
        
        summaries, results = self.search_serpapi(search_query)
        context_text = "\n\n".join(summaries)
        
        summary = self.summarize_resources(task_description, context_text)
        
        return {
            "task": task_description,
            "resources": results,
            "summary": summary
        }
