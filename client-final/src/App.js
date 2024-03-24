import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './auth';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';

// function ProtectedRoute({ children }) {
//   const { isLoggedIn } = useAuth();
//   return isLoggedIn ? children : <Navigate to="/login" />;
// }

function App() {

  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     fetch('/verify_token', { 
  //       method: 'GET',
  //       headers: new Headers({
  //         "x-access-tokens": token,
  //         "Content-Type": "application/json"
  //       }),
  //     })
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json(); // Assuming the server responds with some JSON data
  //       }
  //       throw new Error('Network response was not ok.');
  //     })
  //     .then(data => {
  //       console.log(data); // Process your server response here
  //       setIsAuthenticated(true);
  //     })
  //     .catch(error => {
  //       console.error('There has been a problem with your fetch operation:', error);
  //       setIsAuthenticated(false);
  //     });
  //   }
  // }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
