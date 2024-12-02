import React, { useState } from 'react';
import Header from './header'; // Assuming you have a header component
import Footer from './footer'; // Assuming you have a footer component
import './Admin/uploadPhotos.css'; // Add any custom styles here
import {Button,  Typography, Box} from '@mui/material';
import { styled } from '@mui/system';
import ImageDisplay from './imageDisplay';
import { useNavigate } from 'react-router-dom';

const SearchPhotos = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

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
    setResults([]);
    setResponseMessage('');   
  };

  
  const navigate = useNavigate();

   const handleItemUpload = () => {
    navigate('/upload'); // Navigates to the Upload page
  };
  const handleHome = () => {
    navigate('/'); // Navigates to the search page
  };


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
 
 
    const file = e.target.files[0];
    if (file) {
        // Create a local URL for the selected image
        const imageUrl = URL.createObjectURL(file);

        setSelectedImage(imageUrl); // Set the local URL for rendering
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
      const response = await fetch('http://localhost:7298/api/search', {
        method: 'POST',
        body: formData,
      });

      setResponseMessage('');
      if (response.status === 200) {
        setMessage(response.message);
        const result = await response.json();
      setResponseMessage(result.message);
      setResults(result.filesMatched);
      console.log(result.filesMatched);

      } else {
        setMessage('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error occurred while uploading');
    }
  };

  return (
    <main className="upload-content">
          <Header />

          <Box >
        <Box marginLeft={"170px"} display={"flex"} marginTop={"50px"}>
        <Box>
        <Button
            variant="contained"
            color="primary"
            onClick={()=>handleItemUpload()}
            
          >
            Upload
          </Button>
          </Box>
          <Box marginLeft={"20px"}>
          <Button variant="contained"
            color="primary"
            onClick={()=>handleHome()}
           
          >
            Home
          </Button>
          </Box>
        </Box>
        <Box>
        {/* <Title>Welcome to Item Tracker</Title> */}
        <Typography
          variant="subtitle1"
          style={{
            marginBottom: '20px',
            fontStyle: 'italic',
            color: '#333',
            textAlign: 'center', // Center the text
            fontWeight: '600', // Make the font slightly bolder
            fontSize: '1.2rem', // Adjust font size
            textTransform: 'uppercase', // Uppercase letters
          }}
        >
        Unleashing the Power of Visual Recognition
      </Typography>
  </Box>
  </Box>

      <Box container spacing={4} display={'flex'} marginTop="20px" >
        {/* File Upload Section */}
        <Box item xs={12} md={6}>
          <Box marginLeft={"80px"}><h2>Select Image</h2></Box>
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
        <Box item xs={12} md={6}  marginLeft="100px"  >
          {responseMessage && (
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
              results.map((file, index) => (
                <Box item xs={4} key={index} marginLeft={"20px"} >
                  <Box
                    sx={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      textAlign: 'center',
                    }}
                  >
                    <ImageDisplay imageId={file} />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>{responseMessage}</Typography>
            )}
          </Box>
        )}
</Box>
      </Box>
      <Footer/>
    </main>
  );
};

export default SearchPhotos;

