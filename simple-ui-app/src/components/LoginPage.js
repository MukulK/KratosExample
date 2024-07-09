// src/components/LoginPage.js

import React, { useState, useEffect } from 'react';
import apiSpring from './../utils/apiSpring';
import { useNavigate } from 'react-router-dom';
import './css/LoginPage.css';
const LoginPage = () => {
    const [data, setData] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: 'test@gmail.com',
        password: 'AppaText1234',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiSpring.get('/proxy/kratos/self-service/login/browser?aal=&refresh=&return_to=?aal=&refresh=&return_to=');

                if (response.status === 200) {
                    const responseData = response;
                    setData(responseData);
                    console.log('Response data:', responseData);
                } else {
                    const errorData = await response.json();
                    console.log('Initial request failed with status:', response.status, 'and data:', errorData);
                }

                console.log('Response headers:', response.headers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Execute once on component mount
    }, []);


    const handleSubmitToKratos = async (event) => {
        event.preventDefault();

        if (!data) {
            console.error('No data available.');
            return;
        }

        const { action, nodes } = data.data.ui;
        const csrfToken = nodes[0]?.attributes?.value;

        if (!action || !csrfToken) {
            console.error('Action or CSRF token not found in data.');
            return;
        }

        const submissionData = {
            csrf_token: csrfToken,
            identifier: formData.identifier,
            password: formData.password,
            method: 'password'
        };

        const devAction = action.replace("4433/", "9090/proxy/kratos/");

        try {
            const response = await fetch(devAction, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
                redirect: 'manual',
            });

            console.log('Response status:', response.status);

            if (response.status === 200) {
                console.log('Success:', response);
                navigate('/welcome');
            } else {
                console.log('Non-200 Response:', response);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="login-container">
            <div>
                <label>
                    Email-Id:
                    <input
                        type="email"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <button type="submit" onClick={handleSubmitToKratos}>Submit</button>
        </div>
    );
};

export default LoginPage;
