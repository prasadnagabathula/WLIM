// import React, { useState, useEffect } from 'react';
// import {Table,Box,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Paper,Typography,Button,} from '@mui/material';

// const ClaimHistory = ({ userClaims = [], isDrawerOpen }) => {
//   const [claims, setClaims] = useState(userClaims);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [marginLeft, setMarginLeft] = useState(100);
//   const [marginRight, setMarginRight] = useState(100);

//   // Adjusting the margins when drawer opens or closes
//   useEffect(() => {
//     setMarginLeft(isDrawerOpen ? 260 : 100);
//     setMarginRight(isDrawerOpen ? 50 : 0);
//   }, [isDrawerOpen]);

//   // Handle pagination page change
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   useEffect(() => {
//     const savedClaims = localStorage.getItem('uploadedItems');
//     if (savedClaims) {
//       setClaims(JSON.parse(savedClaims));
//     }
//   }, []);

//   // Handle status change to "Resolved"
//   const markAsResolved = (index) => {
//     const updatedClaims = [...claims];
//     updatedClaims[index].status = 'Completed'; // Update the status to "Completed"
//     updatedClaims[index].resolved = true; // Track whether it's resolved
//     setClaims(updatedClaims);
//     localStorage.setItem('uploadedItems', JSON.stringify(updatedClaims)); // Update local storage
//   };

//   // const markAsResolved = (index) => {
//   //   const updatedClaims = [...claims];
//   //   updatedClaims[index].resolved = true;
//   //   setClaims(updatedClaims);
//   // };

//   return (
//     <Box sx={{
//       textAlign: 'center',
//       mt: 2,
//       ml: `${marginLeft}px`,
//       mr: `${marginRight}px`,
//       transition: 'margin-left 0.3s',
//     }}>
//       <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//       <Typography variant="h4" sx={{ textAlign: 'center', marginY: 2 }}>
//         Claim History
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>   
//             <TableRow>
//               <TableCell>Description</TableCell>
//               <TableCell>Requested Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {claims
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((claim, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{claim.itemDescription}</TableCell>
//                   <TableCell>{claim.identifiedDate}</TableCell>
//                   <TableCell>{claim.status}</TableCell>
//                   <TableCell>
//                   <Button
//                         variant="contained"
//                         onClick={() => markAsResolved(index)}
//                         sx={{
//                           backgroundColor: claim.resolved ? 'green' : 'grey',
//                           color: 'white',
//                         }}
//                         disabled={claim.resolved}
//                       >
//                         {claim.resolved ? 'Resolved' : 'Not Resolved'}
//                       </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={claims.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//       </div>
//     </Box>
//   );
// };

// export default ClaimHistory;

import React, { useState, useEffect } from 'react';
import { Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography, Button, } from '@mui/material';
import axios from 'axios';
import ItemLostRequest from './ItemLostRequest';

const ClaimHistory = ({ isDrawerOpen }) => {
  //const [claims, setClaims] = useState(userClaims);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [itemLostRequests, setItemLostRequests] = useState([]);
  const [currentItemLostRequest, setCurrentItemLostRequest] = useState({
    description: '',
    color: '',
    size: '',
    brand: '',
    model: '',
    distinguishingFeatures: '',
    itemCategory: '',
    serialNumber: '',
    dateTimeWhenLost: '',
    location: '',
    itemValue: '',
    itemPhoto: '',
    proofOfOwnership: '',
    howTheItemLost: '',
    referenceNumber: '',
    additionalInformation: '',
    otherRelevantDetails: ''
  });

  // Adjusting the margins when drawer opens or closes
  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 260 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  useEffect(() => {
    const fetchItemLostRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5291/api/LostItemRequest');
        setItemLostRequests(response.data);
      } catch (error) {
        console.error('Error fetching item lost requests:', error);
      }
    };
    fetchItemLostRequests();
  }, []);

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // useEffect(() => {
  //   const savedClaims = localStorage.getItem('uploadedItems');
  //   if (savedClaims) {
  //     setClaims(JSON.parse(savedClaims));
  //   }
  // }, []);

  // Handle status change to "Resolved"
  const markAsResolved = (index) => {
    const updatedClaims = [...itemLostRequests];
    updatedClaims[index].status = 'Completed'; // Update the status to "Completed"
    updatedClaims[index].resolved = true; // Track whether it's resolved
    setItemLostRequests(updatedClaims);
    localStorage.setItem('uploadedItems', JSON.stringify(updatedClaims)); // Update local storage
  };

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
      mr: `${marginRight}px`,
      transition: 'margin-left 0.3s',
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', marginY: 2 }}>
          Claim History
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Requested Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {itemLostRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ilr, index) => (
                  <TableRow key={index}>
                    <TableCell>{ilr.description}</TableCell>
                    <TableCell>{ilr.dateTimeWhenLost}</TableCell>
                    <TableCell>{ilr.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => markAsResolved(index)}
                        sx={{
                          backgroundColor: ilr.resolved ? 'green' : 'grey',
                          color: 'white',
                        }}
                        disabled={ilr.resolved}
                      >
                        {ilr.resolved ? 'Resolved' : 'Not Resolved'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={itemLostRequests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Box>
  );
};

export default ClaimHistory;

