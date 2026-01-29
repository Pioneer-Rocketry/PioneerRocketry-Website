import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { apiUrls } from '../config/api-urls';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    const onNavigate = (newDate) => {
        setDate(newDate);
    };

    const onView = (newView) => {
        setView(newView);
    };

    // Determine API URL
    const getApiUrl = () => {
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:8787';
        }
        return apiUrls.url.baseUrl;
    };

    const currentAPIurl = getApiUrl();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${currentAPIurl}${apiUrls.url.events.getAll}`);
                const data = await response.json();

                if (data && data.result === 'Empty') {
                    console.warn('No events found');
                    setEvents([]);
                } else if (data && data.result && data.result.events) {
                    const formattedEvents = data.result.events.map(event => {
                        // Use moment for robust parsing
                        const start = moment(event.start).toDate();
                        // Default end to start + 1 hour if missing
                        const end = event.end ? moment(event.end).toDate() : moment(start).add(1, 'hours').toDate();

                        return {
                            ...event, // Spread original properties
                            title: event.title || 'Untitled Event', // Ensure title exists
                            start: start,
                            end: end,
                            resourceId: event.id
                        };
                    });
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [currentAPIurl]);

    const handleEventClick = (event) => {
        navigate(`/calendar/event/${event.id}`);
    };

    return (
        <>
            <style>{`
                /* Customize React Big Calendar to match previous look */
                .rbc-calendar {
                    height: 800px;
                    color: #333;
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: Arial, sans-serif; /* Reset font to be safe */
                }
                
                .rbc-toolbar-label {
                    color: black;
                    font-size: 1.5em;
                    font-weight: bold;
                }

                /* Force Toolbar to be Flex Row */
                .rbc-toolbar {
                    display: flex !important;
                    flex-direction: row !important;
                    flex-wrap: nowrap !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                }

                .rbc-btn-group {
                    display: flex !important;
                    flex-direction: row !important;
                }
                
                /* RESET Global Button Styles for Calendar */
                .rbc-calendar button {
                    min-width: unset !important;
                    height: unset !important;
                    line-height: unset !important;
                    padding: 0.375rem 0.75rem !important;
                    font-size: 1rem !important;
                    font-weight: normal !important;
                    letter-spacing: normal !important;
                    text-transform: none !important;
                    margin: 0 !important;
                    border-radius: 4px !important;
                    background: none;
                    border: 1px solid #ccc;
                    cursor: pointer;
                }
                
                .rbc-calendar button:hover {
                    background-color: #e6e6e6 !important;
                    color: #333 !important;
                }
                
                .rbc-calendar button.rbc-active {
                    background-color: #337ab7 !important;
                    color: white !important;
                    border-color: #2e6da4 !important;
                }
                
                /* Reset global table styles if they leak in */
                .rbc-calendar table {
                    background: transparent;
                }
                
                .rbc-event {
                    background-color: #378006;
                }
                
                #calendar-container {
                    margin-left: 5vw;
                    margin-right: 5vw;
                    margin-top: 5vh;
                    margin-bottom: 10vh;
                }
            `}</style>
            <section>
                <div id="calendar-container">
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 800 }}
                        onSelectEvent={handleEventClick}
                        views={['month', 'week', 'day']}
                        view={view}
                        date={date}
                        onNavigate={onNavigate}
                        onView={onView}
                    />
                </div>
            </section>
        </>
    );
};

export default Calendar;
