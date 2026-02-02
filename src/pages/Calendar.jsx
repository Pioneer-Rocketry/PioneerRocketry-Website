import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { apiUrls } from '../config/api-urls';
import { useNavigate } from 'react-router-dom';
import LegacyStyles from '../components/LegacyStyles';

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
        <>
            <LegacyStyles />
            <style>{`
                #calendar tbody tr[role='row'] {
                    height: 150px;
                }

                #calendar h2 {
                    color: black !important;
                }
                
                /* Override FullCalendar title color if needed via theme or specific selector */
                .fc-toolbar-title {
                    color: black !important;
                }

                #calendar-container {
                    margin-left: 5vw;
                    margin-right: 5vw;
                    margin-top: 5vh;
                    margin-bottom: 10vh;
                }

                /* Day numbers on the left side */
                .fc .fc-daygrid-day-number {
                    float: left;
                    margin-left: 5px;
                    font-weight: bold;
                    color: #333; /* Ensuring visibility */
                }

                .fc .fc-daygrid-day-top {
                    display: flex;
                    flex-direction: row-reverse;
                    justify-content: flex-end !important;
                }
                
                /* Ensure text in calendar is visible */
                .fc {
                    color: #333;
                }
                
                .fc-col-header-cell-cushion {
                    color: #333;
                }
            `}</style>
            <section>
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
        </>
    );
};

export default Calendar;
