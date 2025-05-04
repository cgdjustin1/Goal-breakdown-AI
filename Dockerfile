# Multi-stage build for a Python Flask backend with React frontend
# Stage 1: Build React frontend
FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Python backend
FROM python:3.9-slim
WORKDIR /app

# Copy Python requirements and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy environment variable template (user will need to provide actual .env)
COPY .env.template ./.env.template

# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Run gunicorn server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "backend.app:app"]
