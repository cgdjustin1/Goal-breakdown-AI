# Goal-breakdown-AI

A professional application that breaks down goals into actionable tasks, classifies them based on learning needs, and provides relevant resources for effective goal achievement.

## Features

- **Goal Breakdown**: Convert high-level goals into structured milestones and tasks using Claude AI
- **Task Classification**: Automatically identify tasks that require learning resources
- **Resource Recommendations**: Find and summarize relevant learning resources for each task
- **Modern Interface**: Clean, responsive UI built with React and Material UI
- **RESTful API**: Well-structured Flask backend with clear endpoints

## Project Structure

```
├── backend/                 # Flask backend
│   ├── api/                 # API routes
│   ├── services/            # Business logic services
│   ├── tests/               # Unit tests
│   ├── utils/               # Utility functions
│   ├── app.py               # Application entry point
│   └── config.py            # Configuration settings
│
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── services/        # API client services
│   │   ├── styles/          # CSS/styling
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Entry point
│   └── package.json         # Dependencies and scripts
│
├── .env.template            # Template for environment variables
├── .env                     # Environment variables (not tracked in git)
├── .gitignore               # Git ignore rules
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Anthropic API key (Claude)
- SerpAPI key

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Goal-breakdown-AI.git
   cd Goal-breakdown-AI
   ```

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables
   ```bash
   cp .env.template .env
   # Edit .env to add your API keys
   ```

5. Run the backend server
   ```bash
   cd backend
   python app.py
   ```

### Frontend Setup

1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server
   ```bash
   npm start
   ```

## API Documentation

### Goal Breakdown

- **Endpoint**: `/api/breakdown`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "goal": "Pass the TOEFL exam in three months"
  }
  ```
- **Response**: JSON with milestones, tasks, and estimated time

### Task Classification

- **Endpoint**: `/api/classify`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "descriptions": ["Study grammar rules", "Book the exam"]
  }
  ```
- **Response**: JSON with classified tasks

### Resource Finder

- **Endpoint**: `/api/resources`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "task": "Learn Python decorators",
    "resource_tags": ["python", "advanced"]
  }
  ```
- **Response**: JSON with resources and summaries

## Testing

Run backend tests:
```bash
cd backend
python -m unittest discover tests
```

Run frontend tests:
```bash
cd frontend
npm test
```

## License

MIT