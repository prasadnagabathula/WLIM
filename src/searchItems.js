import React, { useState, useEffect, useCallback } from 'react';
import Header from './header'; // Assuming you have a header component
import Footer from './footer'; // Assuming you have a footer component
import './uploadPhotos.css'; // Add any custom styles here
import { Button, Typography, Box, TextField } from '@mui/material';
import { styled } from '@mui/system';
import ImageDisplay from './imageDisplay';
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

  const ThumbnailBox = styled(Box)(({ isHovered }) => ({
    position: 'relative',
    width: '100px',
    height: '100px',
    margin: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(0.9)', // Scale down when not hovered
    '&:hover img': {
      transform: 'scale(1.1)', // Zoom in on hover
      transition: 'transform 0.3s ease',
    },
  }));
  
  
  const HoveredImagePopup = styled(Box)({
    position: 'absolute',
    top: '-150px',   // Positioning popup relative to the thumbnail
    left: '0',
    width: '100px',  // Larger popup size
    height: '100px', // Larger popup size
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    display: hoveredImage ? 'block' : 'none',
  });
  

  const handleClear = () => {
    setSelectedImage(null); // Clear the uploaded image
    setResults([]);
    setResponseMessage('');   
  };

  
//   const navigate = useNavigate();

//    const handleItemUpload = () => {
//     navigate('/upload'); // Navigates to the Upload page
//   };
//   const handleHome = () => {
//     navigate('/'); // Navigates to the search page
//   };


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
 
 
    const file = e.target.files[0];
    if (file) {
        // Create a local URL for the selected image
        const imageUrl = URL.createObjectURL(file);

        setSelectedImage(imageUrl); // Set the local URL for rendering
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
    // useEffect(() => {
    //     loadThumbnails();
    //   }, []);

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
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginTop="30px" padding="20px" gap={20}>
        {/* Left Side: Image Upload Section */}
        <Box flex="1">
          <Typography variant="h5" gutterBottom marginLeft={"0px"} >
            Unleashing the Power of Visual Recognition
          </Typography>
          <form onSubmit={handleSubmit} className="upload-form">
            <label htmlFor="upload-image">
              <UploadBox>
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
              <button type="submit" className="upload-btn">
                Find Matching Objects
              </button>
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
         <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
  {results.length > 0 && results.map((img, index) => (
    <Box key={index} position="relative">
      <ThumbnailBox
        isHovered={hoveredIndex === index}  // Pass hover state to ThumbnailBox
        onMouseEnter={() => handleMouseEnter(img, index)}
        onMouseLeave={handleMouseLeave}
      >
        {/* <ImageDisplay imageId={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}

        <ImageDisplay
          imageId={img}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // Change to contain to fit the image without cropping
          }}
        />

      </ThumbnailBox>

      {/* Hovered Image Popup */}
      {hoveredImage && hoveredIndex === index && (
        <HoveredImagePopup
          onMouseEnter={() => setHoveredImage(img)}  // Keep pop-up open when hovering over it
          onMouseLeave={handleMouseLeave}  // Close pop-up when mouse leaves
        >
          <ImageDisplay imageId={hoveredImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </HoveredImagePopup>
      )}
    </Box>
  ))}
</Box>


        </Box>
      
      </Box>
      <Footer/>
    </main>
  );
};

export default SearchItems;

