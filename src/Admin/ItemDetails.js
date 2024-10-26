// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Box, Card, CardMedia, CardContent, Typography, Modal, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';


// const ItemDetails = ({isDrawerOpen}) => {

//   const location = useLocation();
//   const { selectedRequest, relatedImages } = location.state || { selectedRequest: null, relatedImages: [] };

//   const [similarItemOpen, setSimilarItemOpen] = React.useState(false);
//   const [selectedSimilarItem, setSelectedSimilarItem] = React.useState(null);

//   const handleSimilarItemClick = (item) => {
//     setSelectedSimilarItem(item);
//     setSimilarItemOpen(true);
//   };

//   const handleClose = () => {
//     setSimilarItemOpen(false);
//     setSelectedSimilarItem(null);
//   };
  

//   const [marginLeft, setMarginLeft] = useState(100); 
//   const [marginRight, setMarginRight] = useState(100); 

//     useEffect(() => {
//       // Adjust margin dynamically based on drawer state
//       setMarginLeft(isDrawerOpen ? 240 : 0);
//       setMarginRight(isDrawerOpen ? 0 : 0); 
//     }, [isDrawerOpen]);

//   return (
//     <Box sx={{
//         textAlign: 'center',
//         mt: 2,
//         ml: `${marginLeft}px`,
//         mr:`${marginRight}px`,
//         transition: 'margin-left 0.3s', 
//       }}>
//       {selectedRequest && (
//         <>
//           <Typography variant="h4" gutterBottom>{selectedRequest.Description}</Typography>
//           <Card>
//             <CardMedia component="img" height="300" image={selectedRequest.ItemPhoto} alt="Item" />
//             <CardContent>
//               <Typography variant="h6">Details</Typography>
//                     <Typography><strong>Color:</strong> {selectedRequest.Color}</Typography>
//                     <Typography><strong>Size:</strong> {selectedRequest.Size}</Typography>
//                     <Typography><strong>Brand:</strong> {selectedRequest.Brand}</Typography>
//                     <Typography><strong>Model:</strong> {selectedRequest.Model}</Typography>
//                     <Typography><strong>Distinguishing Features:</strong> {selectedRequest.DistinguishingFeatures}</Typography>
//                     <Typography><strong>Item Category:</strong> {selectedRequest.ItemCategory}</Typography>
//                     <Typography><strong>Serial Number:</strong> {selectedRequest.SerialNumber}</Typography>
//                     <Typography><strong>Date When Lost:</strong> {new Date(selectedRequest.DateTimeWhenLost).toLocaleString()}</Typography>
//                     <Typography><strong>Location:</strong> {selectedRequest.Location}</Typography>
//                     <Typography><strong>Item Value:</strong> ${selectedRequest.ItemValue.toFixed(2)}</Typography>
//                     <Typography><strong>Proof of Ownership:</strong> {selectedRequest.ProofofOwnership}</Typography>
//                     <Typography><strong>How the Item Lost:</strong> {selectedRequest.HowtheItemLost}</Typography>
//                     <Typography><strong>Reference Number:</strong> {selectedRequest.ReferenceNumber}</Typography>
//                     <Typography><strong>Additional Information:</strong> {selectedRequest.AdditionalInformation}</Typography>
//                     <Typography><strong>Other Relevant Details:</strong> {selectedRequest.OtherRelevantDetails}</Typography>
//             </CardContent>
//           </Card>

//           <Typography variant="h6" sx={{ marginTop: '20px' }}>Matched Items</Typography>
//           <Box sx={{ display: 'flex', overflowX: 'auto', marginTop: '10px' }}>
//             {relatedImages.map(item => (
//               <Card
//                 key={item.id}
//                 onClick={() => handleSimilarItemClick(item)}
//                 sx={{ minWidth: '120px', marginRight: '10px', cursor: 'pointer' }}
//               >
//                 <CardMedia component="img" height="100" image={item.ItemPhoto} alt={`Related ${item.id}`} />
//               </Card>
//             ))}
//           </Box>

