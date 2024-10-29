import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { InputLabel, Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ImageDisplay from '../imageDisplay';
import _ from 'lodash'; 

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
    width: '100px', // Width for the thumbnail
    height: '100px', // Height for the thumbnail
    margin: '10px',
    borderRadius: '15px', // Rounded corners
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow effect
    '&:hover': {
      transform: 'scale(1.05)', // Slightly scale up on hover
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // Enhanced shadow on hover
    },
    backgroundColor: '#ffffff', // White background for contrast
  }));
  
  const HoveredImagePopup = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: '-150px', // Adjust for positioning
    right: '0', // Align to the right
    width: '200px', // Width for the popout image
    height: '200px', // Height for the popout image
    backgroundColor: '#ffffff', // White background
    borderRadius: '15px', // Rounded corners
    border: '2px solid #2196F3', // Blue border for emphasis
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Soft shadow effect
    zIndex: 10,
    display: hoveredImage ? 'block' : 'none', // Toggle visibility
    transition: 'all 0.3s ease', // Smooth transition for popout
  }));


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
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

  const searchImage =  () => {
    setResults([]);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category); 
    formData.append('tags', tags); 
    formData.append('itemDescription', itemDescription); 

       axios.post('http://localhost:5005/api/search',  formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response=>{
        
        if (response.status === 200) {       
          setResults(response.data.filesMatched);
        } else {
          setMessage('No items found');
        }

      }).catch(error => {
            console.error("Error occurred while searching:", error);
        });           
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
      setResponseMessage('');
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
          const filePaths = result.map(item => item.filePath);
          setResults(filePaths || []); 
          setResponseMessage(result.message);
        } else {
          setResponseMessage('No matching images found');
        }
      } catch (error) {
        console.error('Error during search:', error);
        setResponseMessage('Error occurred while searching');
      }
    }, 300), // 300ms delay
    []
  );

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5291/api/LostItemRequest', currentItemLostRequest);
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
      });
      setUploadedImage(null);
    } catch (error) {
      console.error('Error submitting the lost item request:', error);
    }

  };

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
      transition: 'margin-left 0.3s',
    }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
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
              onChange={handleImageUpload}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
        <form  className="upload-form"> 
        <Box flex="1" display="flex" flexDirection="column" alignItems="flex-start">
                    <TextField
                      label="Search Items"
                      variant="outlined"
                      fullWidth
                      value={searchText}
                      onChange={handleSearchChange}
                      style={{ marginBottom: '20px' }}
                    />
                  <Box display="flex" flexWrap="wrap" justifyContent="center"
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
                    }}>
                  {results.length > 0 ? (results.map((img, index) => (
                  <Box key={index} position='relative' >
                    <ThumbnailBox
                      //isHovered={hoveredIndex === index}  // Pass hover state to ThumbnailBox
                      onClick={() => handleMouseEnter(img, index)}
                      //onMouseLeave={handleMouseLeave}
                    >
                      {/* <ImageDisplay imageId={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}

                      <ImageDisplay
                        imageId={img}
                        style={{
                          width: '100px', // Small size for thumbnails
                          height: '100px', // Small size for thumbnails
                          
                        }}
                      />

                    </ThumbnailBox>

                {/* Hovered Image Popup */}
                {hoveredImage && hoveredIndex === index && (
                  <HoveredImagePopup
                    //onMouseEnter={() => setHoveredImage(img)}  // Keep pop-up open when hovering over it
                  // onMouseLeave={handleMouseLeave}  // Close pop-up when mouse leaves
                  >
                    <ImageDisplay imageId={hoveredImage} style={{ width: '200px', height: '200px' }} />
                  </HoveredImagePopup>
                )}
              </Box>
            ))) : <Typography>{responseMessage}</Typography>}
          </Box>


        </Box>
        </form>
          {/* <Grid container spacing={2}>
            {[
              { label: 'Description', name: 'description', maxLength: 50  },
              { label: 'Color', name: 'color', maxLength: 50 },
              { label: 'Size', name: 'size', maxLength: 20 },
              { label: 'Brand', name: 'brand', maxLength: 50 },
              { label: 'Model', name: 'model', maxLength: 50 },
              { label: 'Distinguishing Features', name: 'distinguishingFeatures', maxLength: 100 },
              { label: 'Item Category', name: 'itemCategory', maxLength: 50 },
              { label: 'Serial Number', name: 'serialNumber', maxLength: 50 },
              { label: 'Date and Time When Lost', name: 'dateTimeWhenLost', type: 'datetime-local' },
              { label: 'Location', name: 'location', maxLength: 100 },
              { label: 'Item Value', name: 'itemValue', type: 'number', inputProps: { min: 0 } },
              { label: 'Proof of Ownership', name: 'proofOfOwnership', maxLength: 100 },
              { label: 'How the Item Was Lost', name: 'howTheItemLost', maxLength: 100 },
              { label: 'Reference Number', name: 'referenceNumber', maxLength: 50 },
              { label: 'Additional Information', name: 'additionalInformation', maxLength: 200 },
              { label: 'Other Relevant Details', name: 'otherRelevantDetails', maxLength: 200 },
            ].map(({ label, name, maxLength, type = 'text', inputProps = {} }) => (
              <React.Fragment key={name}>
                <InputLabel>{label}</InputLabel>
                <TextField
                  margin="dense"
                  name={name}
                  value={currentItemLostRequest[name]}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ maxLength, ...inputProps }}
                  type={type}
                />
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Item details submitted!"
      />
    </Box>
  );
}

export default ItemLostRequest;

