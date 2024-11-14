import  React, { useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      setChartItemsData(location.map(loc => Object.assign({}, { data: chartdata[loc], label: loc })));
      setDataCount(response.data.lostItemRequestClaimCount);
    }).catch(error => {
      console.log(error);
    });
  },[]);

const CATEGORY_OPTIONS = [
  "Bag", "Watch", "Tool", "Headphone", "Earphone", "Phone", "Bottle", "Book", "Vallet",
  "Camera", "Key", "Jacket", "Coat", "Blazor", "Jerkin", "Electronics", "Accessories", 
  "Personal Items", "Apparel", "Documents", "Stationery", "Food Containers", "Drink Containers", 
  "Health Products", "Hygiene Products", "Sports", "Others"
];

const CATEGORY_COLORS = {
  "Bag": "#B1E6F3",
  "Watch": "#72DDF7",
  "Tool": "#79B8F4",
  "Headphone": "#D6FFC1",
  "Earphone": "#B9FFAF",
  "Phone": "#97FA9A",
  "Bottle": "#F7ADC3",
  "Book": "#FCC5D9",
  "Vallet": "#FADDE3",
  "Camera": "#FFDBFA",
  "Key": "#FECCFF",
  "Jacket": "#D8BBFF",
  "Coat": "#FAE588",
  "Blazor": "#FADC5C",
  "Jerkin": "#FFD000",
  "Electronics": "#F09191",
  "Accessories": "#F2B0B0",
  "Personal Items": "#F3CFCE",
  "Apparel": "#E7C6A2",
  "Documents": "#D3B392",
  "Stationery": "#BFA081",
  "Food Containers": "#75DAD7",
  "Drink Containers": "#4EBCBA",
  "Health Products": "#279E9D",
  "Hygiene Products": "#FBCA9A",
  "Sports": "#FCB274",
  "Others": "#FD9A4D",
};

// Random data for demonstration purposes
const categoryData = CATEGORY_OPTIONS.map((category) => ({
  name: category,
  value: Math.floor(Math.random() * 50),  // Random value for each category
}));


  const [clickedSegment, setClickedSegment] = useState(null);

  // Handle click on a segment to show category name and count
  const handlePieClick = (data) => {
    setClickedSegment(data);
  };    

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2, 
      }}
    >
      {/* First Row: Items card and Graph */}
      <Box sx={{ display: 'flex', width: '100%', gap: 3 }}>
        {/* Statistics Container */}
        <Paper elevation={5} sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1, height: '90%' }}>
          <Grid container spacing={2} sx={{ flex: 1 }}>
            {/* Lower Right Part: Identified Items */}
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ textAlign: 'center', p: 4, backgroundColor: "#BDB5D5" }}>
                <Typography variant="body1" color="textSecondary">Items</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dataCount.identifiedItemsCount || 0}
                </Typography>
              </Box>
            </Grid>

            {/* Upper Left Part: Claim Requests */}
            <Grid item xs={12} sm={6} md={6}> 
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: "#AFDBF5" }}>
                <Typography variant="body1" color="textSecondary">Claim Requests</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dataCount.claimRequestCount || 0}
                </Typography>
              </Box>
            </Grid>

            {/* Upper Right Part: Pending Requests */}
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#f8d7da', borderRadius: 1 }}>
                <Typography variant="body1" color="textSecondary">Pending Requests</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dataCount.pendingRequestCount || 0}
                </Typography>
              </Box>
            </Grid>

            {/* Lower Left Part: Successfully Claimed Requests */}
            <Grid item xs={12} sm={6} md={6}> 
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#d4edda', borderRadius: 1 }}>
                <Typography variant="body1" color="textSecondary">Returned</Typography>
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
          <ResponsiveContainer width="90%" height={200}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Week', 'Month', '6 Months', '1 Year', 'Above 1 Year'] }]}
              series={chartItemsData}
              width={400}
              height={400}
            />
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Second Row: PieChart */}
      <Box sx={{ width: '60%' }}>
      <Paper elevation={5} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Category Distribution</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart onClick={handlePieClick}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius="100%" 
              innerRadius="40%"    
              labelLine={false}    
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box> 
    </Box>
  );
};


export default DashboardOverview;
