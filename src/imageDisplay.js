import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const ImageDisplay = React.memo(({ imageId, style }) => {
  const [imageData, setImageData] = useState(null);
  const [imageCache, setImageCache] = useState({});

  useEffect(() => {
    // If image exists in cache, use it
    if (imageCache[imageId]) {
      setImageData(imageCache[imageId]);
    } else {
      // Otherwise fetch the image data
      axios.get(`http://localhost:7298/api/images/${imageId}`,{responseType:'blob'})
        .then(response => {
          setImageCache(prevCache => ({ ...prevCache, [imageId]: URL.createObjectURL(response.data) }));
          setImageData(URL.createObjectURL(response.data));
          console.log(URL.createObjectURL(response.data));
        })
        .catch(error => console.error(error));
    }
  }, [imageId, imageCache]);

  if (!imageData) {
    return <div>Loading...</div>;
  }

  return ( <img src={imageData} alt={imageId} style={style} /> );
});


// const ImageDisplay = ({ imageId, style }) => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Function to fetch the image URL from the API
//   const fetchImage = async () => {
//     try {
//       // Example API call to fetch image by ID
//       const response = await axios.get(`http://localhost:5005/api/images/${imageId}`, {
//         responseType: 'blob', // To handle binary data
//       });

//       // Create a URL for the image blob
//       const imageBlob = URL.createObjectURL(response.data);
//       setImageUrl(imageBlob);
//       setLoading(false);
//     } catch (err) {
//       setError('Error fetching the image');
//       setLoading(false);
//     }
//   };

//   // Fetch image on component mount or when imageId changes
//   useEffect(() => {
//     if (imageId) {
//       fetchImage();
//     }
//   }, imageId);

//   return (
//     <Box>
//       {loading ? (
//         <Typography>Loading image...</Typography>
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         // <img
//         //   src={imageUrl}
//         //   alt="Uploaded Image"
//         //   style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
//         // />
//         <img
//         src={imageUrl} // Replace with your image source logic
//         alt={`Image ${imageId}`}  
//         style={{
//           objectFit: 'contain', // Use contain to prevent cropping
//           ...style, // Spread any additional styles passed in
//         }}     
//       />
//       )}
//     </Box>
//   );
// };

export default ImageDisplay;
