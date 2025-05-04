import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import GoalBreakdownPage from './components/pages/GoalBreakdownPage';
import ResourcesPage from './components/pages/ResourcesPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green shade
    },
    secondary: {
      main: '#1976d2', // Blue shade
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}>
        <Header />
        <Box sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/goal-breakdown" element={<GoalBreakdownPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
