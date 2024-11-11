import * as React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Statistics = () => {

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

          {/* Successfully Claimed */}
          <Grid item xs={12} sm={4} md={4}> {/* Each box takes 1/3 of the available width */}
            <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#d4edda', borderRadius: 1 }}>
              <Typography variant="body1" color="textSecondary">
                Successfully Claimed
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
  //   <Box
  //     sx={{
  //       display: 'flex',
  //       width: '100%',
  //       justifyContent: 'space-between',
  //       // gap: 3, 
  //       flex: 1, 
  //     }}
  //   >

  //     {/* Statistics Container */}
  //     <Paper elevation={5} sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1, height: '90%' }}>
  //       <Grid container spacing={2} sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', position: 'relative' }}>
          
  //         {/* Upper Left Part: Claim Requests */}
  //         <Grid item xs={6} sx={{ gridRow: '1', gridColumn: '1', textAlign: 'center', p: 4 }}>
  //           <Box>
  //             <Typography variant="body1" color="textSecondary">
  //               Claim Requests
  //             </Typography>
  //             <Typography variant="h5" fontWeight="bold">
  //               {dataCount.claimRequestCount || 0}
  //             </Typography>
  //           </Box>
  //         </Grid>

  //         {/* Upper Right Part: Pending Requests */}
  //         <Grid item xs={6} sx={{ gridRow: '1', gridColumn: '2', textAlign: 'center', p: 4, bgcolor: '#f8d7da', borderRadius: 1 }}>
  //           <Box>
  //             <Typography variant="body1" color="textSecondary">
  //               Pending Requests
  //             </Typography>
  //             <Typography variant="h5" fontWeight="bold">
  //               {dataCount.pendingRequestCount || 0}
  //             </Typography>
  //           </Box>
  //         </Grid>

  //         {/* Lower Left Part: Successfully Claimed Requests */}
  //         <Grid item xs={6} sx={{ gridRow: '2', gridColumn: '1', textAlign: 'center', p: 4, bgcolor: '#d4edda', borderRadius: 1 }}>
  //           <Box>
  //             <Typography variant="body1" color="textSecondary">
  //               Successfully Claimed
  //             </Typography>
  //             <Typography variant="h5" fontWeight="bold">
  //               {dataCount.successRequestCount || 0}
  //             </Typography>
  //           </Box>
  //         </Grid>

  //         {/* Empty Space for Bottom Right */}
  //         <Grid item xs={6} sx={{ gridRow: '2', gridColumn: '2' }} />
  //       </Grid>
  //     </Paper>


  //     {/* Graph Container */}
  //     {/* <Paper elevation={5} sx={{ p: 3, mb: 3, flex: 1 , height:'90%'}}>
  //       <Typography variant="h6" sx={{ mb: 2 }}>Request Trends</Typography>
  //       <ResponsiveContainer width="100%" height={200}>
  //         <LineChart data={data}>
  //           <CartesianGrid strokeDasharray="3 3" />
  //           <XAxis dataKey="name" />
  //           <YAxis />
  //           <Tooltip />
  //           <Line type="monotone" dataKey="value" stroke="#8884d8" />
  //         </LineChart>
  //       </ResponsiveContainer>
  //     </Paper> */}
      
  //   </Box>
  // );
};

export default Statistics;


