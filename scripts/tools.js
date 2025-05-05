window.localAPIurl = "http://localhost:8787";
window.remoteAPIurl = "https://api.pioneerrocketry.com";
window.testingAPIurl = "https://api.kris-adams3000.workers.dev";
window.currentAPIurl = null;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    window.currentAPIurl = localAPIurl;
} else if (window.location.hostname === "dev.pioneerrocketry.com"){
    window.currentAPIurl = testingAPIurl;
} else {
    window.currentAPIurl = remoteAPIurl;
}

//check if the currentAPIurl is valid by calling the api
fetch(`${currentAPIurl}/calendar/getAllEvents`, {
    method: 'GET',
    headers: {},
})
    .then((response) => {})
    .catch((error) => {
        window.currentAPIurl = window.testingAPIurl;
    });


function getAllUsers() {
    $.ajax({
        type: 'GET',
        url: `${currentAPIurl}/users`,
        success: function (data) {
            console.log(data);
        },
    });
}

async function getHeader() {
    return new Promise((resolve, reject) => {
        fetch('./template.html')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Return the text response for the next `.then`
            })
            .then((data) => {
                // Split the data by the header markers and handle potential errors
                const parts = data.split('<!-- Header -->');
                if (parts.length < 3) {
                    throw new Error('Header markers not found');
                }
                resolve(parts[1]); // Get the content between the markers
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                reject(error); // Reject the promise if there was an error
            });
    });
}

async function getFooter() {
    return new Promise((resolve, reject) => {
        fetch('./template.html')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Return the text response for the next `.then`
            })
            .then((data) => {
                // Split the data by the header markers and handle potential errors
                const parts = data.split('<!-- Footer -->');
                if (parts.length < 3) {
                    throw new Error('Header markers not found');
                }
                resolve(parts[1]); // Get the content between the markers
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                reject(error); // Reject the promise if there was an error
            });
    });
}

function dateTimeToUTC(localDatetime) {
    const time = new Date(localDatetime);
    return time.toISOString();
}

function UTCToLocalDateTime(utcDatetime) {
    time = new Date(utcDatetime);
    //get the local time from UTC time
    time = new Date(time.getTime() - time.getTimezoneOffset() * 60000);

    return time.toISOString().replace('Z', '');
}

$(document).ready(function () {
    $('.loginRequired').hide();
    //if the url consist of only numbers the show.
    if (location.host.match(/^[0-9.:]+$/)) {
        $('.loginRequired').show();
        $('#createEventBtn').show();
        $('.loginRequired').show();
        $('.triggerChangeOnLogin').trigger('change');
        $('.triggerClickOnLogin').trigger('click');
    }
});

function formatDateForInput(dateString, timeString) {
    let date = new Date(dateString);

    // Split time into hours and minutes
    if (dateString == null || dateString == undefined || dateString == '') {
        console.log('Invalid Date', dateString);
        return '';
    }
    if (timeString == null || timeString == undefined || timeString == '') {
        console.log('Invalid Time', timeString, 'Attempting to get time from date');
        dateString = date.toISOString().slice(0, 16);
        timeString = date.toISOString().slice(11, 16);
    }

    let [hours, minutes] = timeString.split(':');

    // Set the time part manually to the date object
    date.setHours(hours - 5);
    date.setMinutes(minutes);

    // Return the formatted string for the input field (yyyy-MM-ddTHH:mm)
    return date.toISOString().slice(0, 16);
}
async function loadUsers() {
    if (window.user != null || window.user != undefined || window.user != '') {
        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ User: window.user }),
        };
        let response = await fetch(`${currentAPIurl}/admin/getAllUsers`, settings);
        if (response.ok) {
            createUserTable(await response.json());
        }
    }
}
async function loadEvents() {
    let data = await fetch(`${currentAPIurl}/calendar/getAllEvents`, {
        method: 'GET',
    });
    createEventTable(await data.json());
}
async function changeUser(id, flags, name, email) {
    try {
        const response = await fetch(`${currentAPIurl}/admin/changeUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ChangeUser: {
                    id: id,
                    flags: flags,
                    name: name,
                    email: email,
                },
                User: window.user,
            }),
        });

        const data = await response.json();
        createUserTable(data);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
function createUserTable(response) {
    let table = $('<table>').addClass('table table-hover placeholder-glow placeholder-sm');

    console.log(response);

    for (const user of response.result.users) {
        let row = $('<tr>').appendTo(table);
        let cellName = $('<td>').text(user.name).appendTo(row);
        let cellEmail = $('<td>').text(user.email).appendTo(row);
        let cellId = $('<td>').text(user.id).appendTo(row);

        // Create the dropdown for flags
        let flagSelect = $('<select>').attr('id', `${user.id}flag`).addClass('form-select').append($('<option>').text('Viewer').val(0), $('<option>').text('Member').val(1), $('<option>').text('Helper').val(2), $('<option>').text('Admin').val(3)).val(user.flags); // Set the selected option based on the user's current flag

        let cellFlags = $('<td>').append(flagSelect).appendTo(row);

        // Create the Change User button
        let changeButton = $('<button>')
            .attr('id', `${user.id}button`)
            .addClass('btn btn-primary')
            .text('Change User')
            .prop('disabled', true) // Initially disabled
            .appendTo($('<td>').appendTo(row));

        // Enable/Disable button based on flag selection
        flagSelect.change(function () {
            if ($(this).val() == user.flags) {
                changeButton.prop('disabled', true);
            } else {
                changeButton.prop('disabled', false);
            }
        });

        // Handle the Change User button click
        changeButton.click(function () {
            changeUser(user.id, flagSelect.val(), user.name, user.email);
        });
    }

    // Clear previous table and append the new one
    $('#users').empty().append(table);
}
function createEventTable(response) {
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
            console.log(event);
        });
    }
    $('#events').empty().append(table);
}
