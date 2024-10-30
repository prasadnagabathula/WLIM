import React, { useEffect, useState } from 'react';
import {Box,Accordion,AccordionSummary,AccordionDetails,IconButton,TextField,InputAdornment, Card,CardContent, CardMedia,Typography,Modal,Grid,Button,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const staticClaimRequests = [  
  {
    id: 1,
    claimedBy: "John Doe",
    Description: "Black leather wallet lost",
    Color: "Black",
    Size: "N/A",
    Brand: "Gucci",
    Model: "Marmont",
    DistinguishingFeatures: "Minor scratches",
    ItemCategory: "Wallet",
    SerialNumber: "1234567890",
    DateTimeWhenLost: "2024-10-20T10:30:00",
    Location: "Main Street, City Center",
    ItemValue: 150.00,
    ItemPhoto: "/gucci.jfif", 
    ProofofOwnership: "Receipt",
    HowtheItemLost: "Left on the bus",
    ReferenceNumber: "REF12345",
    AdditionalInformation: "Contact for more details",
    OtherRelevantDetails: "N/A",
  },
  {
    id: 2,
    claimedBy: "Lily",
    Description: "Red backpack lost",
    Color: "Red",
    Size: "Medium",
    Brand: "Nike",
    Model: "Air",
    DistinguishingFeatures: "Zipper broken",
    ItemCategory: "Backpack",
    SerialNumber: "0987654321",
    DateTimeWhenLost: "2024-10-19T14:00:00",
    Location: "City Park",
    ItemValue: 75.00,
    ItemPhoto: "/nike.jfif", 
    ProofofOwnership: "None",
    HowtheItemLost: "Forgot in the park",
    ReferenceNumber: "REF54321",
    AdditionalInformation: "Call if found",
    OtherRelevantDetails: "N/A",
  },
];


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

function Claims({isDrawerOpen }) {

  // const [claimRequests, setClaimRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [similarItemOpen, setSimilarItemOpen] = useState(false);
  const [selectedSimilarItem, setSelectedSimilarItem] = useState(null);

//   const handleItemClick = (request) => {
//     onCardClick(request); // Pass the selected request to Home
// };

const navigate = useNavigate();

// const handleCardClick = (request) => {
//   const relatedImages = getRelatedImages(); 
//   navigate('/itemdetails', { state: { selectedRequest: request, relatedImages: relatedImages } });
// };


// const getRelatedImages = () => {
//   if (!selectedRequest) return [];
//   const { Color, ItemCategory, Brand } = selectedRequest;

//   return allRelatedImages.filter(image =>
//     image.Color.toLowerCase() === Color.toLowerCase() ||
//     image.ItemCategory.toLowerCase() === ItemCategory.toLowerCase() ||
//     image.Brand.toLowerCase() === Brand.toLowerCase()
//   );
// };

const [claimRequests, setClaimRequests] = useState(staticClaimRequests);

const handleCardClick = (request) => {
  const relatedImages = getRelatedImages(request);
  navigate('/itemdetails', { state: { selectedRequest: request, relatedImages } });
};

const getRelatedImages = (request) => {
  const { Color, ItemCategory, Brand } = request;
  return allRelatedImages.filter(image =>
    image.Color.toLowerCase() === Color.toLowerCase() ||
    image.ItemCategory.toLowerCase() === ItemCategory.toLowerCase() ||
    image.Brand.toLowerCase() === Brand.toLowerCase()
  );
};

  // const handleCardClick = (request) => {
  //   navigate('/itemdetails', { state: { selectedRequest: request, relatedImages } });
  // };

  // const filteredClaims = claimRequests.filter(request => {
  //   return (
  //     request.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     request.claimedBy.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // });

  useEffect(() => {
    const fetchClaimRequests = async () => {
      const response = await fetch('/api/claim-requests');
      const data = await response.json();
      setClaimRequests(data);
    };
    fetchClaimRequests();
  }, []);

  // const handleCardClick = (request) => {
  //   setSelectedRequest(request);
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);

    setSimilarItemOpen(false);
    setSelectedSimilarItem(null);
  };


  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [searchQuery, setSearchQuery] = useState(''); 


  const [marginLeft, setMarginLeft] = useState(100); 
  const [marginRight, setMarginRight] = useState(100); 

    useEffect(() => {
      // Adjust margin dynamically based on drawer state
      setMarginLeft(isDrawerOpen ? 240 : 0);
      setMarginRight(isDrawerOpen ? 0 : 0); 
    }, [isDrawerOpen]);

  return (
    <div>
      <Box  sx={{
      textAlign: 'center',
      mt: 2,
      ml: `${marginLeft}px`,
      mr:`${marginRight}px`,
      transition: 'margin-left 0.3s', 
    }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Claim Requests
        </Typography>
        <div style={{ display: 'flex', marginBottom: '20px', width: '100%' }}>
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}  
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton edge="end">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                style={{ flexGrow: 1, marginRight: '10px',color:'#0d416b' }}
            />
        </div>
        <Grid container spacing={2}>
          {/* {staticClaimRequests.map((request) => ( */}
          {claimRequests.map((request) => (
            <Grid item xs={12} sm={6} md={4} key={request.id}>
              <Card onClick={() => handleCardClick(request)} sx={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={request.ItemPhoto}
                  alt="Item"
                  sx={{objectFit:'contain'}}
                />
                <CardContent>
                  <Typography variant="h6">{request.Description}</Typography>
                  <Typography color="text.secondary">Claimed By: {request.claimedBy}</Typography> 
                  <Typography color="text.secondary">Claimed Date: {new Date(request.DateTimeWhenLost).toLocaleDateString()}</Typography>
                  <Typography color="text.secondary">Status: Pending</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

       {/* Main Item Modal */}
      {/* <Modal open={open} onClose={handleClose}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            {selectedRequest && (
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
                <Typography variant="h5" gutterBottom>{selectedRequest.Description}</Typography>
                <Typography variant="h6">Claimed By: {selectedRequest.claimedBy}</Typography> 
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={selectedRequest.ItemPhoto}
                      alt="Item"
                      sx={{ borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Details</Typography>
                    <Typography><strong>Color:</strong> {selectedRequest.Color}</Typography>
                    <Typography><strong>Size:</strong> {selectedRequest.Size}</Typography>
                    <Typography><strong>Brand:</strong> {selectedRequest.Brand}</Typography>
                    <Typography><strong>Model:</strong> {selectedRequest.Model}</Typography>
                    <Typography><strong>Distinguishing Features:</strong> {selectedRequest.DistinguishingFeatures}</Typography>
                    <Typography><strong>Item Category:</strong> {selectedRequest.ItemCategory}</Typography>
                    <Typography><strong>Serial Number:</strong> {selectedRequest.SerialNumber}</Typography>
                    <Typography><strong>Date When Lost:</strong> {new Date(selectedRequest.DateTimeWhenLost).toLocaleString()}</Typography>
                    <Typography><strong>Location:</strong> {selectedRequest.Location}</Typography>
                    <Typography><strong>Item Value:</strong> ${selectedRequest.ItemValue.toFixed(2)}</Typography>
                    <Typography><strong>Proof of Ownership:</strong> {selectedRequest.ProofofOwnership}</Typography>
                    <Typography><strong>How the Item Lost:</strong> {selectedRequest.HowtheItemLost}</Typography>
                    <Typography><strong>Reference Number:</strong> {selectedRequest.ReferenceNumber}</Typography>
                    <Typography><strong>Additional Information:</strong> {selectedRequest.AdditionalInformation}</Typography>
                    <Typography><strong>Other Relevant Details:</strong> {selectedRequest.OtherRelevantDetails}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ marginTop: '20px' }}>Matched Items</Typography>
                <Box sx={{ display: 'flex', overflowX: 'auto', marginTop: '10px' }}>
                  {getRelatedImages().map(image => (
                    <Card
                      key={image.id}
                      onClick={() => handleSimilarItemClick(image)}
                      sx={{ minWidth: '120px', marginRight: '10px', cursor: 'pointer' }}
                    >
                      <CardMedia
                        component="img"
                        height="100"
                        image={image.ItemPhoto}
                        alt={`Related ${image.id}`}
                      />
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Modal> */}

        {/* Similar Item Modal */}
       {/* <Modal open={similarItemOpen} onClose={handleClose}>
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
        </Modal>*/}
      </div>
    </Box>  
    </div>

  )
}

export default Claims
 