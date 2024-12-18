import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Card, CardMedia, CardContent, Modal, Grid, Button, Container, Alert, Snackbar, Paper } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import ImageDisplay from '../imageDisplay';
import DateFormat from '../Components/DateFormat';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ExpiredItems = ({ isDrawerOpen }) => {
    const [userClaims, setUserClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [marginLeft, setMarginLeft] = useState(100);
    const [marginRight, setMarginRight] = useState(100);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [tabs, setTabs] = useState(0);
    const [userName, setUserName] = useState('');

    // Decode token to get the username
    useEffect(() => {
        const token = localStorage.getItem('oauth2');
        if (token) {
            const decoded = jwtDecode(token);
            setUserName(decoded?.UserName);
        }
    }, []);

    // Adjust margins based on drawer state
    useEffect(() => {
        setMarginLeft(isDrawerOpen ? 300 : 100);
        setMarginRight(isDrawerOpen ? 50 : 0);
    }, [isDrawerOpen]);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await axios.get('http://172.17.31.61:5280/api/getAll');
                const allClaims = response.data;
                console.log(allClaims);
                const filteredClaims = allClaims.filter((claim) => {
                    const createdDate = dayjs(claim.createdDate);
                    return dayjs().diff(createdDate, 'day') > 30;
                });

                setUserClaims(filteredClaims);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching claims:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    const handleDonate = async () => {
        if (selectedItemId) {
            try {
                const response = await axios.patch(
                    `http://172.17.31.61:5280/api/update-donated/${selectedItemId}`,
                    JSON.stringify(true), // Send the boolean as JSON
                    {
                        headers: {
                            'Content-Type': 'application/json', // Use application/json
                        },
                    }
                );

                if (response.status === 200) {
                    setUserClaims((prevClaims) =>
                        prevClaims.map((claim) =>
                        claim.id === selectedItemId
                        ? { ...claim, donated: true }
                        : claim
                        )
                        );
                    setMessage('Donated status updated successfully!');
                    setSeverity('success');
                    setSnackbarOpen(true);
                }
                handleClose(); // Close modal after submitting
            } catch (error) {
                console.error('Error updating donated status:', error);
                setMessage('Failed to update donated status. Please try again.');
                setSeverity('error');
                setSnackbarOpen(true);
            }
        } else {
            console.log('Item ID is not defined');
        }
    };

    const handleExpired = async () => {
        if (selectedItemId) {
            try {
                const response = await axios.patch(
                    `http://172.17.31.61:5280/api/update-donated/${selectedItemId}`,
                    JSON.stringify(false), // Send the boolean as JSON
                    {
                        headers: {
                            'Content-Type': 'application/json', // Use application/json
                        },
                    }
                );

                if (response.status === 200) {
                    setUserClaims((prevClaims) =>
                        prevClaims.map((claim) =>
                        claim.id === selectedItemId
                        ? { ...claim, donated: false }
                        : claim
                        )
                        );
                    setMessage('Donated status updated successfully!');
                    setSeverity('success');
                    setSnackbarOpen(true);
                }
                handleClose(); // Close modal after submitting
            } catch (error) {
                console.error('Error updating donated status:', error);
                setMessage('Failed to update donated status. Please try again.');
                setSeverity('error');
                setSnackbarOpen(true);
            }
        } else {
            console.log('Item ID is not defined');
        }
    };

    const calculateAge = (createdDate) => {
        const created = new Date(createdDate);
        const now = new Date();

        const diffInMilliseconds = now - created;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // Convert ms to days

        // const years = Math.floor(diffInDays / 365);
        const months = Math.floor((diffInDays % 365) / 30);
        const days = (diffInDays % 365) % 30;

        // return `${years} years, ${months} months, ${days} days`;
        return `${months} months, ${days} days`;
    };



    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCardClick = (item) => {
        setSelectedItem(item);
        setSelectedItemId(item.id);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };

    const renderClaims = (claims) => {
        return claims.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                    cursor: 'pointer',
                    boxShadow: 3,
                    backgroundColor: item.donated ? '#C1E1C1' : '#D6ECF5',
                    '&:hover': {
                        backgroundColor: item.donated ? '#A5D6A7' : '#C5E1F2'
                    }
                }} onClick={() => handleCardClick(item)}>
                    <CardMedia>
                        <ImageDisplay imageId={item.filePath} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '15px 0' }} />
                    </CardMedia>
                    <CardContent>
                        <Typography sx={{ textAlign: 'left', margin: '0 10px', display: 'grid', gridTemplateColumns: '80px auto', rowGap: 1.5, columnGap: 2 }}>
                            <b>Description:</b> <span style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 2, textOverflow: 'ellipsis' }}>
                                {item.itemDescription}
                            </span>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: 2, ml: { xs: 0, sm: 0, md: `${marginLeft}px` }, mr: `${marginRight}px`, transition: 'margin-left 0.3s' }}>
            <Paper elevation={5} sx={{ width: '100%', height: '100%', p: 2 }}>
                <Container>
                    <Typography variant="h4" gutterBottom sx={{
                        backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 'bold',
                    }}>
                        Items
                    </Typography>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                            <Tabs value={tabs} variant="fullwidth" onChange={(event, newValue) => setTabs(newValue)} aria-label="basic tabs example">
                                <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ReportProblemIcon sx={{ color: tabs === 0 ? '#E97451' : '#888' }} />Expired</Box>} {...a11yProps(0)} />
                                <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ThumbUpAltIcon sx={{ color: tabs === 1 ? '#4CAF50' : '#888' }} />Donated</Box>} {...a11yProps(1)} />
                            </Tabs>
                        </Box>

                        <CustomTabPanel value={tabs} index={0}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>{error}</Typography>
                            ) : userClaims.length === 0 ? (
                                <Typography>No expired items submitted yet.</Typography>
                            ) : (
                                <Grid container spacing={3} justifyContent="flex-start">
                                    {renderClaims(userClaims.filter(item => !item.donated))}
                                </Grid>
                            )}
                        </CustomTabPanel>
                        <CustomTabPanel value={tabs} index={1}>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography>{error}</Typography>
                            ) : userClaims.length === 0 ? (
                                <Typography>No donated items approved yet.</Typography>
                            ) : (
                                <Grid container spacing={3} justifyContent="flex-start">
                                    {renderClaims(userClaims.filter(item => item.donated))}
                                </Grid>
                            )}
                        </CustomTabPanel>
                    </Box>
                    <Modal open={openModal} onClose={handleClose}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            overflowY: 'auto',
                            p: 2,
                        }}>
                            {selectedItem && (
                                <Box sx={{
                                    bgcolor: 'white',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    maxWidth: '80%',
                                    width: '100%',
                                    position: 'relative',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <Box sx={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        backgroundColor: 'white',
                                        borderBottom: '1px solid #e0e0e0',
                                        paddingBottom: 1,
                                        mb: 2,
                                    }}>
                                        <Button onClick={handleClose} sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            zIndex: 20,
                                        }}>
                                            <CloseIcon />
                                        </Button>
                                        <Typography variant="h4" align="center" gutterBottom sx={{
                                            fontWeight: 'bold',
                                            backgroundImage: 'linear-gradient(to left, #00aae7,#770737,#2368a0)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            color: 'transparent',
                                            fontWeight: 'bold',
                                        }}>
                                            {selectedItem.donated === true ? 'Donated Item' : 'Expired Item'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                        gap: 6,
                                        pt: 3,
                                        fontFamily: 'Lato',
                                        background: '#d3eaf5',
                                        height: '100vh',
                                        overflowY: 'scroll',
                                        '&::-webkit-scrollbar': {
                                            width: '5px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#0d416b',
                                            borderRadius: '4px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: 'lightgrey',
                                        },
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'space-between',
                                            flex: 1,
                                        }}>
                                            <ImageDisplay
                                                imageId={selectedItem.filePath}
                                                style={{
                                                    width: '300px',
                                                    height: '300px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                                    border: '2px solid #e0e0e0',
                                                    marginTop: '30px',
                                                    marginLeft: '60px',
                                                }}
                                            />
                                        </Box>

                                        <CardContent sx={{ flex: 2, fontFamily: 'Lato' }}>

                                            <Box sx={{ display: 'grid', gridTemplateColumns: '250px 1fr', rowGap: 1.5, columnGap: 1, fontFamily: 'Lato' }}>
                                                <Typography variant="h6"><b>Description:</b></Typography>
                                                <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '20px' }}>
                                                    {selectedItem.itemDescription}
                                                </Typography>

                                                <Typography variant="h6"><b>Item Category:</b></Typography>
                                                <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '20px' }}>
                                                    {selectedItem.category}
                                                </Typography>

                                                <Typography variant="h6"><b>Location:</b></Typography>
                                                <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '20px' }}>
                                                    {selectedItem.warehouseLocation}
                                                </Typography>

                                                <Typography variant="h6"><b>Comments:</b></Typography>
                                                <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '20px' }}>
                                                    {selectedItem.comments}
                                                </Typography>

                                                <Typography variant="h6"><b>Uploaded By:</b></Typography>
                                                <Typography sx={{ fontSize: '20px' }}>
                                                    {selectedItem.createdBy}
                                                </Typography>

                                                <Typography variant="h6"><b>Identified Date:</b></Typography>
                                                <Typography sx={{ fontSize: '20px' }}>
                                                    <DateFormat date={selectedItem.createdDate} />
                                                </Typography>

                                                <Typography variant="h6"><b>Age:</b></Typography>
                                                <Typography sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '20px' }}>
                                                    {calculateAge(selectedItem.createdDate)}
                                                </Typography>

                                                {selectedItem.donated === false && (
                                                    <Box>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                gap: 4,
                                                                mt: 5,
                                                            }}
                                                        >
                                                            <Box>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleDonate}
                                                                >
                                                                    Donate
                                                                </Button>
                                                            </Box>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={handleClose}
                                                                startIcon={<CancelIcon />}
                                                                sx={{
                                                                    backgroundColor: '#CD7F32',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    '&:hover': {
                                                                        backgroundColor: '#B87333',
                                                                    },
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                )}

                                            </Box>

                                            {selectedItem.donated === true && (
                                                <Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-start',
                                                            ml: 10,
                                                            gap: 4,
                                                            mt: 5,
                                                        }}
                                                    >
                                                        <Box>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={handleExpired}
                                                            >
                                                                Move To Identified Item
                                                            </Button>
                                                        </Box>
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={handleClose}
                                                            startIcon={<CancelIcon />}
                                                            sx={{
                                                                backgroundColor: '#CD7F32',
                                                                color: '#fff',
                                                                border: 'none',
                                                                '&:hover': {
                                                                    backgroundColor: '#B87333',
                                                                },
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Box>
                                </Box>
                            )}
                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={6000}
                                onClose={handleCloseSnackbar}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                sx={{ mb: 2 }}
                            >
                                <Alert
                                    onClose={handleCloseSnackbar}
                                    severity={severity}
                                    sx={{ width: '100%' }}
                                >
                                    {message}
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Modal>
                </Container>
            </Paper>
        </Box>
    );
};

ExpiredItems.propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
};

export default ExpiredItems;
