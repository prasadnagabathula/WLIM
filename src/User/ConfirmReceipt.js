import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Snackbar, Alert, InputLabel, Box, Typography, Button, FormControl, Paper, Divider, Dialog, DialogActions, AlertDialog, DialogContent, DialogTitle, } from '@mui/material';
import { styled } from '@mui/system';
import _ from 'lodash';
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from 'react-router-dom';

function ConfirmReceipt({ isDrawerOpen, userName }) {
  const [results, setResults] = useState([]);
  const [marginLeft, setMarginLeft] = useState(100);
  const [hoveredImage,] = useState(null); // To store hovered thumbnail image
  const [itemDescription, setItemDescription] = useState(null);
  const [location, setLocation] = useState('');
  const [itemIdValue, setItemIdValue] = useState('');
  const [severity, setSeverity] = useState('success');
  const [itemPhoto, setItemPhoto] = useState(null);
  const [itemSelected, setItemSelected] = useState(false);

  const [marginRight, setMarginRight] = useState(100);

  const [currentItemLostRequest, setCurrentItemLostRequest] = useState({ description: '' });


  const [uploadedImage, setUploadedImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [resultResponseMessage, setResultResponseMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 260 : 0);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);


  const handleConfirm = async () => {
    try {
      // const itemIdValue = itemIdValue; 
      currentItemLostRequest.id = itemIdValue;


      const response = await axios.patch(
        `http://localhost:7237/api/LostItemRequest/confirm-receipt/${itemIdValue}`,
        //`http://localhost:5291/api/LostItemRequest/confirm-receipt/${itemIdValue}`,
        currentItemLostRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 204) {
        setSeverity('success');
        setSnackbarMessage('Details confirmed successfully!');
        setSnackbarOpen(true);

        setCurrentItemLostRequest({ description: '' });


        // Additional actions on success, e.g., closing a dialog
        handleDialogClose();
      }
    } catch (error) {
      console.error('Error confirming the details:', error);
      setSeverity('error');
      setSnackbarMessage('Error confirming the details. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const dialogPaperStyles = {
    width: '600px',
    maxWidth: '800px',
    background: 'linear-gradient(to left,#1a1a2e, #16213e,#e0e0e0)',
    padding: 2,
  };

  const dialogTitleStyles = {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: '1.5rem',
    borderBottom: '2px solid #ddd',
    paddingBottom: 1,
    display: 'flex',
    justifyContent: 'center'
  };

  const dialogContentStyles = {
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#fff',
    borderRadius: '6px',
  };

  const textFieldStyles = {
    marginBottom: 2,
    '& .MuiInputBase-root': {
      borderRadius: '8px',
      border: '1px solid #ccc',
      '&:hover': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1976d2',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#a6c7e7',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#a6c7e7',
      },
    },
  };

  const dialogActionsStyles = {
    padding: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
    borderRadius: '0 0 8px 8px',
  };

  const cancelButtonStyles = {
    color: '#f44336',
    '&:hover': {
      backgroundColor: '#ffebee',
    },
  };

  const submitButtonStyles = {
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  };

  const [qrValue, setQrValue] = useState("");
  const scannerRef = useRef(null);

  //const navigate = useNavigate();
  const isInitialRender = useRef(true);

  useEffect(() => {
    startScanner();
    return () => scannerRef.current?.clear();
  }, []);

  const startScanner = () => {


    if (scannerRef.current) {
      scannerRef.current.clear(); // Clear the previous instance
    }

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        setQrValue(decodedText);
        getItemDetails(decodedText);

        scanner.clear(); // Stop the scanner after scanning
        scannerRef.current = null;
      },
      (error) => {
        console.error("QR Code Scan Error:", error);
      }
    );

    scannerRef.current = scanner;
  };

  const handleReset = () => {
    setQrValue("");
    startScanner(); // Restart the scanner
  };


  useEffect(() => {
    // Skip the first render
    if (isInitialRender.current) {
      isInitialRender.current = false; // Mark as not initial
      return;
    }

    // Handle navigation changes
    if (scannerRef.current) {
      scannerRef.current.clear() // Clear scanner on route change
        .catch((err) => console.error("Failed to clear scanner:", err));
    }
  }, [location.pathname]); // Only runs when the pathname changes

  const getItemDetails = async (qrValue) => {
    if (!qrValue || qrValue.length < 36) {
      console.error('Invalid QR value:', qrValue);
      setResultResponseMessage('Invalid QR code scanned');
      return;
    }

    const itemId = qrValue.substring(0, 36);
    setItemIdValue(itemId);

    console.log("Extracted Item ID:", itemId);

    try {
      const response = await fetch(`http://localhost:7298/api/getById/${itemId}`, {
        method: 'GET',
      });

      if (response.status === 200) {
        const result = await response.json();

        setItemDescription(result.itemDescription);
        setItemPhoto(result.itemPhoto);
        setItemSelected(true);
      } else {
        setResultResponseMessage('No matching images found');
        setItemSelected(false);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setResultResponseMessage('Error occurred while fetching data');
    }
  };


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s',
      height: '100vh'
    }}>

      <Paper elevation={5} sx={{ width: '100%', height: '100vh' }}>
        <Typography variant="h4" gutterBottom sx={{
          backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0 )',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          mt: 2
        }}>
          Scan to Confirm
        </Typography>
        <Divider sx={{
          width: '90%',
          margin: 'auto',
          mb: 2,
        }} />
        <Box sx={{
          mt: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          justifyContent: 'center',
          gap: 2,
          width: { xs: '100%', sm: '100%', md: 'auto' },
          height: '100vh'
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100vh'
            }}
          >
            <InputLabel
              id="location-label"
              sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              Please Scan Your QR
            </InputLabel>
            <FormControl sx={{ width: '400px', marginTop: '5px', mb: 2 }}>

              <Box
                id="reader"
                sx={{
                  margin: "20px auto",
                  width: "300px",
                  height: "300px",
                  border: "2px dashed #1976d2",
                  borderRadius: "8px",
                  position: "relative",
                  backgroundColor: "#f9f9f9",
                }}></Box>

              <Box sx={{ height: '100%' }}>
                {qrValue && (
                  <Box sx={{ marginTop: 3, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{ marginBottom: 2, color: "#333", fontWeight: "bold" }}
                    >
                      Details:
                    </Typography>
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        display: "inline-block",
                        fontFamily: "monospace",
                        fontSize: "1rem",
                      }}
                    >
                      {itemDescription}
                    </Typography>
                    {/* <CardMedia>
                            <ImageDisplay imageId={itemPhoto} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0px 0px 0px' }} />
                          </CardMedia> */}
                  </Box>
                )}
                <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center", gap: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      padding: '10px 20px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                    }}
                    onClick={handleConfirm}
                  >
                    Confirm
                  </Button>
                  <Dialog
                    open={snackbarOpen}
                    onClose={handleSnackbarClose}
                    sx={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <DialogTitle>Alert</DialogTitle>
                    <DialogContent sx={{ width: { xs: '300px', sm: '300px', md: '500px' } }}>
                      <Alert severity={severity}>{snackbarMessage}</Alert>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleSnackbarClose} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {/* <Snackbar
                      open={snackbarOpen}
                      autoHideDuration={6000}
                      onClose={handleSnackbarClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'start' }}
                    >
                      <Alert
                        onClose={handleSnackbarClose}
                        severity={severity}
                        sx={{ width: '100%' }}
                      >
                        {snackbarMessage}
                      </Alert>
                    </Snackbar> */}
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      padding: "10px 20px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>

                </Box>
              </Box>
            </FormControl>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ConfirmReceipt;