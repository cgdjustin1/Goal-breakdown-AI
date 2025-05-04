"""
Test configuration file for pytest fixtures.
"""

import pytest
from backend.app import create_app

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app({
        'TESTING': True,
        'DEBUG': True
    })
    
    # Create a test client using the Flask application
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()
