import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <header>
                <h1>Campus Events</h1>
                <p>Willkommen zu deinen Events!</p>
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
