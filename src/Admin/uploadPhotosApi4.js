import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './uploadPhotos.css'; // Add any custom styles here
import { Button, Grid, Alert, Snackbar, Typography, Box,Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Divider } from '@mui/material';
import { fontFamily, styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CATEGORY_OPTIONS } from '../Components/Constants';
import CategoryDropdown from './CategoryDropdown';
import BackspaceIcon from '@mui/icons-material/Backspace';
import UploadIcon from '@mui/icons-material/Upload';
import QRDialogComponent from '../Components/QRDialogComponent';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import { QRCodeCanvas } from 'qrcode.react';

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
  const [identifiedLocation, setIdentifiedLocation] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false); 
  const [photoData, setPhotoData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); 
  const videoRef = useRef(null);
  const PictureRef = useRef(null);
  //QR code  
  const [qrData, setQrData] = useState('');
  const [binaryData, setBinaryData] = useState('');
  const canvasRef = useRef(null);
  const [itemId, setItemId] = useState('');
  const [qrGeneratedAt, setQrGeneratedAt] = useState('');
  const [qrSequenceNumber, setQrSequenceNumber] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);


  const fetchUserLocation = () => { 
    const userLocation = localStorage.getItem('location') || 'Atlanta'; 
    setLocation(userLocation);
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [identifiedDate, setIdentifiedDate] = useState(getCurrentDateTime());

  const suggestions = ['Gate1', 'Cafeteria1', 'Reception', 'Road', 'Park'];

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

        // console.log(combinedText);

        let matchedCategory = CATEGORY_OPTIONS.find((category) =>
            combinedText.includes(category.toLowerCase())
        ) || "Others";
        
        setCategory(toInitialCapitalCase(matchedCategory));
        setCategoryOptions(CATEGORY_OPTIONS);

        setIsDisabled(false);         
}

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 260 : 0);
    setMarginRight(isDrawerOpen ? 0 : 0);
    
    }, [isDrawerOpen]);

  useEffect(() => {
    //axios.get('http://172.17.31.61:5291/api/LostItemRequest/Locations')
    axios.get('http://localhost:7237/api/LostItemRequest/Locations')
    .then(response => {
      // console.log(response);
      setLocationOptions(response.data.map(data => data.locations));
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const navigate = useNavigate();

  const handleIdentifiedDateChange = (value) => {
    setIdentifiedDate(value);
  };

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
    setIdentifiedLocation('');
    setIdentifiedDate('');
  };

  const toInitialCapitalCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  //const analyzeImage = async (imageData) => {
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
 // };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    // setIsDisabled(true);
    //clearQrData();
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
      // await analyzeImageFromBinary(uint8Array); // Call analysis function
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


  const generateQRCode = (qData) => {
    // console.log("canvas"+qData);
    if (!qData) return;

    // // Access the canvas rendered by QRCodeCanvas
    // const canvas = canvasRef.current.querySelector('canvas');
    
    // if (canvas) {
    //   canvas.toBlob((blob) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setBinaryData(reader.result); // Base64 encoded binary data
    //     };
    //     reader.readAsDataURL(blob);
    //   });
     
    // }
    const timer = setTimeout(() => {
      const canvas = canvasRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setBinaryData(reader.result); // Base64 encoded binary data
          };
          reader.readAsDataURL(blob);
        });
      }
    }, 100); // Small delay to ensure rendering completes

    return () => clearTimeout(timer);
  };

  const clearQrData = () => {
    setQrData('');
    setBinaryData('');
    setItemId('');
    setQrGeneratedAt('');
    setQrSequenceNumber('');
  }

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
    formData.append('identifiedLocation', identifiedLocation);
    formData.append('identifiedDate', identifiedDate);

    try {
      //const response = await axios.post('http://172.17.31.61:5280/api/upload', formData, {
        const response = await axios.post('http://localhost:7298/api/upload', formData, {   
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        //QR Code
        setItemId(response.data.itemId)
        setQrGeneratedAt(response.data.qrGeneratedAt)
        setQrSequenceNumber(response.data.qrSequenceNumber)
        // console.log(response.data.qrSequenceNumber);
        setQrData(response.data.itemId+response.data.qrGeneratedAt+response.data.qrSequenceNumber); 
        console.log(qrData);       
        generateQRCode(response.data.itemId+response.data.qrGeneratedAt+response.data.qrSequenceNumber);       
        setDialogOpen(true);

        setMessage('Item details uploaded successfully!');
        setSeverity('success');
        setSelectedImage(null); // Clear the uploaded image
        setCategory('');
        setTags([]);
        setComments('');
        setLocation(location);
        setIdentifiedLocation('');
        setIdentifiedDate(identifiedDate);
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

  
  const handleTakePicture = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true); // Camera is active
      setErrorMessage('');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('No camera detected or permission denied.');
      setIsCameraActive(false); // Ensure camera is not active if there’s an error
    }
  };

  const handleCapturePhoto = () => {
    if (PictureRef.current && videoRef.current) {
      const context = PictureRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, PictureRef.current.width, PictureRef.current.height);
      const photo = PictureRef.current.toDataURL('image/png'); // Get image as data URL
      setPhotoData(photo); // Set photo data
      setIsCameraActive(false); // Stop showing the video after capturing the photo

      // Stop the video stream
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height:'100%',
      boxSizing: 'border-box',
      textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s'
    }}>
      
      <Paper elevation={5} sx={{width:'100%',  p: 2, boxSizing: 'border-box'}}>
       <Typography
        variant="h4"
        sx={{
          fontFamily: 'Lato',
          textAlign: 'center',
          mb: 2,
          fontWeight: 'bold',
          backgroundImage: 'linear-gradient(to left, #00aae7, #770737, #2368a0)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Upload Identified Item
      </Typography>
      <Divider sx={{ 
        width: '90%', 
        margin: 'auto'
      }} />
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          mt:2,
          height:'100%',
          boxSizing: 'border-box',
        }}
      >
        <Grid container spacing={1}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              flex: 1, 
              order: { xs: 2, md: 1 }, 
              boxSizing: 'border-box',
              height: 'max-content'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Lato',
                mb: 4,
                ml:5,
                // mt: -10,
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
                      <span style={{ marginLeft: 8, fontFamily:'Lato' }}>Upload Identified Item Photo</span>
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

              <Typography variant='subtitle1' sx={{fontFamily:'Lato', mb:2}}><b>(OR)</b></Typography>

              {/* Button to open camera */}
              {!isCameraActive && !photoData && (
                <Button
                  variant="contained"
                  startIcon={<CameraAltIcon />}
                  onClick={handleTakePicture}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    padding: '10px 20px',
                  }}
                >
                  Take a Picture
                </Button>
              )}

              {/* Error message */}
              {errorMessage && (
                <Typography color="error" sx={{ marginTop: 2}}>
                  {errorMessage}
                </Typography>
              )}

              {/* Video feed to capture photo */}
              {isCameraActive && !photoData && (
                <Box>
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      display: 'block',
                      marginBottom: 2,
                    }}
                    autoPlay
                    onClick={handleCapturePhoto} 
                  ></video>
                </Box>
              )}

              {/* Display captured photo */}
              {photoData && (
                <Box sx={{ marginTop: 3, textAlign: 'center' }}>
                  <img
                    src={photoData}
                    alt="Captured"
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                    }}
                  />
                  <Typography sx={{ marginTop: 2 }}>Photo captured successfully!</Typography>
                </Box>
              )}

              {/* Hidden canvas for photo capture */}
              {/* <canvas ref={PictureRef} style={{ display: 'none' }} width={500} height={375}></canvas> */}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-center',
              justifyContent: 'flex-start',
              flex: 1,
              mt:2,
              order: { xs: 1, md: 2 }, 
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt:-4 }}>
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
                  // marginBottom: '25px', 
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
                  // marginBottom: '25px', 
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
                <InputLabel id="location-label">Location</InputLabel>
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
                </Select>  
                <Autocomplete
                  options={suggestions}
                  value={identifiedLocation}
                  onChange={(event, newValue) => setIdentifiedLocation(newValue)}
                  noOptionsText=""
                  renderInput={(params) => (
                    <TextField {...params} label="Identified Location" variant="outlined" />
                  )}
                  sx={{ width: { xs: '100%', sm: '400px', md: '450px' }, mt: 2 }}
                  onInputChange={(event, newInputValue) => setIdentifiedLocation(newInputValue)}
                />           
                {/* <TextField
                  label="Identified Location"
                  variant="outlined"
                  value={identifiedLocation}
                  sx={{ width: { xs: '100%', sm: '400px', md: '450px' }, mt: 2 }}                                  
                  onChange={(e) => setIdentifiedLocation(e.target.value)}
                />             */}

                <TextField
                  variant="outlined"
                  value={identifiedDate}
                  sx={{ width: { xs: '100%', sm: '400px', md: '450px' }, mt: 2 }}                  
                  onChange={(e) => handleIdentifiedDateChange(e.target.value)}
                  type="datetime-local"                  
                  label="Identified Date"
                  //helperText="Format: dd-mm-yyyy"
                  InputLabelProps={{
                  shrink: true,
                  }}
                />             

              </FormControl>

              <Box display="flex" gap={4} justifyContent="center" alignItems="center" marginTop={3} marginBottom={1}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isDisabled}
                  startIcon={<UploadIcon />}               
                >
                  {isDisabled ? 'Getting image properties, wait...' : 'Upload'}
                </Button>
                <Button
                  variant="contained"
                  // color="#F28C28"
                  onClick={handleClear}
                  startIcon={<BackspaceIcon />}
                  sx={{
                    backgroundColor: '#CD7F32',
                    color: '#fff',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#B87333'
                    },
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Preparing data and image for display and print in hidden mode */}
          <Box display={'none'}>                 
                  <div ref={canvasRef}>
                    {qrData && <QRCodeCanvas value={qrData} />}
                  </div>  
                  {binaryData && (
                    <div>
                      <h3>QR Code Preview</h3>
                      <img src={binaryData} alt="Generated QR Code" />
                    </div>
                  )}          
          </Box> 

          <QRDialogComponent
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            qrData={qrData}
            binaryData={binaryData}
            // itemCategory={category}
            // itemDescription={comments}
            // identifiedDate={identifiedDate}
          />               
              {/*<Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ mb: 2}}
              >
                <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>           
                  {message}
                </Alert>
              </Snackbar>    */}            

        </Grid>
      </Box>
      </Paper>
    </Box>
  );

};

export default UploadPhotosApi4;

