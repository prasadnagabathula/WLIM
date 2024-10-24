import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation  } from 'react-router-dom';
import { AppBar,Divider, Toolbar, IconButton, Typography, Drawer, Box, List, ListItem, ListItemText, Avatar, Menu, MenuItem, CssBaseline, Collapse } from '@mui/material';

function Home() {
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleProfileMenuClick = (event) => setProfileMenuAnchorEl(event.currentTarget);
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null); 
    navigate('/profile'); 
  };
  const handleLogout = () => {
    localStorage.removeItem('oauth2');
    localStorage.removeItem('userRole');
    navigate('/');
  };


  return (
    <div style={{fontFamily:'Montserrat'}}>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#fff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
          {/* Left menu icon and Logo container */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src='/miraclelogo.jpg' alt="Miracle Logo" style={{ width: '160px', marginLeft: '13px' }} />
          </div> 
        </Toolbar>
      </AppBar>

       
      </Box>

    </div>
  )
}

export default Home
