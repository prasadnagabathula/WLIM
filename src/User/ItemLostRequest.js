import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { InputLabel, Box, Dialog, DialogActions, AlertDialog, DialogContent, DialogTitle, Typography, TextField, Button, Grid, Snackbar, Alert, FormControl, Select, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { height, styled } from '@mui/system';
import ImageDisplay from '../imageDisplay';
import _ from 'lodash';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function ItemLostRequest({ isDrawerOpen, userName }) {
  const [marginLeft, setMarginLeft] = useState(100);
  const [itemLostRequests, setItemLostRequests] = useState([]);

  //   useEffect(() => {
  //   setMarginLeft(isDrawerOpen ? 400 : 100);
  // }, [isDrawerOpen]);

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
  const [itemobject, setItemobject] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState({ id: null, itemDescription: '' });
  const [itemSelected, setItemSelected] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [location, setLocation] = useState('');

  // const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  //const [selectedImageId, setSelectedImageId] = useState('');

  // Azure Computer Vision API endpoint and key
  const subscriptionKey = '2df0c7e47bc14b538b8534fb58937522';
  const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';

  const locationOptions = ["New York", "Atlanta", "Tacoma", "Piscataway"];

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
    setSearchText('');
    setItemSelected(false);
  };

  const analyzeImage = async (imageData, file) => {
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
          const imageTags = response.data.description.tags;
          setImageTags(imageTags);
          setItemDescription(response.data.description.captions[0].text);
          const itemDesc = response.data.description.captions[0].text;
          const objects = response.data.objects;
          const objectCategory = objects && objects.length > 0 ? objects[0].object : "unknown";
          searchImage(file, imageTags, itemDesc, objectCategory);
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
    setMarginLeft(isDrawerOpen ? 260 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);


  // Function to handle selecting a thumbnail and submitting it via API
  const handleThumbnailClick = async (item) => {
    //console.log(item.filePath);
    console.log(item.id)

    setSelectedThumbnail(item.filePath); // Set the selected image
    setSelectedItemDetails({ id: item.id, itemDescription: item.itemDescription }); // Capture id and description
    setItemSelected(true);
    //setSelectedImageId(item.id);

    setCurrentItemLostRequest({
      description: item.itemDescription,
      requestedBy: userName,
      claimId: item.id,
    });

  };


  const handleImageChange = (e) => {
    setResults([]);
    setItemSelected(false);
    setSelectedItemDetails({ id: null, itemDescription: '' });
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
        analyzeImage(arrayBuffer, file);
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
      axios.post('https://localhost:7298/api/search', formData, {
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
        const response = await fetch(`https://localhost:7298/api/images/search/${query}`, {
          method: 'GET',
        });

        if (response.status === 200) {
          const result = await response.json();
          //console.log(result);
          //const filePaths = result.map(item => item.filePath);

          const filePaths = result.map(item => ({
            id: item.id,
            itemDescription: item.itemDescription,
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
      const response = await axios.post('https://localhost:7237/api/LostItemRequest/Claim', currentItemLostRequest);
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

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s'
    }}>
      <Box sx={{
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
            <InputLabel id="location-label">Location</InputLabel>   
            <Select
              labelId="location-label"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              label="Location"
            >
              {locationOptions.map((loc, index) => (
                <MenuItem key={index} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={!uploadedImage && <CloudUploadIcon />}
            sx={{
              width: '250px',
              height: '250px',
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
              marginTop: '10px',
              marginBottom: '20px',
              color: 'black',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                border: '2px dashed #333',
              },
            }}
          >
            {!uploadedImage && 'Search by Photo'}
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Box component='form' sx={{
            width: { xs: '90%', sm: '90%' },
          }}>
            <Box sx={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              // alignItems: "flex-start",
              width: { xs: '100%', sm: '100%', md: 500 },
              height: '100%',
            }}>
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', marginTop: '10px' }}
              />
              {/* Display results count */}
              {searchText && (
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '20px', color: '#89023e' }}>
                  {results.length > 0 ? `Showing ${results.length} result${results.length > 1 ? 's' : ''}` : 'No results found'}
                </Typography>
              )}
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                sx={{
                  backgroundColor: '#eee',
                  maxHeight: '270px',
                  overflowY: 'auto',
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
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                mt: 2
              }}  >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'Lato',
                  color: '#229954',

                }}>
                  <DoneAllIcon /> <p><b>Selected Item :</b> {selectedItemDetails.itemDescription}</p>
                </Box>
                <Box height="40px" sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  mt: 2
                }} >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDialogOpen}
                    disabled={!selectedThumbnail} // Disable button if no thumbnail is selected
                    width="300px"
                  >
                    Claim the Item
                  </Button>
                </Box>
              </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        sx={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent sx={{ width: { xs: '300px', sm: '300px', md: '500px' } }}>
          <Alert severity={severity}>{responseMessage}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSnackbar} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={handleDialogClose} PaperProps={{ sx: dialogPaperStyles }}>
      <DialogTitle sx={dialogTitleStyles}>More Information About Item</DialogTitle>
      <DialogContent sx={dialogContentStyles}>
        {[ 
          { label: 'Description', name: 'description', maxLength: 50 },
          { label: 'Color', name: 'color', maxLength: 50 },
          { label: 'Brand', name: 'brand', maxLength: 50 },
          { label: 'Distinguishing Features', name: 'distinguishingFeatures', maxLength: 100 },
          { label: 'Date and Time of Loss', name: 'dateTimeWhenLost', type: 'datetime-local' },
          { label: 'Location / Area', name: 'location', maxLength: 100 },
          { label: 'Other Details For Communication', name: 'otherRelevantDetails', maxLength: 200 },
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
              sx={textFieldStyles}
            />
          </React.Fragment>
        ))}
      </DialogContent>
      <DialogActions sx={dialogActionsStyles}>
        <Button onClick={handleDialogClose} color="secondary" sx={cancelButtonStyles}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={submitButtonStyles}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
      {/* <Dialog open={dialogOpen} onClose={handleDialogClose}
        PaperProps={{
          style: {
            width: '600px', 
            maxWidth: '800px', 
          },
        }}
      >
        <DialogTitle>More Information About Item</DialogTitle>
        <DialogContent>
          {[
            { label: 'Description', name: 'description', maxLength: 50 },
            { label: 'Color', name: 'color', maxLength: 50 },
            // { label: 'Size', name: 'size', maxLength: 20 },
            { label: 'Brand', name: 'brand', maxLength: 50 },
            // { label: 'Model', name: 'model', maxLength: 50 },
            { label: 'Distinguishing Features', name: 'distinguishingFeatures', maxLength: 100 },
            // { label: 'Item Category', name: 'itemCategory', maxLength: 50 },
            // { label: 'Serial Number', name: 'serialNumber', maxLength: 50 },
            { label: 'Date and Time of Loss', name: 'dateTimeWhenLost', type: 'datetime-local' },
            { label: 'Location / Area', name: 'location', maxLength: 100 },
            // { label: 'Item Value', name: 'itemValue', type: 'number', inputProps: { min: 0 } },
            // { label: 'Proof of Ownership', name: 'proofOfOwnership', maxLength: 100 },
            // { label: 'How the Item Was Lost', name: 'howTheItemLost', maxLength: 100 },
            // { label: 'Reference Number', name: 'referenceNumber', maxLength: 50 },
            { label: 'Other Details For Communication', name: 'otherRelevantDetails', maxLength: 200 },
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
}

export default ItemLostRequest;

