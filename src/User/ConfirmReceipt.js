import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { InputLabel, Box, CardMedia, Dialog, DialogActions, AlertDialog, DialogContent, DialogTitle, Typography, TextField, Button, Grid, Snackbar, Alert, FormControl, Select, MenuItem, Paper, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { height, styled } from '@mui/system';
import ImageDisplay from '../imageDisplay';
import _ from 'lodash';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Html5QrcodeScanner } from "html5-qrcode";

function ConfirmReceipt({ isDrawerOpen, userName }) {
  const [marginLeft, setMarginLeft] = useState(100);
  const [itemLostRequests, setItemLostRequests] = useState([]); 

  const [results, setResults] = useState([]);
  const [imageTags, setImageTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null); // To store hovered thumbnail image
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which thumbnail is hovered
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState();
  const [itemDescription, setItemDescription] = useState(null);
  const [itemPhoto, setItemPhoto] = useState(null);
  const [itemobject, setItemobject] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState({ id: null, itemDescription: '', comments:'', warehouseLocation: '' });
  const [itemSelected, setItemSelected] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [location, setLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  

  const [marginRight, setMarginRight] = useState(100);

 

  const [currentItemLostRequest, setCurrentItemLostRequest] = useState({
    description: '',
    color: '',
    size: '',
    brand: '',
    model: '',
    distinguishingFeatures: '',
    itemCategory: '',
    serialNumber: '',
    dateTimeWhenLost: '',
    location: '',
    itemValue: '',
    itemPhoto: '',
    proofOfOwnership: '',
    howTheItemLost: '',
    referenceNumber: '',
    additionalInformation: '',
    address: '',
    otherRelevantDetails: '',
    requestedBy: userName,
    claimId:'',
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [resultResponseMessage, setResultResponseMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);


  useEffect(() => {
    const fetchItemLostRequests = async () => {
      try {
        //const response = await axios.get('http://172.17.31.61:5291/api/LostItemRequest');
        const response = await axios.get('http://localhost:7237/api/LostItemRequest');
        
        setItemLostRequests(response.data);
      } catch (error) {
        console.error('Error fetching item lost requests:', error);
      }
    };
    fetchItemLostRequests();
  }, []);

  useEffect(() => {
    //axios.get('http://172.17.31.61:5291/api/LostItemRequest/Locations')
    axios.get('http://localhost:7237/api/LostItemRequest/Locations')
    .then(response => {
      console.log(response);
      setLocationOptions(response.data.map(data => data.locations));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSearchText('');
    setItemSelected(false);
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
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    },
    backgroundColor: '#ffffff',
  }));

  // Hovered Image Popup (with position fixed for overlay)
  const HoveredImagePopup = styled(Box)(({ theme }) => ({
    position: 'absolute', // Ensures the pop-up doesn't scroll with the container
    top: '20px', // Adjust as needed to avoid overlap
    left: '20px', // Adjust as needed for alignment
    width: '200px',
    height: '200px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    border: '2px solid #2196F3',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    display: hoveredImage ? 'block' : 'none',
    transition: 'all 0.3s ease',
  }));

  //setSelectedImageId(item.id);
  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 260 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);


  // Function to handle selecting a thumbnail and submitting it via API
  const handleThumbnailClick = async (item) => {
    //console.log(item.filePath);
    console.log(item.id)

    setSelectedThumbnail(item.filePath); // Set the selected image
    setSelectedItemDetails({ id: item.id, itemDescription: item.itemDescription, comments: item.comments, warehouseLocation: item.warehouseLocation }); // Capture id and description
    setItemSelected(true);
    //setSelectedImageId(item.id);

    setCurrentItemLostRequest({
      description: item.itemDescription,
      requestedBy: userName,
      claimId: item.id,
    });

  };


  const handleImageChange = (e) => {
    setSearchText('');
    setResults([]);
    setItemSelected(false);
    setSelectedItemDetails({ id: null, itemDescription: '', comments:'', warehouseLocation: '' });
    console.log(e);
    const file = e.target.files[0];
    //console.log(file);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        const arrayBuffer = reader.result;
       // analyzeImage(arrayBuffer, file);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const searchImage = (file, imgTags, itemDesc, category) => {
    //setResults([]);   
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('tags', imgTags);
    formData.append('itemDescription', itemDesc);
    formData.append('warehouseLocation', location);

    try {
      //axios.post('http://172.17.31.61:5280/api/search', formData, {
        axios.post('http://localhost:7298/api/search', formData, {        
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          //console.log(response)

          if (response.status === 200) {
            setResults([]);
            setResultResponseMessage('');
            const filePaths = response.data.filesMatched.map(item => ({
              id: item.id,
              itemDescription: item.itemDescription,
              comments: item.comments,
              warehouseLocation: item.warehouseLocation,
              filePath: item.filePath
            }));
            setResults(filePaths);
          } else {
            setMessage('No items found');

          }
        });

    } catch (error) {
      console.error("Error occurred while searching:", error);
    };
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItemLostRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    setResults([]);
    setItemSelected(false);
    setSelectedItemDetails({ id: null, itemDescription: '', comments:'', warehouseLocation: '' });

    // Trigger the debounced search
    if (value) {
      debouncedSearch(value);
    } else {
      setResults([]);
      setResultResponseMessage('');
      setItemSelected(false);
    }

  };

  const handleMouseEnter = (image, index) => {
    setHoveredImage(image);
    setHoveredIndex(index); // Set the index to track hovered thumbnail
  };

  const debouncedSearch = useCallback(
    _.debounce(async (query) => {

      try {
        //const response = await fetch(`http://172.17.31.61:5280/api/images/search/${query}`, {
          const response = await fetch(`http://localhost:7298/api/images/search/${query}`, {
          
          method: 'GET',
        });

        if (response.status === 200) {
          const result = await response.json();
          //console.log(result);
          //const filePaths = result.map(item => item.filePath);

          const filePaths = result.map(item => ({
            id: item.id,
            itemDescription: item.itemDescription,
            comments: item.comments,
            warehouseLocation: item.warehouseLocation,
            filePath: item.filePath
          }));

          setResults(filePaths || []);
          setResultResponseMessage(result.message);
        } else {
          setResultResponseMessage('No matching images found');
          setItemSelected(false);
        }
      } catch (error) {
        console.error('Error during search:', error);
        setResultResponseMessage('Error occurred while searching');
      }
    }, 300), // 300ms delay
    []
  );

  const handleSubmit = async () => {
    try {
      console.log(currentItemLostRequest);
      //const response = await axios.post('http://172.17.31.61:5291/api/LostItemRequest/Claim', currentItemLostRequest);
      const response = await axios.post('http://localhost:7237/api/LostItemRequest/Claim', currentItemLostRequest);
      if (response.status === 200) {
        setSeverity('success');
        setResults([]);
        setResponseMessage(response.data.message);
        setSnackbarOpen(true);
        // Clear form data and close dialog on successful submission
        setCurrentItemLostRequest({
          description: '',
          color: '',
          size: '',
          brand: '',
          model: '',
          distinguishingFeatures: '',
          itemCategory: '',
          serialNumber: '',
          dateTimeWhenLost: '',
          location: '',
          itemValue: '',
          itemPhoto: '',
          proofOfOwnership: '',
          howTheItemLost: '',
          referenceNumber: '',
          additionalInformation: '',
          address: '',
          otherRelevantDetails: '',
          requestedBy: 'userName',
          claimId: '',
        });
        handleDialogClose();
        // Handle success actions like showing snackbar
      }
    } catch (error) {
      console.error('Error submitting the lost item request:', error);
    }
  };

  const dialogPaperStyles = {
    width: '600px',
    maxWidth: '800px',
    background: 'linear-gradient(to left,#1a1a2e, #16213e,#e0e0e0)',
    padding: 2, 
  };
  
  const dialogTitleStyles = {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: '1.5rem',
    borderBottom: '2px solid #ddd',
    paddingBottom: 1,
    display:'flex',
    justifyContent:'center'
  };
  
  const dialogContentStyles = {
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#fff',
    borderRadius: '6px',
  };
  
  const textFieldStyles = {
    marginBottom: 2,
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      border: '1px solid #ccc',
      '&:hover': {
        borderColor: '#1976d2', 
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1976d2',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#a6c7e7',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#a6c7e7',
      },
    },
  };
  
  const dialogActionsStyles = {
    padding: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
    borderRadius: '0 0 8px 8px',
  };
  
  const cancelButtonStyles = {
    color: '#f44336',
    '&:hover': {
      backgroundColor: '#ffebee',
    },
  };
  
  const submitButtonStyles = {
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  };

  const [qrValue, setQrValue] = useState("");
  const scannerRef = useRef(null);

  const startScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear(); // Clear the previous instance
    }

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        setQrValue(decodedText);
        getItemDetails();
        scanner.clear(); // Stop the scanner after scanning
        scannerRef.current = null;
      },
      (error) => {
        console.error("QR Code Scan Error:", error);
      }
    );

    scannerRef.current = scanner;
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleReset = () => {
    setQrValue("");
    startScanner(); // Restart the scanner
  };

  const getItemDetails = async () => 
  {
    const itemId = qrValue.substring(0,36);    

    try {
      //const response = await fetch(`http://172.17.31.61:5280/api/images/search/${query}`, {
        const response = await fetch(`http://localhost:7298/api/getById/${itemId}`, {
        
        method: 'GET',
      });

      if (response.status === 200) {
        const result = await response.json();

        
        setItemDescription(result.itemDescription);
        setItemPhoto(result.itemPhoto)
        //const filePaths = result.map(item => item.filePath);

        // const filePaths = result.map(item => ({
        //   id: item.id,
        //   itemDescription: item.itemDescription,
        //   comments: item.comments,
        //   warehouseLocation: item.warehouseLocation,
        //   filePath: item.filePath
        // }));

        // setResults(filePaths || []);
       // setResultResponseMessage(result.message);
      } else {
        setResultResponseMessage('No matching images found');
        setItemSelected(false);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setResultResponseMessage('Error occurred while fetching data');
    }

  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s'
    }}>
    
    <Paper  elevation={5} sx={{width:'100%', height:'100vh'}}>
      <Typography variant="h4" gutterBottom sx={{
        backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontWeight: 'bold',
        mt:2
      }}>
      Scan to Confirm
      </Typography>
      <Divider sx={{ 
        width: '90%', 
        margin: 'auto', 
        mb: 2,
      }} />
      <Box sx={{
        mt:2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        justifyContent: 'center',
        gap: 2,
        width: { xs: '100%', sm: '100%', md: 'auto' },
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FormControl sx={{ width: { xs: '250px', sm: '400px', md: '250px' },marginTop: '10px', mb: 3 }}>
          <Box sx={{ padding: 3, textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
              <InputLabel
                id="location-label"
                sx={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: 2 }}
              >
                Scan QR
              </InputLabel>

              <Box
                id="reader"
                sx={{
                  margin: "20px auto",
                  width: "300px",
                  height: "300px",
                  border: "2px dashed #1976d2",
                  borderRadius: "8px",
                  position: "relative",
                  backgroundColor: "#f9f9f9",
                }}
              ></Box>

              {qrValue && (
                <Box sx={{ marginTop: 3, textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ marginBottom: 2, color: "#333", fontWeight: "bold" }}
                  >
                    Details:
                  </Typography>
                  <Typography
                    sx={{
                      padding: "10px 15px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      display: "inline-block",
                      fontFamily: "monospace",
                      fontSize: "1rem",
                    }}
                  >
                    {itemDescription}
                  </Typography>
                  {/* <CardMedia>
                            <ImageDisplay imageId={itemPhoto} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0px 0px 0px' }} />
                          </CardMedia> */}
                </Box>
              )}

              <Box sx={{ marginTop: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  onClick={() => alert("Confirm action triggered!")}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </FormControl>

         
        </Box>
        </Box>
    
      </Paper>
    </Box>
  );
}

export default ConfirmReceipt;

