import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './EventInfo.css';
import homeIcon from "../images/home.jpg";
import profileIcon from "../images/profile.jpg";

const EventInfo = () => {
    const navigate = useNavigate();
    const { event, role } = useParams();
    //ToDo: this needs to be pulled form the backend
    const roleDetails = {
        bar: {
            description: "Manage the bar and serve drinks.",
            shift: "6:00 PM - 12:00 AM", //ToDo: calculate this rather then hardcode it
        },
        cocktail: {
            description: "Prepare specialty cocktails.",
            shift: "7:00 PM - 1:00 AM",
        },
        springer: {
            description: "Assist where needed across roles.",
            shift: "Flexible",
        },
        karaoke: {
            description: "Handle karaoke requests and manage the mic.",
            shift: "8:00 PM - 2:00 AM",
        },
    };

    //ToDo: this needs to be pulled form the backend
    const eventDetails = {
        weihnachtsfeier: "A festive Christmas celebration.",
        halloweenparty: "A spooky Halloween party.",
    };

    const eventRoleInfo = roleDetails[role];
    const eventInfo = eventDetails[event];

    if (!eventRoleInfo || !eventInfo) {
        return <div>Invalid event or role.</div>;
    }

    return (
        <div className="event-info">
            <header className="event-info-header">
                <img src={homeIcon} alt="Home Icon" className="icon home-icon" onClick={() => navigate("/dashboard")}/>
                <h1> Eventinfo </h1>
                <img src={profileIcon} alt="Profile Icon" className="icon profile-icon"
                     onClick={() => navigate("/profile")}/>
            </header>

                <h1>{event} - {role}</h1>
                <p><strong>Event Details:</strong> {eventInfo}</p>
                <p><strong>Role Description:</strong> {eventRoleInfo.description}</p>
                <p><strong>Shift:</strong> {eventRoleInfo.shift}</p>


        </div>
    );
};

export default EventInfo;
