import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, CircularProgress } from '@mui/material';

function View({ isDrawerOpen }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [marginLeft, setMarginLeft] = useState(100); // Default margin
  const [marginRight, setMarginRight] = useState(100); // Default margin

  const [uploadedItems, setUploadedItems] = useState([]); // State to hold API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Adjust margin dynamically based on drawer state
    setMarginLeft(isDrawerOpen ? 240 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  useEffect(() => {
    // Fetch data from the API when the component loads
    const fetchUploadedItems = async () => {
      try {
        setLoading(true); // Set loading to true before the API call
        const response = await fetch('http://localhost:5005/api/uploadeditems', {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUploadedItems(data); // Store the API response in the state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError(err.message); // Handle any errors
        setLoading(false);
      }
    };

    fetchUploadedItems(); // Call the API fetching function
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
      mr: `${marginRight}px`,
      transition: 'margin-left 0.3s',
    }}>
      <Typography variant="h4" gutterBottom>
        Uploaded Item Details
      </Typography>

      {loading ? (
        <CircularProgress />  
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography>  
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Description</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Features</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Identified Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Object Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.itemDescription}</TableCell>
                    <TableCell>{item.brandMake}</TableCell>
                    <TableCell>{item.modelVersion}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.serialNumber}</TableCell>
                    <TableCell>{item.distinguishingFeatures}</TableCell>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell>{item.identifiedDate}</TableCell>
                    <TableCell>{item.identifiedLocation}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.tags}</TableCell>
                    <TableCell>{item.object}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={uploadedItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
}

export default View;
