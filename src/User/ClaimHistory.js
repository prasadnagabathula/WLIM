import React, { useState, useEffect } from 'react';
import { Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography, Button, TableSortLabel } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import DateFormat from '../Components/DateFormat';

const ClaimHistory = ({ isDrawerOpen }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [itemLostRequests, setItemLostRequests] = useState([]);
  const [userName, setUserName] = useState('');
  const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState('createdDate'); // Column to sort by

  // Decode token to get the username
  useEffect(() => {
    const token = localStorage.getItem('oauth2');
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded); // Debugging to verify token structure
      setUserName(decoded?.UserName); // Assuming `userName` is part of the token payload
    }
  }, []);

  // Adjust margins based on drawer state
  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 260 : 100);
    setMarginRight(isDrawerOpen ? 50 : 100);
  }, [isDrawerOpen]);

  // Fetch items and filter based on userName
  useEffect(() => {
    const fetchItemLostRequests = async () => {
      if (!userName) return; // Only fetch when userName is available
      try {
        const response = await axios.get('http://localhost:7237/api/LostItemRequest');
        const userClaims = response.data.filter(item => item.createdBy === userName);
        console.log("Filtered Claims for User:", userClaims); // Debugging statement
        setItemLostRequests(userClaims);
      } catch (error) {
        console.error('Error fetching item lost requests:', error);
      }
    };
    fetchItemLostRequests();
  }, [userName]);

  const handleSort = (property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const sortedCliamHistory = [...itemLostRequests].sort((a, b) => {
    const valueA = a[orderBy] || '';
    const valueB = b[orderBy] || '';

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'desc'
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
    } else if (valueA instanceof Date && valueB instanceof Date) {
      return order === 'desc'
        ? valueB - valueA
        : valueA - valueB;
    } else {
      return order === 'desc'
        ? (valueA > valueB ? 1 : -1)
        : (valueB > valueA ? 1 : -1);
    }
  });


  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mark status as resolved
  const markAsResolved = (index) => {
    const updatedClaims = [...itemLostRequests];
    updatedClaims[index].status = 'Completed';
    updatedClaims[index].resolved = true;
    setItemLostRequests(updatedClaims);
    localStorage.setItem('uploadedItems', JSON.stringify(updatedClaims));
  };

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: { sm: 0, md: `${marginLeft}px` },
      mr: { sm: 0, md: `${marginRight}px` },
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
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? order : 'desc'}
                    onClick={() => handleSort('description')}
                  >
                    <b>Description</b>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'createdDate'}
                    direction={orderBy === 'createdDate' ? order : 'desc'}
                    onClick={() => handleSort('createdDate')}
                  >
                    <b>Requested Date</b>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'isActive'}
                    direction={orderBy === 'isActive' ? order : 'desc'}
                    onClick={() => handleSort('isActive')}
                  >
                    <b>Status</b>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedCliamHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <DateFormat date={item.createdDate} />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => markAsResolved(index)}
                        sx={{
                          backgroundColor: item.isActive ? 'grey !important' : 'green !important',
                          color: item.isActive ? 'black !important' : 'white !important',
                          width: '150px'
                        }}
                        disabled={item.isActive}
                      >
                        {item.isActive ? 'Pending' : 'Resolved'}
                      </Button>

                    </TableCell>
                    <TableCell>

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