
function setAPIurl() {
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
let calendar;
async function initCalendar() {
    setAPIurl();
    try {
        const response = await fetch(`${window.currentAPIurl}${apiUrls.url.events.getAll}`, {
            method: apiUrls.methods.events.getAll,
        });

        const data = await response.json();
        let eventsPre;
        if (data && data.result == "Empty"){
            toastMessage('No events found, rendering empty calendar', 'warning');
            throw new Error('No events found');
        }else{
            eventsPre = data.result.events;
            console.log(eventsPre);
        }

        const calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
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
            eventsPre[i].url = `${window.currentAPIurl}${window.apiUrls.url.events.serve}${eventsPre[i].id}`;
            console.log(eventsPre[i]);
            calendar.addEvent(eventsPre[i]);
        }

        calendar.render();
    } catch (error) {
        console.error('Error:', error);
        toastMessage('Rendering Empty Calendar', 'danger');
        const calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
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
