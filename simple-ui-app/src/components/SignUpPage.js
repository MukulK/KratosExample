// src/components/LoginPage.js

import React, { useState, useEffect } from 'react';
import apiSpring from '../utils/apiSpring';
import { useNavigate } from 'react-router-dom';
import './css/LoginPage.css';
const SignUpPage = () => {
    const [data, setData] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        csrf_token: '',
        traits: {
            email: '',
            name: { first: '', last: '' },
            other: { phone: '', company: '', area: '' },
        },
        password: '',
        method: 'password',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiSpring.get('/proxy/kratos/self-service/registration/browser?return_to=');

                if (response.status === 200) {
                    const responseData = response;
                    setData(responseData);
                } else {
                    const errorData = await response.json();
                    console.log('Initial request failed with status:', response.status, 'and data:', errorData);
                }
                console.log('Response data:', response);

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
            traits: {
                email: formData.traits.email,
                name: {
                    first: formData.traits.name.first,
                    last: formData.traits.name.last,
                },
                other: {
                    phone: formData.traits.other.phone,
                    company: formData.traits.other.company,
                    area: formData.traits.other.area,
                }

            },
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nameParts = name.split('.');

        if (nameParts.length === 1) {
            setFormData({ ...formData, [name]: value });
        } else if (nameParts.length === 2) {
            setFormData({ ...formData, traits: { ...formData.traits, [nameParts[1]]: value } });
        } else if (nameParts.length === 3) {
            setFormData({
                ...formData,
                traits: {
                    ...formData.traits,
                    [nameParts[1]]: { ...formData.traits[nameParts[1]], [nameParts[2]]: value },
                },
            });
        }
    };

    return (
        <>
        <div className="login-container">
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="traits.email"
                            value={formData.traits.email}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="traits.name.first"
                            value={formData.traits.name.first}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="traits.name.last"
                            value={formData.traits.name.last}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Phone:
                        <input
                            type="text"
                            name="traits.other.phone"
                            value={formData.traits.other.phone}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Company:
                        <input
                            type="text"
                            name="traits.other.company"
                            value={formData.traits.other.company}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Area:
                        <input
                            type="text"
                            name="traits.other.area"
                            value={formData.traits.other.area}
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

        <div>
            
        </div>
        </>
    );
};

export default SignUpPage;
