import React, { useEffect, useState } from 'react';
import {Box,Typography,Card,CardMedia, CardContent, Modal, Grid, Button, Container} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ClaimStatus = ({ isDrawerOpen, userName }) => {
  const [marginLeft, setMarginLeft] = useState(100);
  const [marginRight, setMarginRight] = useState(100);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadedItems, setUploadedItems] = useState([]);

  // Adjusting the margins when drawer opens or closes
  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 400 : 100);
    setMarginRight(isDrawerOpen ? 50 : 0);
  }, [isDrawerOpen]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const savedClaims = localStorage.getItem('uploadedItems');
    if (savedClaims) {
      setUploadedItems(JSON.parse(savedClaims));
    }
  }, []);

  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 2,   
        ml: `${marginLeft}px`,
        mr: `${marginRight}px`,
        transition: 'margin-left 0.3s',
      }}
    >
      <Container>
        <Typography variant="h4" gutterBottom>
          Claim Status
        </Typography>
        {uploadedItems.length === 0 ? (
          <Typography>No claims submitted yet.</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {uploadedItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{ cursor: 'pointer', boxShadow: 3 }}
                  onClick={() => handleCardClick(item)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt="Item"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.itemDescription}</Typography>
                    <Typography>Requested By: {userName}</Typography>
                    <Typography>
                      Requested Date: {item.identifiedDate}
                    </Typography>
                    <Typography>Status: Pending</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal for item details */}
        <Modal open={openModal} onClose={handleClose}>
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
        {selectedItem && (
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '800px',
                width: '100%',
                boxShadow: 24,
                position: 'relative',
              }}
            >
              <Button
              onClick={handleClose}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              <CloseIcon />
            </Button>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                {/* Image Section */}
                <Box sx={{ flex: 1 }}>
                  <img
                    src={selectedItem.image}
                    alt="Uploaded"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                    }}
                  />
                </Box>

                {/* Details Section */}
                <CardContent sx={{ flex: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedItem.itemDescription}
                  </Typography>
                  <Typography>Brand: {selectedItem.brand}</Typography>
                  <Typography>Model: {selectedItem.model}</Typography>
                  <Typography>Color: {selectedItem.color}</Typography>
                  <Typography>
                    Serial Number: {selectedItem.serialNumber}
                  </Typography>
                  <Typography>Requested By: {selectedItem.requestedBy}</Typography>
                  <Typography>
                    Requested Date: {selectedItem.identifiedDate}
                  </Typography>
                  <Typography>Location: {selectedItem.location}</Typography>
                  <Typography>Status: {selectedItem.status}</Typography>
                  <Typography>Size: {selectedItem.size}</Typography>
                  <Typography>
                    Item Category: {selectedItem.itemCategory}
                  </Typography>
                  <Typography>
                    Value Of the Item: {selectedItem.valueOfTheItem}
                  </Typography>
                  <Typography>
                    Proof Of Ownership: {selectedItem.proofOfOwnership}
                  </Typography>
                  <Typography>
                    Circumstances Of Loss: {selectedItem.circumstancesOfLoss}
                  </Typography>
                  <Typography>
                    Additional Information: {selectedItem.additionalInformation}
                  </Typography>
                </CardContent>
              </Box>
            </Box>
        )}
        </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default ClaimStatus;


