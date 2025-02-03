import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import profileIcon from "../images/profile.jpg"; 
import homeIcon from "../images/home.jpg"; 

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isClicked, setIsClicked] = useState(false); 
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
      setIsClicked(true); 
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
          
          <img
            src={homeIcon}
            alt="Home Icon"
            className="home-icon"
            onClick={() => navigate('/dashboard')}
          />

         
          <h1 className="profile-header">Profile</h1>

         
          <div className="profile-image-container">
            <img
              src={profileIcon}
              alt="Profile"
              className="profile-image"
            />
          </div>

         
          <div className="profile-details-box">
            <p><strong>Vorname:</strong> {profile.firstName}</p>
            <p><strong>Nachname:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>

          
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
