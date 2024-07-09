// WelcomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WelcomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // Replace with your actual endpoint to fetch user details from Kratos session
                const response = await axios.get('http://127.0.0.1:4433/sessions/me');

                if (response.data) {
                    setUser(response.data); // Assuming response contains user details
                } else {
                    console.error('Failed to fetch user details.');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="welcome-container">
            <h1>Welcome to Your App!</h1>
            {user && (
                <div className="user-details">
                    <p>
                        Logged in as: <strong>{user.username}</strong>
                    </p>
                    <p>
                        Email: <strong>{user.email}</strong>
                    </p>
                    {/* TODO: Add more user details */}
                </div>
            )}
        </div>
    );
};

export default WelcomePage;
