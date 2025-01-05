import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import profileIcon from "../images/profile.jpg"; // Ensure the path is correct
import homeIcon from "../images/home.jpg"; // Ensure the path is correct

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isClicked, setIsClicked] = useState(false); // Track first click
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the profile data when the component mounts
    fetch('http://localhost:5000/api/users/profile', {
      method: 'GET',
      credentials: 'include', // Include the session cookie
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setError('You are not authorized. Please log in.');
      });
  }, []);

  const handleLogout = async () => {
    if (isClicked) {
      // Logic to clear the session and redirect to login
      try {
        await fetch('http://localhost:5000/api/users/logout', {
          method: 'POST',
          credentials: 'include',
        });
        navigate('/');
      } catch (err) {
        console.error('Error logging out:', err);
      }
    } else {
      setIsClicked(true); // Mark the button as clicked once
    }
  };

  return (
    <div className="profile">
      {error ? (
        <div>
          <p className="profile-error">{error}</p>
          <button onClick={() => navigate('/')}>Go to Login</button>
        </div>
      ) : profile ? (
        <div className="profile-box">
          {/* Home Icon */}
          <img
            src={homeIcon}
            alt="Home Icon"
            className="home-icon"
            onClick={() => navigate('/dashboard')}
          />

          {/* Profile Header */}
          <h1 className="profile-header">Profile</h1>

          {/* Profile Picture */}
          <div className="profile-image-container">
            <img
              src={profileIcon}
              alt="Profile"
              className="profile-image"
            />
          </div>

          {/* White Box for Details */}
          <div className="profile-details-box">
            <p><strong>Vorname:</strong> {profile.firstName}</p>
            <p><strong>Nachname:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>

          {/* Logout Button */}
          <div className="logout-btn-container">
            <button
              onClick={handleLogout}
              className={`logout-btn ${isClicked ? 'clicked' : ''}`}
            >
              {isClicked && <span className="logout-symbol">⮌</span>}
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
