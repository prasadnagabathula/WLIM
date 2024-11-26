import React, { useEffect, useState } from 'react';
import { Typography, Box, Autocomplete, TextField } from '@mui/material';
import DashboardOverview from './DashboardOverview';
import Statistics from './Statistics';
import axios from 'axios';


function Default({ isDrawerOpen }) {
  const [locations, setLocations] = React.useState([]);
  const [loc, setLoc] = React.useState("All");
    const [marginLeft, setMarginLeft] = useState(100); 
    const [marginRight, setMarginRight] = useState(100); 
  
    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 250 : 0);
      setMarginRight(isDrawerOpen ? 0 : 0);
    }, [isDrawerOpen]);

    React.useEffect(() => {

      axios.get('https://localhost:7237/api/LostItemRequest/Locations')
      .then(response => {
        setLocations(response.data.map(data => data.locations));
      }).catch(error => {
        console.log(error);
      });
  
    },[]);
  
    return (
      <div>
      <Box
      sx={{
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      mt: 2,
      ml: { sm: 0, md: `${marginLeft}px` }, 
      mr: { sm: 0, md: `${marginRight}px` },
      transition: 'margin-left 0.3s',
      }}
      >
      {localStorage.getItem('userRole') === 'Admin' ?
      (
      <Box sx={{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}}>
      
      <Typography variant="h5" sx={{
      mb: 4,
      pt: 2,
      backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      fontWeight: 'bold',
      }}>
      Tracking Every Item: Every Asset Counts
      </Typography>
      <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 4,pt: 2,mr:3}}>
      <Autocomplete
      disablePortal
      options={["All", ...locations]}
      value={loc}
      onChange={(event, value) => {
      if(value !== null){
      setLoc(value)
      }
      }}
      sx={{width: 300 }}
      renderInput={(params) => <TextField {...params}label="Location" />}
      />
      </Box>
      </Box>
      ) : (
      <Typography variant="h5" sx={{
      mb: 4,
      pt: 2,
      backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      fontWeight: 'bold',
      }}>
      Tracking Every Item: Every Asset Counts
      </Typography>
      ) }
      
     
      
      <Box
      sx={{
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      gap: 2,
      }}
      >
      
      {localStorage.getItem('userRole') === 'Admin' ? <DashboardOverview location = {loc}/> : <Statistics/>}
      </Box>
      
      <Typography variant="h5" sx={{
      mt: 2,
      pt: 2,
      backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
      WebkitBackgroundClip: 'text', // For webkit browsers like Chrome and Safari
      backgroundClip: 'text', // Standard background clip (for other browsers)
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
