import { toastMessage } from "../ui/toasts.js";

export async function submitEventForm(form, onSuccess, onError) {
    const eventObj = getEventFormData(form);
    const payload = { event: eventObj };
    if (localStorage.getItem('JWT')) {
        payload.token = localStorage.getItem('JWT');
    } else {
        console.error('No JWT found in localStorage');
        if (typeof onError === 'function') onError(new Error('No JWT found'));
        return;
    }
    try {
        const res = await fetch('https://api.pioneerrocketry.com/calendar/addEvent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok && result.success) {
            if (typeof onSuccess === 'function') onSuccess(result);
        } else {
            if (typeof onError === 'function') onError(result);
        }
    } catch (err) {
        if (typeof onError === 'function') onError(err);
    }
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
    //there needs to be a form for editing an event.

    for (const event of response.result.events) {
        let row = $('<tr>').appendTo(table);

        let cellName = $('<td>').text(event.title).appendTo(row);
        let cellDescription = $('<td>').text(event.description).appendTo(row);
        let cellStart = $('<td>').text(event.start).appendTo(row);
        let cellEnd = $('<td>').text(event.end).appendTo(row);
        let buttonCell = $('<td>').appendTo(row);

        //   let editButton = $("<button>").attr("id", `${event.id}button`).addClass("btn btn-primary").text("Edit Event").appendTo(buttonCell);
        //   editButton.click(function () {
        //     update = true;
        //     // Get the event object (assuming it's passed to this function)

        //     // Set the modal fields with the event data
        //     $("#eventTitle").val(event.title || "");
        //     $("#eventDescription").val(event.description || "");
        //     //$("#eventStartDate").val(event.start ? formatDateForInput(event.start, event.startTime) : "");
        //     $("#eventStartDate").val(event.start ? UTCToLocalDateTime(event.start) : "");
        //     $("#eventEndDate").val(event.end ? UTCToLocalDateTime(event.end) : "");
        //     $("#eventId").val(event.id || "");
        //     $("#eventGroupId").val(event.groupId || "");
        //     $("#eventAllDay").val(event.allDay !== null ? event.allDay.toString() : "false");

        //     // Set days of the week checkboxes
        //     $("#daysOfWeekButtons input[type=checkbox]").prop("checked", false);
        //     if (event.daysOfWeek) {
        //       event.daysOfWeek.forEach(function (day) {
        //         $(`#daysOfWeekButtons input[value="${day}"]`).prop("checked", true);
        //       });
        //     }
        //     $("#eventDaysOfWeek").val(event.daysOfWeek ? event.daysOfWeek.join(",") : "");

        //     $("#eventStartTime").val(event.startTime || "");
        //     $("#eventEndTime").val(event.endTime || "");
        //     $("#eventStartRecur").val(event.startRecur ? UTCToLocalDateTime(event.startRecur) : "");
        //     $("#eventEndRecur").val(event.endRecur ? UTCToLocalDateTime(event.endRecur) : "");
        //     $("#eventUrl").val(event.url || "");
        //     $("#eventInteractive").val(event.interactive !== null ? event.interactive.toString() : "false");
        //     $("#eventClassName").val(event.className || "");
        //     $("#eventClassNames").val(event.classNames ? event.classNames.join(", ") : "");
        //     $("#eventEditable").val(event.editable !== null ? event.editable.toString() : "false");
        //     $("#eventStartEditable").val(event.startEditable !== null ? event.startEditable.toString() : "false");
        //     $("#eventDurationEditable").val(event.durationEditable !== null ? event.durationEditable.toString() : "false");
        //     $("#eventResourceEditable").val(event.resourceEditable !== null ? event.resourceEditable.toString() : "false");
        //     $("#eventResourceId").val(event.resourceId || "");
        //     $("#eventResourceIds").val(event.resourceIds ? event.resourceIds.join(", ") : "");
        //     $("#eventDisplay").val(event.display || "");
        //     $("#eventOverlap").val(event.overlap !== null ? event.overlap.toString() : "false");
        //     $("#eventConstraint").val(event.constraint || "");
        //     $("#eventColor").val(event.color || "");
        //     $("#eventBackgroundColor").val(event.backgroundColor || "");
        //     $("#eventBorderColor").val(event.borderColor || "");
        //     $("#eventTextColor").val(event.textColor || "");
        //     $("#eventRrule").val(event.rrule || "");
        //     $("#eventDuration").val(event.duration || "");

        //     // Change the submit button text
        //     $("#createEventSubmit").text("Update Event");

        //     // Show the modal
        //     $("#createEventModal").modal("show");
        //   });

        let deleteButton = $('<button>').attr('id', `${event.id}button`).addClass('btn btn-danger').text('Delete Event').appendTo(buttonCell);
        deleteButton.click(function () {
            // Store event id in modal data
            $('#deleteEventModal').data('eventId', event.id);
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteEventModal'));
            deleteModal.show();
        });

        // Only bind once
        $(document)
            .off('click', '#confirmDeleteEventBtn')
            .on('click', '#confirmDeleteEventBtn', function () {
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
                            alert('Event deleted successfully!');
                            if (typeof loadEvents === 'function') loadEvents();
                        } else {
                            alert('Error deleting event: ' + (data.error || 'Unknown error'));
                        }
                        deleteModal.hide();
                    })
                    .catch((err) => {
                        alert('Error deleting event: ' + err.message);
                        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'));
                        deleteModal.hide();
                    });
            });
    }
    $('#events').empty().append(table);
}
