import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import profileIcon from "../images/profile.jpg";
import homeIcon from "../images/home.jpg";

const Dashboard = () => {
    const navigate = useNavigate();
    
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
    const sanitizeForUrl = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-'); // Convert to lowercase and replace non-alphanumerics with hyphens
    };

    
    useEffect(() => {
        fetch('http://localhost:5000/api/events') 
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching events');
                }
                return response.json();
            })
            .then((data) => {
                setEvents(data);  
                setLoading(false); 
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false); 
            });
    }, []);

    
    const handleEventClick = (event) => {
        const sanitizedEventName = sanitizeForUrl(event.name);
        navigate(`/event-details/${sanitizedEventName}`); 
    };

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                
                <img
                    src={homeIcon}
                    alt="Home Icon"
                    className="icon home-icon"
                    onClick={() => navigate('/dashboard')}
                />
                <h1>Campus Events</h1>
                
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
                    
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div
                                key={event._id}  
                                className="event-card"
                                onClick={() => handleEventClick(event)} 
                            >
                                {event.name} - {new Date(event.date).toLocaleDateString()}
                            </div>
                        ))
                    ) : (
                        <p>No events available</p>
                    )}
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
