import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './uploadPhotos.css'; // Add any custom styles here
import { Button, Grid, Alert, Snackbar, Typography, Box,Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fontFamily, styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CATEGORY_OPTIONS } from '../Components/Constants';
import CategoryDropdown from './CategoryDropdown';
import BackspaceIcon from '@mui/icons-material/Backspace';
import UploadIcon from '@mui/icons-material/Upload';


const UploadPhotosApi4 = ({ isDrawerOpen }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [itemDescription, setItemDescription] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState('success');

  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [comments, setComments] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([...CATEGORY_OPTIONS]);
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [denseCaptions, setDenseCaptions] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);

  const createClient = require('@azure-rest/ai-vision-image-analysis').default;
  const { AzureKeyCredential } = require('@azure/core-auth');

  //New East US
  const endpoint = 'https://cvwlimv40eus.cognitiveservices.azure.com/';
  const key = 'B1ZBQc0A2DHqj9AYmgaJXK1r7kbKsyddhDgX6Qzr0F5qeai2pOQaJQQJ99AKACYeBjFXJ3w3AAAFACOG8VEg';
 
  const credential = new AzureKeyCredential(key);
  const client = createClient(endpoint, credential);

  const features = [  
    'Caption',
    'DenseCaptions',
    'Objects',
    'People',
    'Read',
    'SmartCrops',
    'Tags'
  ];

    async function analyzeImageFromBinary(binaryData) {
  
        
        const result = await client.path('/imageanalysis:analyze').post({
            body: binaryData,
            queryParameters: {
            features: features,
            'smartCrops-aspect-ratios': [0.9, 1.33]
            },
            contentType: 'application/octet-stream'
        });

        const iaResult = result.body;

        //const imageTags = response.data.description.tags;

        let imageTags = [];  
        if (iaResult.tagsResult) {         
            iaResult.tagsResult.values.forEach((tag, index) =>
                imageTags.push(tag.name)
            );
            setTags(imageTags.join(', '));
          }

        let itemDesc = '';
        if (iaResult.captionResult) {
            const itemDesc = iaResult.captionResult.text;
            setItemDescription(itemDesc);            
        }

        let denseCaption = [];
        if (iaResult.denseCaptionsResult) {         
            iaResult.denseCaptionsResult.values.forEach((caption, index) =>
                denseCaption.push(caption.text)
            );
            setDenseCaptions(denseCaption.join(', '));
            setComments(denseCaption.join(', '));
          }
        
        const combinedText = [...imageTags, itemDesc, denseCaptions].join(" ").toLowerCase();

        console.log(combinedText);

        let matchedCategory = CATEGORY_OPTIONS.find((category) =>
            combinedText.includes(category.toLowerCase())
        ) || "Others";
        
        setCategory(toInitialCapitalCase(matchedCategory));
        setCategoryOptions(CATEGORY_OPTIONS);

        setIsDisabled(false);         
}

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 190 : 0);
    setMarginRight(isDrawerOpen ? 0 : 20);

  }, [isDrawerOpen]);

  useEffect(() => {
    axios.get('https://localhost:7237/api/LostItemRequest/Locations')
    .then(response => {
      console.log(response);
      setLocationOptions(response.data.map(data => data.locations));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/'); // Navigates to the Upload page
  };
  const handleFindItem = () => {
    navigate('/search'); // Navigates to the search page
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const UploadBox = styled(Box)({
    // width: '300px',
    // height: '300px',
    border: '2px dashed #888',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      border: '2px dashed #333',
    },
  });

  const handleClear = () => {
    setSelectedImage(null); // Clear the uploaded image
    setCategory('');
    setComments('');
    setTags('');
    setLocation('');
    setMessage('');
  };

  const toInitialCapitalCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const analyzeImage = async (imageData) => {
    //analyzeImageFromUrl(imageData);
    // const apiUrl = `${endpoint}/vision/v3.1/analyze?visualFeatures=Categories,Description,Objects`;

    // try {
    //   const response = await axios.post(apiUrl, imageData, {
    //     headers: {
    //       'Ocp-Apim-Subscription-Key': subscriptionKey,
    //       'Content-Type': 'application/octet-stream',
    //     },
    //   });

    //   const imageTags = response.data.description.tags;
    //   setTags(imageTags);

    //   const iaResult = response.data;

    //   console.log(`Model Version: ${iaResult}`);

    //   const itemDesc = response.data.description.captions[0].text;
    //   setItemDescription(itemDesc);

    //   const objects = response.data.objects;
    //   const objectCategory = objects && objects.length > 0 ? objects[0].object : "Others";

    //   const combinedText = [...imageTags, itemDesc, objectCategory].join(" ").toLowerCase();

    //   let matchedCategory = CATEGORY_OPTIONS.find((category) =>
    //     combinedText.includes(category.toLowerCase())
    //   ) || "Others";
    //   setCategory(toInitialCapitalCase(matchedCategory));
    //   setCategoryOptions(CATEGORY_OPTIONS);

    //   setIsDisabled(false);
    // } catch (error) {
    //   console.error('Error analyzing image:', error);
    // }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsDisabled(true);
    const file = e.target.files[0];
    if (file) {
      // Get the original file name and extension
    const fileName = file.name; // e.g., "image.png" or "photo.jpg"
    const fileExtension = fileName.split('.').pop(); // Extract extension

    // Create an object URL
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const arrayBuffer = reader.result; // Binary data of the file
      const uint8Array = new Uint8Array(arrayBuffer);
      await analyzeImageFromBinary(uint8Array); // Call analysis function
    };

    reader.readAsArrayBuffer(file); // Read file as binary data

      // const imageUrl = URL.createObjectURL(file);
      // setSelectedImage(imageUrl);
      // console.log(imageUrl);
      // analyzeImageFromUrl(imageUrl);

    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //   const arrayBuffer = reader.result;
      
    //   // Ensure the file is valid and has a proper format
    //   if (arrayBuffer) {
    //      analyzeImageFromFile(arrayBuffer);
    //   } else {
    //     console.error("Invalid file or unable to read as ArrayBuffer");
    //   }
    // };

    // reader.readAsArrayBuffer(file); // Read file as ArrayBuffer

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file first!');
      setSeverity('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('itemDescription', itemDescription);
    formData.append('comments', comments);
    formData.append('warehouseLocation', location);

    try {
      const response = await axios.post('https://localhost:7298/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setMessage('Image uploaded successfully!');
        setSeverity('success');
        setSelectedImage(null); // Clear the uploaded image
        setCategory('');
        setTags([]);
        setComments('');
        setLocation('');
      } else {
        setMessage('Failed to upload image');
        setSeverity('error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error occurred while uploading');
      setSeverity('error');
    }
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          mt: 6,
          ml: { sm: 0, md: `${marginLeft}px` },
          mr: `${marginRight}px`,
          transition: 'margin-left 0.3s',
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
        }}
      >
        <Grid container spacing={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              flex: 1, 
              order: { xs: 2, md: 1 }, 
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Lato',
                mb: 4,
                fontSize: { md: '30px' },
                backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Unleashing the Power of Visual Recognition
            </Typography>
            <label htmlFor="upload-image">
                <UploadBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #888',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    width: '300px',
                    height: '300px',
                    marginBottom: '20px', 
                  }}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <CloudUploadIcon />
                      <span style={{ marginLeft: 8 }}>Upload Identified Item Photo</span>
                    </span>
                  )}
                </UploadBox>
              </label>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              flex: 1,
              order: { xs: 1, md: 2 }, 
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CategoryDropdown
                categoryOptions={categoryOptions}
                initialCategory={category}
                onCategoryChange={onCategoryChange}
              />

              <TextField
                label="Comments"
                variant="outlined"
                value={comments}
                multiline
                minRows={1} 
                maxRows={6} 
                sx={{ 
                  width: { xs: '100%', sm: '400px', md: '450px' }, 
                  marginBottom: '25px', 
                  marginTop:2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#770737',
                    },
                    '&:hover fieldset': {
                      borderImage: 'linear-gradient(to left, #2368a0, #770737, #00aae7) 1',
                    },
                    '&.Mui-focused fieldset': {
                      borderImage: 'linear-gradient(to left, #00aae7, #770737, #2368a0) 1',
                      borderWidth: '2px',
                    },
                  }, 
                }}
                onChange={(e) => setComments(e.target.value)}
              />

              <TextField
                label="Tags"
                variant="outlined"
                value={tags}
                multiline
                minRows={1} 
                maxRows={6} 
                sx={{ 
                  width: { xs: '100%', sm: '400px', md: '450px' }, 
                  marginBottom: '25px', 
                  marginTop:2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#770737',
                    },
                    '&:hover fieldset': {
                      borderImage: 'linear-gradient(to left, #2368a0, #770737, #00aae7) 1',
                    },
                    '&.Mui-focused fieldset': {
                      borderImage: 'linear-gradient(to left, #00aae7, #770737, #2368a0) 1',
                      borderWidth: '2px',
                    },
                  }, 
                }}
                onChange={(e) => setTags(e.target.value)}
              />

              <FormControl sx={{ 
                width: { xs: '100%', sm: '400px', md: '450px' }, 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#770737',
                    },
                    '&:hover fieldset': {
                      borderImage: 'linear-gradient(to left, #2368a0, #770737, #00aae7) 1',
                    },
                    '&.Mui-focused fieldset': {
                      borderImage: 'linear-gradient(to left, #00aae7, #770737, #2368a0) 1',
                      borderWidth: '2px',
                    },
                }, 
              }}>
                {/* <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  freeSolo
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
                </Select> */}
                <Autocomplete
                    disablePortal
                    options={locationOptions}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sx={{ width: { xs: '100%', sm: '400px', md: '450px' } }}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                  />
              </FormControl>

              <Box display="flex" gap={4} justifyContent="center" alignItems="center" marginTop={5}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  disabled={isDisabled}
                  startIcon={<UploadIcon />}
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
                  }}
                >
                  {isDisabled ? 'Getting image properties, wait...' : 'Upload'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClear}
                  startIcon={<BackspaceIcon />}
                  sx={{
                    background: 'linear-gradient(to left, #00aae7, #770737)',
                    color: '#fff',
                    border: 'none',
                    '&:hover': {
                      background: 'linear-gradient(to left, #2368a0, #770737, #00aae7)',
                    },
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Box>

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
        </Grid>
      </Box>

    </div>
  );

};

export default UploadPhotosApi4;

