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
import ItemDetails from '../Admin/ItemDetails';
import UploadPhotos from '../uploadPhotos';

function Home() {
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for menu
    const [openUploadMenu, setOpenUploadMenu] = useState(false);
    const [openItemRequestMenu, setOpenItemRequestMenu] = useState(false);
    const [view, setView] = useState('slider'); // Default view
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [currentSubMenu, setCurrentSubMenu] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [relatedImages, setRelatedImages] = useState([]);
    const [username, setUsername] = useState('')

    const [uploadedItems, setUploadedItems] = useState([]);
    // const [uploadedData, setUploadedData] = useState([]);

    // useEffect(() => {
    //   const storedItems = JSON.parse(localStorage.getItem('uploadedData'));
    //   if (storedItems) {
    //     setUploadedData(storedItems);
    //   }
    // }, []);
  
    // useEffect(() => {
    //   localStorage.setItem('uploadedData', JSON.stringify(uploadedData));
    // }, [uploadedData]);

  const handleRequestSubmit = (newRequest) => {
    setUploadedItems((prev) => [...prev, newRequest]);
  };
    
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
    const currentPath = decodeURIComponent(location.pathname);
       
    const getBreadcrumbs = () => {
        const pathnames = decodeURIComponent(location.pathname).split('/').filter((x) => x);
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
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('email');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const allRelatedImages = [
    {
      id: 1,
      claimedBy: "Harry",
      Description: "Levis Red sling bag",
      Color: "Red",
      Size: "N/A",
      Brand: "Levis",
      Model: "N/A",
      DistinguishingFeatures: "Minor scratches",
      ItemCategory: "Bags",
      SerialNumber: "1234567890",
      DateTimeWhenLost: "2024-10-20T10:30:00",
      Location: "Main Street, City Center",
      ItemValue: 150.00,
      ItemPhoto: "/related1.jfif", 
      ProofofOwnership: "Receipt",
      HowtheItemLost: "Left on the bus",
      ReferenceNumber: "REF12345",
      AdditionalInformation: "Contact for more details",
      OtherRelevantDetails: "N/A",
    },
    {
      id: 2,
      claimedBy: "Sonia",
      Description: "Black backpack",
      Color: "Black",
      Size: "Medium",
      Brand: "Skybags",
      Model: "Air",
      DistinguishingFeatures: "Zipper broken",
      ItemCategory: "Backpack",
      SerialNumber: "0987654321",
      DateTimeWhenLost: "2024-10-19T14:00:00",
      Location: "City Park",
      ItemValue: 75.00,
      ItemPhoto: "/related2.jfif", 
      ProofofOwnership: "None",
      HowtheItemLost: "Forgot in the park",
      ReferenceNumber: "REF54321",
      AdditionalInformation: "Call if found",
      OtherRelevantDetails: "N/A",
    },
    {
      id: 3,
      claimedBy: "Charles",
      Description: "Grey leather wallet lost",
      Color: "Grey",
      Size: "N/A",
      Brand: "Gucci",
      Model: "Marmont",
      DistinguishingFeatures: "Minor scratches",
      ItemCategory: "Wallet",
      SerialNumber: "1234567890",
      DateTimeWhenLost: "2024-10-20T10:30:00",
      Location: "Main Street, City Center",
      ItemValue: 150.00,
      ItemPhoto: "/related3.jfif", 
      ProofofOwnership: "Receipt",
      HowtheItemLost: "Left on the bus",
      ReferenceNumber: "REF12345",
      AdditionalInformation: "Contact for more details",
      OtherRelevantDetails: "N/A",
    },
    {
      id: 4,
      claimedBy: "Selena",
      Description: "Black wallet lost",
      Color: "Black",
      Size: "Small",
      Brand: "Mat&Harbour",
      Model: "Air",
      DistinguishingFeatures: "Worn out",
      ItemCategory: "Wallet",
      SerialNumber: "0987654321",
      DateTimeWhenLost: "2024-10-19T14:00:00",
      Location: "City Park",
      ItemValue: 75.00,
      ItemPhoto: "/related4.jfif", 
      ProofofOwnership: "None",
      HowtheItemLost: "Forgot in the park",
      ReferenceNumber: "REF54321",
      AdditionalInformation: "Call if found",
      OtherRelevantDetails: "N/A",
    },
    // { id: 1, image: '/related1.jfif', color: 'Red', category: 'Bag', brand: 'Lavie', image: '/related1.jfif', description:'Red shiny bag'  },
    // { id: 2, image: '/related2.jfif', color: 'Black', category: 'Backpack', brand: 'SkyBags', image: '/related2.jfif', description:'Black backpack'  },
    // { id: 3, image: '/related3.jfif', color: 'Grey', category: 'Wallet', brand: 'Gucci', image: '/related3.jfif', description:'Gucci wallet'  },
    // { id: 4, image: '/related4.jfif', color: 'Black', category: 'Wallet', brand: 'Mast&Harbour', image: '/related4.jfif', description:'Black wallet'  },
  ];

const getRelatedImages = () => {
  if (!selectedRequest) return [];
  const { Color, ItemCategory, Brand } = selectedRequest;

  return allRelatedImages.filter(image =>
    image.Color.toLowerCase() === Color.toLowerCase() ||
    image.ItemCategory.toLowerCase() === ItemCategory.toLowerCase() ||
    image.Brand.toLowerCase() === Brand.toLowerCase()
  );
};

const userClaims = [
  {
    itemDescription: 'Pink Floral Sling Bag',
    identifiedDate: '2024-10-27',
    status: 'Pending',
    resolved: false,
  },
  {
    itemDescription: 'Black Leather Wallet',
    identifiedDate: '2024-10-10',
    status: 'Completed',
    resolved: false,
  },
];
  
  const renderAdminForms = () => (
    <>
      <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to=""
        onClick={handleUploadMenu}
      >
        <ListItemText primary="Identified Items" className="drawer-text" />
        <DriveFolderUploadOutlinedIcon />
      </ListItem>
      <Collapse in={openUploadMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539', color:'#fff'}}>
              <List component="div" disablePadding sx={{color:'#fff'}}>
                  <ListItem button component={Link} to="Identified Items" onClick={handleClose}>
                      <ListItemText primary="Create"  sx={{color:'#fff'}}  />
                  </ListItem>
                  <ListItem button component={Link} to="Identified Items/View" onClick={handleClose}>
                      <ListItemText primary="View"  sx={{color:'#fff'}} />
                  </ListItem>
              </List> 
      </Collapse>

      <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to="Claim Requests"
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
        component={Link} to="Lost Item Request"
        onClick={(event) => handleClick(event, 'claimHistory')}
      >
        <ListItemText primary="Lost Item Request" />
        <LibraryAddOutlinedIcon />
      </ListItem> 

      <ListItem 
        button sx={{color:'#fff'}}
        component={Link} to=""
        onClick={handleItemRequestMenu}
      >
        <ListItemText primary="View All Lost Item Requests" className="drawer-text" />
        <VisibilityOutlinedIcon />
      </ListItem>
      <Collapse in={openItemRequestMenu} timeout="auto" unmountOnExit sx={{backgroundColor:'#2C3539', color:'#fff'}}>
              <List component="div" disablePadding sx={{color:'#fff'}}>
                  <ListItem button component={Link} to="View All Lost Item Requests" onClick={handleClose}>
                      <ListItemText primary="Claim Status"  sx={{color:'#fff'}}  />
                  </ListItem>
                  <ListItem button component={Link} to="View All Requests/Claim History" onClick={handleClose}>
                      <ListItemText primary="Claim History"  sx={{color:'#fff'}}  />
                  </ListItem>
              </List> 
      </Collapse>  
    </>
  );

  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUsername(localStorage.getItem('userName'));
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

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
              {userData.role === 'Admin' ? renderAdminForms() : renderUserForms()}
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
        <Route path='/' element={userData.role === 'Admin' ? <Statistics isDrawerOpen={isDrawerOpen} /> : <Default isDrawerOpen={isDrawerOpen} />} />
          <Route path='Identified Items' element={<UploadPhotos  isDrawerOpen={isDrawerOpen} />} />
          <Route path='Claim Requests' element={<Claims isDrawerOpen={isDrawerOpen} />} />
          <Route path='Lost Item Request' element={<ItemLostRequest onRequestSubmit={handleRequestSubmit} userName={userData.name}  isDrawerOpen={isDrawerOpen} />} />
          <Route path='View All Requests/Claim History' element={<ClaimHistory userClaims={userClaims} isDrawerOpen={isDrawerOpen} />} />
          <Route path='Identified Items/View' element={<View isDrawerOpen={isDrawerOpen} />} />
          <Route path='Item Details' element={<ItemDetails isDrawerOpen={isDrawerOpen} />} />
          <Route path='View All Lost Item Requests' element={<ClaimStatus uploadedItems={uploadedItems} userName={userData.name} isDrawerOpen={isDrawerOpen} />} />
        </Routes>
      </Box>
    </div>
  )
}

export default Home
