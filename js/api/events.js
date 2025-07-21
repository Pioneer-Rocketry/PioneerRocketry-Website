import { toastMessage } from "../ui/toasts.js";

export function submitEventForm(form, onSuccess, onError) {
    const eventObj = getEventFormData(form);
    const payload = { event: eventObj };
    if (localStorage.getItem('JWT')) {
        payload.token = localStorage.getItem('JWT');
    } else {
        console.error('No JWT found in localStorage');
        if (typeof onError === 'function') onError(new Error('No JWT found'));
        return;
    }
    $.ajax({
        url: `${window.currentAPIurl}/calendar/createEvent`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        dataType: 'json',
        success: function(result, textStatus, jqXHR) {
            if (jqXHR.status === 200 && result.success) {
                if (typeof onSuccess === 'function') onSuccess(result);
            } else {
                if (typeof onError === 'function') onError(result);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (typeof onError === 'function') onError(new Error(textStatus + ': ' + errorThrown));
        }
    });
}

export function getEventFormData(form) {
    const eventObj = {};
    for (const el of form.elements) {
        if (!el.name) continue;
        if (el.type === 'checkbox' || el.type === 'radio') continue;
        eventObj[el.name] = el.value;
    }
    // Parse booleans
    ['allDay', 'interactive', 'editable', 'startEditable', 'durationEditable', 'resourceEditable', 'overlap'].forEach((k) => {
        if (k in eventObj && eventObj[k] !== '') eventObj[k] = eventObj[k] === 'true';
        else if (eventObj[k] === '') delete eventObj[k];
    });
    // Parse arrays
    if (eventObj.classNames)
        eventObj.classNames = eventObj.classNames
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    if (eventObj.resourceIds)
        eventObj.resourceIds = eventObj.resourceIds
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    if (eventObj.daysOfWeek)
        eventObj.daysOfWeek = eventObj.daysOfWeek
            .split(',')
            .map(Number)
            .filter((n) => !isNaN(n));
    // Remove empty optional fields
    Object.keys(eventObj).forEach((k) => {
        if (eventObj[k] === '' || eventObj[k] == null) delete eventObj[k];
    });
    // FullCalendar event parsing compliance
    // https://fullcalendar.io/docs/event-parsing
    if (eventObj.start) eventObj.start = new Date(eventObj.start).toISOString();
    if (eventObj.end) eventObj.end = new Date(eventObj.end).toISOString();
    if (eventObj.startRecur) eventObj.startRecur = new Date(eventObj.startRecur).toISOString();
    if (eventObj.endRecur) eventObj.endRecur = new Date(eventObj.endRecur).toISOString();
    return eventObj;
}

export function loadEvents() {
    $.ajax({
        url: `${currentAPIurl}/calendar/getAllEvents`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.success == false) {
                toastMessage('No Events Found', 'warning');
            } else {
                createEventTable(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastMessage('Error loading events: ' + textStatus + ' ' + errorThrown, 'danger');
        },
    });
}

export function createEventTable(response) {
    let table = $('<table>').addClass('table table-hover placeholder-glow placeholder-sm');
    let thead = $('<thead>').appendTo(table);
    let headerRow = $('<tr>').appendTo(thead);
    headerRow.append(
        $('<th>').text('Title'),
        $('<th>').text('Start'),
        $('<th>').text('End'),
        $('<th>').text('Actions')
    );
    //there needs to be a form for editing an event.

    for (const event of response.result.events) {
        const row = $('<tr>').appendTo(table);
        const titleCell = $('<td>').text(event.title).appendTo(row);
        const startCell = $('<td>').text(new Date(event.start).toLocaleString()).appendTo(row);
        const endCell = $('<td>').text(event.end ? new Date(event.end).toLocaleString() : 'N/A').appendTo(row);
        const buttonCell = $('<td>').appendTo(row);

        const viewDetailsButton = $('<button>').attr('id', `${event.id}viewButton`).addClass('btn btn-primary').text('View Details').appendTo(buttonCell);

        viewDetailsButton.off('click').on('click', function () {
            const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
            // for now append the data to the modal body
        });



        // Delete button
        const deleteButton = $('<button>')
            .attr('id', `${event.id}button`)
            .addClass('btn btn-danger')
            .text('Delete Event')
            .appendTo(buttonCell);

        deleteButton.off('click').on('click', function () {
            $('#deleteEventModal').data('eventId', event.id);
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteEventModal'));
            deleteModal.show();
        });
    }

    // Bind confirm delete button once
    $(document).off('click', '#confirmDeleteEventBtn').on('click', '#confirmDeleteEventBtn', function () {
        const eventId = $('#deleteEventModal').data('eventId');
        fetch(`${currentAPIurl}/calendar/removeEvent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: eventId, token: localStorage.getItem('JWT') || '' }),
        })
            .then((res) => res.json())
            .then((data) => {
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'));
                if (data.success) {
                    toastMessage('Event deleted successfully!');
                    if (typeof loadEvents === 'function') loadEvents();
                } else {
                    toastMessage('Error deleting event: ' + (data.error || 'Unknown error'));
                }
                deleteModal.hide();
            })
            .catch((err) => {
                toastMessage('Error deleting event: ' + err.message);
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'));
                deleteModal.hide();
            });
    });
    $('#events').empty().append(table);
}
