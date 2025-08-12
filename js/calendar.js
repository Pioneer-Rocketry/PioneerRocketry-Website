import { apiUrls } from '../json/api-urls.js';
import { toastMessage } from './ui/toasts.js';
import { Calendar } from "https://cdn.jsdelivr.net/npm/fullcalendar/index.global.min.js";


export function setAPIurl() {
    window.devAPIurl = 'https://dev-api.pioneerrocketry.com';
    window.productionAPIurl = 'https://api.pioneerrocketry.com';
    window.currentAPIurl = null;
    if (localStorage.getItem('currentAPIurl') != null) {
        window.currentAPIurl = localStorage.getItem('currentAPIurl');
    } else {
        if (window.location.hostname === 'dev.pioneerrocketry.com') {
            window.currentAPIurl = window.devAPIurl;
        } else {
            window.currentAPIurl = window.productionAPIurl;
        }
    }
    if (window.location.hostname === 'localhost') {
        window.currentAPIurl = 'http://localhost:8787';
    }
}



export async function initCalendar() {
    setAPIurl();
    try {
        const response = await fetch(`${window.currentAPIurl}${apiUrls.url.events.getAll}`, {
            method: apiUrls.methods.events.getAll,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        let eventsPre;
        try {
            eventsPre = data.result.events;
        } catch (e) {
            toastMessage('No events found, rendering empty calendar', "warning");
            throw new Error('No events found');
        }

        const calendarEl = document.getElementById('calendar');
        window.calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin, bootstrap5Plugin],
            initialView: 'dayGridMonth',
            timeZone: 'local',
            themeSystem: 'bootstrap5',
            height: '100%',
            contentHeight: 'auto',
            expandRows: true,
            headerToolbar: {
                left: 'title',
                center: 'prev next today',
                right: 'dayGridMonth dayGridWeek dayGridDay',
            },
        });

        for (let i = 0; i < eventsPre.length; i++) {
            eventsPre[i].url = `${window.currentAPIurl}/calendar/event/${eventsPre[i].id}`;
            calendar.addEvent(eventsPre[i]);
        }

        calendar.render();
    } catch (error) {
        console.error('Error:', error);
        toastMessage('Rendering Empty Calendar',"danger");
        const calendarEl = document.getElementById('calendar');
        calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin, bootstrap5Plugin],
            initialView: 'dayGridMonth',
            timeZone: 'local',
            events: [],
            themeSystem: 'bootstrap5',
            height: '100%',
            contentHeight: 'auto',
            expandRows: true,
        });
        calendar.render();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initCalendar());
} else {
    initCalendar()
}

