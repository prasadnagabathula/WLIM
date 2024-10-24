import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {LineChart, Line, XAxis, YAxis,CartesianGrid,Tooltip,Legend, ResponsiveContainer} from 'recharts';

const data = [
    { month: 'January', Identified: 30, Returned: 20, NotClaimed: 10, Requests: 25, Rejected: 5 },
    { month: 'February', Identified: 40, Returned: 30, NotClaimed: 15, Requests: 35, Rejected: 10 },
    { month: 'March', Identified: 50, Returned: 40, NotClaimed: 20, Requests: 45, Rejected: 5 },
    { month: 'April', Identified: 60, Returned: 50, NotClaimed: 25, Requests: 55, Rejected: 15 },
    { month: 'May', Identified: 70, Returned: 60, NotClaimed: 30, Requests: 65, Rejected: 20 },
    { month: 'June', Identified: 80, Returned: 70, NotClaimed: 35, Requests: 75, Rejected: 25 },
    { month: 'July', Identified: 90, Returned: 80, NotClaimed: 40, Requests: 85, Rejected: 30 },
    { month: 'August', Identified: 100, Returned: 90, NotClaimed: 45, Requests: 95, Rejected: 35 },
    { month: 'September', Identified: 110, Returned: 100, NotClaimed: 50, Requests: 105, Rejected: 40 },
    { month: 'October', Identified: 120, Returned: 110, NotClaimed: 55, Requests: 115, Rejected: 45 },
    { month: 'November', Identified: 130, Returned: 120, NotClaimed: 60, Requests: 125, Rejected: 50 },
    { month: 'December', Identified: 140, Returned: 130, NotClaimed: 65, Requests: 135, Rejected: 55 },
];


function Statistics({ isDrawerOpen }) {

    const [marginLeft, setMarginLeft] = useState(100); // Default margin
    const [marginRight, setMarginRight] = useState(100); // Default margin

    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 220 : 0);
      setMarginRight(isDrawerOpen ? 50 : 0);
    }, [isDrawerOpen]);

  return (
    <div>
        <Box sx={{
          textAlign: 'center',
          mt: 2,
          ml: `${marginLeft}px`,
          mr:`${marginRight}px`,
          transition: 'margin-left 0.3s', 
        }}>
            <Typography variant="h5" sx={{ mb: 4 }}>
                Monthly Item Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis  dataKey="month" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Identified" stroke="#ae2478" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Returned" stroke="#065535" />
                    <Line type="monotone" dataKey="NotClaimed" stroke="#e38826" />
                    <Line type="monotone" dataKey="Requests" stroke="#0abab5" />
                    <Line type="monotone" dataKey="Rejected" stroke="#d52c1e" />
                </LineChart>
            </ResponsiveContainer>
        </Box>    
    </div>
  )
}

export default Statistics
