import React, { useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import ItemLostRequest from '../../src/User/ItemLostRequest'

const Statistics = ({chooseTab}) => {

  const [dataCount, setDataCount] = React.useState({});
  const [hovered, setHovered] = useState('');


  React.useEffect(() => {
    axios.get(`http://172.17.31.61:5291/api/LostItemRequest/UserDashboardData${localStorage.getItem('userName')}`)
      // axios.get(`http://localhost:7237/api/LostItemRequest/UserDashboardData${localStorage.getItem('userName')}`)
      .then(response => {
        console.log(response);
        setDataCount(response.data);
      }).catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        flex: 1,
        flexDirection:'column',
        gap:2
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
          <Grid item xs={12} sm={4} md={4}>
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                bgcolor: '#f8d7da',
                borderRadius: 1,
                position: 'relative',
              }}
              onMouseEnter={() => setHovered('Pending')}
              onMouseLeave={() => setHovered('')}
            >
              {hovered === 'Pending' && (
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
                    fontFamily: 'Lato'
                  }}
                >
                  Click to view Pending Requests
                </div>
              )}

              <Link
                to="View All Lost Item Requests"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  position: 'relative',
                  zIndex: 2,
                }}
                onClick={() => chooseTab(0)}
              >
                <Typography variant="body1" color="textSecondary">Pending Requests</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dataCount.pendingRequestCount || 0}
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* <Grid item xs={12} sm={4} md={4}> 
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#f8d7da', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Pending Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.pendingRequestCount || 0}
              </Typography>
            </Box>
          </Grid> */}

          {/* Claim Requests */}
          <Grid item xs={12} sm={4} md={4}>
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: "#AFDBF5" }}>
              <Typography variant="body1" color="textSecondary">
                Claimed Requests
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dataCount.claimRequestCount || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Successfully Claimed */}
          <Grid item xs={12} sm={4} md={4}>
            <Box
              sx={{
                textAlign: 'center',
                p: 4,
                bgcolor: '#d4edda',
                borderRadius: 1,
                position: 'relative',
              }}
              onMouseEnter={() => setHovered('Returned')}
              onMouseLeave={() => setHovered('')}
            >
              {hovered === 'Returned' && (
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
                    fontFamily:'Lato'  
                  }}
                >
                  Click to view Returned Requests
                </div>
              )}

              <Link
                to="View All Lost Item Requests"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  position: 'relative',
                  zIndex: 2,
                }}
                onClick={() => chooseTab(2)}
              >
                <Typography variant="body1" color="textSecondary">Returned</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {dataCount.returnedCount || 0}
                </Typography>
              </Link>
            </Box>
          </Grid>

        </Grid>
      </Paper>
      <ItemLostRequest />
    </Box>

  );
};

export default Statistics;
