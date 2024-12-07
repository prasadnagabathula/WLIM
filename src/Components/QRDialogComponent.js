import React, { useState, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

const QRDialogComponent = ({ open, onClose, itemCategory, identifiedDate, itemDescription, qrData, binaryData }) => {
  const canvasRef = useRef();
  // Split QR data into two lines
  const midpoint = Math.ceil(qrData.length / 2); // Divide the data roughly in half
  const firstLine = qrData.substring(0, midpoint);
  const secondLine = qrData.substring(midpoint);

  console.log(itemDescription);
  const splitDescription = (text, chunkSize) => {
    const result = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      result.push(text.substring(i, i + chunkSize));
    }
    return result;
  };

  const lines = splitDescription(itemDescription, 38);

  const handlePrint = () => {
    const qrCanvas = canvasRef.current;
    if (qrCanvas) {
        const printWindow = window.open('', '', 'width=600,height=600');

        // Construct the HTML content for printing only the barcode section
        printWindow.document.write('<html><head><title>Print QR Code</title><style>');
        printWindow.document.write(`
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          .qr-container {
            width: 350px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          img {
            width: 100%;
            height: auto;
            margin-top: 10px;
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        printWindow.document.write('<h3>Item QR Code:</h3>');
        
        // QR Code Div
        if (binaryData) {
          const qrDiv = `
            <div class="qr-container">
              <img src="${binaryData}" alt="QR Code" />
            </div>
          `;
          printWindow.document.write(qrDiv);
        }      
                
        printWindow.document.write('<p><strong>QR Code Data:</strong></p>');
        printWindow.document.write(`<p>${firstLine}<br>${secondLine}</p>`);
        
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        
  
      // Wait for the image to fully load before printing
      printWindow.onload = () => {
        printWindow.print();
        setTimeout(() => {
          onClose();
        }, 1000);
      };
    }
  };
  
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        Item Details Uploaded Successfully
      </DialogTitle>

      <DialogContent dividers>
        <Card sx={{ padding: 3, boxShadow: 4, backgroundColor: '#fafafa' }}>
          <CardContent>
            <Typography variant="body1" sx={{ fontSize: 16, marginBottom: 3, textAlign:'center' }}>
              You can now print the QR code for reference.
            </Typography>  
            <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 'bold', marginTop: 1, textAlign:'center' }}>
              QR Code:                          
            </Typography> 

            {/* QR Code Canvas */}
            <Box mt={2} ref={canvasRef} display="flex" justifyContent="center">
              {qrData && <QRCodeCanvas value={qrData} size={200} />}
            </Box>
    
            <Box display="flex">
             <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 'bold', marginTop: 2, marginLeft:2, width:115 }}>
              QR Code Data:                          
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 16, marginTop: 2 }}>              
                {firstLine}
                <br />
                {secondLine}
            </Typography>
            </Box>
            <Box display="flex">
             <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 'bold', marginTop: 2, marginLeft:2, width:115 }}>
              Item Category:                          
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 16, marginTop: 2 }}>              
                {itemCategory}               
            </Typography>
            </Box>
            <Box display="flex" flexDirection="column">
                <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 'bold', marginBottom: 2, marginLeft:2, width:115 }}>
                    Description:
                </Typography>
                {lines.map((line, index) => (
                    <Typography
                    key={index}
                    variant="body1"
                    sx={{ fontSize: 16, marginTop: 2 }}
                    >
                    {line}
                    </Typography>
                ))}
                </Box>
            <Box display="flex">
             <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 'bold', marginTop: 2, marginLeft:2, width:115 }}>
              Identified Date:                          
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 16, marginTop: 2 }}>              
                {identifiedDate}             
            </Typography>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button
          onClick={handlePrint}
          color="primary"
          variant="contained"
          sx={{ marginRight: 2 }}
        >
          Print QR Code
        </Button>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRDialogComponent;
