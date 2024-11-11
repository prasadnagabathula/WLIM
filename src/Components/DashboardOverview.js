import * as React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DashboardOverview = () => {

  const [dataCount, setDataCount] = React.useState({});

  React.useEffect(() => {
    axios.get('https://localhost:7237/api/LostItemRequest/ClaimsCount')
    .then(response => {
      console.log(response);
      setDataCount(response.data);
    }).catch(error => {
      console.log(error);
    });
  },[]);

  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 },
    { name: 'Aug', value: 200 },
    { name: 'Sep', value: 278 },
    { name: 'Oct', value: 389 },
    { name: 'Nov', value: 150 },
    { name: 'Dec', value: 400 },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        gap: 3, 
        flex: 1, 
        flexDirection: { xs: 'column', sm: 'row' }, 
      }}
    >
  
      {/* Statistics Container */}
      <Paper elevation={5} sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1, height: '90%' }}>
        <Grid container spacing={2} sx={{ flex: 1 }}>
          
          {/* Upper Left Part: Claim Requests */}
          <Grid item xs={12} sm={6} md={6}> 
            <Box sx={{ textAlign: 'center', p: 4 , bgcolor:"#AFDBF5"}}>
              <Typography variant="body1" color="textSecondary">
                Claim Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.claimRequestCount || 0}
              </Typography>
            </Box>
          </Grid>
  
          {/* Upper Right Part: Pending Requests */}
          <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#f8d7da', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Pending Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.pendingRequestCount || 0}
              </Typography>
            </Box>
          </Grid>
  
          {/* Lower Left Part: Successfully Claimed Requests */}
          <Grid item xs={12} sm={6} md={6}> 
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#d4edda', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Successfully Claimed
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.successRequestCount || 0}
              </Typography>
            </Box>
          </Grid>
  
          {/* Lower Right Part: Identified Items */}
          <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ textAlign: 'center', p: 4 , backgroundColor:"#BDB5D5"}}>
              <Typography variant="body1" color="textSecondary">
                Identified Items
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.identifiedItemsCount || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  
      {/* Graph Container */}
      <Paper elevation={5} sx={{ p: 3, mb: 3, flex: 1, height: '90%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Request Trends</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />   
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
  
};

export default DashboardOverview;
