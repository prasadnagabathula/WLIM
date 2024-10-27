import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ItemLostRequest({ onRequestSubmit, isDrawerOpen, userName }) {

  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100); 

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);

  }, [isDrawerOpen]);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [itemDetails, setItemDetails] = useState({
    itemDescription: '',
    brand: '',
    model: '',
    color: '',
    serialNumber: '',
    identifiedDate: '',
    location: '',
    size: '',
    itemCategory: '',
    valueOfTheItem: '',
    proofOfOwnership: '',
    circumstancesOfLoss: '',
    aaditionalInformation: '',  
    requestedBy: userName,
  });

  // const handleImageUpload = (event) => {
  //   const files = event.target.files;
  //   if (files.length > 0) {
  //     setUploadedImage(URL.createObjectURL(files[0]));
  //   }
  // };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); 
        console.log("Image uploaded:", reader.result); // Debug log
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newClaim = { ...itemDetails, image: uploadedImage, status: 'In Progress', resolved: false };
    console.log("Claim to be saved:", newClaim); 

    const existingClaims = JSON.parse(localStorage.getItem('uploadedItems')) || [];
    localStorage.setItem('uploadedItems', JSON.stringify([...existingClaims, newClaim]));

    setSnackbarOpen(true);
    setItemDetails({
      itemDescription: '',
      brand: '',
      model: '',
      color: '',
      serialNumber: '',
      identifiedDate: '',
      location: '',
      size: '',
      itemCategory: '',
      valueOfTheItem: '',
      proofOfOwnership: '',
      circumstancesOfLoss: '',
      additionalInformation: '',
      requestedBy: userName,
    });
    setUploadedImage(null);
  };

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
      mr: `${marginRight}px`,
      transition: 'margin-left 0.3s',
    }}>
      <Typography variant="h4" gutterBottom>
        Item Lost Request
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={!uploadedImage && <CloudUploadIcon />}
            sx={{
              width: '300px',
              height: '300px',
              border: '2px dashed #888',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: uploadedImage ? 'transparent' : '#fff',
              backgroundImage: uploadedImage ? `url(${uploadedImage})` : 'none',
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              cursor: 'pointer',
              marginTop:'100px',
              marginBottom: '20px',
              color:'black',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                border: '2px dashed #333',
              },
            }}
          >
            {!uploadedImage && 'Upload Lost Item Photo'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Button>
          {/* {uploadedImage && (
            <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', marginTop: '10px' }} />
          )} */}
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            {Object.keys(itemDetails).map((key) => (
              key !== 'image' && (
                <Grid item xs={12} key={key}>
                  <TextField
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    variant="outlined"
                    fullWidth
                    name={key}
                    value={itemDetails[key]}
                    onChange={handleChange}
                    type={key === 'identifiedDate' ? 'date' : 'text'}
                  />
                </Grid>
              )
            ))}
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
        onClose={() => setSnackbarOpen(false)}
        message="Item details submitted!"
      />
    </Box>
  );
}

export default ItemLostRequest;
