import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { TextField, MenuItem, Box, Typography, Card, CardMedia, CardContent, Modal, Grid, Button, Container, Alert, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../Components/AuthService'; // Assuming your auth service file is named AuthService.js
import ImageDisplay from '../imageDisplay';
import DateFormat from '../Components/DateFormat';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { tab } from '@testing-library/user-event/dist/tab';
import PublishIcon from '@mui/icons-material/Publish';
// import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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

  const [claim, setClaim] = useState([]);
  const [approved, setApproved] = useState([]);
  const [reject, setReject] = useState([]);
  const [resolved,setResolved] = useState([]);

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
        console.log("Claimed data", response.data.filter(item => item.status === "Claim"));
        setUploadedItems(userClaims);
        setClaim(userClaims.filter(data => data.status === "Claim"));
        setApproved(userClaims.filter(data => data.status === "Approved"));
        setResolved(userClaims.filter(data => data.status === "Resolved"));
        setReject(userClaims.filter(data => data.status === "Reject"));
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

  const [tabs, setTabs] = React.useState(0);

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
          Claim Requests
        </Typography>


        <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', 
          display: 'flex', justifyContent: 'center', 
         }}>
          <Tabs
            value={tabs}
            variant="fullwidth"
            onChange={(event, newValue) => setTabs(newValue)}
            aria-label="basic tabs example"
            sx={{
              display: 'flex',
              justifyContent: 'center', 
              alignItems: 'center', 
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReportProblemIcon sx={{ color: tabs === 0 ? '#E97451' : '#888' }} />
                  Claimed
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThumbUpAltIcon sx={{ color: tabs === 1 ? '#4CAF50' : '#888' }} />
                  Approved
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: tabs === 2 ? '#4CAF50' : '#888' }} />
                  Resolved
                </Box>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelIcon sx={{ color: tabs === 3 ? 'red' : '#888' }} />
                  Rejected
                </Box>
              }
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

      <CustomTabPanel value={tabs} index={0}>
      {claim.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="flex-start">
            {claim.map((item, index) => {
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
                      {/* <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.isActive ? 'Claimed' : 'Approved'}</Typography> */}
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.status}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Age:</b> {calculateDaysAgo(item.createdDate, item.updatedDate)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabs} index={1}>
      {approved.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="flex-start">
            {approved.map((item, index) => {
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
                      {/* <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.isActive ? 'Claimed' : 'Approved'}</Typography> */}
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.status}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Age:</b> {calculateDaysAgo(item.createdDate, item.updatedDate)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

        )}
      </CustomTabPanel>

      <CustomTabPanel value={tabs} index={2}>
      {resolved.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="flex-start">
            {resolved.map((item, index) => {
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
                      {/* <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.isActive ? 'Claimed' : 'Approved'}</Typography> */}
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.status}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Age:</b> {calculateDaysAgo(item.createdDate, item.updatedDate)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

        )}
      </CustomTabPanel>

      <CustomTabPanel value={tabs} index={3}>
      {reject.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="flex-start">
            {reject.map((item, index) => {
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
                      {/* <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.isActive ? 'Claimed' : 'Approved'}</Typography> */}
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Status:</b> {item.status}</Typography>
                      <Typography sx={{ textAlign: 'left', margin: '0px 10px' }}><b>Age:</b> {calculateDaysAgo(item.createdDate, item.updatedDate)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

        )}
      </CustomTabPanel>
    </Box>

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
                }}
              >
                <Button onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <CloseIcon />
                </Button>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 2, marginBottom: 0, marginLeft: 0,
                    backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold',
                   }}
                >
                  Claim Approval
                </Typography>
                <hr />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, gap: 6, pt: 3, fontFamily:'Lato', background: '#d3eaf5', }}>
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: '250px 1fr', rowGap: 1.5, columnGap: 1, fontFamily:'Lato' }}>
                      <Typography variant="h6"><b>Description:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize:'20px' }}>
                        {selectedItem.description}
                      </Typography>

                      <Typography variant="h6"><b>Item Category:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap',fontSize:'20px' }}>
                        {selectedItem.itemCategory}
                      </Typography>

                      <Typography variant="h6"><b>Color:</b></Typography>
                      <Typography sx={{fontSize:'20px'}}>{selectedItem.color}</Typography>

                      <Typography variant="h6"><b>Brand:</b></Typography>
                      <Typography sx={{fontSize:'20px'}}>{selectedItem.brand}</Typography>

                      <Typography variant="h6"><b>Distinguishing Features:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap',fontSize:'20px' }}>
                        {selectedItem.distinguishingFeatures}
                      </Typography>

                      <Typography variant="h6"><b>Date and Time of Loss:</b></Typography>
                      <Typography sx={{fontSize:'20px'}}>
                        <DateFormat date={selectedItem.dateTimeWhenLost} />
                      </Typography>

                      <Typography variant="h6"><b>Location / Area:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap',fontSize:'20px' }}>
                        {selectedItem.location}
                      </Typography>

                      <Typography variant="h6"><b>Other Details For Communication:</b></Typography>
                      <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap',fontSize:'20px' }}>
                        {selectedItem.otherRelevantDetails}
                      </Typography>

                      <Typography variant="h6"><b>Requested By:</b></Typography>
                      <Typography sx={{fontSize:'20px'}}>
                        {selectedItem.createdBy}
                      </Typography>

                      <Typography variant="h6"><b>Requested Date:</b></Typography>
                      <Typography sx={{fontSize:'20px'}}>
                        <DateFormat date={selectedItem.createdDate} />
                      </Typography>

                      <Typography variant="h6"><b>Status:</b></Typography>
                      <Typography sx={{fontSize:'20px'}}>{selectedItem.status}</Typography>
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
                      <Button variant="contained" color="primary" onClick={handleSubmit} 
                        startIcon={<PublishIcon />}
                        sx={{
                          background: 'linear-gradient(to left, #00aae7, #770737)',
                          color: '#fff',
                          border: 'none',
                          '&:hover': {
                            background: 'linear-gradient(to left, #2368a0, #770737, #00aae7)',
                          },
                          '&.Mui-disabled': {
                            background: 'linear-gradient(to left, #d3d3d3, #a9a9a9)',
                            color: '#fff',
                          },
                      }}>
                        Submit
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={handleClose}
                      startIcon={<CancelIcon />}
                      sx={{
                        background: 'linear-gradient(to left, #00aae7, #770737)',
                        color: '#fff',
                        border: 'none',
                        '&:hover': {
                          background: 'linear-gradient(to left, #2368a0, #770737, #00aae7)',
                        },
                        '&.Mui-disabled': {
                          background: 'linear-gradient(to left, #d3d3d3, #a9a9a9)',
                          color: '#fff',
                        },
                      }}>
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