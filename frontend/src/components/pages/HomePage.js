import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Goal Breakdown',
      description: 'Break down any goal into actionable milestones and tasks with estimated time requirements',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 50 }} color="primary" />,
    },
    {
      title: 'Task Classification',
      description: 'Automatically identify which tasks require learning resources and which ones are purely action-oriented',
      icon: <CategoryIcon sx={{ fontSize: 50 }} color="primary" />,
    },
    {
      title: 'Resource Recommendations',
      description: 'Get tailored learning resources and summaries for each task that requires knowledge acquisition',
      icon: <MenuBookIcon sx={{ fontSize: 50 }} color="primary" />,
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          my: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(120deg, #e0f7fa 0%, #bbdefb 100%)',
          textAlign: 'center'
        }}
      >
        <Box sx={{ py: 4 }}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Achieve Your Goals With AI-Powered Breakdown
          </Typography>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
          >
            Turn your ambitious goals into structured, actionable plans with intelligent task breakdown and resource recommendations
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/goal-breakdown')}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Try It Now
          </Button>
        </Box>
      </Paper>

      {/* Features Section */}
      <Box sx={{ my: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={2}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'translateY(-8px)' } 
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ my: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          How It Works
        </Typography>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>1. Enter Your Goal</Typography>
              <Typography paragraph>Start by entering any goal you want to achieve - from learning a new skill to preparing for an exam or completing a project.</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>2. Get Your Breakdown</Typography>
              <Typography paragraph>The AI analyzes your goal and breaks it down into milestones and tasks with time estimates, creating a structured plan for you.</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>3. Access Resources</Typography>
              <Typography paragraph>For tasks that require learning, get recommended resources and summaries to help you acquire the knowledge you need.</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              {/* Placeholder for screenshot or illustration */}
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '300px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="caption" color="text.secondary">Application Interface</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Call to Action */}
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to achieve your goals?
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Start breaking down your goals into actionable steps today
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/goal-breakdown')}
          sx={{ px: 4, py: 1.5 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
