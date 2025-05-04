"""
Task Breakdown Service.

This module provides functionality to break down a goal into milestones and tasks
using the Claude AI model.
"""

import anthropic
import json
import re
from backend.config import ANTHROPIC_API_KEY, CLAUDE_MODEL

class TaskBreakdownService:
    """Service to handle the breakdown of goals into tasks and milestones."""

    def __init__(self, api_key=ANTHROPIC_API_KEY, model=CLAUDE_MODEL):
        """Initialize the service with API key and model.
        
        Args:
            api_key (str): Anthropic API key
            model (str): Claude model to use
        """
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
    
    def breakdown_goal(self, goal):
        """Break down a goal into milestones and tasks using Claude.
        
        Args:
            goal (str): The goal to break down
            
        Returns:
            dict: Parsed JSON response with milestones and tasks
        """
        user_prompt = f"""
        Please break down the following goal into multiple milestones. Each milestone should include:
        - title: a concise description
        - week_range: an array like [start_week, end_week]
        - tasks: a list of tasks under the milestone, and each task should include:
          - description: what the task is about
          - estimated_time_hours: estimated time to complete this task (in hours)
          - resource_tags: a list of keywords related to this task, used for learning resource recommendation

        Return the result as **valid JSON format only**, with no extra explanation or comments.

        Goal: {goal}
        """

        response = self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            temperature=0.5,
            system="You are a smart task breakdown assistant that returns structured JSON.",
            messages=[{"role": "user", "content": user_prompt}]
        )

        text = response.content[0].text
        parsed_json = self.parse_json_response(text)
        
        # Extract subtasks if no error
        if not parsed_json.get('error'):
            subtasks = self.extract_subtasks(parsed_json)
            parsed_json['subtasks'] = subtasks
            
        return parsed_json

    @staticmethod
    def parse_json_response(text):
        """Parse JSON response with fallback for partial matches.
        
        Args:
            text (str): Text response from Claude
            
        Returns:
            dict: Parsed JSON or error information
        """
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

    @staticmethod
    def extract_subtasks(parsed_json):
        """Extract all subtasks into a flat list.
        
        Args:
            parsed_json (dict): Parsed JSON from Claude response
            
        Returns:
            list: Flat list of subtasks
        """
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

    @staticmethod
    def subtask_descriptions(subtasks):
        """Extract list of subtask descriptions.
        
        Args:
            subtasks (list): List of subtask dictionaries
            
        Returns:
            list: List of subtask descriptions
        """
        return [task["description"] for task in subtasks]
