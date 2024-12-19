import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Card, CardMedia, CardContent, Tabs, Tab, Modal, Grid, Button, Container, Paper, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../Components/AuthService';
import ImageDisplay from '../imageDisplay';
import DateFormat from '../Components/DateFormat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const ClaimStatus = ({ isDrawerOpen, tabChange }) => {
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [value, setValue] = useState(tabChange);

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
    setMarginLeft(isDrawerOpen ? 300 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  // Fetch claims from the API and filter them based on `userName`
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('http://172.17.31.61:5291/api/LostItemRequest');
        // const response = await axios.get('http://localhost:7237/api/LostItemRequest');
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
  const pendingClaims = uploadedItems.filter(item => item.status === "Claimed");
  const resolvedClaims = uploadedItems.filter(item => !item.isActive);
  const approvedClaims = uploadedItems.filter(item => item.status === "Approve");
  const receivedClaims = uploadedItems.filter(item => item.status === "Returned");
  const rejectedClaims = uploadedItems.filter(item => item.status === "Reject");

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s'
    }}>

      <Paper elevation={5} sx={{ width: '100%', height: '100%', p: 2 }}>
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
                marginBottom: 0,
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
                    Approved
                  </Box>
                }
                sx={{
                  color: value === 1 ? '#4CAF50' : '#888',
                  fontWeight: value === 1 ? 'bold' : 'normal',
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThumbUpAltIcon sx={{ color: value === 2 ? '#4CAF50' : '#888' }} />
                    Received
                  </Box>
                }
                sx={{
                  color: value === 2 ? '#4CAF50' : '#888',
                  fontWeight: value === 2 ? 'bold' : 'normal',
                }}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThumbUpAltIcon sx={{ color: value === 3 ? '#4CAF50' : '#888' }} />
                    Rejected
                  </Box>
                }
                sx={{
                  color: value === 3 ? '#4CAF50' : '#888',
                  fontWeight: value === 3 ? 'bold' : 'normal',
                }}
              />
            </Tabs>
          </Box>
          <Divider sx={{
            width: '90%',
            margin: 'auto',
            mb: 2
          }} />


          {/* Tab Panel for Pending Claims */}
          {value === 0 && (
            <Grid container spacing={3} justifyContent={pendingClaims.length === 0 ? "center" : "flex-start"} >
              {pendingClaims.length === 0 ? (
                <Typography sx={{ mt: 6 }}>No pending claims.</Typography>
              ) : (
                pendingClaims.map((item, index) => {
                  const cardBackgroundColor = item.isActive ? '#F2D2BD' : '#F2D2BD';
                  const cardHoverColor = item.isActive ? '#FBCEB1' : '#FBCEB1';
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          boxShadow: 3,
                          height: '230px',
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
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 2,
                            textOverflow: 'ellipsis',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Description:</b> <span style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              WebkitLineClamp: 2,
                              textOverflow: 'ellipsis',
                            }}>
                              {item.description}
                            </span>
                          </Typography>
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Status:</b>{item.status === "Claimed" ? 'Pending' : 'Approved'}
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
            <Grid container spacing={3} justifyContent={approvedClaims.length === 0 ? "center" : "flex-start"}>
              {approvedClaims.length === 0 ? (
                <Typography sx={{ mt: 6 }}>No approved claims.</Typography>
              ) : (
                approvedClaims.map((item, index) => {
                  const cardBackgroundColor = item.isActive ? '#C1E1C1' : '#C1E1C1';
                  const cardHoverColor = item.isActive ? '#A5D6A7' : '#A5D6A7';
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          boxShadow: 3,
                          height: '230px',
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
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 2,
                            textOverflow: 'ellipsis',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Description:</b> <span style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              WebkitLineClamp: 2,
                              textOverflow: 'ellipsis',
                            }}>
                              {item.description}
                            </span>
                          </Typography>
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Status:</b>{item.status}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
          )}
          {value === 2 && (
            <Grid container spacing={3} justifyContent={receivedClaims.length === 0 ? "center" : "flex-start"}>
              {receivedClaims.length === 0 ? (
                <Typography sx={{ mt: 6 }}>No received claims.</Typography>
              ) : (
                receivedClaims.map((item, index) => {
                  const cardBackgroundColor = item.isActive ? '#C1E1C1' : '#C1E1C1';
                  const cardHoverColor = item.isActive ? '#A5D6A7' : '#A5D6A7';
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          boxShadow: 3,
                          height: '230px',
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
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 2,
                            textOverflow: 'ellipsis',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Description:</b> <span style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              WebkitLineClamp: 2,
                              textOverflow: 'ellipsis',
                            }}>
                              {item.description}
                            </span>
                          </Typography>
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Status:</b>{item.status === "Returned" ? "Received" : "Approved"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
          )}

          {value === 3 && (
            <Grid container spacing={3} justifyContent={rejectedClaims.length === 0 ? "center" : "flex-start"}>
              {rejectedClaims.length === 0 ? (
                <Typography sx={{ mt: 6 }}>No Rejected claims.</Typography>
              ) : (
                rejectedClaims.map((item, index) => {
                  const cardBackgroundColor = item.isActive ? '#C1E1C1' : '#C1E1C1';
                  const cardHoverColor = item.isActive ? '#A5D6A7' : '#A5D6A7';
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          boxShadow: 3,
                          height: '230px',
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
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 2,
                            textOverflow: 'ellipsis',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Description:</b> <span style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              WebkitLineClamp: 2,
                              textOverflow: 'ellipsis',
                            }}>
                              {item.description}
                            </span>
                          </Typography>
                          <Typography sx={{
                            textAlign: 'left',
                            margin: '0px 10px',
                            display: 'grid',
                            gridTemplateColumns: '80px auto',
                            rowGap: 1.5,
                            columnGap: 2,
                          }}>
                            <b>Status:</b>{item.status === "Reject" ? "Rejected" : "Pending"}
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
                    maxWidth: '80%',
                    width: '100%',
                    position: 'relative',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >

                  <Box
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      backgroundColor: 'white',
                      borderBottom: '1px solid #e0e0e0',
                      paddingBottom: 1,
                      mb: 2,
                    }}
                  >
                    <Button
                      onClick={handleClose}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 10,
                        zIndex: 20,
                      }}
                    >
                      <CloseIcon />
                    </Button>
                    <Typography
                      variant="h4"
                      align="center"
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        marginBottom: 0,
                        marginLeft: 0,
                        backgroundImage:
                          'linear-gradient(to left, #00aae7,#770737,#2368a0)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 'bold',
                      }}
                    >
                      Claim Status
                    </Typography>
                  </Box>

                  {/* Scrollable Content */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                      gap: 6,
                      pt: 3,
                      fontFamily: 'Lato',
                      background: '#d3eaf5',
                      height: '100vh',
                      overflowY: 'scroll',
                      '&::-webkit-scrollbar': {
                        width: '5px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#0d416b',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'lightgrey',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'space-between',
                        flex: 1,
                      }}
                    >
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
                          marginLeft: '60px',
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flex: 2 }}>

                      {/* Using Grid for aligned labels and content */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '250px 1fr',
                          rowGap: 1.5,
                          columnGap: 1,
                        }}
                      >
                        {/* Content Items */}
                        <Typography variant="h6"><b>Item Description:</b></Typography>
                        <Typography variant="h5" gutterBottom>
                          {selectedItem.itemDescription}
                        </Typography>

                        <Typography variant="h6"><b>Item Category:</b></Typography>
                        <Typography sx={{ fontSize: '20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {selectedItem.itemCategory}
                        </Typography>

                        <Typography variant="h6"><b>Color:</b></Typography>
                        <Typography sx={{ fontSize: '20px' }} >{selectedItem.color}</Typography>

                        <Typography variant="h6"><b>Brand:</b></Typography>
                        <Typography sx={{ fontSize: '20px' }}>{selectedItem.brand}</Typography>

                        <Typography variant="h6"><b>Distinguishing Features:</b></Typography>
                        <Typography sx={{ fontSize: '20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {selectedItem.distinguishingFeatures}
                        </Typography>

                        <Typography variant="h6"><b>Date and Time of Loss:</b></Typography>
                        <Typography sx={{ fontSize: '20px' }}>
                          <DateFormat date={selectedItem.dateTimeWhenLost} />
                        </Typography>

                        <Typography variant="h6"><b>Location / Area of Loss:</b></Typography>
                        <Typography sx={{ fontSize: '20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {selectedItem.location}
                        </Typography>

                        <Typography variant="h6"><b>Other Details For Communication:</b></Typography>
                        <Typography sx={{ fontSize: '20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {selectedItem.otherRelevantDetails}
                        </Typography>

                        <Typography variant="h6"><b>Address:</b></Typography>
                        <Typography sx={{ fontSize: '20px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {selectedItem.address}
                        </Typography>

                        <Typography variant="h6">
                          <b>Requested Date:</b>
                        </Typography>
                        <Typography sx={{ fontSize: '20px', width: '100%', }}>
                          <DateFormat date={selectedItem.createdDate} />
                        </Typography>
                        {!selectedItem.isActive && (
                          <>
                            <Typography variant="h6">
                              <b>Resolved Date:</b>
                            </Typography>
                            <Typography sx={{ fontSize: '20px' }}>
                              <DateFormat date={selectedItem.updatedDate} />
                            </Typography>
                          </>
                        )}
                        <Typography variant="h6" sx={{ mb: 3 }}>
                          <b>Status:</b>
                        </Typography>
                        <Typography sx={{ fontSize: '20px' }}>
                          {selectedItem.status === 'Approve' ? 'Approve' : (selectedItem.status === 'Reject' ? "Rejected" : "Pending")}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>
                </Box>
              )}
            </Box>
          </Modal>
        </Container>
      </Paper>
    </Box>
  );
};

export default ClaimStatus;