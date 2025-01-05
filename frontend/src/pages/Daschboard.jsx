import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

import profileIcon from "../images/profile.jpg"
import homeIcon from "../images/home.jpg"

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                {/* Home Icon */}
                <img 
                    src={homeIcon}
                    alt="Home Icon" 
                    className="icon home-icon" 
                    onClick={() => navigate('/dashboard')} 
                />
                <h1>Campus Events</h1>
                {/* Profile Icon */}
                <img 
                    src={profileIcon}
                    alt="Profile Icon" 
                    className="icon profile-icon" 
                    onClick={() => navigate('/profile')} 
                />
            </header>
            <main>
                <section>
                    <h2>Meine Schichten</h2>
                    <div className="event-card">Halloween - 13.12.2069</div>
                    <div className="event-card">Weihnachten - 23.4.2204</div>
                </section>
                <footer>
                    <p>Semester Closing: 12.12</p>
                    <p>Semester Start: 07.08.9101</p>
                    <p>Semester Mitte: 2.11.1515</p>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;
