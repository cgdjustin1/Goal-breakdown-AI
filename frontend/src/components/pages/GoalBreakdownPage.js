import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TagIcon from '@mui/icons-material/Tag';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const GoalBreakdownPage = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breakdownResult, setBreakdownResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Enter Goal', 'Review Breakdown', 'Explore Resources'];

  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!goal.trim()) {
      setError('Please enter a goal');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.breakdownGoal(goal);
      setBreakdownResult(response);
      setActiveStep(1); // Move to the next step
    } catch (err) {
      setError('Error processing your goal: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourcesExplore = (taskDescription, resourceTags) => {
    // Save the selected task to localStorage for use on resources page
    localStorage.setItem('selectedTask', JSON.stringify({
      description: taskDescription,
      resourceTags: resourceTags
    }));
    
    // Navigate to resources page
    navigate('/resources');
  };

  const renderGoalForm = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <TextField
        fullWidth
        label="Enter your goal"
        variant="outlined"
        value={goal}
        onChange={handleGoalChange}
        placeholder="e.g., Learn to play the guitar in 3 months"
        multiline
        rows={4}
        sx={{ mb: 3 }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        size="large"
        disabled={isLoading || !goal.trim()}
        sx={{ minWidth: 150 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Break Down Goal'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const renderBreakdownResults = () => {
    if (!breakdownResult || !breakdownResult.milestones) {
      return (
        <Alert severity="info" sx={{ mt: 4 }}>
          No breakdown data available. Please enter a goal to get started.
        </Alert>
      );
    }

    return (
      <Box sx={{ mt: 4 }}>
        {breakdownResult.milestones.map((milestone, idx) => (
          <Accordion key={idx} defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {milestone.title} 
                <Chip 
                  label={`Weeks ${milestone.week_range[0]}-${milestone.week_range[1]}`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {milestone.tasks.map((task, taskIdx) => (
                  <ListItem 
                    key={taskIdx}
                    secondaryAction={
                      task.resource_tags && task.resource_tags.length > 0 ? (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleResourcesExplore(task.description, task.resource_tags)}
                        >
                          Find Resources
                        </Button>
                      ) : null
                    }
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary={task.description}
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              Estimated time: {task.estimated_time_hours} hour{task.estimated_time_hours !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                          {task.resource_tags && task.resource_tags.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <TagIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              </Box>
                              {task.resource_tags.map((tag, tagIdx) => (
                                <Chip key={tagIdx} label={tag} size="small" variant="outlined" />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setActiveStep(0)} variant="outlined">
            Edit Goal
          </Button>
          <Button onClick={() => setActiveStep(2)} variant="contained">
            Explore Resources
          </Button>
        </Box>
      </Box>
    );
  };

  const renderResourcesGuide = () => (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ready to find learning resources for your tasks?
        </Typography>
        <Typography paragraph>
          Now that you have broken down your goal into manageable tasks, you can find relevant learning resources for each task that requires knowledge acquisition.
        </Typography>
        <Typography paragraph>
          Click on the "Find Resources" button next to any task to get customized learning materials and summaries.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/resources')} 
          sx={{ mt: 2 }}
        >
          Go to Resources Page
        </Button>
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Button onClick={() => setActiveStep(1)} variant="outlined">
          Back to Breakdown
        </Button>
      </Box>
    </Box>
  );

  const renderActiveStep = () => {
    switch (activeStep) {
      case 0:
        return renderGoalForm();
      case 1:
        return renderBreakdownResults();
      case 2:
        return renderResourcesGuide();
      default:
        return renderGoalForm();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Goal Breakdown
        </Typography>
        <Typography variant="subtitle1" paragraph align="center" color="text.secondary">
          Transform your high-level goals into actionable steps with AI assistance
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderActiveStep()}
      </Box>
    </Container>
  );
};

export default GoalBreakdownPage;
