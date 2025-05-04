"""
Goal Breakdown AI - Backend Application

This is the main application module that initializes the Flask app
and registers all API routes.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
import logging

from backend.api.task_routes import task_bp

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_app(test_config=None):
    """Application factory pattern for creating and configuring the Flask app.
    
    Args:
        test_config (dict): Test configuration (optional)
        
    Returns:
        Flask app: Configured Flask application
    """
    # Create Flask app
    app = Flask(__name__, instance_relative_config=True)
    
    # Set default configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        DATABASE=os.path.join(app.instance_path, 'goal_breakdown.sqlite'),
    )
    
    # Override with test config if provided
    if test_config is not None:
        app.config.from_mapping(test_config)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Enable CORS
    CORS(app)
    
    # Register API blueprints
    app.register_blueprint(task_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy'})
    
    logger.info('Application initialized successfully')
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
