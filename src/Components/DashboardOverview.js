import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardOverview = ({ totalClaims, pendingRequests, claimedRequests, identifiedItems }) => {
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
      }}
    >

      {/* Statistics Container */}
      <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1, height:'90%' }}>
        <Grid container spacing={2}>
          {/* Upper Left Part: Claim Requests */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="textSecondary">
                Claim Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {totalClaims || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Upper Right Part: Pending Requests */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#f8d7da', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Pending Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {pendingRequests || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Lower Left Part: Successfully Claimed Requests */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#d4edda', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Successfully Claimed
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {claimedRequests || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Lower Right Part: Identified Items */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="textSecondary">
                Identified Items
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {identifiedItems || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Graph Container */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, flex: 1 , height:'90%'}}>
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
