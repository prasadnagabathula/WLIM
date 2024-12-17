import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Autocomplete } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const DashboardOverview = ({ location }) => {

  // const [chartData, setChartData] = React.useState({});
  const [chartDataLocations, setChartDataLocations] = React.useState([]);
  const [chartItemsData, setChartItemsData] = React.useState([]);
  const [dataCount, setDataCount] = React.useState({});
  const [categoryData, setCategoryData] = React.useState([]);
  const [hovered, setHovered] = useState(false);

  React.useEffect(() => {
    //console.log(location);
    // axios.get(`http://localhost:7237/api/LostItemRequest/DashboardData/${location}`)
    axios.get(`http://172.17.31.61:5291/api/LostItemRequest/DashboardData/${location}`)
      .then(response => {
        const chartdata = response.data.data;
        const loca = Object.keys(response.data.data);
        if (location === "All") {
          const t = Object.values(chartdata);
          setChartDataLocations(["All", ...loca]);
          setChartItemsData([Object.assign({}, {
            data: t[0].map((_, index) =>
              t.reduce((sum, arr) => sum + arr[index], 0)
            ), label: "All Locations"
          })]);
        }
        else {
          setChartDataLocations(loca);
          setChartItemsData(loca.map(loc => Object.assign({}, { data: chartdata[loc], label: loc })));
        }

        setDataCount(response.data.lostItemRequestClaimCount);

        const temp = response.data.category;
        setCategoryData(
          Object.keys(temp).map((category) => ({
            name: category,
            value: temp[category],
          }))
        );
      }).catch(error => {
        console.log(error);
      });
  }, [location]);

  const CATEGORY_COLORS = {
    "Bag": "#B1E6F3",
    "Watch": "#72DDF7",
    "Wallet": "#AEC6CF",
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
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={12} md={6} lg={6} order={{ xs: 2, md: 1 }}>

          {/* Statistics Container */}
          <Paper elevation={5} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Grid container spacing={2}>
              {/* Identified Items */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center', p: 5, backgroundColor: "#BDB5D5" }}>
                  <Typography variant="body1" color="textSecondary">Items</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {dataCount.identifiedItemsCount || 0}
                  </Typography>
                </Box>
              </Grid>

              {/* Claim Requests */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 5, sm: 5, md: 3.6, lg: 5 },
                    bgcolor: "#AFDBF5",
                    position: 'relative',
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >

                  {hovered && (
                    <div
                      className="popup"
                      style={{
                        position: 'absolute',
                        top: '80%',
                        left: '40%',
                        transform: 'translate(-30%, -30%)',
                        backgroundColor: '#DBCDF0',
                        color: '#333',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        zIndex: 1,
                      }}
                    >
                      Click to view Claim Requests
                    </div>
                  )}

                  {/* Link for Claim Requests */}
                  <Link
                    to="Claim Requests"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      zIndex: 2,
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">Claim Requests</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {dataCount.claimRequestCount || 0}
                    </Typography>
                  </Link>
                </Box>
              </Grid>

              {/* Pending Requests */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center', p: { xs: 5.5, sm: 5.5, md: 3.6, lg: 5.5 }, bgcolor: '#f8d7da', borderRadius: 1 }}>
                  <Typography variant="body1" color="textSecondary">Pending Requests</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {dataCount.pendingRequestCount || 0}
                  </Typography>
                </Box>
              </Grid>

              {/* Successfully Claimed Requests */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center', p: 5.5, bgcolor: '#d4edda', borderRadius: 1 }}>
                  <Typography variant="body1" color="textSecondary">Returned</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {dataCount.successRequestCount || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* piechart */}
        <Grid item xs={12} sm={12} md={6} lg={6} order={{ xs: 1, md: 2 }}>
          <Paper elevation={5} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Item Category Distribution</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    {categoryData.length > 0 ? (
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
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#a04000',
                        }}
                      >
                        No data found
                      </Typography>
                    )}
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    maxHeight: 250,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  {categoryData.length > 0 ? (
                    categoryData.map((entry, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={1}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: CATEGORY_COLORS[entry.name],
                            borderRadius: '50%',
                            marginRight: 1,
                          }}
                        />
                        <Typography variant="body2">{entry.name} ({entry.value})</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No categories available
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

        </Grid>

        {/* Second Row: Graph Container */}
        <Grid item xs={12} sm={12} md={12} lg={12} order={{ xs: 3, md: 3 }}>
          <Paper elevation={5} sx={{ p: 3, mb: 3, flex: 1, height: '90%', mt: 3, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Request Trends</Typography>
            <ResponsiveContainer width="100%" height={300}>
              {(chartDataLocations.includes(location) ?
                (
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Week', 'Month', '6 Months', '1 Year', 'Above 1 Year'] }]}
                    series={chartItemsData}
                    width={400}
                    height={400}
                  />
                ) :
                (<Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a04000 ' }}>
                  No data found
                </Typography>)
              )
              }
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;