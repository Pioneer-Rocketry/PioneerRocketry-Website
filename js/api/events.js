import { apiUrls } from '../../json/api-urls.js';
import { toastMessage } from '../ui/toasts.js';

async function submitEvent(event, mode = 'create') {
    event.preventDefault();
    const form = event.target;
    $('#advancedSettingsCollapse').collapse('show');

    const eventObj = getEventFormData(form);
    const payload = { event: eventObj };

    const url =
        mode === 'edit'
            ? currentAPIurl + apiUrls.url.admin.events.update
            : currentAPIurl + apiUrls.url.admin.events.create;
    const method =
        mode === 'edit'
            ? apiUrls.methods.admin.events.update
            : apiUrls.methods.admin.events.create;

    $.ajax({
        url,
        method,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${localStorage.getItem('JWT') || ''}`,
        },
        dataType: 'json',
        success(result, textStatus, jqXHR) {
            if (jqXHR.status === 200 && result.success) {
                if (typeof loadEvents === 'function') loadEvents();
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createEventModal'));
                modal.hide();
                form.reset();
                toastMessage(
                    mode === 'edit' ? 'Event updated successfully!' : 'Event created successfully!',
                    'success'
                );
            } else {
                toastMessage(
                    `Error ${mode === 'edit' ? 'updating' : 'creating'} event: ` +
                        (result.error || result.errorMessage || 'Unknown error'),
                    'danger'
                );
            }
        },
        error(jqXHR, textStatus, errorThrown) {
            toastMessage(
                `Error ${mode === 'edit' ? 'updating' : 'creating'} event: ` +
                    (jqXHR.responseJSON?.error || textStatus + ': ' + errorThrown),
                'danger'
            );
        },
    });
}

export function getEventFormData(form) {
    const eventObj = {};

    // Gather basic form data
    for (const el of form.elements) {
        console.log(`Processing element: ${el.name} (${el.type})`);
        if (!el.name) continue;
        if (el.type === 'checkbox' || el.type === 'radio') continue;
        eventObj[el.name] = el.value;
    }

    // Parse the 'allDay' checkbox as boolean/number
    const allDayCheckbox = form.elements['allDay'] || form.elements['eventAllDay'];
    if (allDayCheckbox && allDayCheckbox.type === 'checkbox') {
        eventObj.allDay = allDayCheckbox.checked ? 1 : 0;
    }

    // Parse daysOfWeek as array of numbers
    if (eventObj.daysOfWeek) {
        const numbers = eventObj.daysOfWeek
            .split(',')
            .map(Number)
            .filter((n) => !isNaN(n));
        eventObj.daysOfWeek = numbers;
    }

    // Remove empty optional fields
    Object.keys(eventObj).forEach((k) => {
        if (eventObj[k] === '' || eventObj[k] == null) delete eventObj[k];
    });

    return eventObj;
}

export function loadEvents() {
    $.ajax({
        url: apiUrls.url.events.getAll,
        method: apiUrls.methods.events.getAll,
        dataType: 'json',
        success: function (data) {
            if (data.result == 'Empty') {
                toastMessage('No Events Found', 'warning');
                $('#events').empty();
            } else if (data.success == false) {
                toastMessage('Error Loading Events', 'danger');
                $('#events').empty();
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
    headerRow.append($('<th>').text('Title'), $('<th>').text('Start'), $('<th>').text('End'), $('<th>').text('Actions'));
    //there needs to be a form for editing an event.

    for (const event of response.result.events) {
        const row = $('<tr>').appendTo(table);
        const titleCell = $('<td>').text(event.title);
        let startDate = event.start;
        // If the start date has a time, show date and time; otherwise, show only the date.
        if (typeof startDate === 'string' && startDate.indexOf('T') !== -1) {
            startDate = new Date(event.start).toLocaleString();
        } else {
            startDate = new Date(event.start).toLocaleDateString();
        }
        const startCell = $('<td>').text(startDate);
        const endCell = $('<td>').text(event.end ? new Date(event.end).toLocaleString() : 'N/A');
        const buttonCell = $('<td>');
        row.append(titleCell, startCell, endCell, buttonCell);

        const editEventButton = $('<button>').attr('id', `${event.id}editButton`).addClass('btn btn-primary').text('Edit Event').appendTo(buttonCell);

        editEventButton.off('click').on('click', function () {
            editEventModal(event);
        });

        // Delete button
        const deleteButton = $('<button>').attr('id', `${event.id}button`).addClass('btn btn-danger').text('Delete Event').appendTo(buttonCell);

        deleteButton.off('click').on('click', function () {
            $('#deleteEventModal').data('eventId', event.id);
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteEventModal'));
            deleteModal.show();
        });
    }

    // Bind confirm delete button once
    $(document)
        .off('click', '#confirmDeleteEventBtn')
        .on('click', '#confirmDeleteEventBtn', function () {
            const eventId = $('#deleteEventModal').data('eventId');
            fetch(currentAPIurl + apiUrls.url.admin.events.remove, {
                method: apiUrls.methods.admin.events.remove,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('JWT') || '',
                },
                body: JSON.stringify({ id: eventId }),
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

export function editEventModal(event) {
    $('#createEventSubmit').text('Edit Event');
    $('#createEventForm')
        .off()
        .on('submit', async function (event) {
            event.preventDefault();
            submitEvent(event, 'edit');
        });
    const form = $('#createEventForm')[0];
    const dateKeys = new Set(['startRecur', 'endRecur', 'start', 'end']);
    const booleanKeys = new Set(['allDay']);
    const arrayKeys = new Set(['daysOfWeek']);

    //change the name of the button to Update Event
    $('#createEventSubmit').text('Update Event');
    // change the text of the title to Edit Event
    $('#createEventModalLabel').text('Edit Event');

    for (const key in event) {
        if (event[key] === null) continue;
        if (!form.elements[key]) continue;
        if (dateKeys.has(key)) {
            //if the event[key] has no time then we need to set the form element to date
            if (event[key].indexOf('T') === -1) {
                form.elements[key].type = 'date';
            } else {
                form.elements[key].type = 'datetime-local';
            }
            console.log(`Setting ${key} to ${event[key]}`);
            form.elements[key].value = event[key];
        } else if (booleanKeys.has(key)) {
            if (event[key] === '0' || event[key] === 0) {
                form.elements[key].checked = false;
            } else if (event[key] === '1' || event[key] === 1) {
                form.elements[key].checked = true;
                if (key === 'allDay') {
                    $('#eventStart').attr('type', 'date');
                    $('label[for=eventStart]').html(`Start Date <span class='text-danger'>*</span>`);
                    $('#eventEnd').prop('disabled', true);
                }
            } else {
                continue;
            }
        } else if (arrayKeys.has(key)) {
            let daysOfWeek = event[key];
            if (typeof daysOfWeek === 'string') {
                daysOfWeek = JSON.parse(daysOfWeek);
            }
            if (Array.isArray(daysOfWeek)) {
                //for some reason the days are numbers 0-6, so we need to map them to the checkboxes
                daysOfWeek = daysOfWeek.map(String);
                console.log(daysOfWeek);
                for (let day of daysOfWeek) {
                    switch (day) {
                        case '0':
                            day = 'Sun';
                            break;
                        case '1':
                            day = 'Mon';
                            break;
                        case '2':
                            day = 'Tue';
                            break;
                        case '3':
                            day = 'Wed';
                            break;
                        case '4':
                            day = 'Thu';
                            break;
                        case '5':
                            day = 'Fri';
                            break;
                        case '6':
                            day = 'Sat';
                            break;
                        default:
                            console.warn(`Unknown day of week: ${day}`);
                            continue; // Skip unknown days, (if this ever happens the world is gone)
                    }
                    $(`#eventDaysOfWeek${day}`).prop('checked', true);
                }
                $('#eventStartRecur').prop('required', daysOfWeek.length !== 0);
                $('#eventEndRecur').prop('required', daysOfWeek.length !== 0);
                $('label[for=eventStartRecur]').html(`Recurrence Start Date${daysOfWeek.length !== 0 ? " <span class='text-danger'>*</span>" : ''}`);
                $('label[for=eventEndRecur]').html(`Recurrence End Date${daysOfWeek.length !== 0 ? " <span class='text-danger'>*</span>" : ''}`);
            }
        } else {
            form.elements[key].value = event[key];
        }
    }
    // Set the form to edit mode
    form.dataset.mode = 'edit';
    form.dataset.eventId = event.id;
    $('#createEventSubmit').text('Update Event');
    $('#createEventModal').modal('show');
}

