import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// API service methods
const api = {
  /**
   * Break down a goal into milestones and tasks
   * 
   * @param {string} goal - The goal to break down
   * @returns {Promise} - Promise resolving to breakdown result
   */
  breakdownGoal: async (goal) => {
    try {
      const response = await apiClient.post('/breakdown', { goal });
      return response.data;
    } catch (error) {
      console.error('Error breaking down goal:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Classify tasks based on whether they need learning resources
   * 
   * @param {Array<string>} descriptions - Array of task descriptions to classify
   * @returns {Promise} - Promise resolving to classified tasks
   */
  classifyTasks: async (descriptions) => {
    try {
      const response = await apiClient.post('/classify', { descriptions });
      return response.data;
    } catch (error) {
      console.error('Error classifying tasks:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get resources for a task
   * 
   * @param {string} task - Task description
   * @param {Array<string>} resourceTags - Optional array of resource tags
   * @returns {Promise} - Promise resolving to resources and summary
   */
  getResources: async (task, resourceTags = []) => {
    try {
      const response = await apiClient.post('/resources', { task, resource_tags: resourceTags });
      return response.data;
    } catch (error) {
      console.error('Error getting resources:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Check health of API server
   * 
   * @returns {Promise} - Promise resolving to health status
   */
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error.response?.data || error;
    }
  }
};

export default api;
