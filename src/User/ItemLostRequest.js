import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputLabel, Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ItemLostRequest({ isDrawerOpen, userName }) {
  const [marginLeft, setMarginLeft] = useState(100);
  const [itemLostRequests, setItemLostRequests] = useState([]);
  const [currentItemLostRequest, setCurrentItemLostRequest] = useState({
    description: '',
    color: '',
    size: '',
    brand: '',
    model: '',
    distinguishingFeatures: '',
    itemCategory: '',
    serialNumber: '',
    dateTimeWhenLost: '',
    location: '',
    itemValue: '',
    itemPhoto: '',
    proofOfOwnership: '',
    howTheItemLost: '',
    referenceNumber: '',
    additionalInformation: '',
    otherRelevantDetails: '',
    requestedBy: userName,
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
  }, [isDrawerOpen]);

  useEffect(() => {
    const fetchItemLostRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5291/api/LostItemRequest');
        setItemLostRequests(response.data);
      } catch (error) {
        console.error('Error fetching item lost requests:', error);
      }
    };
    fetchItemLostRequests();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItemLostRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5291/api/LostItemRequest', currentItemLostRequest);
      setSnackbarOpen(true);
      setItemLostRequests((prevRequests) => [...prevRequests, currentItemLostRequest]);
      // Reset form
      setCurrentItemLostRequest({
        description: '',
        color: '',
        size: '',
        brand: '',
        model: '',
        distinguishingFeatures: '',
        itemCategory: '',
        serialNumber: '',
        dateTimeWhenLost: '',
        location: '',
        itemValue: '',
        itemPhoto: '',
        proofOfOwnership: '',
        howTheItemLost: '',
        referenceNumber: '',
        additionalInformation: '',
        otherRelevantDetails: '',
        requestedBy: userName,
      });
      setUploadedImage(null);
    } catch (error) {
      console.error('Error submitting the lost item request:', error);
    }

  };

  return (
    <Box sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
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
              marginTop: '100px',
              marginBottom: '20px',
              color: 'black',
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
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            {[
              { label: 'Description', name: 'description', maxLength: 50 },
              { label: 'Color', name: 'color', maxLength: 50 },
              { label: 'Size', name: 'size', maxLength: 20 },
              { label: 'Brand', name: 'brand', maxLength: 50 },
              { label: 'Model', name: 'model', maxLength: 50 },
              { label: 'Distinguishing Features', name: 'distinguishingFeatures', maxLength: 100 },
              { label: 'Item Category', name: 'itemCategory', maxLength: 50 },
              { label: 'Serial Number', name: 'serialNumber', maxLength: 50 },
              { label: 'Date and Time When Lost', name: 'dateTimeWhenLost', type: 'datetime-local' },
              { label: 'Location', name: 'location', maxLength: 100 },
              { label: 'Item Value', name: 'itemValue', type: 'number', inputProps: { min: 0 } },
              { label: 'Proof of Ownership', name: 'proofOfOwnership', maxLength: 100 },
              { label: 'How the Item Was Lost', name: 'howTheItemLost', maxLength: 100 },
              { label: 'Reference Number', name: 'referenceNumber', maxLength: 50 },
              { label: 'Additional Information', name: 'additionalInformation', maxLength: 200 },
              { label: 'Other Relevant Details', name: 'otherRelevantDetails', maxLength: 200 },
            ].map(({ label, name, maxLength, type = 'text', inputProps = {} }) => (
              <React.Fragment key={name}>
                <InputLabel>{label}</InputLabel>
                <TextField
                  margin="dense"
                  name={name}
                  value={currentItemLostRequest[name]}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ maxLength, ...inputProps }}
                  type={type}
                />
              </React.Fragment>
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

