import * as React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { Bar, LabelList, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

const DashboardOverview = () => {

  const [chartData, setChartData] = React.useState({});
  const [chartDataLocations, setChartDataLocations] = React.useState([]);
  const [chartItemsData, setChartItemsData] = React.useState([]);
  const [dataCount, setDataCount] = React.useState({});

  React.useEffect(() => {
    axios.get('https://localhost:7237/api/LostItemRequest/DashboardData')
    .then(response => {
      // console.log(response);
      const chartdata = response.data.data;
      setChartData(chartdata);
      const location = Object.keys(response.data.data);
      setChartDataLocations(location);
      setChartItemsData(location.map(loc => Object.assign({}, { data: chartdata[loc] })));
      setDataCount(response.data.lostItemRequestClaimCount);
    }).catch(error => {
      console.log(error);
    });
  },[]);

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

           {/* Lower Right Part: Identified Items */}
           <Grid item xs={12} sm={6} md={6}>
            <Box sx={{ textAlign: 'center', p: 4 , backgroundColor:"#BDB5D5"}}>
              <Typography variant="body1" color="textSecondary">
                 Items
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.identifiedItemsCount || 0}
              </Typography>
            </Box>
          </Grid>
          
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
                Returned
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.successRequestCount || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
  
      {/* Graph Container */}
      <Paper elevation={5} sx={{ p: 3, mb: 3, flex: 1, height: '90%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Request Trends</Typography>
        <ResponsiveContainer width="100%" height={200}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: ['Week', 'Month', '6 Months', '1 Year', 'Above 1 Year'] }]}
          series={chartItemsData}
          width={400}
          height={400}
        />
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
  
};



export default DashboardOverview;