//           {/* Similar Item Modal */}
//           <Modal open={similarItemOpen} onClose={handleClose}>
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//               {selectedSimilarItem && (
//                 <Box sx={{ bgcolor: 'white', borderRadius: '8px', padding: '20px', maxWidth: '800px', width: '100%', boxShadow: 24, position: 'relative' }}>
//                   <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
//                     <CloseIcon />
//                   </IconButton>
//                   <Typography variant="h5" gutterBottom>{selectedSimilarItem.Description}</Typography>
//                   <CardMedia component="img" height="300" image={selectedSimilarItem.ItemPhoto} alt="Item" />
//                   <Typography variant="h6">Details</Typography>
//                     <Typography><strong>Color:</strong> {selectedSimilarItem.Color}</Typography>
//                     <Typography><strong>Size:</strong> {selectedSimilarItem.Size}</Typography>
//                     <Typography><strong>Brand:</strong> {selectedSimilarItem.Brand}</Typography>
//                     <Typography><strong>Model:</strong> {selectedSimilarItem.Model}</Typography>
//                     <Typography><strong>Distinguishing Features:</strong> {selectedSimilarItem.DistinguishingFeatures}</Typography>
//                     <Typography><strong>Item Category:</strong> {selectedSimilarItem.ItemCategory}</Typography>
//                     <Typography><strong>Serial Number:</strong> {selectedSimilarItem.SerialNumber}</Typography>
//                     <Typography><strong>Date When Lost:</strong> {new Date(selectedSimilarItem.DateTimeWhenLost).toLocaleString()}</Typography>
//                     <Typography><strong>Location:</strong> {selectedSimilarItem.Location}</Typography>
//                     <Typography><strong>Item Value:</strong> ${selectedSimilarItem.ItemValue.toFixed(2)}</Typography>
//                     <Typography><strong>Proof of Ownership:</strong> {selectedSimilarItem.ProofofOwnership}</Typography>
//                     <Typography><strong>How the Item Lost:</strong> {selectedSimilarItem.HowtheItemLost}</Typography>
//                     <Typography><strong>Reference Number:</strong> {selectedSimilarItem.ReferenceNumber}</Typography>
//                     <Typography><strong>Additional Information:</strong> {selectedSimilarItem.AdditionalInformation}</Typography>
//                     <Typography><strong>Other Relevant Details:</strong> {selectedSimilarItem.OtherRelevantDetails}</Typography>
//                 </Box>
//               )}
//             </Box>
//           </Modal>
//         </>
//       )}
//     </Box>
//   );
// };

// export default ItemDetails;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {  
  Box, Button, Card, CardMedia, CardContent, Typography, TextField,
  MenuItem, Dialog, DialogContent, DialogActions, Modal, IconButton, Grid 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const allRelatedImages = [
    {
      id: 1,
      claimedBy: "Harry",
      Description: "Levis Red sling bag",
      Color: "Red",
      Size: "N/A",
      Brand: "Levis",
      Model: "N/A",
      DistinguishingFeatures: "Minor scratches",
      ItemCategory: "Bags",
      SerialNumber: "1234567890",
      DateTimeWhenLost: "2024-10-20T10:30:00",
      Location: "Main Street, City Center",
      ItemValue: 150.00,
      ItemPhoto: "/related1.jfif", 
      ProofofOwnership: "Receipt",
      HowtheItemLost: "Left on the bus",
      ReferenceNumber: "REF12345",
      AdditionalInformation: "Contact for more details",
      OtherRelevantDetails: "N/A",
    },
    {
      id: 2,
      claimedBy: "Sonia",
      Description: "Black backpack",
      Color: "Black",
      Size: "Medium",
      Brand: "Skybags",
      Model: "Air",
      DistinguishingFeatures: "Zipper broken",
      ItemCategory: "Backpack",
      SerialNumber: "0987654321",
      DateTimeWhenLost: "2024-10-19T14:00:00",
      Location: "City Park",
      ItemValue: 75.00,
      ItemPhoto: "/related2.jfif", 
      ProofofOwnership: "None",
      HowtheItemLost: "Forgot in the park",
      ReferenceNumber: "REF54321",
      AdditionalInformation: "Call if found",
      OtherRelevantDetails: "N/A",
    },
    {
      id: 3,
      claimedBy: "Charles",
      Description: "Grey leather wallet lost",
      Color: "Grey",
      Size: "N/A",
      Brand: "Gucci",
      Model: "Marmont",
      DistinguishingFeatures: "Minor scratches",
      ItemCategory: "Wallet",
      SerialNumber: "1234567890",
      DateTimeWhenLost: "2024-10-20T10:30:00",
      Location: "Main Street, City Center",
      ItemValue: 150.00,
      ItemPhoto: "/related3.jfif", 
      ProofofOwnership: "Receipt",
      HowtheItemLost: "Left on the bus",
      ReferenceNumber: "REF12345",
      AdditionalInformation: "Contact for more details",
      OtherRelevantDetails: "N/A",
    },
    {
      id: 4,
      claimedBy: "Selena",
      Description: "Black wallet lost",
      Color: "Black",
      Size: "Small",
      Brand: "Mat&Harbour",
      Model: "Air",
      DistinguishingFeatures: "Worn out",
      ItemCategory: "Wallet",
      SerialNumber: "0987654321",
      DateTimeWhenLost: "2024-10-19T14:00:00",
      Location: "City Park",
      ItemValue: 75.00,
      ItemPhoto: "/related4.jfif", 
      ProofofOwnership: "None",
      HowtheItemLost: "Forgot in the park",
      ReferenceNumber: "REF54321",
      AdditionalInformation: "Call if found",
      OtherRelevantDetails: "N/A",
    },
    // { id: 1, image: '/related1.jfif', color: 'Red', category: 'Bag', brand: 'Lavie', image: '/related1.jfif', description:'Red shiny bag'  },
    // { id: 2, image: '/related2.jfif', color: 'Black', category: 'Backpack', brand: 'SkyBags', image: '/related2.jfif', description:'Black backpack'  },
    // { id: 3, image: '/related3.jfif', color: 'Grey', category: 'Wallet', brand: 'Gucci', image: '/related3.jfif', description:'Gucci wallet'  },
    // { id: 4, image: '/related4.jfif', color: 'Black', category: 'Wallet', brand: 'Mast&Harbour', image: '/related4.jfif', description:'Black wallet'  },
  ];

