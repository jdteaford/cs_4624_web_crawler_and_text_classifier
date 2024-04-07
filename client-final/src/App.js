import './App.css';
import { createUseStyles } from 'react-jss';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './auth';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import NewCrawl from './pages/NewCrawl';
import CrawlHistory from './pages/CrawlHistory';
import Train from './pages/Train';

// function ProtectedRoute({ children }) {
//   const { isLoggedIn } = useAuth();
//   return isLoggedIn ? children : <Navigate to="/login" />;
// }

const useStyles = createUseStyles({
  movingBackground: {
    animation: '$moveBackground 10s infinite',
    background: 'linear-gradient(to bottom right, #ff8d44, #833636, #660000)',
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  '@keyframes moveBackground': {
    '0%': {
      backgroundSize: '100% 100%',
    },
    '50%': {
      backgroundSize: '200% 200%',
    },
    '100%': {
      backgroundSize: '100% 100%',
    },
  },
});

function App() {
  const classes = useStyles();

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
    <div className='seperate'>
      <div className={classes.movingBackground}></div>
      <div className='router'>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route path="/newcrawl" element={<PrivateRoute><NewCrawl /></PrivateRoute>} />
            <Route path="/crawlhistory" element={<PrivateRoute><CrawlHistory /></PrivateRoute>} />
            <Route path="/train" element={<PrivateRoute><Train /></PrivateRoute>} />
          </Routes>
        </Router>
      </div>

    </div>
  );
}

export default App;
