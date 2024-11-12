import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Card, CardMedia, CardContent, Modal, Grid, Button, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../Components/AuthService'; // Assuming your auth service file is named authService.js
import ImageDisplay from '../imageDisplay';
import DateFormat from '../Components/DateFormat';

const ClaimStatus = ({ isDrawerOpen }) => {
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [userName, setUserName] = useState('');

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
    setMarginLeft(isDrawerOpen ? 250 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  // Fetch claims from the API and filter them based on `userName`
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/LostItemRequest');
        console.log("Fetched claims:", response.data); // Debugging to verify API response data
        const userClaims = response.data.filter(item => item.createdBy === userName);
        console.log("Filtered claims for user:", userClaims); // Debugging to verify filtering
        console.log(userClaims);
        setUploadedItems(userClaims);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };
    if (userName) fetchClaims(); // Fetch claims only if `userName` is set
  }, [userName]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 2, ml: { sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s' }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Claim Status
        </Typography>
        {uploadedItems.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="flex-start">
            {uploadedItems.map((item, index) => {
              const cardBackgroundColor = item.isActive ? '#E5E4E2' : '#C8E6C9'; 
              const cardHoverColor = item.isActive ? '#C0C0C0' : '#A5D6A7';
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      boxShadow: 3,
                      backgroundColor: cardBackgroundColor,
                      '&:hover': {
                        backgroundColor: cardHoverColor,
                      },
                    }}
                    onClick={() => handleCardClick(item)}
                  >
                    <CardMedia>
                      <ImageDisplay
                        imageId={item.itemPhoto}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          margin: '15px 0px 0px 0px',
                        }}
                      />
                    </CardMedia>
                    <CardContent>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}>
                        <b>Description:</b> {item.description}
                      </Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}>
                        <b>Status:</b> {item.isActive ? 'Pending' : 'Resolved'}
                      </Typography>
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
              <Box sx={{ bgcolor: 'white', borderRadius: '8px', padding: '20px', maxWidth: '800px', width: '100%', position: 'relative' }}>
                <Button onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <CloseIcon />
                </Button>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, gap: 2, pt: 4 }}>
                  <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                    <ImageDisplay imageId={selectedItem.itemPhoto} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0px 0px 0px' }} />
                  </Box>
                  <CardContent sx={{ flex: 2 }}>
                    <Typography variant="h5" gutterBottom>{selectedItem.itemDescription}</Typography>
                    <Typography><b>Description:</b> {selectedItem.description}</Typography>
                    <Typography><b>Item Category:</b> {selectedItem.itemCategory}</Typography>
                    <Typography><b>Requested Date:</b><DateFormat date={selectedItem.createdDate} /></Typography>
                    <Typography><b>Status: </b>{selectedItem.isActive ? 'Pending' : 'Resolved'}</Typography>
                  </CardContent>
                </Box>
              </Box>
            )}
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default ClaimStatus;