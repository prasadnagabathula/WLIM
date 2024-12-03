import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, InputAdornment, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, CircularProgress, TableSortLabel, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DateFormat from '../Components/DateFormat';
import { styled } from '@mui/system';
import ImageDisplay from '../imageDisplay';
import dayjs from 'dayjs';

function View({ isDrawerOpen }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('desc'); // Order of sorting: 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState('createdDate');
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null); // To store hovered thumbnail image
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which thumbnail is hovered

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 240 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  const calculateDaysAgo = (createdDate, updatedDate) => {
    const startDate = dayjs(createdDate);
    const endDate = updatedDate ? dayjs(updatedDate) : dayjs(); // Use updatedDate or current date if not provided
  
    const diffInMinutes = endDate.diff(startDate, 'minute');
    const diffInHours = endDate.diff(startDate, 'hour');
    const diffInDays = endDate.diff(startDate, 'day');
  
    if (diffInDays >= 1) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
  };
  
  useEffect(() => {
    // Fetch data from the API when the component loads
    const fetchUploadedItems = async () => {
      try {
        setLoading(true); // Set loading to true before the API call
        //const response = await fetch('http://172.17.31.61:5280/api/getAll', {
          const response = await fetch('http://localhost:7298/api/getAll', {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();        
        setUploadedData(data); // Store the API response in the state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError(err.message); // Handle any errors
        setLoading(false);
      }
    };

    fetchUploadedItems(); // Call the API fetching function
  }, []);

  const handleSort = (property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const sortedViews = [...uploadedData].sort((a, b) => {
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
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleThumbnailClick = (image, index) => {
    setHoveredImage(image);
    setHoveredIndex(index); // Set the index to track hovered thumbnail
    };

  const ThumbnailBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100px',
    height: '100px',
    margin: '10px',
    borderRadius: '15px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      transform: 'scale(1.5)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    },
    backgroundColor: '#ffffff',
}));

// const HoveredImagePopup = styled(Box)(({ theme }) => ({
//   position: 'relative', // Ensures the pop-up doesn't scroll with the container
//   top: '0px', // Adjust as needed to avoid overlap
//   left: '20px', // Adjust as needed for alignment
//   width: '200px',
//   height: '200px',
//   backgroundColor: '#ffffff',
//   borderRadius: '15px',
//   border: '2px solid #2196F3',
//   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
//   zIndex: 1000,
//   display: hoveredImage ? 'block' : 'none',
//   transition: 'all 0.3s ease',
//   }));


  // Helper function to safely convert a value to lowercase
  const safeToLowerCase = (value) => (value ? value.toString().toLowerCase() : '');

  const filteredData = sortedViews.filter((item) =>
    safeToLowerCase(item.itemDescription).includes(searchQuery.toLowerCase()) ||
    safeToLowerCase(item.category).includes(searchQuery.toLowerCase()) ||
    safeToLowerCase(item.tags).includes(searchQuery.toLowerCase()) ||
    safeToLowerCase(item.comments).includes(searchQuery.toLowerCase()) ||
    safeToLowerCase(item.createdBy).includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s'
    }}>
      
      <Paper  elevation={5} sx={{width:'100%', height:'100%', p: 2}}>
    
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{
          backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
        }}>
          Identified Item List
        </Typography>
        <Divider sx={{ 
            width: '90%', 
            margin: 'auto',
            mb:2
          }} />
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
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Item Photo</b></TableCell>
                  <TableCell>
                    <TableSortLabel
                          active={orderBy === 'itemDescription'}
                          direction={orderBy === 'itemDescription' ? order : 'desc'}
                          onClick={() => handleSort('itemDescription')}
                    >
                      <b>Item Description</b>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'category'}
                      direction={orderBy === 'category' ? order : 'desc'}
                      onClick={() => handleSort('category')}
                    >
                      <b>Category</b>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'tags'}
                      direction={orderBy === 'tags' ? order : 'desc'}
                      onClick={() => handleSort('tags')}
                    >
                      <b>Tags</b>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'comments'}
                      direction={orderBy === 'comments' ? order : 'desc'}
                      onClick={() => handleSort('comments')}
                    >
                      <b>Comments</b>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'createdBy'}
                      direction={orderBy === 'createdBy' ? order : 'desc'}
                      onClick={() => handleSort('createdBy')}
                    >
                      <b>Created By</b>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'createdDate'}
                      direction={orderBy === 'createdDate' ? order : 'desc'}
                      onClick={() => handleSort('createdDate')}
                    >
                      <b>Created Date</b>
                    </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'age'}
                          direction={orderBy === 'age' ? order : 'desc'}
                          onClick={() => handleSort('age')}
                        >
                          <b>Age</b>
                        </TableSortLabel>
                      </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                          <ThumbnailBox onClick={
                          () => handleThumbnailClick(item.filePath, index)                         
                        }
                          style={{
                            border: selectedThumbnail === item.filePath ? '2px solid #2196F3' : 'none', // Highlight selected thumbnail
                          }}
                        >
                          <ImageDisplay imageId={item.filePath} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        </ThumbnailBox>
                        {/* {hoveredImage && hoveredIndex === index && (
                          <HoveredImagePopup>
                          <ImageDisplay imageId={hoveredImage} style={{ width: '200px', height: '200px' }} />
                          </HoveredImagePopup>
                          )} */}
                    </TableCell>
                    <TableCell>{item.itemDescription}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.tags}</TableCell>
                    <TableCell>{item.comments}</TableCell>
                    <TableCell>{item.createdBy}</TableCell>
                    <TableCell>
                      <DateFormat date={item.createdDate} />
                    </TableCell>
                    <TableCell>{calculateDaysAgo(item.createdDate, item.updatedDate)}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      </Paper>
    </Box>
  );
}

export default View;
