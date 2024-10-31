import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Grid, Snackbar, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { height, styled } from '@mui/system';
import ImageDisplay from '../imageDisplay';
import _ from 'lodash';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function ItemLostRequest({ isDrawerOpen, userName }) {
  const [marginLeft, setMarginLeft] = useState(100);
  const [itemLostRequests, setItemLostRequests] = useState([]);

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
  }, [isDrawerOpen]);

  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null); // To store hovered thumbnail image
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which thumbnail is hovered
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [itemDescription, setItemDescription] = useState('');
  const [itemobject, setItemobject] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState({ id: null, itemDescription: '' });
  const [itemSelected, setItemSelected] = useState(false);
  const [severity, setSeverity] = useState('success');

  // const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  //const [selectedImageId, setSelectedImageId] = useState('');

  // Azure Computer Vision API endpoint and key
  const subscriptionKey = '2df0c7e47bc14b538b8534fb58937522';
  const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';


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
    otherRelevantDetails: '',
    requestedBy: userName,
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [resultResponseMessage, setResultResponseMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');



  useEffect(() => {
    const fetchItemLostRequests = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/LostItemRequest');
        setItemLostRequests(response.data);
      } catch (error) {
        console.error('Error fetching item lost requests:', error);
      }
    };
    fetchItemLostRequests();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const analyzeImage = async (imageData) => {
    const apiUrl = `${endpoint}/vision/v3.1/analyze?visualFeatures=Categories,Description,Objects`;

    try {
      const response = await axios.post(apiUrl, imageData, {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/octet-stream',
        },
      });

      if (response.status === 200) {
        {
          const objects = response.data.objects;
          const objectCategory = objects && objects.length > 0 ? objects[0].object : "unknown";
          const imageTags = response.data.description.tags;

          setCategory(objectCategory);
          setTags(imageTags);
          setItemDescription(response.data.description.captions[0].text);
          searchImage();
        }
      } else {
        console.log('Error analyzing image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
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
    setMarginLeft(isDrawerOpen ? 260 : 250);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);


  // Function to handle selecting a thumbnail and submitting it via API
  const handleThumbnailClick = async (item) => {
    console.log(item.filePath);
    setSelectedThumbnail(item.filePath); // Set the selected image
    setSelectedItemDetails({ id: item.id, itemDescription: item.itemDescription }); // Capture id and description
    setItemSelected(true);


    setCurrentItemLostRequest({
      description: selectedItemDetails.itemDescription,
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
      otherRelevantDetails: '',
      requestedBy: userName,
      claimId: selectedItemDetails.id,
    });

  };


  const handleImageChange = (e) => {
    setResults([]);
    setItemSelected(false);
    setSelectedItemDetails({ id: null, itemDescription: '' });
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        const arrayBuffer = reader.result;
        analyzeImage(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const searchImage = () => {
    //setResults([]);   
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('itemDescription', itemDescription);
    try {
      axios.post('http://localhost:5005/api/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          console.log(response)

          if (response.status === 200) {
            setResults([]);
            setResultResponseMessage('');
            const filePaths = response.data.filesMatched.map(item => ({
              id: item.id,
              itemDescription: item.itemDescription,
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

    // Trigger the debounced search
    if (value) {
      debouncedSearch(value);
    } else {
      setResults([]);
      setResultResponseMessage('');
    }

  };

  const handleMouseEnter = (image, index) => {
    setHoveredImage(image);
    setHoveredIndex(index); // Set the index to track hovered thumbnail
  };

  const debouncedSearch = useCallback(
    _.debounce(async (query) => {
      try {
        const response = await fetch(`http://localhost:5005/api/images/search/${query}`, {
          method: 'GET',
        });

        if (response.status === 200) {
          const result = await response.json();
          console.log(result);
          const filePaths = result.map(item => item.filePath);
          setResults(filePaths || []);
          setResultResponseMessage(result.message);
        } else {
          setResultResponseMessage('No matching images found');
        }
      } catch (error) {
        console.error('Error during search:', error);
        setResultResponseMessage('Error occurred while searching');
      }
    }, 300), // 300ms delay
    []
  );

  const handleClaimItem = async () => {
    if (!selectedThumbnail) return;
    try {
      const response = await axios.post('https://localhost:7237/api/LostItemRequest/Claim', currentItemLostRequest);

      if (response.status === 200) {
        setItemSelected(false);
        setSelectedItemDetails({ id: null, itemDescription: '' });
        setSeverity('success');
        setResults([]);
        setResponseMessage(response.data.message);
        setSnackbarOpen(true);
        setItemLostRequests((prevRequests) => [...prevRequests, currentItemLostRequest]);
        // Reset form
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
          otherRelevantDetails: '',
          requestedBy: userName,
          claimId: '',
        });
        setUploadedImage(null);
      }

    } catch (error) {
      console.error('Error submitting the lost item request:', error);
    }

  };

  return (
    <Box sx={{ textAlign: 'center', mt: 2, ml: `${marginLeft}px`, mr: `${marginRight}px`, transition: 'margin-left 0.3s' }}>

      {/* <Grid container spacing={3}> */}
      {/* <Grid item xs={6}> */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-around',
        // border: '2px solid red'
      }}>
        <Box>

          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={!uploadedImage && <CloudUploadIcon />}
            sx={{
              width: '300px',
              height: '300px',
              border: '2px dashed #888',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: uploadedImage ? 'transparent' : '#fff',
              backgroundImage: uploadedImage ? `url(${uploadedImage})` : 'none',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              cursor: 'pointer',
              marginTop: '100px',
              marginBottom: '20px',
              color: 'black',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                border: '2px dashed #333',
              },
            }}
          >
            {!uploadedImage && 'Upload Lost Item Photo'}
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        {/* </Grid> */}
        {/* <Grid item xs={6}> */}
        <Box>

          <form className="upload-form">
            <Box flex="1" display="flex" flexDirection="column" alignItems="flex-start">
              <TextField
                label="Search Items"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px' }}
              />
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                sx={{
                  maxHeight: '500px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '5px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'black',
                    borderRadius: '5px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'lightgrey',
                  },
                }}
              >
                {results.length > 0 ? (results.map((item, index) => (
                  <Box key={index} position="relative">
                    <ThumbnailBox onClick={
                      //() => handleMouseEnter(img, index),
                      () => handleThumbnailClick(item)
                    }
                      style={{
                        border: selectedThumbnail === item.filePath ? '2px solid #2196F3' : 'none', // Highlight selected thumbnail
                      }}
                    >
                      <ImageDisplay imageId={item.filePath} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    </ThumbnailBox>

                    {/* Hovered Image Popup */}
                    {/* {hoveredImage && hoveredIndex === index && (
                          <HoveredImagePopup>
                            <ImageDisplay imageId={hoveredImage} style={{ width: '200px', height: '200px' }} />
                          </HoveredImagePopup>
                        )} */}


                  </Box>

                ))) : <Typography>{resultResponseMessage}</Typography>}
              </Box>

              {itemSelected && (<Box sx={{
                display: 'flex',
                flexDirection: 'column'
              }} >
                <Box mt={2} sx={{
                  display: 'flex',
                  // width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Lato',
                  textAlign: 'center',
                  color: '#229954',
                  // marginLeft: 16,

                }}>
                  <DoneAllIcon /> <p><b>Selected Item :</b> {selectedItemDetails.itemDescription}</p>
                </Box>

                <Box width="100%" height="40px" display="flex" justifyContent="right" sx={{
                  display: 'flex',
                  // width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // marginTop: "40px"
                }} >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClaimItem}
                    disabled={!selectedThumbnail} // Disable button if no thumbnail is selected
                  >
                    Claim the Item
                  </Button>
                </Box>
              </Box>
              )}
            </Box>
          </form>
        </Box>
      </Box>

      {/* </Grid> */}
      {/* </Grid> */}
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={responseMessage}
      /> */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ ml: '34%', mb: 2 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ItemLostRequest;

