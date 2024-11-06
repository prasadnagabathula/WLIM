import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';

function Default({ isDrawerOpen }) {
    const [marginLeft, setMarginLeft] = useState(100); // Default margin
  
    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 260 : 100);
    }, [isDrawerOpen]);

  
    return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 2,
          // ml: `${marginLeft}px`, // Adjust margin based on drawer state
          ml: {sm: 0, md: `${marginLeft}px`}, // Adjust margin based on drawer state
          transition: 'margin-left 0.3s', // Smooth transition
        }}
      >
        <Typography variant="h5" sx={{ mb: 4, pt: 2 }}>
            Lost Items? Let’s Bring Them Back Home!
        </Typography>  
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          width: {sm: '360px', md: '500px'}
        }}>
          <img src='/default.jpg' alt="default" style={{ width: '100%', objectFit: 'cover' }} />   
        </Box>
        <Typography variant="h5" sx={{ mt: 2, pt: 2 }}>
            Finding Solutions for Lost Items: Our Commitment to Accountability
        </Typography>
      </Box>
    </div>
  )
}

export default Default
