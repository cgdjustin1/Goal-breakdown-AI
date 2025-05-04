import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Link,
  List,
  ListItem,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LaunchIcon from '@mui/icons-material/Launch';
import TagIcon from '@mui/icons-material/Tag';
import api from '../../services/api';

const ResourcesPage = () => {
  const [task, setTask] = useState('');
  const [resourceTags, setResourceTags] = useState([]);
  const [resources, setResources] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState('');
  
  // Check localStorage for any selected task from the GoalBreakdownPage
  useEffect(() => {
    const savedTask = localStorage.getItem('selectedTask');
    if (savedTask) {
      try {
        const parsedTask = JSON.parse(savedTask);
        setTask(parsedTask.description);
        setResourceTags(parsedTask.resourceTags || []);
      } catch (err) {
        console.error('Error parsing saved task', err);
      }
    }
  }, []);
  
  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };
  
  const handleTagAdd = () => {
    if (newTag.trim() && !resourceTags.includes(newTag.trim())) {
      setResourceTags([...resourceTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleTagDelete = (tagToDelete) => {
    setResourceTags(resourceTags.filter(tag => tag !== tagToDelete));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!task.trim()) {
      setError('Please enter a task description');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getResources(task, resourceTags);
      setResources(response);
    } catch (err) {
      setError('Error finding resources: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Learning Resources
        </Typography>
        <Typography variant="subtitle1" paragraph align="center" color="text.secondary">
          Find relevant resources to help you complete your tasks
        </Typography>
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Task Description"
              variant="outlined"
              value={task}
              onChange={handleTaskChange}
              placeholder="e.g., Learn Python decorators"
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TagIcon fontSize="small" sx={{ mr: 1 }} />
                Resource Tags (Optional)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {resourceTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <TextField
                label="Add tag"
                variant="outlined"
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleNewTagKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button 
                        onClick={handleTagAdd}
                        disabled={!newTag.trim()}
                        size="small"
                      >
                        Add
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={isLoading || !task.trim()}
              sx={{ minWidth: 150 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Find Resources'}
            </Button>
          </Box>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {resources && (
          <Box>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Resource Summary
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {resources.summary}
              </Typography>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Found Resources
            </Typography>
            <Grid container spacing={2}>
              {resources.resources.map((resource, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {resource.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {resource.snippet}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        endIcon={<LaunchIcon />}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Resource
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ResourcesPage;
