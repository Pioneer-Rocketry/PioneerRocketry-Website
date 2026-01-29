import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { apiUrls } from '../config/api-urls';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

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
                        // Ensure start/end times are parsed correctly if separate fields exist
                        // The original code handled startTime/endTime splitting
                        let start = event.start;
                        let end = event.end;

                        return {
                            ...event,
                            start: start,
                            end: end,
                            // We don't set 'url' property here to avoid FullCalendar default navigation
                            // We handle click via eventClick
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

    const handleEventClick = (info) => {
        info.jsEvent.preventDefault(); // Prevent default browser navigation if 'url' was set
        navigate(`/calendar/event/${info.event.id}`);
    };

    return (
        <section className="wrapper">
            <h1 className="text-center" style={{ marginTop: '2rem' }}>Meetings are Held Every Tuesday at 5:33PM</h1>
            <div id="calendar-container" style={{ margin: '5vh 5vw 10vh 5vw' }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    timeZone="local"
                    themeSystem="bootstrap5"
                    height="auto"
                    contentHeight="auto"
                    expandRows={true}
                    headerToolbar={{
                        left: 'title',
                        center: 'prev next today',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                />
            </div>
        </section>
    );
};

export default Calendar;
