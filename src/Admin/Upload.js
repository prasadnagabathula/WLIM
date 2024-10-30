import React, { useState, useEffect } from 'react';
import { Box, Alert, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import View from './View';
import axios from 'axios';
import { styled } from '@mui/system';

function Upload({isDrawerOpen, setUploadedData}) {
  // const [uploadedItems, setUploadedItems] = useState([]);
  const [imageSrc, setImageSrc] = useState(null); 
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);

  }, [isDrawerOpen]);

  const [itemDescription, setItemDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [distinguishingFeatures, setDistinguishingFeatures] = useState('');
  const [condition, setCondition] = useState('');
  const [identifiedDate, setIdentifiedDate] = useState('');
  const [identifiedLocation, setIdentifiedLocation] = useState('');
  const [object, setObject] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');
  const [itemobject, setItemobject] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [severity, setSeverity] = useState('success');

  const [currentIdentifiedItems, setCurrentIdentifiedItems] = useState({
    ItemDescription: '',
    BrandMake: '',
    ModelVersion: '',
    Color: '',
    SerialNumber: '',
    DistinguishingFeatures: '',
    Condition: '',
    IdentifiedDate: '',
    IdentifiedLocation: '',
    category: category,
    tags: tags,
    Itemobject: itemobject

  });
  console.log("selected file", selectedFile)
  const UploadBox = styled(Box)({
    width: '300px',
    height: '300px',
    border: '2px dashed #888',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    cursor: 'pointer',
    marginTop: '100px',
    marginBottom: '20px',
    color: 'black',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      border: '2px dashed #333',
    },
  });
  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  // Azure Computer Vision API endpoint and key
  const subscriptionKey = '2df0c7e47bc14b538b8534fb58937522';
  const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';

  const handleClear = () => {
    setInputValue(''); 
    setSelectedImage(null); // Clear the uploaded image
    //setMessage('');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const handleFileChange = (e) => {
    console.log(e);
    setSelectedFile(e.target.files[0]);
    setIsDisabled(true);
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the selected image
      const imageUrl = URL.createObjectURL(file);

      setSelectedImage(imageUrl); // Set the local URL for rendering

      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        analyzeImage(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // const handleImageUpload = (event) => {
  //   const files = event.target.files;
  //   if (files.length > 0) {
  //     const imageFile = files[0];
  //     const reader = new FileReader();
      
  //     reader.onloadend = () => {
  //       setImageSrc(reader.result); 
  //     };
  //     reader.readAsDataURL(imageFile); 
  //   }
  // };

// const handleSubmit = () => {
//     const newItem = {
//       itemDescription,
//       brand,
//       model,
//       color,
//       serialNumber,
//       distinguishingFeatures,
//       condition,
//       identifiedDate,
//       identifiedLocation,
//       category,
//       tags,
//       object,
//     };
//     setUploadedData((prevItems) => [...prevItems, newItem]); 
//     setSnackbarOpen(true);
//     console.log(newItem);
    
//     // Reset fields after submission
//     setImageSrc(null);
//     setItemDescription('');
//     setBrand('');
//     setModel('');
//     setColor('');
//     setSerialNumber('');
//     setDistinguishingFeatures('');
//     setCondition('');
//     setIdentifiedDate('');
//     setIdentifiedLocation('');
//     setCategory('');
//     setTags('');
//     setObject('');
//     }
//   };

  const analyzeImage = async (imageData) => {
    const apiUrl = `${endpoint}/vision/v3.1/analyze?visualFeatures=Categories,Description,Objects`;

    try {
      const response = await axios.post(apiUrl, imageData, {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/octet-stream',
        },
      });
      console.log(response)
      const objects = response.data.objects;
      const Itemobjects = objects && objects.length > 0 ? objects[0].object : "unknown";
      const objectCategory = objects && objects.length > 0 ? objects[0].object : "unknown";
      setCategory(objectCategory);
      setItemobject(Itemobjects);
      console.log(Itemobjects);

      const imageTags = response.data.description.tags;
      setTags(imageTags);
      setIsDisabled(false);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };


  const handleSubmit = async () => {
  //  handleClear();
  //  setInputValue(''); 
    // Step 1: Define the data object for the identified item
    const newItem = {
      ItemDescription: itemDescription,
      BrandMake: brand,
      ModelVersion: model,
      Color: color,
      SerialNumber: serialNumber,
      DistinguishingFeatures: distinguishingFeatures,
      Condition: condition,
      IdentifiedDate: identifiedDate,
      IdentifiedLocation: identifiedLocation,
      category: category,
      tags: tags,
      Itemobject: itemobject

    };

    // Step 2: Set state (asynchronous, but we are using the newItem object for the POST request)
    setCurrentIdentifiedItems(newItem);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('tags', tags.join(','));
    formData.append('ItemDescription', itemDescription);
    formData.append('BrandMake', brand);
    formData.append('ModelVersion', model);
    formData.append('color', color);
    formData.append('serialNumber', serialNumber);
    formData.append('DistinguishingFeatures', distinguishingFeatures);
    formData.append('condition', condition);
    formData.append('identifiedDate', identifiedDate);
    formData.append('IdentifiedLocation', identifiedLocation);
    formData.append('Itemobject', itemobject);

    console.log("newItem values",newItem)
    try {
      // console.log(formData);
        const response = await axios.post('https://localhost:7215/api/IdentifiedItem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("response",response);
      if (response.status === 200) {
        setMessage('Item details submitted Successfully!');
        setSeverity('success');
        setCategory('');
        setTags([]);
        handleClear();
      } else {
        setMessage('Error occurred while submitting!');
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
          textAlign: 'center',
          mt: 2,
          ml: `${marginLeft}px`,
          mr: `${marginRight}px`,
          transition: 'margin-left 0.3s',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Identified Item Details
        </Typography>
        <Grid container spacing={3}>

          {/* First Half - Styled Upload Button */}
          <Grid item xs={6}>
              <Button sx={{
                width: '300px',
                height: '300px',
                marginTop: '100px',}}>
                <label htmlFor="upload-image">
                <UploadBox>
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
            </Button>
          </Grid>
               

          {/* Second Half - Input Fields */}
          <Grid item xs={6}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  label="Category"
                  variant="outlined"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tags"
                  variant="outlined"
                  fullWidth
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />

              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="object"
                  variant="outlined"
                  fullWidth
                  value={itemobject}
                  onChange={(e) => setItemobject(e.target.value)}
                />

              </Grid> 
              <Grid item xs={12}>
                <TextField
                  label="Item Description"
                  variant="outlined"
                  fullWidth
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Brand/Make"
                  variant="outlined"
                  fullWidth
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Model/Version"
                  variant="outlined"
                  fullWidth
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Colour"
                  variant="outlined"
                  fullWidth
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Serial Number/ID"
                  variant="outlined"
                  fullWidth
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Distinguishing Features"
                  variant="outlined"
                  fullWidth
                  value={distinguishingFeatures}
                  onChange={(e) => setDistinguishingFeatures(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Condition"
                  variant="outlined"
                  fullWidth
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Identified Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  value={identifiedDate}
                  onChange={(e) => setIdentifiedDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true, 
                }}
                inputProps={{
                    style: { textAlign: 'left' }, 
                }}/>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Identified Location"
                  variant="outlined"
                  fullWidth
                  value={identifiedLocation}
                  onChange={(e) => setIdentifiedLocation(e.target.value)}
                />
              </Grid>
             
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  )
}

export default Upload;
