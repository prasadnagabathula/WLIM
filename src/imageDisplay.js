import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const ImageDisplay = ({ imageId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the image URL from the API
  const fetchImage = async () => {
    try {
      // Example API call to fetch image by ID
      const response = await axios.get(`http://localhost:5005/api/images/${imageId}`, {
        responseType: 'blob', // To handle binary data
      });

      // Create a URL for the image blob
      const imageBlob = URL.createObjectURL(response.data);
      setImageUrl(imageBlob);
      setLoading(false);
    } catch (err) {
      setError('Error fetching the image');
      setLoading(false);
    }
  };

  // Fetch image on component mount or when imageId changes
  useEffect(() => {
    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  return (
    <Box>
      {loading ? (
        <Typography>Loading image...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <img
          src={imageUrl}
          alt="Uploaded Image"
          style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
        />
      )}
    </Box>
  );
};

export default ImageDisplay;
