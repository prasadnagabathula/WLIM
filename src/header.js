import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    // <AppBar position="static" color="primary">
    //   <Toolbar>
    //     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    //     Warehouse Missing Items Tracker
    //     </Typography>
    //   </Toolbar>
    // </AppBar>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#fff' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
          {/* Left menu icon and Logo container */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src='/miraclelogo.jpg' alt="Miracle Logo" style={{ width: '160px', marginLeft: '13px' }} />
            </div>

            <div>
            <Typography sx={{marginRight:'600px', fontFamily:'Lato', color:'black', fontSize:'24px',fontWeight:'700'}}>Warehouse Lost Items Management</Typography>
            </div>
          </Toolbar>
          </AppBar>
  );
};

export default Header;
