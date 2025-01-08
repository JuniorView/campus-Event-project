import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EventDetails.css';

import profileIcon from "../images/profile.jpg";
import homeIcon from "../images/home.jpg";

const roles = [
    { id: "bar", label: "Bar" },
    { id: "springer", label: "Springer" },
    { id: "cocktail", label: "Cocktail" },
    { id: "karaoke", label: "Karaoke" },
];

const EventDetails = () => {
    const navigate = useNavigate();
    const { event } = useParams(); 
    const [selectedOption, setSelectedOption] = useState('');

    
    const handleSelection = (e) => {
        setSelectedOption(e.target.value);
    };

    
    const goToRegistrationPage = () => {
        if (selectedOption) {
            navigate(`/registration/${event}/${selectedOption}`);
        } else {
            alert("Please select a shift before proceeding.");
        }
    };

    return (
        <div className="page-container">
            <div className="event-box">
                <header className="header">
                    <img
                        src={homeIcon}
                        alt="Home Icon"
                        className="icon home-icon"
                        onClick={() => navigate('/dashboard')}
                    />
                    <h1>Event: {event}</h1>
                    <img
                        src={profileIcon}
                        alt="Profile Icon"
                        className="icon profile-icon"
                        onClick={() => navigate('/profile')}
                    />
                </header>

                
                <select
                    className="role-select"
                    value={selectedOption}
                    onChange={handleSelection}
                >
                    <option value="">Select a shift</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.label}
                        </option>
                    ))}
                </select>

                
                {selectedOption && (
                    <div className="info-container">
                        <p className="selection-result">
                            Selected Shift: {roles.find(r => r.id === selectedOption)?.label}
                        </p>
                        <div>
                            <button
                                className="register-btn"
                                onClick={goToRegistrationPage} 
                            >
                                IN TABELLE EINTRAGEN
                            </button>
                        </div>
                        <div>
                            <button
                                className="info-btn"
                                onClick={() => navigate(`/eventdetails/${event}/${selectedOption}/event-info`)}
                            >
                                Event Info
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
