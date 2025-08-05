import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome to Polipine!🌟</h1>
        {isAuthenticated ? (
          <>
            <p className="welcome-text">
              Welcome back, @{user.username}! Ready to share your political opinions?
            </p>
            <div className="home-actions">
              <Link to="/polipions" className="home-btn primary">
                View All Polipions
              </Link>
              <Link to="/my-polipions" className="home-btn secondary">
                My Polipions
              </Link>
              <Link to="/new" className="home-btn secondary">
                Create New Polipion
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="welcome-text">
              Your platform to share and discover political opinions from around the world
            </p>
            <div className="home-actions">
              <Link to="/register" className="home-btn primary">
                Join Polipine
              </Link>
              <Link to="/login" className="home-btn secondary">
                Login
              </Link>
            </div>
          </>
        )}
        <div className="welcome-image">
          <span className="political-emoji">🗳️🏛️📊🌍</span>
        </div>
      </div>
    </div>
  );
};

export default Home; 