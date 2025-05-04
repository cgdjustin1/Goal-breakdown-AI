import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API keys
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

# API settings
CLAUDE_MODEL = "claude-3-7-sonnet-20250219"
