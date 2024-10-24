import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import View from './View';

function Upload({isDrawerOpen}) {

  const [uploadedItems, setUploadedItems] = useState([]);

  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100); 

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  const [itemDescription, setItemDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [features, setFeatures] = useState('');
  const [condition, setCondition] = useState('');
  const [identifiedDate, setIdentifiedDate] = useState('');
  const [location, setLocation] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const imageFile = files[0];
        setItemDescription('Black leather wallet with silver clasp and multiple card slots');
        setBrand('Gucci');
        setModel('Marmont');
        setColor('Black');
        setSerialNumber('1234567890');
        setFeatures('Minor scratches on the surface');
        setCondition('New');
        setIdentifiedDate(new Date().toISOString().split('T')[0]); 
        setLocation('Main Street, City Center');
    }
  };

  const handleSubmit = () => {
    const newItem = {
      itemDescription,
      brand,
      model,
      color,
      serialNumber,
      features,
      condition,
      identifiedDate,
      location,
    };
    setUploadedItems([...uploadedItems, newItem]);
    setSnackbarOpen(true);
    console.log(newItem);
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
        <Typography variant="h4" gutterBottom>
          Upload Item Details
        </Typography>
        <Grid container spacing={3}>
          {/* First Half - Styled Upload Button */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                width: '300px',
                height: '300px',
                border: '2px dashed #888',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
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
              Upload Identified Item Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>

          {/* Second Half - Input Fields */}
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Item Description"
                  variant="outlined"
                  fullWidth
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Brand/Make"
                  variant="outlined"
                  fullWidth
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Model/Version"
                  variant="outlined"
                  fullWidth
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Colour"
                  variant="outlined"
                  fullWidth
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Serial Number/ID"
                  variant="outlined"
                  fullWidth
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Distinguishing Features"
                  variant="outlined"
                  fullWidth
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Condition"
                  variant="outlined"
                  fullWidth
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Identified Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  value={identifiedDate}
                  onChange={(e) => setIdentifiedDate(e.target.value)}
                  InputProps={{
                    inputProps: {
                      placeholder: '' 
                    },
                  }}/>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Identified Location"
                  variant="outlined"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>
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
      <View uploadedItems={uploadedItems} />
    </div>
  )
}

export default Upload
