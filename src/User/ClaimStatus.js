import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Card, CardMedia, CardContent,Tabs, Tab, Modal, Grid, Button, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../Components/AuthService'; 
import ImageDisplay from '../imageDisplay';
import DateFormat from '../Components/DateFormat';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 

const ClaimStatus = ({ isDrawerOpen }) => {
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [value, setValue] = useState(0);

  // Decode token to get the username
  useEffect(() => {
    const token = localStorage.getItem('oauth2');
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      setUserName(decoded?.UserName); 
    }
  }, []);


  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 250 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  // Fetch claims from the API and filter them based on `userName`
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('http://172.17.31.61:5291/api/LostItemRequest');
        console.log("Fetched claims:", response.data); 
        const userClaims = response.data.filter(item => item.createdBy === userName);
        console.log("Filtered claims for user:", userClaims); 
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

  // Handle Tab change
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Filter claims into pending and resolved based on `isActive`
  const pendingClaims = uploadedItems.filter(item => item.isActive);
  const resolvedClaims = uploadedItems.filter(item => !item.isActive);

  return (
    <Box sx={{ textAlign: 'center', mt: 2, ml: { sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s' }}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{
          backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
        }}>
          Claim Status
        </Typography>

        {/* Tabs for Pending and Resolved with Centering and Custom Styles */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="Claim Status Tabs"
            indicatorColor="primary"
            textColor="secondary"
            variant="fullwidth"
            sx={{
              display: 'flex',
              justifyContent: 'center', 
              borderBottom: 1,
              borderColor: 'divider',
              marginBottom: 3, 
              [`@media (max-width:600px)`]: {
                variant: 'scrollable', 
              },
              [`@media (min-width:601px)`]: {
                variant: 'fullWidth', 
              },
            }}
            scrollButtons="auto" 
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: value === 0 ? '#E97451' : '#888' }} />
                  Pending
                </Box>
              }
              sx={{
                color: value === 0 ? '#E97451' : '#888',
                fontWeight: value === 0 ? 'bold' : 'normal',
              }}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: value === 1 ? '#4CAF50' : '#888' }} />
                  Resolved
                </Box>
              }
              sx={{
                color: value === 1 ? '#4CAF50' : '#888',
                fontWeight: value === 1 ? 'bold' : 'normal',
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Panel for Pending Claims */}
        {value === 0 && (
          <Grid container spacing={3} justifyContent="flex-start" >
            {pendingClaims.length === 0 ? (
              <Typography>No pending claims.</Typography>
            ) : (
              pendingClaims.map((item, index) => {
                const cardBackgroundColor = item.isActive ? '#F2D2BD' : '#C1E1C1';
                const cardHoverColor = item.isActive ? '#FBCEB1' : '#93C572';
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
              })
            )}
          </Grid>
        )}

        {/* Tab Panel for Resolved Claims */}
        {value === 1 && (
          <Grid container spacing={3} justifyContent="flex-start">
            {resolvedClaims.length === 0 ? (
              <Typography>No resolved claims.</Typography>
            ) : (
              resolvedClaims.map((item, index) => {
                const cardBackgroundColor = item.isActive ? '#F2D2BD' : '#C1E1C1';
                const cardHoverColor = item.isActive ? '#FBCEB1' : '#93C572';
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
              })
            )}
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
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold', mb: 2, marginBottom: 0, marginLeft: 0,
                    backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold',
                  }}
                >
                  Claim Status
                </Typography>
                <hr />
           
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, gap: 6, pt: 3, fontFamily: 'Lato', background: '#d3eaf5', }}>
                 <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'space-between',
                        flex: 1,
                      }}>
                        <ImageDisplay 
                          imageId={selectedItem.itemPhoto} 
                          style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            border: '2px solid #e0e0e0',
                            marginTop: '30px',
                            marginLeft: '60px'
                          }}
                        />
                      </Box>

                  <CardContent sx={{ flex: 2 }}>
                    <Typography variant="h5" gutterBottom>{selectedItem.itemDescription}</Typography>

                    {/* Using Grid for aligned labels and content */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: 1.5, columnGap: 1 }}>
                      <Typography variant="body2"><b>Description:</b></Typography>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.description}
                      </Typography>

                      <Typography variant="body2"><b>Item Category:</b></Typography>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.itemCategory}
                      </Typography>

                      <Typography variant="body2"><b>Color:</b></Typography>
                      <Typography variant="body2">{selectedItem.color}</Typography>

                      <Typography variant="body2"><b>Brand:</b></Typography>
                      <Typography variant="body2">{selectedItem.brand}</Typography>

                      <Typography variant="body2"><b>Distinguishing Features:</b></Typography>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.distinguishingFeatures}
                      </Typography>

                      <Typography variant="body2"><b>Date and Time of Loss:</b></Typography>
                      <Typography variant="body2">
                      <DateFormat date={selectedItem.dateTimeWhenLost} />
                      </Typography>

                      <Typography variant="body2"><b>Location / Area of Loss:</b></Typography>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.location}
                      </Typography>

                      <Typography variant="body2"><b>Other Details For Communication:</b></Typography>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.otherRelevantDetails}
                      </Typography>

                      <Typography variant="body2"><b>Address:</b></Typography>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {selectedItem.address}
                      </Typography>

                      <Typography variant="body2"><b>Requested Date:</b></Typography>
                      <Typography variant="body2">
                        <DateFormat date={selectedItem.createdDate} />
                      </Typography>

                      <Typography variant="body2"><b>Status:</b></Typography>
                      <Typography variant="body2">{selectedItem.isActive ? 'Pending' : 'Resolved'}</Typography>
                    </Box>
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