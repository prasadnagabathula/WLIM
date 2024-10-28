import React, { useState } from 'react'
import { Grid, Paper, Typography, TextField, Button, Box, IconButton, InputAdornment } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import axios from './AuthService';
import { useNavigate } from 'react-router-dom';

function Login({myRole}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 3; // Password must be at least 6 characters
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Remove the error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Remove the error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setError('');
    if (!email) {
      setEmailError('Email is required.')
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.')
      isValid = false;
    } else
      if (!validatePassword(password)) {
        setPasswordError('Password must be at least 4 characters.');
        isValid = false;
      }
    if (!isValid) {
      return; // Stop the form submission if validation fails
    }
    try {
      const response = await axios.post(`http://172.17.31.61:5241/api/Login?emailId=${email}&password=${password}`);

      if (response.status === 200) {
        localStorage.setItem('oauth2', response.data.token);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userData', JSON.stringify({ name: response.data.name, role: response.data.role, email, photo: null }));
        myRole(response.data.role);
        // Now you can retrieve the role
        const userRole = response.data.role;
        console.log('User role:', userRole);
        const homeURL = `${userRole.toLowerCase() === 'admin' ? 'admin' : 'user'}/home`;

        navigate(homeURL);
      }
    } catch (err) {
      setError('Invalid Email or password.');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundImage: 'url(/loginbg.avif)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1,
          },
        }}
      >
        {/* Center Container Box */}
        <Grid
          container
          component={Paper}
          elevation={6}
          sx={{
            zIndex: 2,
            width: { xs: '90%', md: '60%' },
            height: '70vh',
            display: 'flex',
            backgroundColor: 'transparent'
          }}
        >
          {/* Left Half - Welcome Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 170, 231, 0.4)',
              p: 3,
            }}
          >
            <Box sx={{
              '& > *': {
                textAlign: 'center'
              }
            }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                Warehouse Lost Items <br />Management
              </Typography>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Tracking Every Item: Because Every Asset Counts
              </Typography>
            </Box>
          </Grid>

          {/* Right Half - Login Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#232527',
              p: 3,
              flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <img src='/miraclelogo.png' alt="Miracle Logo" style={{ width: '160px' }} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                Login to your account
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '80%' }}>
                <TextField
                  variant="standard"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  placeholder="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleEmailChange}
                  error={Boolean(emailError)}
                  helperText={emailError}
                  InputProps={{
                    sx: { color: 'white' },
                    endAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleOutlinedIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />
                <TextField
                  variant="standard"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  placeholder="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  error={Boolean(passwordError)}
                  helperText={passwordError}
                  InputProps={{
                    sx: { color: 'white' },
                    endAdornment: (
                      <InputAdornment position="start">
                        <HttpsOutlinedIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: '#00aae7', color: 'white' }}
                >
                  Login
                </Button>
                <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', mt: 7 }}>
                  © 2024 Miracle Software Systems, Inc.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Login
