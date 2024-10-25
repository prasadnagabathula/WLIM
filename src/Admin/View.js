import React, { useState, useEffect } from 'react';
import { Box,Button, TextField,InputAdornment,IconButton,Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function View({uploadedItems = [], isDrawerOpen }) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [marginLeft, setMarginLeft] = useState(100); // Default margin
  const [marginRight, setMarginRight] = useState(100); // Default margin

    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 240 : 0);
      setMarginRight(isDrawerOpen ? 50 : 0); 
    }, [isDrawerOpen]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
      mr:`${marginRight}px`,
      transition: 'margin-left 0.3s', 
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* <h3 style={{ marginBottom: '20px', fontSize: '25px', display:'flex', justifyContent:'center' }}>Department Table List</h3> */}
        <Typography variant="h4" gutterBottom>
          Uploaded Item Details
        </Typography>
        <div style={{ display: 'flex', marginBottom: '20px', width: '100%' }}>
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton edge="end">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                style={{ flexGrow: 1, marginRight: '10px' }}
            />
        </div>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {uploadedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.itemDescription}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>{item.features}</TableCell>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.identifiedDate}</TableCell>
                <TableCell>{item.location}</TableCell>
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
      </div>
    </Box>
  )
}

export default View
