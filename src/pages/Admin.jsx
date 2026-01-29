import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { apiUrls } from '../config/api-urls';

const clientId = '663378314498-3g2pd0cjt832jjv09i16k9brf8jb8n0p.apps.googleusercontent.com';

const AdminDashboard = () => {
    const [token, setToken] = useState(localStorage.getItem('JWT'));
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    // const [images, setImages] = useState([]);

    // Determine API URL
    const getApiUrl = () => {
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:8787';
        }
        return apiUrls.url.baseUrl;
    };
    const currentAPIurl = getApiUrl();

    const handleLoginSuccess = async (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.auth.googleLogin}`, {
                method: apiUrls.methods.auth.googleLogin,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });
            const data = await response.json();
            console.log('Backend Login Response:', data);

            let flags = data.result?.flags;
            if (parseFloat(flags) >= 2.0) {
                localStorage.setItem('JWT', credentialResponse.credential);
                setToken(credentialResponse.credential);
                // Load data
                loadData();
            } else {
                alert('Insufficient permissions (Flags: ' + flags + ')');
            }
        } catch (error) {
            console.error('Login backend error:', error);
            alert('Login failed connecting to backend');
        }
    };

    const handleLoginError = () => {
        console.log('Login Failed');
    };

    const loadData = async () => {
        // Load events as an example
        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.events.getAll}`);
            const data = await response.json();
            if (data.result && data.result.events) {
                setEvents(data.result.events);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    useEffect(() => {
        if (token) {
            loadData();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('JWT');
        setToken(null);
    };

    if (!token) {
        return (
            <div className="container wrapper" style={{ marginTop: '5rem', textAlign: 'center' }}>
                <h1>Admin Login</h1>
                <div style={{ display: 'inline-block', marginTop: '2rem' }}>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                        theme="filled_black"
                        size="large"
                        shape="rectangular"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container wrapper" style={{ marginTop: '2rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Admin Dashboard</h1>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h2>Event Manager</h2>
                </div>
                <div className="card-body">
                    <p>Manage club events here.</p>
                    {events.length === 0 ? (
                        <p>No events found or loading...</p>
                    ) : (
                        <div className="list-group">
                            {events.map((ev) => (
                                <div key={ev.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{ev.title}</h5>
                                        <small>{new Date(ev.start).toLocaleDateString()}</small>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">ID: {ev.id}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="alert alert-info">
                Full admin functionality (User handling, Image uploads, etc.) requires porting the specific JS logic from the legacy <code>js/api/</code> folders.
                This dashboard demonstrates authentication and event fetching.
            </div>
        </div>
    );
};

const Admin = () => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AdminDashboard />
        </GoogleOAuthProvider>
    );
};

export default Admin;
