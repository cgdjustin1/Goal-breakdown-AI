"""
Task API Routes.

This module defines the API routes for task breakdown, classification, and resource finding.
"""

from flask import Blueprint, request, jsonify
import traceback

from backend.services.task_breakdown_service import TaskBreakdownService
from backend.services.subtask_classification_service import SubtaskClassificationService
from backend.services.resource_finder_service import ResourceFinderService

# Create Blueprint
task_bp = Blueprint('tasks', __name__)

# Service instances
task_breakdown_service = TaskBreakdownService()
classification_service = SubtaskClassificationService()
resource_finder_service = ResourceFinderService()

@task_bp.route('/breakdown', methods=['POST'])
def breakdown_goal():
    """API endpoint to break down a goal into milestones and tasks.
    
    Request body:
        {
            "goal": "string"
        }
    
    Returns:
        JSON response with milestones, tasks, and subtasks
    """
    try:
        data = request.json
        if not data or 'goal' not in data:
            return jsonify({'error': 'Goal is required'}), 400
        
        goal = data['goal']
        result = task_breakdown_service.breakdown_goal(goal)
        
        return jsonify(result)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@task_bp.route('/classify', methods=['POST'])
def classify_tasks():
    """API endpoint to classify tasks based on resource needs.
    
    Request body:
        {
            "descriptions": ["string"]
        }
    
    Returns:
        JSON response with classified tasks
    """
    try:
        data = request.json
        if not data or 'descriptions' not in data:
            return jsonify({'error': 'Task descriptions are required'}), 400
        
        descriptions = data['descriptions']
        result = classification_service.classify_tasks(descriptions)
        
        return jsonify(result)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@task_bp.route('/resources', methods=['POST'])
def get_resources():
    """API endpoint to find resources for a task.
    
    Request body:
        {
            "task": "string",
            "resource_tags": ["string"] (optional)
        }
    
    Returns:
        JSON response with resources and summary
    """
    try:
        data = request.json
        if not data or 'task' not in data:
            return jsonify({'error': 'Task description is required'}), 400
        
        task = data['task']
        tags = data.get('resource_tags', [])
        
        result = resource_finder_service.get_resources_for_task(task, tags)
        
        return jsonify(result)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
