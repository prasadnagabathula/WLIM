import * as React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Statistics = () => {

  const [dataCount, setDataCount] = React.useState({});

  React.useEffect(() => {
    axios.get('https://localhost:7237/api/LostItemRequest/DashboardData')
    .then(response => {
      console.log(response);
      setDataCount(response.data.lostItemRequestClaimCount);
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
        justifyContent: 'center', // Center the content horizontally
        flex: 1,
      }}
    >
      {/* Statistics Container */}
      <Paper
        elevation={5}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
        }}
      >
        {/* Outer Grid Structure for Three Equal Boxes in a Row */}
        <Grid container spacing={2} sx={{ flex: 1 }}>
          
          
          {/* Pending Requests */}
          <Grid item xs={12} sm={4} md={4}> {/* Each box takes 1/3 of the available width */}
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#f8d7da', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Pending Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.pendingRequestCount || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Claim Requests */}
          <Grid item  xs={12} sm={4} md={4}> 
            <Box sx={{ textAlign: 'center', p: 4, bgcolor:"#AFDBF5" }}>
              <Typography variant="body1" color="textSecondary">
                Claim Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.claimRequestCount || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Successfully Claimed */}
          <Grid item xs={12} sm={4} md={4}> {/* Each box takes 1/3 of the available width */}
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#d4edda', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Returned
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.successRequestCount || 0}
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </Paper>
    </Box>

  );
};

export default Statistics;


