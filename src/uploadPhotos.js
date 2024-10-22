import React, { useState } from 'react';
import axios from 'axios';
import Header from './header'; // Assuming you have a header component
import Footer from './footer'; // Assuming you have a footer component
import './uploadPhotos.css'; // Add any custom styles here
import { Button, Typography, Box} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const UploadPhotos = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

   const handleHome = () => {
    navigate('/'); // Navigates to the Upload page
  };
  const handleFindItem = () => {
    navigate('/search'); // Navigates to the search page
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
      const response = await axios.post('http://localhost:5005/api/Upload/uploads', formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
          }
    });

      if (response.status === 200) {
        setMessage('Image uploaded successfully!');
      } else {
        setMessage('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error occurred while uploading');
    }
  };

  return (
    <div className="upload-image-container">
      {/* Header component */}
      <Header />

      <main className="upload-content">
      <Box >
        <Box marginLeft={"170px"} display={"flex"}>
        <Box>
        <Button
            variant="contained"
            color="primary"
            onClick={()=>handleHome()}
            
          >
            Home
          </Button>
          </Box>
          <Box marginLeft={"20px"}>
          <Button variant="contained"
            color="primary"
            onClick={()=>handleFindItem()}            
          >
            Find
          </Button>
          </Box>
        </Box>
        <Box>
        {/* <Title>Welcome to PicFinderAI</Title> */}
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
        
        <h2>Upload Your Image</h2>
        <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="upload-image">
          <UploadBox>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Uploaded"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
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
         

          <Box display="flex" gap={2} justifyContent="center" alignItems="center" marginTop={2}>
          <button type="submit" className="upload-btn">
          Upload
          </button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            //disabled={!selectedImage && results.length === 0}
          >
            Clear
          </Button>
          </Box>
        </form>

        {message && <p className="upload-message">{message}</p>}
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default UploadPhotos;

