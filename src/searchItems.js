import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './header'; // Assuming you have a header component
import Footer from './footer'; // Assuming you have a footer component
import './uploadPhotos.css'; // Add any custom styles here
import { Button, Typography, Box, TextField,Grid, Paper, Divider } from '@mui/material';
import { styled } from '@mui/system';
import ImageDisplay from './imageDisplay';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CancelIcon from '@mui/icons-material/Cancel';
//import { useNavigate } from 'react-router-dom';
import _ from 'lodash'; 

const SearchItems = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null); // To store hovered thumbnail image
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which thumbnail is hovered
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  // Azure Computer Vision API endpoint and key
  const subscriptionKey = '2df0c7e47bc14b538b8534fb58937522';
  const endpoint = 'https://cvpicfinderai.cognitiveservices.azure.com/';

  useEffect(() => {
    loadThumbNails();
  }, []); 

//   const existingImages = [
//     'image1', 'image2', 'image3', 'image4', 'image5', 
//     'image6', 'image7', 'image8', 'image9', 'image10'
//   ];

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


  // const ThumbnailBox = styled(Box)({
  //   position: 'relative',
  //   width: '100px', // Fixed width for thumbnail
  //   height: '100px', // Fixed height for thumbnail
  //   margin: '10px',
  //   borderRadius: '10px',
  //   cursor: 'pointer',
  //   overflow: 'hidden',
  //   '&:hover img': {
  //     transform: 'scale(1.1)',
  //     transition: 'transform 0.3s ease',
  //   },
  // });
    
  
 
  // const HoveredImagePopup = styled(Box)(({ theme }) => ({
  //   position: 'absolute',
  //   bottom: '-150px', // Adjust to position it below the thumbnail
  //   right: '25', // Align to the right of the thumbnail
  //   width: '200px', // Adjust as needed for the hovered image size
  //   height: '200px', // Adjust as needed for the hovered image size
  //   backgroundColor: '#fff',
  //   border: '1px solid #ccc',
  //   borderRadius: '10px',
  //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  //   zIndex: 10,
  //   display: hoveredImage ? 'block' : 'none', // Toggle display based on hover
  // }));

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
  
  

  const handleClear = () => {
    setSelectedImage(null); // Clear the uploaded image
    setResponseMessage('');   
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
 
    const file = e.target.files[0];
    if (file) {
      setIsDisabled(true);
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


const handleUpload = async (e) => {
  e.preventDefault();
  if (!selectedFile) {
    setMessage('Please select a file first!');
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
      setSelectedImage(null); // Clear the uploaded image
      setCategory('');
      setTags([]);
      setSearchText("");
      loadThumbNails();
    } else {
      setMessage('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    setMessage('Error occurred while uploading');
  }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5005/api/search', {
        method: 'POST',
        body: formData,
      });

      setResponseMessage('');
      if (response.status === 200) {
        setMessage(response.message);
        const result = await response.json();
      setResponseMessage(result.message);
      setResults(result.filesMatched);

      } else {
        setMessage('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error occurred while uploading');
    }
  };

  const loadThumbNails = async (e) => {
    try {
      const response = await fetch('http://localhost:5005/api/images', {
        method: 'GET'
      });

      setResponseMessage('');
      if (response.status === 200) {
        setMessage(response.message);
        const result = await response.json();

        const filePaths = result.map(item => item.filePath);
      //setResponseMessage(result.message);
      //console.log(result);
      setResults(filePaths);

      } else {
        setMessage('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error occurred while uploading');
    } 
  };

  const handleMouseEnter = (image, index) => {
    setHoveredImage(image);
    setHoveredIndex(index); // Set the index to track hovered thumbnail
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
    setHoveredIndex(null);
  };

  

  return (
    <main className="upload-content">
      <Header />
      <Box  sx={{
        height: '83vh',
        width: '97vw',
        backgroundImage: 'url(/bg.avif)', 
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          zIndex: 1,
        },
      }}
      display="flex" justifyContent="space-between" alignItems="flex-start" marginTop="40px" padding="20px" gap={20}>
        {/* Left Side: Image Upload Section */}
        <Grid
        container
        component={Paper}
        elevation={6}
        sx={{
          zIndex: 2, 
          width: { xs: '90%', md: '60%' }, 
          height: '70vh',
          display: 'flex',
          marginTop: '50px',
          backgroundColor: 'transparent',
          
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'top',
            backgroundColor: '#fff', 
            border: '2px solid',
            borderColor: 'divider',
            // backdropFilter: 'blur(30px)',
            // opacity: '15%',
            p: 3,
          }}
        >
          <Box sx={{
            '& > *': {
                textAlign: 'center'
            }
          }}>
            <Box flex="1">
          <Typography variant="h5" gutterBottom marginLeft={"0px"} sx={{marginTop:'10px', fontFamily:'Montserrat',fontSize:'30px'}} >
            Unleashing the Power of Visual Recognition
          </Typography>
          <form onSubmit={handleSubmit} className="upload-form">
            <label htmlFor="upload-image">
              <UploadBox sx={{ marginLeft:'80px', marginTop:'40px', marginBottom:'60px'}}>
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      
                    }}
                  />
                ) : (
                  <Typography>Click here to upload an image</Typography>
                )}
              </UploadBox>
            </label>

            <input
              id="upload-image"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            
            <Box
              display="flex"
              gap={2}
              justifyContent="center"
              alignItems="center"
              marginTop={2}
            >
              <Button type="submit" onClick={handleUpload}  disabled={isDisabled} variant="outlined" color="secondary">
              {isDisabled? "Getting image properties wait..." :"Upload"}
              </Button>
              <Button type="submit" className="upload-btn"  variant="contained" >
                Find Matching Items
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

          </Box>
          
        </Grid>
        <Divider orientation="Vertical" variant="middle" flexItem />
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff', 
            p: 3,
            flexDirection: 'column',
          }}
        >
            {/* Right Side: Thumbnails and Search Section */}
  <Box flex="1" display="flex" flexDirection="column" alignItems="flex-start">
          <TextField
            label="Search Images"
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
        {results.length > 0 && results.map((img, index) => (
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
  ))}
</Box>


        </Box>

        </Grid>
      </Grid>
        

        {/* Response Section */}
        {/* Display the response message */}
        {/* <Box item xs={12} md={6}  marginLeft="100px"  >
          {results.length > 0 && responseMessage && (
            <Typography variant="h6" color="primary">
              <h2>Results</h2>
              {responseMessage}
            </Typography>
          )}

        {results.length > 0 && (
                  
          <Box container spacing={2} display={'flex'} width={ "350px" } height={ "250px" }  sx={{
                overflowX: 'auto', // Enables horizontal scrolling
                whiteSpace: 'nowrap', // Prevents image wrapping
                border: '1px solid #ddd', // Optional: Adds a border to the image container
                padding: '10px',
                maxWidth: '100%', // Restricts the width of the container
            }} >`
            {results.length > 0 ? (
              results.map((filePath, index) => (
                <Box item xs={4} key={index} marginLeft={"20px"} >
                  <Box
                    sx={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      textAlign: 'center',
                    }}
                  >
                    <ImageDisplay imageId={filePath} />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>{responseMessage}</Typography>
            )}
          </Box>
        )}
</Box> */}
      <Footer/>
      
      </Box>
    </main>
  );
};

export default SearchItems;

