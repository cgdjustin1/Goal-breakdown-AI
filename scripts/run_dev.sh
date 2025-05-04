#!/bin/bash
# Development startup script that runs both backend and frontend

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create directory for logs
mkdir -p logs

echo -e "${BLUE}Starting Goal Breakdown AI development servers...${NC}"

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
  echo -e "${BLUE}Creating Python virtual environment...${NC}"
  python -m venv venv
  source venv/bin/activate
  echo -e "${BLUE}Installing backend dependencies...${NC}"
  pip install -r requirements.txt
else
  source venv/bin/activate
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo -e "${BLUE}Creating .env file from template...${NC}"
  cp .env.template .env
  echo -e "${GREEN}Created .env file. Please edit it to add your API keys.${NC}"
fi

# Start backend in background
echo -e "${BLUE}Starting backend server...${NC}"
cd backend
FLASK_APP=app.py FLASK_ENV=development python app.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Check if npm dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
  echo -e "${BLUE}Installing frontend dependencies...${NC}"
  cd frontend
  npm install
  cd ..
fi

# Start frontend in background
echo -e "${BLUE}Starting frontend development server...${NC}"
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}Development servers started!${NC}"
echo -e "${BLUE}Backend running at: ${GREEN}http://localhost:5000${NC}"
echo -e "${BLUE}Frontend running at: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}Backend logs: ${GREEN}logs/backend.log${NC}"
echo -e "${BLUE}Frontend logs: ${GREEN}logs/frontend.log${NC}"
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"

# Function to kill processes on exit
cleanup() {
  echo -e "${BLUE}Stopping servers...${NC}"
  kill $BACKEND_PID
  kill $FRONTEND_PID
  echo -e "${GREEN}Servers stopped.${NC}"
  exit 0
}

# Register the cleanup function for SIGINT (Ctrl+C)
trap cleanup SIGINT

# Wait forever (or until Ctrl+C)
wait
