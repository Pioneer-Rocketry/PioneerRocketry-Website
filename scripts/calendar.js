function setAPIurl() {
    window.devAPIurl = 'https://dev-api.pioneerrocketry.com';
    window.productionAPIurl = 'https://api.pioneerrocketry.com';
    window.currentAPIurl = null;
    if (localStorage.getItem('currentAPIurl') != null) {
        window.currentAPIurl = localStorage.getItem('currentAPIurl');
    } else {
        if (window.location.hostname === 'dev.pioneerrocketry.com') {
            window.currentAPIurl = devAPIurl;
        } else {
            window.currentAPIurl = productionAPIurl;
        }
    }
    if (window.location.hostname === 'localhost') {
        window.currentAPIurl = 'http://localhost:8787';
    }
}


let calendar;
$(document).ready(function () {
    setAPIurl();
    fetch(`${currentAPIurl}/calendar/getAllEvents`, {
        method: 'GET',
        headers: {
            // Add this header to pull all data
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            try{
                eventsPre = data.result.events;
            }catch(e){
                console.warn('No events found, rendering empty calendar');
                throw new Error('No events found');
            }
            

            const calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                // Enable plugins here
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
                console.log(eventsPre[i]);
                eventsPre[i].url = `${currentAPIurl}/calendar/event/${eventsPre[i].id}`;
                calendar.addEvent(eventsPre[i]);
            }

            console.log('rendering calendar');
            calendar.render();
        })
        
        .catch((error) => {
            console.error('Error:', error);
            console.warn('Rendering Empty Calendar');
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
        });
});
