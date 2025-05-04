import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Goal Breakdown', path: '/goal-breakdown' },
    { name: 'Resources', path: '/resources' }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon color="primary" />
          Goal Breakdown AI
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" />
                Goal Breakdown AI
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbIcon color="primary" />
                Goal Breakdown AI
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    color="inherit"
                    sx={{ 
                      mx: 1,
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      borderBottom: location.pathname === item.path ? `2px solid ${theme.palette.primary.main}` : 'none'
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
