import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { apiUrls } from '../config/api-urls';
import AdminLayout from '../components/admin/AdminLayout';
import EventManager from '../components/admin/EventManager';

const clientId = '663378314498-3g2pd0cjt832jjv09i16k9brf8jb8n0p.apps.googleusercontent.com';

const AdminDashboard = () => {
    const [token, setToken] = useState(localStorage.getItem('JWT'));
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userProfile, setUserProfile] = useState(null); // Should decode JWT or fetch profile

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
                // Optionally decode token to get user info if needed
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
        setLoadingEvents(true);
        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.events.getAll}`);
            const data = await response.json();
            if (data.result && data.result.events) {
                setEvents(data.result.events);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleCreateEvent = async (eventData) => {
        try {
            const payload = {
                ...eventData,
                token: token
            };

            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.events.create}`, {
                method: apiUrls.methods.admin.events.create,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (data.success || data.result?.success) {
                loadData();
                alert('Event created successfully!');
            } else {
                alert('Failed to create event: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Error creating event');
        }
    };

    useEffect(() => {
        if (token) {
            loadData();
        }
    }, [token]);

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.events.remove}`, {
                method: apiUrls.methods.admin.events.remove,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, id: eventId }),
            });
            const data = await response.json();

            if (data.success || data.result?.success) {
                loadData();
            } else {
                alert('Failed to delete event: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('JWT');
        setToken(null);
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                    <p className="text-gray-400 mb-8">Pioneer Rocketry</p>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginError}
                            theme="filled_black"
                            size="large"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                        Authorized personnel only.
                    </p>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white/80">Total Events</h3>
                                <p className="text-4xl font-bold text-white mt-2">{events.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white/80">System Status</h3>
                                <p className="text-xl font-bold text-white mt-2 flex items-center">
                                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                                    Operational
                                </p>
                            </div>
                            {/* Add more stats here */}
                        </div>

                        <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">Welcome back</h2>
                            <p className="text-gray-400">Select a module from the sidebar to get started.</p>
                        </div>
                    </div>
                );
            case 'events':
                return (
                    <EventManager
                        events={events}
                        loading={loadingEvents}
                        onCreateEvent={handleCreateEvent}
                        onDeleteEvent={handleDeleteEvent}
                    />
                );
            case 'users':
                return <div className="p-10 text-center text-gray-500">User Management Module - Coming Soon</div>;
            case 'images':
                return <div className="p-10 text-center text-gray-500">Image Manager Module - Coming Soon</div>;
            default:
                return <div className="p-10 text-center text-gray-500">Module Under Construction</div>;
        }
    };

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
            {renderContent()}
        </AdminLayout>
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
