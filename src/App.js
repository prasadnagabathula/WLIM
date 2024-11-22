import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPhotos from './Admin/uploadPhotos';
import SearchPhotos from './searchPhotos';
import SearchItems from './searchItems';
import Login from './Components/Login';
import Home from './Components/Home';
import HomePage from './homePage';
import ProtectedRoute from './Components/ProtectedRoute';
import ItemDetails from './Admin/ItemDetails';
import Profile from './Components/Profile';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    fontFamily: 'Lato, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Lato, Arial, sans-serif',
        },
      },
    },
  },
});

function App() {

  return (

    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/home/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/user/home/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* Add a catch-all route for unknown URLs */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/upload" element={<UploadPhotos />} />
        <Route path="/search" element={<SearchPhotos />} />
        <Route path="/items" element={<SearchItems />} />
        <Route path="/profile" element={<Profile />} />    

      </Routes>
    </Router>
  </ThemeProvider>
    
  );
}

export default App;
