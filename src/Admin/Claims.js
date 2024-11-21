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
  //         isActive: status === 'Claimed',
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
    console.log('Status:',status);
    console.log('Comments:', comments);
    console.log('Description:', selectedItemDesc);
    const selectedClaim = {
      id: selectedItemId,
      status : status,
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
      isActive: newStatus === 'Claimed'
    }));
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setSelectedItemId(item.id);
   //console.log(item.id);
    setSelectedItemDesc(item.description);
    setStatus(item.status);
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
              const cardBackgroundColor = item.isActive ? '#E5E4E2' : '#C8E6C9'; // Light orange for Disclaimed, light green for Claimed

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    cursor: 'pointer',
                    boxShadow: 3,
                    backgroundColor: cardBackgroundColor, // Apply the background color here
                    '&:hover': {
                      backgroundColor: item.isActive ? '	#FFFDD0' : '#A5D6A7' // Change color on hover for visual feedback
                    }
                  }} onClick={() => handleCardClick(item)}>
                    <CardMedia>
                      <ImageDisplay imageId={item.itemPhoto} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0px 0px 0px' }} />
                    </CardMedia>
                    <CardContent>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Description:</b> {item.description}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.isActive ? 'Claimed' : 'Approved'}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Age:</b> {calculateDaysAgo(item.createdDate, item.updatedDate)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

        )}

        {/* Modal for item details */}
        <Modal open={openModal} onClose={handleClose}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh', 
              overflowY: 'auto', 
              p: 2,
            }}
          >
            {selectedItem && (
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: '8px',
                  padding: '20px',
                  maxWidth: '800px',
                  width: '100%',
                  position: 'relative',
                  maxHeight: '90vh', 
                  overflowY: 'auto',
                }}
              >
                <Button onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <CloseIcon />
                </Button>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 2, marginBottom: 0, marginLeft: 0 }}
                >
                  Claim Approval
                </Typography>
                <hr />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, gap: 2, pt: 4, fontFamily:'Lato' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <ImageDisplay
                      imageId={selectedItem.itemPhoto}
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        border: '2px solid #e0e0e0',
                        marginTop: '0px',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flex: 2, fontFamily:'Lato' }}>
                    <Typography variant="h5" gutterBottom>{selectedItem.itemDescription}</Typography>

                    {/* Using Grid for aligned labels and content */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: 1.5, columnGap: 1, fontFamily:'Lato' }}>
                      <Typography><b>Description:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.description}
                      </Typography>

                      <Typography><b>Item Category:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.itemCategory}
                      </Typography>

                      <Typography><b>Color:</b></Typography>
                      <Typography>{selectedItem.color}</Typography>

                      <Typography><b>Brand:</b></Typography>
                      <Typography>{selectedItem.brand}</Typography>

                      <Typography><b>Distinguishing Features:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.distinguishingFeatures}
                      </Typography>

                      <Typography ><b>Date and Time of Loss:</b></Typography>
                      <Typography>
                        <DateFormat date={selectedItem.dateTimeWhenLost} />
                      </Typography>

                      <Typography><b>Location / Area:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.location}
                      </Typography>

                      <Typography><b>Other Details For Communication:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.otherRelevantDetails}
                      </Typography>

                      <Typography><b>Requested By:</b></Typography>
                      <Typography>
                        {selectedItem.createdBy}
                      </Typography>

                      <Typography><b>Requested Date:</b></Typography>
                      <Typography>
                        <DateFormat date={selectedItem.createdDate} />
                      </Typography>

                      <Typography><b>Status:</b></Typography>
                      <Typography>{selectedItem.isActive ? 'Pending' : 'Resolved'}</Typography>
                    </Box>
                    <TextField
                      select
                      label="Status"
                      value={status}
                      onChange={handleStatusChange}
                      fullWidth
                      sx={{ mt: 4 }}
                    >
                      {['Reject', 'Approve'].map((option) => (
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
                      <Button variant="outlined" color="secondary" onClick={handleClose}>
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