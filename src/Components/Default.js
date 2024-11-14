import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import DashboardOverview from './DashboardOverview';
import Statistics from './Statistics';

function Default({ isDrawerOpen }) {
    const [marginLeft, setMarginLeft] = useState(100); // Default margin
    const [marginRight, setMarginRight] = useState(100); // Default margin
  
    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 260 : 100);
      setMarginRight(isDrawerOpen ? 0 : 100);
    }, [isDrawerOpen]);

  
    return (
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            mt: 2,
            ml: { sm: 0, md: `${marginLeft}px` }, // Adjust margin based on drawer state
            mr: { sm: 0, md: `${marginRight}px` },
            transition: 'margin-left 0.3s', // Smooth transition
          }}
        >
          <Typography variant="h5" sx={{ 
            mb: 4,
            pt: 2,
            backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',  
            WebkitBackgroundClip: 'text',  // For webkit browsers like Chrome and Safari
            backgroundClip: 'text',  // Standard background clip (for other browsers)
            color: 'transparent', 
            fontWeight: 'bold',            
          }}>
            Tracking Every Item: Every Asset Counts
             {/* {localStorage.getItem('userRole') === 'Admin' 
          ? "Leading with Responsibility: Ensuring Lost Items Find Their Way Home!" 
          : "Lost Items? Let’s Bring Them Back Home!"} */}
          </Typography>  
  
          {/* Container for DashboardOverview with Side-by-Side Layout */}
          <Box
            sx={{
              display: 'flex',
              width: '100%', // Ensures the container takes up full width
              justifyContent: 'space-between', // Ensures space is distributed equally
              gap: 2, // Adds space between the graph and stats containers
            }}
          >
            {/* <DashboardOverview /> */}
            {localStorage.getItem('userRole') === 'Admin' ? <DashboardOverview/> : <Statistics/>}
          </Box>
  
          <Typography variant="h5" sx={{ 
            mt: 2,
            pt: 2,
            backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',  
            WebkitBackgroundClip: 'text',  // For webkit browsers like Chrome and Safari
            backgroundClip: 'text',  // Standard background clip (for other browsers)
            color: 'transparent', 
            fontWeight: 'bold',
          }}>
            {localStorage.getItem('userRole') === 'Admin'
          ? "Turning Lost Into Found with Admin Expertise."
          : "Finding Solutions for Lost Items: Our Commitment to Accountability"}
          </Typography>
        </Box>
      </div>
    );
}

export default Default
