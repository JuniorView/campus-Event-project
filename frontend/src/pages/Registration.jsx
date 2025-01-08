import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Registration.css';
import profileIcon from "../images/profile.jpg";
import homeIcon from "../images/home.jpg";

const Registration = () => {
    const { event, role } = useParams(); // Get event and role from URL params
    const [userDetails, setUserDetails] = useState(null); // State for user details
    const [shifts, setShifts] = useState([]); // To store the shifts data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state
    const [clickedShifts, setClickedShifts] = useState({}); // Object to track clicked shifts
    const navigate = useNavigate();

   
    const fetchUserDetails = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/details', {
                credentials: 'include', // Send cookies for session authentication
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user details: ${await response.text()}`);
            }

            const data = await response.json();
            console.log("User Details:", data);
            setUserDetails(data); // Store the details in state
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError(error.message);
        }
    };

    // Fetch user details on mount
    useEffect(() => {
        fetchUserDetails();
    }, []);

    // Fetch shifts from the backend
    const fetchShifts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/get-shifts?eventName=${event}&role=${role}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch shifts: ${errorText}`);
            }

            const data = await response.json();
            console.log("Fetched Shifts:", data.timeSlots); 
            
            setShifts(data.timeSlots); // Set the shifts data
            setLoading(false);
        } catch (err) {
            console.error("Error fetching shifts:", err);
            setError(`Failed to fetch shifts: ${err.message || err}`);
            setLoading(false);
        }
    };

    // Fetch shifts on component mount
    useEffect(() => {
        fetchShifts();
    }, [event, role]);

    const handleRegister = async (shift) => {
        try {
            const requestBody = {
                event,
                role,
                startTime: shift.start,
                endTime: shift.end,
                firstName: userDetails?.firstName, // Use fetched user details
                lastName: userDetails?.lastName,
            };

            console.log("Request Body:", requestBody); 

            const response = await fetch('http://localhost:5000/api/events/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                credentials: 'include', // Ensure cookies are sent
            });

            if (!response.ok) {
                throw new Error(`Failed to register shift: ${await response.text()}`);
            }

            const data = await response.json();
            console.log('Shift registered successfully:', data);

            fetchShifts(); 
        } catch (error) {
            console.error('Error registering shift:', error);
            setError(error.message);
        }
    };

    const handleUnregister = async (shift) => {
       
        const [shiftFirstName, shiftLastName] = shift.user?.split(" ") || [];
    
      
        if (
            shiftFirstName !== userDetails?.firstName ||
            shiftLastName !== userDetails?.lastName
        ) {
           
            alert("You can only unregister from shifts you are registered for.");
            return;
        }
    
        try {
            const requestBody = {
                event,
                role,
                startTime: shift.start,
                endTime: shift.end,
            };
    
            console.log("Request Body to Unregister:", requestBody); 
    
            const response = await fetch('http://localhost:5000/api/events/unregister', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                credentials: 'include', // Ensure cookies are sent
            });
    
            if (!response.ok) {
                throw new Error(`Failed to unregister from shift: ${await response.text()}`);
            }
    
            const data = await response.json();
            console.log('Shift unregistered successfully:', data);
    
            fetchShifts(); // Refresh shifts to show the updated status
        } catch (error) {
            console.error('Error unregistering shift:', error);
            setError(error.message);
        }
    };
    
    
    const handleShiftClick = (shift) => {
        const shiftId = `${shift.start}-${shift.end}`; // Unique key for each shift 

        if (shift.status === 'registered' && shift.user?.id === userDetails?.id) {
           
            if (clickedShifts[shiftId] === 'red') {
                setClickedShifts((prev) => {
                    const newState = { ...prev };
                    delete newState[shiftId]; // Reset the clicked state
                    return newState;
                });
                handleUnregister(shift);
            } else {
                setClickedShifts((prev) => ({ ...prev, [shiftId]: 'red' }));
            }
        } else if (shift.status === 'available') {
            // Register logic (click green)
            if (clickedShifts[shiftId] === 'green') {
                setClickedShifts((prev) => {
                    const newState = { ...prev };
                    delete newState[shiftId]; // Reset the clicked state
                    return newState;
                });
                handleRegister(shift);
            } else {
                setClickedShifts((prev) => ({ ...prev, [shiftId]: 'green' }));
            }
        }
    };

    return (
        <div className="registration-container">
            <header className="registration-header">
                <img
                    src={homeIcon}
                    alt="Home Icon"
                    className="icon home-icon"
                    onClick={() => navigate('/dashboard')}
                />
                <h1>{event} - {role}</h1>
                <img
                    src={profileIcon}
                    alt="Profile Icon"
                    className="icon profile-icon"
                    onClick={() => navigate('/profile')}
                />
            </header>

            <div className="registration-page">
                {loading && <p>Loading shifts...</p>}
                {error && <p className="error">{error}</p>}

                <div className="shifts-grid">
    {shifts.map((shift, index) => {
        const shiftId = `${shift.start}-${shift.end}`; // Unique identifier
        return (
            <div 
                key={index} 
                className={`shift-block 
                    ${shift.status === 'registered' ? 'taken' : shift.status === 'available' ? 'available' : ''} 
                    ${clickedShifts[shiftId] === 'green' ? 'green' : ''} 
                    ${clickedShifts[shiftId] === 'red' ? 'red' : ''}`
                }
                onClick={() => handleShiftClick(shift)} // Track click
            >
                <h3>
                    {new Date(shift.start).toLocaleString('en-US', { timeZone: 'UTC' })} - 
                    {new Date(shift.end).toLocaleString('en-US', { timeZone: 'UTC' })}
                </h3>
                <div className="status">
                    {shift.status === 'registered' && shift.user ? (
                        (() => {
                            const [firstName, lastName] = shift.user.split(" ");
                            return <span className="taken-label">Taken by {firstName} {lastName}</span>;
                        })()
                    ) : (
                        <span className="available-label">Available</span>
                    )}
                </div>
            </div>
        );
    })}
</div>
            </div>
        </div>
    );
};

export default Registration;