export function eventsOnReady() {
    $('#eventAllDay').on('input', () => {
        $('#eventStart').attr('type', $('#eventAllDay').prop('checked') ? 'date' : 'datetime-local');
        $('label[for=eventStart]').html(`Start Date ${$('#eventAllDay').prop('checked') ? '' : 'and Time '}<span class='text-danger'>*</span>`);
        $('label[for=eventEnd]').html(`End Date and Time ${$('#eventAllDay').prop('checked') ? '' : "<span class='text-danger'>*</span>"}`);
        $('#eventEnd').prop('disabled', $('#eventAllDay').prop('checked'));
    });
    // Days of week checkboxes to hidden input
    $('#daysOfWeekButtons input[type="checkbox"]').on('change', function () {
        const selected = $('#daysOfWeekButtons input[type="checkbox"]:checked')
            .map(function () {
                return this.value;
            })
            .get();
        $('#eventDaysOfWeek').val(selected.join(','));
        $('#eventStartRecur').prop('required', selected.length !== 0);
        $('#eventEndRecur').prop('required', selected.length !== 0);
        $('label[for=eventStartRecur]').html(`Recurrence Start Date${selected.length !== 0 ? " <span class='text-danger'>*</span>" : ''}`);
        $('label[for=eventEndRecur]').html(`Recurrence End Date${selected.length !== 0 ? " <span class='text-danger'>*</span>" : ''}`);
    });

    $('#createEventForm').on('submit', async function (event) {
        event.preventDefault();
        submitEvent(event, 'create');
    });
    $('#createEventModal').on('hide.bs.modal', function () {
        $('#createEventForm')
            .off()
            .on('submit', async function (event) {
                event.preventDefault();
                submitEvent(event, 'create');
            });
        
        $('#createEventSubmit').text('Create Event');
        $('#eventStartRecur').prop('required', false);
        $('#eventEndRecur').prop('required', false);
        $('label[for=eventStartRecur]').html(`Recurrence Start Date`);
        $('label[for=eventEndRecur]').html(`Recurrence End Date`);
        $('#advancedSettingsCollapse').collapse('hide');
        $('#eventStart').attr('type', 'datetime-local');
        $('label[for=eventStart]').html(`Start Date and Time <span class='text-danger'>*</span>`);
        $('label[for=eventEnd]').html(`End Date and Time <span class='text-danger'>*</span>`);
        $('#eventEnd').prop('disabled', false);
    });
}
