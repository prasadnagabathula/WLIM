import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation  } from 'react-router-dom';
import { AppBar,Divider, Toolbar, IconButton, Typography, Drawer, Box, List, ListItem, ListItemText, Avatar, Menu, MenuItem, CssBaseline, Collapse } from '@mui/material';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Default from './Default';
import CustomBreadcrumbs from './CustomBreadcrumbs';
import Claims from '../Admin/Claims';
import Upload from '../Admin/Upload';
import ClaimStatus from '../User/ClaimStatus';
import ClaimHistory from '../User/ClaimHistory';
import Statistics from './Statistics';
import View from '../Admin/View';
import ItemLostRequest from '../User/ItemLostRequest';

function Home() {
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for menu
    const [role, setRole] = useState('User'); 
    const [openUploadMenu, setOpenUploadMenu] = useState(false);
    const [openItemRequestMenu, setOpenItemRequestMenu] = useState(false);
    const [view, setView] = useState('slider'); // Default view
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [currentSubMenu, setCurrentSubMenu] = useState(null);
    
    const handleUploadMenu = () => {
        setOpenUploadMenu((prev) => !prev);
    };

    const handleItemRequestMenu = () => {
      setOpenItemRequestMenu((prev) => !prev);
    };

    // Handle sub-menu open and close
  const handleSubMenuOpen = (event, menu) => {
    setSubMenuAnchorEl(event.currentTarget);
    setCurrentSubMenu(menu);
  };
  const handleSubMenuClose = () => setSubMenuAnchorEl(null);

    const navigate = useNavigate();

    const location = useLocation();
    const currentPath = location.pathname;
       
    const getBreadcrumbs = () => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        return pathnames.map((path, index) => ({
            label: path.charAt(0).toUpperCase() + path.slice(1).replace(/([A-Z])/g, ' $1'), // Capitalize and space camel case
            link: '/' + pathnames.slice(0, index + 1).join('/'), // Create link for breadcrumb
        }));
    };

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
      };  
    
       // Handle menu open/close
       const handleClick = (event, menu) => {
        setAnchorEl({ [menu]: event.currentTarget });
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      // Handle profile menu open and close
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

  const renderAdminForms = () => (
    <>
      <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to=""
        onClick={handleUploadMenu}
      >
        <ListItemText primary="Upload Item Details" className="drawer-text" />
        <DriveFolderUploadOutlinedIcon />
      </ListItem>
      <Collapse in={openUploadMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539', color:'#fff'}}>
              <List component="div" disablePadding sx={{color:'#fff'}}>
                  <ListItem button component={Link} to="Uploaditemdetails" onClick={handleClose}>
                      <ListItemText primary="Create"  sx={{color:'#fff'}}  />
                  </ListItem>
                  <ListItem button component={Link} to="Uploaditemdetails/view" onClick={handleClose}>
                      <ListItemText primary="View"  sx={{color:'#fff'}} />
                  </ListItem>
              </List> 

      </Collapse>

      <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to="claimrequests"
        onClick={(event) => handleClick(event, 'claims')}
      >
        <ListItemText primary="Claim Requests"  />
        <DescriptionOutlinedIcon />
      </ListItem>     
    </>
  );

  const renderUserForms = () => (
    <>
    <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to="itemlostRequest"
        onClick={(event) => handleClick(event, 'claimHistory')}
      >
        <ListItemText primary="Item Lost Request" />
        <LibraryAddOutlinedIcon />
      </ListItem> 

      <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to=""
        onClick={handleItemRequestMenu}
      >
        <ListItemText primary="View All Item Lost Requests" className="drawer-text" />
        <VisibilityOutlinedIcon />
      </ListItem>
      <Collapse in={openItemRequestMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539', color:'#fff'}}>
              <List component="div" disablePadding sx={{color:'#fff'}}>
                  <ListItem button component={Link} to="viewallrequest" onClick={handleClose}>
                      <ListItemText primary="Claim Status"  sx={{color:'#fff'}}  />
                  </ListItem>
                  <ListItem button component={Link} to="viewallrequest/claimhistory" onClick={handleClose}>
                      <ListItemText primary="Claim History"  sx={{color:'#fff'}}  />
                  </ListItem>
              </List> 
      </Collapse>  
    </>
  );

  const [userData, setUserData] = useState({
    photo: '/profile.avif',
    name: 'Charitha Sri',
    role: 'user'
  });

//   useEffect(() => {
//     const storedData = localStorage.getItem('userData');
//     if (storedData) {
//       setUserData(JSON.parse(storedData)); 
//     }
//   }, []);


  return (
    <div style={{fontFamily:'Montserrat'}}>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#fff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
          {/* Left menu icon and Logo container */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuOutlinedIcon sx={{ color: 'black', fontSize: '32px' }} />
            </IconButton>
            <img src='/miraclelogo.jpg' alt="Miracle Logo" style={{ width: '170px',marginLeft:'13px'}} />
          </div> 
          <Box flexGrow={1} />

          {/* Username and Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <Typography variant="body1" sx={{ marginRight: 1, color:'black' }}>
              {username || 'U'}
            </Typography> */}
            <div style={{ marginRight: 2, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#232527' }}>
                {userData.name || 'U'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#004687', fontSize:'14px' }}>
                {userData.role || 'User'}
              </Typography>
            </div>
            <IconButton onClick={handleProfileMenuClick} color="inherit">
              <Avatar src={userData.photo} sx={{ bgcolor: '#00aae7' }}>
                {/* {username[0] || 'U'} */}
                {userData.name ? userData.name[0] : 'U'}
              </Avatar>
            </IconButton>
          </div>

          {/* Profile Menu */}
          <Menu
            anchorEl={profileMenuAnchorEl}
            open={Boolean(profileMenuAnchorEl)}
           onClose={() => setProfileMenuAnchorEl(null)}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{fontFamily:'Lato'}}>Profile</MenuItem>
            <MenuItem onClick={handleLogout} sx={{fontFamily:'Lato'}}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
              width: 250,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                  width: 250,
                  boxSizing: 'border-box',
                  backgroundColor: 'black',
                  color: 'white',
                  fontFamily: 'Montserrat, sans-serif',
                  '&::-webkit-scrollbar': {
                      width: '0px', // Hide scrollbar
                  },
                  '&::-webkit-scrollbar-thumb': {
                      background: 'transparent', 
                  },
                  '&::-webkit-scrollbar-track': {
                      background: 'transparent', 
                  },
                },
            }}
          >
          <Toolbar />
          <Box  className="drawer-invisible-scrollbar" sx={{ overflow: 'auto' }}>
            <List className="drawer-text">
              {role === 'Admin' ? renderAdminForms() : renderUserForms()}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Submenu */}
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleSubMenuClose}
      >
        {currentSubMenu?.subMenu?.map((subItem) => (
          <MenuItem key={subItem} onClick={() => setView(subItem.toLowerCase())}>{subItem}</MenuItem>
        ))}
      </Menu>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, height: '100vh', overflow: 'auto' }}>
        <Toolbar />
        <CustomBreadcrumbs paths={getBreadcrumbs()} currentPath={currentPath} isDrawerOpen={isDrawerOpen}  />
        <Routes>
        <Route path='/' element={role === 'Admin' ? <Statistics isDrawerOpen={isDrawerOpen} /> : <Default isDrawerOpen={isDrawerOpen} />} />
          <Route path='uploaditemdetails' element={<Upload isDrawerOpen={isDrawerOpen} />} />
          <Route path='claimrequests' element={<Claims isDrawerOpen={isDrawerOpen} />} />
          <Route path='itemlostrequest' element={<ItemLostRequest isDrawerOpen={isDrawerOpen} />} />
          <Route path='viewalllostrequest' element={<ClaimStatus isDrawerOpen={isDrawerOpen} />} />
          <Route path='viewalllostrequest/claimhistory' element={<ClaimHistory isDrawerOpen={isDrawerOpen} />} />
          <Route path='uploaditemdetails/view' element={<View isDrawerOpen={isDrawerOpen} />} />
        </Routes>
      </Box>

    </div>
  )
}

export default Home
