function repairEvent(event) {
    // Default values for missing fields
    const defaults = {
        id: null,
        groupId: null,
        allDay: false,
        start: null,
        end: null,
        daysOfWeek: null,
        startTime: null,
        endTime: null,
        startRecur: null,
        endRecur: null,
        title: 'Untitled Event',
        url: null,
        interactive: true,
        className: null,
        classNames: null,
        editable: false,
        startEditable: false,
        durationEditable: false,
        resourceEditable: false,
        resourceId: null,
        resourceIds: null,
        display: null,
        overlap: false,
        constraint: null,
        color: '#000000',
        backgroundColor: '#000000',
        borderColor: '#000000',
        textColor: '#000000',
        rrule: null,
        duration: null,
    };

    // Ensure each property has a valid value, or use default
    for (const key in defaults) {
        if (!event.hasOwnProperty(key) || event[key] === '' || event[key] === 'null') {
            event[key] = defaults[key];
        }
    }

    // Convert strings to boolean where necessary
    event.allDay = event.allDay === 'true';
    event.interactive = event.interactive === 'true';
    event.editable = event.editable === 'true';
    event.startEditable = event.startEditable === 'true';
    event.durationEditable = event.durationEditable === 'true';
    event.resourceEditable = event.resourceEditable === 'true';
    event.overlap = event.overlap === 'true';

    // Convert daysOfWeek from string to array if necessary
    if (typeof event.daysOfWeek === 'string') {
        try {
            event.daysOfWeek = JSON.parse(event.daysOfWeek);
        } catch (e) {
            event.daysOfWeek = null;
        }
    }

    // Convert classNames and resourceIds from string to array if necessary
    if (typeof event.classNames === 'string') {
        try {
            event.classNames = JSON.parse(event.classNames);
        } catch (e) {
            event.classNames = null;
        }
    }
    if (typeof event.resourceIds === 'string') {
        try {
            event.resourceIds = JSON.parse(event.resourceIds);
        } catch (e) {
            event.resourceIds = null;
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
    fetch('https://api.pioneerrocketry.com/calendar/get_all', {
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
            const repairedEvents = repairEvents(data.result.events);

            const calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                timeZone: 'local',
                events: repairedEvents,
                themeSystem: 'bootstrap5',
                height: '100%',
                contentHeight: 'auto',
                expandRows: true,
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
  
      // Gather basic event data
      const basicEventData = {};
      addIfValid(basicEventData, 'title', formData.get('eventTitle'));
      addIfValid(basicEventData, 'start', dateTimeToUTC(formData.get('eventStartDate')));
      addIfValid(basicEventData, 'end', dateTimeToUTC(formData.get('eventEndDate')));
      addIfValid(basicEventData, 'description', formData.get('eventDescription'));
  
      // Gather advanced event data
      const advancedEventData = {};
      const parseJsonIfValid = (value) => (value ? JSON.parse(value) : '');
  
      // Add advanced fields
      const advancedFields = [
          { key: 'id', value: formData.get('eventId') },
          { key: 'groupId', value: formData.get('eventGroupId') },
          { key: 'allDay', value: formData.get('eventAllDay') === 'true' },
          { key: 'daysOfWeek', value: parseJsonIfValid(formData.get('eventDaysOfWeek')) },
          { key: 'startTime', value: formData.get('eventStartTime') },
          { key: 'endTime', value: formData.get('eventEndTime') },
          { key: 'startRecur', value: formData.get('eventStartRecur') },
          { key: 'endRecur', value: formData.get('eventEndRecur') },
          { key: 'title', value: formData.get('eventTitle') },
          { key: 'url', value: formData.get('eventUrl') },
          { key: 'interactive', value: formData.get('eventInteractive') === 'true' },
          { key: 'className', value: formData.get('eventClassName') },
          { key: 'classNames', value: parseJsonIfValid(formData.get('eventClassNames')) },
          { key: 'editable', value: formData.get('eventEditable') === 'true' },
          { key: 'startEditable', value: formData.get('eventStartEditable') === 'true' },
          { key: 'durationEditable', value: formData.get('eventDurationEditable') === 'true' },
          { key: 'resourceEditable', value: formData.get('eventResourceEditable') === 'true' },
          { key: 'resourceId', value: formData.get('eventResourceId') },
          { key: 'resourceIds', value: parseJsonIfValid(formData.get('eventResourceIds')) },
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
      advancedFields.forEach(({ key, value, condition }) => addIfValid(advancedEventData, key, value, condition));
  
      // Combine basic and advanced data into a single object
      const eventData = {
          CalanderEvent: { ...basicEventData, ...advancedEventData },
          User: window.user,
      };
  
      console.log(eventData);
  
      try {
          // Send data to the backend for insertion into the database
          const response = await fetch('https://api.pioneerrocketry.com/calendar/create_event', {
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
