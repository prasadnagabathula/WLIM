import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import Header from './header'; // Assuming you have a header component
//import Footer from './footer'; // Assuming you have a footer component
import './uploadPhotos.css'; // Add any custom styles here
import { Button, Grid, Alert, Snackbar, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fontFamily, styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CATEGORY_OPTIONS } from '../Components/Constants';
import CategoryDropdown from './CategoryDropdown';


const UploadPhotos = ({ isDrawerOpen }) => {
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

  //const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
  const createClient = require('@azure-rest/ai-vision-image-analysis').default;
  const { AzureKeyCredential } = require('@azure/core-auth');

  //New East US
  const endpoint = 'https://cvwlimv40eus.cognitiveservices.azure.com/';
  const key = 'B1ZBQc0A2DHqj9AYmgaJXK1r7kbKsyddhDgX6Qzr0F5qeai2pOQaJQQJ99AKACYeBjFXJ3w3AAAFACOG8VEg';

  // // Old East US Azure Computer Vision API endpoint and key
  // const subscriptionKey = '2df0c7e47bc14b538b8534fb58937522';
  // const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';

  //  //working EastUS2 but Caption, DenseCaptions not supported
  //  const endpoint = 'https://cvwlimv4.cognitiveservices.azure.com/';
  //  const key = 'BqlF7mwv0N3YIDqm2PSVf8v6lqi6QVa9II4bFNRZlKDVlqTE60yJJQQJ99AKACHYHv6XJ3w3AAAFACOGEHua';

  // //working Central US but Caption, DenseCaptions not supported
  //  const endpoint = 'https://cv40wlim.cognitiveservices.azure.com/';
  //  const key = '2xVlkKnavQD2d2xVwYfmLxLT2XPbgFUdTjdJidnbaPCPWzUYJmPhJQQJ99AKAC1i4TkXJ3w3AAAFACOGFXEe';

  // //East US2
  //  const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';
  //  const key = '28d34c819ec44d3db09950e8fda64eca';

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

  //const imageUrl = `https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png`;

  async function analyzeImageFromBinary(binaryData) {
//async function analyzeImageFromFile(imageBuffer) {
  console.log(binaryData);
  
  const result = await client.path('/imageanalysis:analyze').post({
    body: binaryData,
    queryParameters: {
      features: features,
      'smartCrops-aspect-ratios': [0.9, 1.33]
    },
     contentType: 'application/octet-stream'
  });

  const iaResult = result.body;

  console.log(`Model Version: ${iaResult.modelVersion}`);
  console.log(`Image Metadata: ${JSON.stringify(iaResult.metadata)}`);
    const parsedResults = [];

    if (iaResult.captionResult) {
      parsedResults.push(
        <p key="caption">
          <strong>Caption:</strong> {iaResult.captionResult.text} 
          )
        </p>
      );
    }

    if (iaResult.denseCaptionsResult) {
      parsedResults.push(<strong>Dense Caption:</strong>)
        iaResult.denseCaptionsResult.values.forEach((denseCaption, index) =>
        parsedResults.push(
          <p key={`denseCaption-${index}`}>
            <strong>{index+1}:</strong> {JSON.stringify(denseCaption.text)}
          </p>
        )
      );
    }

    // if (iaResult.objectsResult) {
    //   iaResult.objectsResult.values.forEach((object, index) =>
    //     parsedResults.push(
    //       <p key={`object-${index}`}>
    //         <strong>Object:</strong> {JSON.stringify(object)}
    //       </p>
    //     )
    //   );
    // }

    // if (iaResult.peopleResult) {
    //   iaResult.peopleResult.values.forEach((person, index) =>
    //     parsedResults.push(
    //       <p key={`person-${index}`}>
    //         <strong>Person:</strong> {JSON.stringify(person)}
    //       </p>
    //     )
    //   );
    // }

    // if (iaResult.readResult) {
    //   iaResult.readResult.blocks.forEach((block, index) =>
    //     parsedResults.push(
    //       <p key={`block-${index}`}>
    //         <strong>Text Block:</strong> {JSON.stringify(block)}
    //       </p>
    //     )
    //   );
    // }

    // if (iaResult.smartCropsResult) {
    //   iaResult.smartCropsResult.values.forEach((smartCrop, index) =>
    //     parsedResults.push(
    //       <p key={`smartCrop-${index}`}>
    //         <strong>Smart Crop:</strong> {JSON.stringify(smartCrop)}
    //       </p>
    //     )
    //   );
    // }

    if (iaResult.tagsResult) {
      parsedResults.push(<strong>Tag(s):</strong>)
      iaResult.tagsResult.values.forEach((tag, index) =>
        parsedResults.push(
          <p key={`tag-${index}`}>
            <strong>{index+1}:</strong> {JSON.stringify(tag.name)}
          </p>
        )
      );
    }

    setResults(parsedResults);
  
}



  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 300 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);

  }, [isDrawerOpen]);

  const locationOptions = ["New York", "Atlanta", "Tacoma", 
    "Piscataway", "Salinas", "Watsonville"];

  

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
    alignItems: 'center',
    justifyContent: 'center',
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
      const response = await axios.post('http://localhost:5005/api/upload', formData, {
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
          mt: 2,
          ml: { sm: 0, md: `${marginLeft}px` },
          mr: `${marginRight}px`,
          transition: 'margin-left 0.3s',
        }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Lato', mb: 4, fontSize: { md: '30px' } }}>
              Unleashing the Power of Visual Recognition
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap:20,
            }}> 
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Box component='form' onSubmit={handleSubmit} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
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
                      // margin:'20px 60px',
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


                <CategoryDropdown
                  categoryOptions={categoryOptions}
                  initialCategory={category}
                  onCategoryChange={onCategoryChange}
                />


                <TextField
                  label="Comments"
                  variant="outlined"
                  value={comments}
                  sx={{ width: { xs: '100%', sm: '400px', md: '450px' } }}
                  // style={{ width: '450px'}}                  
                  onChange={(e) => setComments(e.target.value)}
                />

                <FormControl sx={{ width: { xs: '100%', sm: '400px', md: '450px' }, mt: 2 }}>
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

                <Box display="flex" gap={3} justifyContent="center" alignItems="center" marginTop={3}>
                  <Button type="submit" variant="outlined" color="primary" disabled={isDisabled}>
                    {isDisabled ? "Getting image properties, wait..." : "Upload"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>              
            </Box>
            <Box>{results}</Box>
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
          </Box>
        </Grid>
      </Box>
    </div>
  );

};

export default UploadPhotos;