const ItemDetails = ({ isDrawerOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
//   const { selectedRequest, relatedImages } = location.state || { selectedRequest: null, relatedImages: [] };
const { selectedRequest, relatedImages = [] } = location.state || {};

  const [similarItemOpen, setSimilarItemOpen] = useState(false);
  const [selectedSimilarItem, setSelectedSimilarItem] = useState(null);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState('In Progress');
  const [comments, setComments] = useState('');

  const [marginLeft, setMarginLeft] = useState(100);

  useEffect(() => {
    setMarginLeft(isDrawerOpen ? 240 : 0);
  }, [isDrawerOpen]);

  const handleBack = () => navigate('/admin/home/claimrequests');

  const handlePopupClose = () => setOpenPopup(false);

  const handleStatusChange = (event) => setStatus(event.target.value);

  const handleCardClick = (image) => {
    setSelectedImage(image);
    setOpenPopup(true);
  };

  const handleSimilarItemClick = (item) => {
    setSelectedSimilarItem(item);
    setSimilarItemOpen(true);
  };

  const handleClose = () => {
    setSimilarItemOpen(false);
    setSelectedSimilarItem(null);
  };

  const handleSubmit = () => {
    const submissionData = {
      comments,
      status,
      requestId: selectedRequest?.ReferenceNumber,
    };
    console.log('Submitting:', submissionData);
    alert('Form submitted successfully!');
  };

  const getRelatedImages = () => {
    if (!selectedRequest) return [];
    const { Color, ItemCategory, Brand } = selectedRequest;
  
    return allRelatedImages.filter(image =>
      image.Color.toLowerCase() === Color.toLowerCase() ||
      image.ItemCategory.toLowerCase() === ItemCategory.toLowerCase() ||
      image.Brand.toLowerCase() === Brand.toLowerCase()
    );
  };

  return (
    <Box sx={{ marginLeft: `${marginLeft}px`, padding: '20px' }}>
      <Grid container spacing={2}>
        {/* Left Section: Image and Matched Items */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="600"
              image={selectedRequest?.ItemPhoto || ''}
              alt="Item"
            />
          </Card>

          <Typography variant="h6" sx={{ marginTop: '20px' }}>Matched Items</Typography>
          <Box sx={{ display: 'flex', overflowX: 'auto', marginTop: '10px' }}>
            {relatedImages.map(item => (
              <Card
                key={item.id}
                onClick={() => handleSimilarItemClick(item)}
                sx={{ minWidth: '120px', marginRight: '10px', cursor: 'pointer' }}
              >
                <CardMedia component="img" height="100" image={item.ItemPhoto} alt={`Related ${item.id}`} />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Right Section: Details, Status, and Comments */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{display:'flex',justifyContent:'center'}}>{selectedRequest?.Description}</Typography>
          <Typography><strong>Color:</strong> {selectedRequest?.Color}</Typography>
          <Typography><strong>Size:</strong> {selectedRequest?.Size}</Typography>
          <Typography><strong>Brand:</strong> {selectedRequest?.Brand}</Typography>
          <Typography><strong>Model:</strong> {selectedRequest?.Model}</Typography>
          <Typography><strong>Distinguishing Features:</strong> {selectedRequest?.DistinguishingFeatures}</Typography>
          <Typography><strong>Item Category:</strong> {selectedRequest?.ItemCategory}</Typography>
          <Typography><strong>Serial Number:</strong> {selectedRequest?.SerialNumber}</Typography>
          <Typography><strong>Date When Lost:</strong> {new Date(selectedRequest?.DateTimeWhenLost).toLocaleString()}</Typography>
          <Typography><strong>Location:</strong> {selectedRequest?.Location}</Typography>
          <Typography><strong>Item Value:</strong> ${selectedRequest?.ItemValue?.toFixed(2)}</Typography>
          <Typography><strong>Proof of Ownership:</strong> {selectedRequest?.ProofofOwnership}</Typography>
          <Typography><strong>How the Item Lost:</strong> {selectedRequest?.HowtheItemLost}</Typography>
          <Typography><strong>Reference Number:</strong> {selectedRequest?.ReferenceNumber}</Typography>
          <Typography><strong>Additional Information:</strong> {selectedRequest?.AdditionalInformation}</Typography>
          <Typography><strong>Other Relevant Details:</strong> {selectedRequest?.OtherRelevantDetails}</Typography>

          <TextField
            label="Comments"
            multiline
            rows={4}
            fullWidth
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            sx={{ mt: 3 }}
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={handleStatusChange}
            fullWidth
            sx={{ mt: 4 }}
          >
            {['In Progress', 'Requested', 'Pending', 'Closed'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex',justifyContent:'center', gap: 4, mt: 5 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" onClick={handleBack}>
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Modal for Matched Item Details */}
      <Modal open={similarItemOpen} onClose={handleClose}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            {selectedSimilarItem && (
              <Box sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '800px',
                width: '100%',
                boxShadow: 24,
                position: 'relative',
              }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h5" gutterBottom>{selectedSimilarItem.Description}</Typography>
                <Typography variant="h6">Claimed By: {selectedSimilarItem.claimedBy}</Typography> 
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={selectedSimilarItem.ItemPhoto}
                      alt="Item"
                      sx={{ borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                  <Typography variant="h6">Details</Typography>
                    <Typography><strong>Color:</strong> {selectedSimilarItem.Color}</Typography>
                    <Typography><strong>Size:</strong> {selectedSimilarItem.Size}</Typography>
                    <Typography><strong>Brand:</strong> {selectedSimilarItem.Brand}</Typography>
                    <Typography><strong>Model:</strong> {selectedSimilarItem.Model}</Typography>
                    <Typography><strong>Distinguishing Features:</strong> {selectedSimilarItem.DistinguishingFeatures}</Typography>
                    <Typography><strong>Item Category:</strong> {selectedSimilarItem.ItemCategory}</Typography>
                    <Typography><strong>Serial Number:</strong> {selectedSimilarItem.SerialNumber}</Typography>
                    <Typography><strong>Date When Lost:</strong> {new Date(selectedSimilarItem.DateTimeWhenLost).toLocaleString()}</Typography>
                    <Typography><strong>Location:</strong> {selectedSimilarItem.Location}</Typography>
                    <Typography><strong>Item Value:</strong> ${selectedSimilarItem.ItemValue.toFixed(2)}</Typography>
                    <Typography><strong>Proof of Ownership:</strong> {selectedSimilarItem.ProofofOwnership}</Typography>
                    <Typography><strong>How the Item Lost:</strong> {selectedSimilarItem.HowtheItemLost}</Typography>
                    <Typography><strong>Reference Number:</strong> {selectedSimilarItem.ReferenceNumber}</Typography>
                    <Typography><strong>Additional Information:</strong> {selectedSimilarItem.AdditionalInformation}</Typography>
                    <Typography><strong>Other Relevant Details:</strong> {selectedSimilarItem.OtherRelevantDetails}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Modal>
    </Box>
  );
};

export default ItemDetails;


