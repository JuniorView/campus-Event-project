import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MeineSchichten.css";
import profileIcon from "../images/profile.jpg";
import homeIcon from "../images/home.jpg";

const MeineSchichten = () => {
    const [shifts, setShifts] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = 1; // Test User ID 

    useEffect(() => {
        // Fetch shifts for the user
        fetch(`http://localhost:5000/api/events/shifts/user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setShifts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });

        // Fetch events data
        fetch("http://localhost:5000/api/events/")
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((err) => console.error("Error fetching events:", err));
    }, [userId]);

   // Function to create hour blocks (e.g., "10:00-11:00")
const getTimeBlock = (start) => {
    const startHour = new Date(start).getHours();
    return `${startHour}:00 - ${startHour + 1}:00`;
};

// Object to track which roles are assigned to each time block
const shiftTracker = {};
const conflictingBlocks = new Set();

shifts.forEach((shift) => {
    shift.timeslot.forEach((slot) => {
        const timeBlock = getTimeBlock(slot.start);
        const key = `${shift.role}-${shift.event_id}`; // Unique identifier for shift

        // Add shift role-event to the corresponding time block
        if (!shiftTracker[timeBlock]) {
            shiftTracker[timeBlock] = new Set();
        }
        shiftTracker[timeBlock].add(key);

        // If multiple different roles/events exist in the same time block, it's a conflict
        if (shiftTracker[timeBlock].size > 1) {
            conflictingBlocks.add(timeBlock);
        }
    });
});

    if (loading) return <p>Loading shifts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="meine-schichten">
            <header className="meine-schichten-header">
                <img src={homeIcon} alt="Home Icon" className="icon home-icon" onClick={() => navigate("/dashboard")} />
                <h1>Meine Schichten</h1>
                <img src={profileIcon} alt="Profile Icon" className="icon profile-icon" onClick={() => navigate("/profile")} />
            </header>
            <main>
                {shifts.length > 0 ? (
                    <ul className="shift-list">
                        {shifts.map((shift, index) => {
                            const event = events.find((e) => e.id === shift.event_id);
                            return (
                                <li key={index} className="shift-item">
                                    <strong>Event:</strong> {event ? event.name : "Unknown"} <br />
                                    <strong>Role:</strong> {shift.role} <br />
                                    {shift.timeslot.map((slot) => {
                                        const timeBlock = getTimeBlock(slot.start);
                                        const isConflicting = conflictingBlocks.has(timeBlock);
                                        return (
                                            <div key={slot.id} className={`time-block ${isConflicting ? "conflict" : ""}`}>
                                                ⏳ {timeBlock}
                                            </div>
                                        );
                                    })}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Keine Schichten gefunden.</p>
                )}
                
            </main>
        </div>
    );
};

export default MeineSchichten;
