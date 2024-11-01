import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header'; // Assuming you have a header component
import Footer from './footer'; // Assuming you have a footer component
import './uploadPhotos.css'; // Add any custom styles here
import { Button,Grid,Alert, Snackbar, Typography, Box, TextField} from '@mui/material';
import { fontFamily, styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadPhotos = ({isDrawerOpen}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [severity, setSeverity] = useState('success');

  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [comments, setComments] = useState('');

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 300 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);

  }, [isDrawerOpen]);

  // Azure Computer Vision API endpoint and key
  const subscriptionKey = '2df0c7e47bc14b538b8534fb58937522';
  const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';

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

  const analyzeImage = async (imageData) => {
    const apiUrl = `${endpoint}/vision/v3.1/analyze?visualFeatures=Categories,Description,Objects`;
    
    try {
      const response = await axios.post(apiUrl, imageData, {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/octet-stream',
        },
      });
      const objects = response.data.objects;
      const objectCategory = objects && objects.length > 0 ? objects[0].object : "unknown";
      setCategory(objectCategory);

      const imageTags = response.data.description.tags;
      setTags(imageTags);
      setIsDisabled(false);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };
 
  const handleFileChange = (e) => {
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

    try {
      const response = await axios.post('http://localhost:5005/api/upload', formData,{
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
          textAlign: 'center',
          mt: 2,
          ml: `${marginLeft}px`,
          mr: `${marginRight}px`,
          transition: 'margin-left 0.3s',
        }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Box sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Lato', mb:4 }}>
              Unleashing the Power of Visual Recognition
            </Typography>
  
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <form onSubmit={handleSubmit}>
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

<Box >
                <TextField
                  label="Comments"
                  variant="outlined"
                  fullWidth
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                </Box>
                <Box display="flex" gap={3} justifyContent="center" alignItems="center" marginTop={4}>

                

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
              </form>
            </Box>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{ mb:2 }}
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

