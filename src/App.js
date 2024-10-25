// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPhotos from './uploadPhotos';
import SearchPhotos from './searchPhotos';
import SearchItems from './searchItems';
import Login from './Components/Login';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  const role = "Admin";
  return (

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>     
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={`${role === "Admin" ? "admin" : "user"}/home/*`} element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        {/* <Route path="/home/*" element={<Home />} /> */}
        <Route path="/home/*" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        {/* Add a catch-all route for unknown URLs */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/upload" element={<UploadPhotos />} />
        <Route path="/search" element={<SearchPhotos />} />
        <Route path="/items" element={<SearchItems />} />
      </Routes>
    </Router>
  );
}

export default App;
