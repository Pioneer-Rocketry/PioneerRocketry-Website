import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrls } from '../config/api-urls';

const Event = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getApiUrl = () => {
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:8787';
        }
        return apiUrls.url.baseUrl;
    };
    const currentAPIurl = getApiUrl();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Assuming the API returns JSON for a single event. 
                // If the backend returns HTML, we might need a different approach or endpoint.
                // Based on apiUrls structure: events.get: '/events/'
                // This matches events.serve logic in calendar.js which was constructing a URL to visit.
                // Let's try fetching it as JSON.
                // Note: The original code used window.apiUrls.url.events.serve which was /events/.
                // And legacy code redirected user to `${window.currentAPIurl}/events/${id}`.
                // If that endpoint returns HTML, we have an issue.
                // We'll try to fetch. If it fails or returns HTML manifest as text, we'll need to know.
                // But for now, let's assume standard REST behavior or that we can get data.
                // Wait, `events.getAll` returned `result.events`.
                // Maybe we can filter from getAll if single get is not available as JSON?
                // But better to try fetching specific event first.

                const response = await fetch(`${currentAPIurl}${apiUrls.url.events.get}${id}`, {
                    headers: {
                        'Accept': 'application/json' // Try formatting request for JSON
                    }
                });

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setEvent(data);
                } else {
                    // If not JSON, maybe we can't use this endpoint for data.
                    // Fallback: This might be a server-rendered page. 
                    // For conversion, we probably want to REWRITE this to be client side.
                    // But we need the data.
                    // If we can't get data, we might need to ask user/check backend code.
                    // But we don't have backend code.
                    // We'll assume for now it works or we'll handle error.
                    throw new Error("API returned non-JSON response");
                }
            } catch (err) {
                console.error("Failed to fetch event:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id, currentAPIurl]);

    if (loading) return <div className="container wrapper">Loading...</div>;
    if (error) return <div className="container wrapper">Error: {error}. The API might not support JSON for single events.</div>;
    if (!event) return <div className="container wrapper">Event not found</div>;

    // Helper for date formatting
    const formatDate = (dateString, options) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-US', options || {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'long'
        });
    };

    // Helper for days of week
    const formatDays = (daysStr) => {
        if (!daysStr) return 'None';
        // Cleanup string likely like "[1,2]"
        const days = daysStr.toString().replace(/\[|\]/g, '').split(',');
        const map = { '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday' };
        return days.map(d => map[d.trim()] || '').filter(Boolean).join(', ');
    };

    return (
        <div id="page-wrapper">
            <section className="wrapper style2 moduleSafe">
                <div className="title">Event Details</div>
                <div className="container moduleSafe">
                    <div className="row aln-center">
                        <div className="col-12 col-md-8 card-like" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <section className="highlight">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <h2 className="lead mb-3 fs-2">Event: {event.title}</h2>
                                    <p className="mb-4 fs-3">Description: {event.description}</p>

                                    <div className="card-like w-100 mb-4 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title fs-4">Event Timing</h5>
                                            <div className="row mb-2">
                                                <div className="col-sm-4 text-muted fs-4">Start:</div>
                                                <div className="col-sm-8 fs-4">{formatDate(event.start)}</div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-sm-4 text-muted fs-4">End:</div>
                                                <div className="col-sm-8 fs-4">{formatDate(event.end)}</div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-sm-4 text-muted fs-4">All Day:</div>
                                                <div className="col-sm-8 fs-4">{event.allDay ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-4 text-muted fs-4">Repeats:</div>
                                                <div className="col-sm-8 fs-4">{formatDays(event.daysOfWeek)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="actions">
                                        <li>
                                            <a href={event.url || '#'} className="button style1" target="_blank" rel="noopener noreferrer">Event Link</a>
                                        </li>
                                        {/* ICS download logic could be added here similar to original */}
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Event;
