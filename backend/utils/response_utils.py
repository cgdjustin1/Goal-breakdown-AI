"""
Response Utility Functions.

This module provides helper functions for API responses.
"""

from flask import jsonify
import traceback

def create_error_response(error, status_code=500):
    """Create a standardized error response.
    
    Args:
        error: The exception or error message
        status_code: HTTP status code
        
    Returns:
        tuple: (response, status_code)
    """
    error_message = str(error)
    trace = traceback.format_exc()
    
    return jsonify({
        'error': error_message,
        'trace': trace if status_code >= 500 else None
    }), status_code

def create_success_response(data, status_code=200):
    """Create a standardized success response.
    
    Args:
        data: The response data
        status_code: HTTP status code
        
    Returns:
        tuple: (response, status_code)
    """
    return jsonify({
        'data': data,
        'status': 'success'
    }), status_code
