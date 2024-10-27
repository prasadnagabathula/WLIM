// import React, { useState, useEffect } from 'react';
// import { Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// function ItemLostRequest({isDrawerOpen}) {
    
//   const [uploadedItems, setUploadedItems] = useState([]);
//   const [marginLeft, setMarginLeft] = useState(100);
//   const [marginRight, setMarginRight] = useState(100); 

//   useEffect(() => {
//     setMarginLeft(isDrawerOpen ? 400 : 100);
//     setMarginRight(isDrawerOpen ? 50 : 0);

//   }, [isDrawerOpen]);


//   const [itemDescription, setItemDescription] = useState('');
//   const [brand, setBrand] = useState('');
//   const [model, setModel] = useState('');
//   const [color, setColor] = useState('');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [features, setFeatures] = useState('');
//   const [condition, setCondition] = useState('');
//   const [identifiedDate, setIdentifiedDate] = useState('');
//   const [location, setLocation] = useState('');
//   const [size, setSize] = useState('');
//   const [itemCategory, setItemCategory] = useState('');
//   const [valueOfTheItem, setValueOfTheItem] = useState('');
//   const [proofOfOwnership, setProofOfOwnership] = useState('');
//   const [circumstancesOfLoss, setCircumstancesOfLoss] = useState('');
//   const [additionalInformation, setAdditionalInformation] = useState('');
//   const [relevantDetails, setRelevantDetails] = useState('');
//   const [snackbarOpen, setSnackbarOpen] = useState(false);



//   const handleImageUpload = (event) => {
//     const files = event.target.files;
//     if (files.length > 0) {
//       const imageFile = files[0];
//         setItemDescription('Black leather wallet with silver clasp and multiple card slots');
//         setBrand('Gucci');
//         setModel('Marmont');
//         setColor('Black');
//         setSerialNumber('1234567890');
//         setFeatures('Minor scratches on the surface');
//         setCondition('New');
//         setIdentifiedDate(new Date().toISOString().split('T')[0]); 
//         setLocation('Main Street, City Center');
//     }
//   };

//   const handleSubmit = () => {
//     const newItem = {
//       itemDescription,
//       brand,
//       model,
//       color,
//       serialNumber,
//       features,
//       condition,
//       identifiedDate,
//       location,
//     };
//     setUploadedItems([...uploadedItems, newItem]);
//     setSnackbarOpen(true);
//     console.log(newItem);
//   };

  
//   return (
//     <div>
//         <Box
//         sx={{
//           textAlign: 'center',
//           mt: 2,
//           ml: `${marginLeft}px`,
//           mr: `${marginRight}px`,
//           transition: 'margin-left 0.3s',
//         }}
//       >
//         <Typography variant="h4" gutterBottom>
//           Item Lost Request
//         </Typography>
//         <Grid container spacing={3}>
//           {/* First Half - Styled Upload Button */}
//           <Grid item xs={6}>
//             <Button
//               variant="contained"
//               component="label"
//               fullWidth
//               startIcon={<CloudUploadIcon />}
//               sx={{
//                 width: '300px',
//                 height: '300px',
//                 border: '2px dashed #888',
//                 borderRadius: '10px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: '#fff',
//                 cursor: 'pointer',
//                 marginTop:'100px',
//                 marginBottom: '20px',
//                 color:'black',
//                 transition: 'all 0.3s ease-in-out',
//                 '&:hover': {
//                   border: '2px dashed #333',
//                 },
//               }}
//             >
//               Upload Lost Item Photo
//               <input
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={handleImageUpload}
//               />
//             </Button>
//           </Grid>

//           {/* Second Half - Input Fields */}
//           <Grid item xs={6}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Item Description"
//                   variant="outlined"
//                   fullWidth
//                   value={itemDescription}
//                   onChange={(e) => setItemDescription(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Brand/Make"
//                   variant="outlined"
//                   fullWidth
//                   value={brand}
//                   onChange={(e) => setBrand(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Model/Version"
//                   variant="outlined"
//                   fullWidth
//                   value={model}
//                   onChange={(e) => setModel(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Colour"
//                   variant="outlined"
//                   fullWidth
//                   value={color}
//                   onChange={(e) => setColor(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Serial Number/ID"
//                   variant="outlined"
//                   fullWidth
//                   value={serialNumber}
//                   onChange={(e) => setSerialNumber(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Distinguishing Features"
//                   variant="outlined"
//                   fullWidth
//                   value={features}
//                   onChange={(e) => setFeatures(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Condition"
//                   variant="outlined"
//                   fullWidth
//                   value={condition}
//                   onChange={(e) => setCondition(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Identified Date"
//                   variant="outlined"
//                   type="date"
//                   fullWidth
//                   value={identifiedDate}
//                   onChange={(e) => setIdentifiedDate(e.target.value)}
//                   InputProps={{
//                     inputProps: {
//                       placeholder: '' 
//                     },
//                   }}/>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Identified Location"
//                   variant="outlined"
//                   fullWidth
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Size "
//                   variant="outlined"
//                   fullWidth
//                   value={size}
//                   onChange={(e) => setSize(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Item Category"
//                   variant="outlined"
//                   fullWidth
//                   value={itemCategory}
//                   onChange={(e) => setItemCategory(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Value of the Item"
//                   variant="outlined"
//                   fullWidth
//                   value={valueOfTheItem}
//                   onChange={(e) => setValueOfTheItem(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Proof of Ownership"
//                   variant="outlined"
//                   fullWidth
//                   value={proofOfOwnership}
//                   onChange={(e) => setProofOfOwnership(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Circumstances of Loss"
//                   variant="outlined"
//                   fullWidth
//                   value={circumstancesOfLoss}
//                   onChange={(e) => setCircumstancesOfLoss(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Additional Information(optional)"
//                   variant="outlined"
//                   fullWidth
//                   value={additionalInformation}
//                   onChange={(e) => setAdditionalInformation(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Any Other Relevant Details"
//                   variant="outlined"
//                   fullWidth
//                   value={relevantDetails}
//                   onChange={(e) => setRelevantDetails(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Button variant="contained" color="primary" onClick={handleSubmit}>
//                   Submit
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>

//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={6000}
//           onClose={() => setSnackbarOpen(false)}
//           message="Item details submitted!"
//         />
//       </Box>
      
//     </div>
//   )
// }

// export default ItemLostRequest

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

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setUploadedImage(URL.createObjectURL(files[0]));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onRequestSubmit({ ...itemDetails, image: uploadedImage });
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
      status: 'Pending',
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
