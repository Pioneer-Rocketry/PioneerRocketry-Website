function repairEvent(event) {
    // List of keys to check for removal
    const keysToCheck = [
        'id', 'groupId', 'allDay', 'start', 'end', 'daysOfWeek', 'startTime', 'endTime',
        'startRecur', 'endRecur', 'title', 'url', 'interactive', 'className',
        'classNames', 'editable', 'startEditable', 'durationEditable', 'resourceEditable',
        'resourceId', 'resourceIds', 'display', 'overlap', 'constraint',
        'color', 'backgroundColor', 'borderColor', 'textColor', 'rrule', 'duration'
    ];

    // Remove properties that are null, empty strings, or invalid
    for (const key of keysToCheck) {
        if (event[key] === null || event[key] === '' || event[key] === 'null' || event[key] === undefined) {
            delete event[key];
        }
    }

    // Convert strings to boolean where necessary
    if (event.allDay === 'true') event.allDay = true;
    if (event.interactive === 'true') event.interactive = true;
    if (event.editable === 'true') event.editable = true;
    if (event.startEditable === 'true') event.startEditable = true;
    if (event.durationEditable === 'true') event.durationEditable = true;
    if (event.resourceEditable === 'true') event.resourceEditable = true;
    if (event.overlap === 'true') event.overlap = true;

    // Convert daysOfWeek from string to array if necessary
    if (typeof event.daysOfWeek === 'string') {
        try {
            event.daysOfWeek = JSON.parse(event.daysOfWeek);
        } catch (e) {
            delete event.daysOfWeek;
        }
    }

    // Convert classNames and resourceIds from string to array if necessary
    if (typeof event.classNames === 'string') {
        try {
            event.classNames = JSON.parse(event.classNames);
        } catch (e) {
            delete event.classNames;
        }
    }
    if (typeof event.resourceIds === 'string') {
        try {
            event.resourceIds = JSON.parse(event.resourceIds);
        } catch (e) {
            delete event.resourceIds;
        }
    }

    console.log(event);
    return event;
}


function repairEvents(events) {
    return events.map(repairEvent);
}

let calendar;
document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.pioneerrocketry.com/calendar/getAllEvents', {
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
            repairedEvents = repairEvents(data.result.events);

            const calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                // Enable plugins here
                initialView: 'dayGridMonth',
                timeZone: 'local',
                events: repairedEvents,
                themeSystem: 'bootstrap5',
                height: '100%',
                contentHeight: 'auto',
                expandRows: true,

                headerToolbar: {
                    left: 'title',
                    center: 'prev next today',
                    right: 'dayGridMonth dayGridWeek dayGridDay'
                }
            });

            console.log(repairedEvents);
            console.log('rendering calendar');
            calendar.render();
        })
        .then(() => {
            $('#calendar > div.fc-header-toolbar.fc-toolbar > div:nth-child(2)').append($('<button>').attr({ id: 'createEventBtn', type: 'button', class: 'btn btn-primary', 'data-bs-toggle': 'modal', 'data-bs-target': '#createEventModal' }).text('Create New Event').hide());
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

    function dateTimeToUTC(localDatetime) {
        const time = new Date(localDatetime);
        return time.toISOString();
    }
    

    

    document.getElementById('createEventSubmit').addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted');

        const formData = new FormData(document.getElementById('createEventForm'));

        // Utility function to add values to an object if they are valid
        const addIfValid = (obj, key, value, condition = value !== null && value !== undefined && value !== '') => {
            if (condition) {
                obj[key] = value;
            }
        };

        // Convert comma-separated daysOfWeek to an array of integers
        function parseDaysOfWeek(){
            let selectedDaysOfWeek = [];
            $("#daysOfWeekButtons").find("input[type=checkbox]").each(function () {
                if($(this).prop("checked")) {
                    selectedDaysOfWeek.push($(this).val());
                }
            })
            $("#eventDaysOfWeek").val(selectedDaysOfWeek.join(","));
            return selectedDaysOfWeek;
        };

        // Gather basic event data
        const basicEventData = {};
        addIfValid(basicEventData, 'title', formData.get('eventTitle'));
        addIfValid(basicEventData, 'start', dateTimeToUTC(formData.get('eventStartDate')));
        addIfValid(basicEventData, 'end', dateTimeToUTC(formData.get('eventEndDate')));
        addIfValid(basicEventData, 'description', formData.get('eventDescription'));

        // Gather advanced event data
        const advancedEventData = {};

        // Add advanced fields
        const advancedFields = [
            { key: 'id', value: formData.get('eventId') },
            { key: 'groupId', value: formData.get('eventGroupId') },
            { key: 'allDay', value: formData.get('eventAllDay') === 'true' },
            { key: 'daysOfWeek', value: parseDaysOfWeek(formData.get('eventDaysOfWeek')) },  // Adjusted to parse daysOfWeek correctly
            { key: 'startTime', value: formData.get('eventStartTime') },
            { key: 'endTime', value: formData.get('eventEndTime') },
            { key: 'startRecur', value: formData.get('eventStartRecur') },
            { key: 'endRecur', value: formData.get('eventEndRecur') },
            { key: 'url', value: formData.get('eventUrl') },
            { key: 'interactive', value: formData.get('eventInteractive') === 'true' },
            { key: 'className', value: formData.get('eventClassName') },
            { key: 'classNames', value: formData.get('eventClassNames') },
            { key: 'editable', value: formData.get('eventEditable') === 'true' },
            { key: 'startEditable', value: formData.get('eventStartEditable') === 'true' },
            { key: 'durationEditable', value: formData.get('eventDurationEditable') === 'true' },
            { key: 'resourceEditable', value: formData.get('eventResourceEditable') === 'true' },
            { key: 'resourceId', value: formData.get('eventResourceId') },
            { key: 'resourceIds', value: formData.get('eventResourceIds') },
            { key: 'display', value: formData.get('eventDisplay') },
            { key: 'overlap', value: formData.get('eventOverlap') === 'true' },
            { key: 'constraint', value: formData.get('eventConstraint') },
            { key: 'color', value: formData.get('eventColor'), condition: formData.get('eventColor') !== '#000000' },
            { key: 'backgroundColor', value: formData.get('eventBackgroundColor'), condition: formData.get('eventBackgroundColor') !== '#000000' },
            { key: 'borderColor', value: formData.get('eventBorderColor'), condition: formData.get('eventBorderColor') !== '#000000' },
            { key: 'textColor', value: formData.get('eventTextColor'), condition: formData.get('eventTextColor') !== '#000000' },
            { key: 'rrule', value: formData.get('eventRrule') },
            { key: 'duration', value: formData.get('eventDuration') }
        ];

        // Add each advanced field if valid
        advancedFields.forEach(({ key, value, condition = true }) => addIfValid(advancedEventData, key, value, condition));

        // Combine basic and advanced data into a single object
        const eventData = {
            CalendarEvent: { ...basicEventData, ...advancedEventData },
            User: window.user,
        };

        console.log(eventData);

        try {
            // Send data to the backend for insertion into the database
            const response = await fetch('https://api.pioneerrocketry.com/admin/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error('Failed to insert event');
            }

            // Handle success response
            console.log('New Event Inserted Successfully');

            // Optionally, close the modal or reset the form
            $('#createEventModal').modal('hide');
            $('#eventData .toast-body').html('Event created successfully');
            $('#eventData').toast('show');
        } catch (error) {
            // Handle error
            console.error('Error inserting event:', error.message);
            // Optionally, display an error message to the user
        }
    });



});
