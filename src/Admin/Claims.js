import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { TextField, MenuItem, Box, Typography, Card, CardMedia, CardContent, Modal, Grid, Button, Container, Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../Components/AuthService'; // Assuming your auth service file is named AuthService.js
import ImageDisplay from '../imageDisplay';
import DateFormat from '../Components/DateFormat';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Claims = ({ isDrawerOpen }) => {  
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemDesc, setSelectedItemDesc] = useState('');
  const [uploadedItems, setUploadedItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentClaimReq, setCurrentCliamReq] = useState({
    isActive: '',
    additionalInformation: ''
  });

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
    setMarginLeft(isDrawerOpen ? 400 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  const calculateDaysAgo = (createdDate, updatedDate) => {
    // if (!updatedDate) {
    //   // If no updatedDate, return 0 days
    //   return 0;
    // }

    if (!updatedDate) {
      // If no updatedDate, return the difference between createdDate and current date
      const startDate = dayjs(createdDate);
      const endDate = dayjs(); // Current date
      return endDate.diff(startDate, 'day');
    }

    const startDate = dayjs(createdDate);
    const endDate = dayjs(updatedDate);
    return endDate.diff(startDate, 'day');
  };

  // Fetch claims from the API and filter them based on `userName`
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/LostItemRequest');
        console.log("Fetched claims:", response.data);
        const userClaims = response.data;
        console.log("User claims:", userClaims);
        setUploadedItems(userClaims);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };
    if (userName) fetchClaims(); // Fetch claims only if `userName` is set
  }, [userName]);

  // const handleSubmit = async () => {
  //   if (currentClaimReq.id) {
  //     try {
  //       const response = await axios.put(`https://localhost:7237/api/LostItemrequest/${currentClaimReq.id}`, {
  //         isActive: status === 'Disclaimed',
  //         additionalInformation: comments
  //       });
  //       console.log('Updated claim:', response.data);
  //       alert('Form submitted successfully!');
  //       handleClose(); // Close modal after submitting
  //     } catch (error) {
  //       console.error('Error updating claim:', error);
  //     }
  //   }
  // };
  const handleSubmit = async () => {
    console.log('Submit button clicked');
    console.log('Current Claim ID:', selectedItemId);
    console.log('isActive:', status === 'Disclaimed');
    console.log('Comments:', comments);
    console.log('Description:', selectedItemDesc);
    const selectedClaim = {
      id: selectedItemId,
      isActive: status === 'Disclaimed',
      additionalInformation: comments,
      description: selectedItemDesc
    };

    if (selectedItemId) {
      try {
        const response = await axios.put(`https://localhost:7237/api/LostItemRequest/${selectedItemId}`, selectedClaim);
        console.log('Updated claim:', response.data);
        alert('Form submitted successfully!');
        if (response.status === 200) {
          setMessage('Image uploaded successfully!');
          setSeverity('success');
        }
        // console.log('Updated claim:', response.data);
        // alert('Form submitted successfully!');
        handleClose(); // Close modal after submitting
      } catch (error) {
        console.error('Error updating claim:', error);
      }
    } else {
      console.log('Claim ID is not defined');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setCurrentCliamReq((prev) => ({
      ...prev,
      isActive: newStatus === 'Disclaimed'
    }));
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setSelectedItemId(item.id);
    setSelectedItemDesc(item.description);
    setStatus(item.isActive ? 'Disclaimed' : 'Claimed');
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
    setComments('');
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 2, ml: { sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s' }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Claim Requests
        </Typography>
        {uploadedItems.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="flex-start">
            {uploadedItems.map((item, index) => {
              // Determine the background color based on the status
              const cardBackgroundColor = item.isActive ? '#D3D3D3' : '#C8E6C9'; // Light orange for Disclaimed, light green for Claimed

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    cursor: 'pointer',
                    boxShadow: 3,
                    backgroundColor: cardBackgroundColor, // Apply the background color here
                    '&:hover': {
                      backgroundColor: item.isActive ? '#ffabab' : '#A5D6A7' // Change color on hover for visual feedback
                    }
                  }} onClick={() => handleCardClick(item)}>
                    <CardMedia>
                      <ImageDisplay imageId={item.itemPhoto} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0px 0px 0px' }} />
                    </CardMedia>
                    <CardContent>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Description:</b> {item.description}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.isActive ? 'Disclaimed' : 'Claimed'}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Age:</b> {calculateDaysAgo(item.createdDate, item.updatedDate)} days</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

        )}

        {/* Modal for item details */}
        <Modal open={openModal} onClose={handleClose}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {selectedItem && (
              <Box sx={{ bgcolor: 'white', borderRadius: '8px', padding: '20px', maxWidth: '800px', width: { xs: '90%', sm: '90%', md: '100%' }, position: 'relative' }}>
                <Button onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <CloseIcon />
                </Button>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, gap: 2, pt: 4 }}>
                  {/* <Box sx={{ flex: 1, border: '2px solid red' }}> */}
                  <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                    <ImageDisplay imageId={selectedItem.itemPhoto} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0px 0px 0px' }} />
                  </Box>
                  <CardContent sx={{ flex: 2 }}>
                    <Typography variant="h5" gutterBottom>{selectedItem.itemDescription}</Typography>
                    <Typography><b>Description:</b> {selectedItem.description}</Typography>
                    <Typography><b>Item Category:</b> {selectedItem.itemCategory}</Typography>
                    <Typography><b>Requested By:</b> {selectedItem.createdBy}</Typography>
                    <Typography><b>Requested Date:</b><DateFormat date={selectedItem.createdDate} /></Typography>
                    <TextField
                      select
                      label="Status"
                      value={status}
                      onChange={handleStatusChange}
                      fullWidth
                      sx={{ mt: 4 }}
                    >
                      {['Disclaimed', 'Claimed'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Comments"
                      multiline
                      rows={2}
                      fullWidth
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      sx={{ mt: 3 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 5 }}>
                      <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                      </Button>
                      <Button variant="outlined" onClick={handleClose}>
                        Cancel
                      </Button>
                    </Box>
                  </CardContent>
                </Box>
              </Box>
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{ mb: 2 }}
            >
              <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Claims;
