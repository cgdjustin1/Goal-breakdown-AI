"""
Subtask Classification Service.

This module provides functionality to classify tasks based on whether they require learning
resources or not, using the Claude AI model.
"""

import anthropic
import json
from backend.config import ANTHROPIC_API_KEY, CLAUDE_MODEL

class SubtaskClassificationService:
    """Service to handle classification of tasks based on resource needs."""

    def __init__(self, api_key=ANTHROPIC_API_KEY, model=CLAUDE_MODEL):
        """Initialize the service with API key and model.
        
        Args:
            api_key (str): Anthropic API key
            model (str): Claude model to use
        """
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
    
    def classify_tasks(self, descriptions):
        """Classify tasks based on whether they need learning resources.
        
        Args:
            descriptions (list): List of task descriptions to classify
            
        Returns:
            list: List of classified tasks with resource needs
        """
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
        response = self.client.messages.create(
            model=self.model,
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
