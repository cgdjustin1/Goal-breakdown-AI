"""
Test cases for the Task Breakdown service.
"""

import unittest
from unittest.mock import patch, MagicMock
import json

from backend.services.task_breakdown_service import TaskBreakdownService

class TestTaskBreakdownService(unittest.TestCase):
    """Test suite for the TaskBreakdownService class."""
    
    def setUp(self):
        """Set up test fixtures before each test."""
        self.mock_api_key = "mock_api_key"
        self.mock_model = "mock_model"
        self.service = TaskBreakdownService(api_key=self.mock_api_key, model=self.mock_model)
    
    @patch('anthropic.Anthropic')
    def test_breakdown_goal(self, mock_anthropic_class):
        """Test the breakdown_goal method with a valid goal."""
        # Arrange
        mock_anthropic_instance = MagicMock()
        mock_anthropic_class.return_value = mock_anthropic_instance
        
        mock_content = MagicMock()
        mock_content.text = """
        {
            "milestones": [
                {
                    "title": "Initial Planning Phase",
                    "week_range": [1, 2],
                    "tasks": [
                        {
                            "description": "Define project scope",
                            "estimated_time_hours": 3,
                            "resource_tags": ["project management", "planning"]
                        }
                    ]
                }
            ]
        }
        """
        
        mock_response = MagicMock()
        mock_response.content = [mock_content]
        mock_anthropic_instance.messages.create.return_value = mock_response
        
        # Act
        result = self.service.breakdown_goal("Complete project")
        
        # Assert
        self.assertIn("milestones", result)
        self.assertEqual(1, len(result["milestones"]))
        self.assertEqual("Initial Planning Phase", result["milestones"][0]["title"])
        self.assertIn("subtasks", result)
        self.assertEqual(1, len(result["subtasks"]))
        self.assertEqual("Define project scope", result["subtasks"][0]["description"])
    
    def test_parse_json_response_valid(self):
        """Test parsing a valid JSON response."""
        # Arrange
        valid_json = '{"key": "value"}'
        
        # Act
        result = self.service.parse_json_response(valid_json)
        
        # Assert
        self.assertEqual({"key": "value"}, result)
    
    def test_parse_json_response_invalid(self):
        """Test parsing an invalid JSON response with fallback."""
        # Arrange
        invalid_json = 'Some text before {"key": "value"} some text after'
        
        # Act
        result = self.service.parse_json_response(invalid_json)
        
        # Assert
        self.assertEqual({"key": "value"}, result)
    
    def test_extract_subtasks(self):
        """Test extracting subtasks from a parsed JSON response."""
        # Arrange
        parsed_json = {
            "milestones": [
                {
                    "title": "Milestone 1",
                    "tasks": [
                        {
                            "description": "Task 1",
                            "estimated_time_hours": 2,
                            "resource_tags": ["tag1", "tag2"]
                        }
                    ]
                }
            ]
        }
        
        # Act
        subtasks = self.service.extract_subtasks(parsed_json)
        
        # Assert
        self.assertEqual(1, len(subtasks))
        self.assertEqual("Milestone 1", subtasks[0]["milestone"])
        self.assertEqual("Task 1", subtasks[0]["description"])
        self.assertEqual(2, subtasks[0]["estimated_time_hours"])
        self.assertEqual(["tag1", "tag2"], subtasks[0]["resource_tags"])

if __name__ == '__main__':
    unittest.main()
