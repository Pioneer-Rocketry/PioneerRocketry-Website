$(document).ready(function () {
    setAPIurl();
    $('.loginRequired').hide();
    //if the url consist of only numbers the show.
    if (location.host.match(/^[0-9.:]+$/)) {
        $('.loginRequired').show();
        $('#createEventBtn').show();
        $('.loginRequired').show();
        $('.triggerChangeOnLogin').trigger('change');
        $('.triggerClickOnLogin').trigger('click');
    }

    $('#loadPageBtn').on('click', function () {
        const pageName = document.getElementById('pageName').value;
        $.ajax({
            type: 'POST',
            url: `${window.currentAPIurl}/admin/getPage`,
            data: {
                page: pageName,
            },
            success: function (response) {
                console.log('Raw response:', response);
                const parsedResponse = JSON.parse(response);
                console.log('Parsed response:', parsedResponse);

                if (parsedResponse.success === false) {
                    alert('Error: ' + parsedResponse.error);
                    return;
                }
                displayPageData(parsedResponse);
            },
            error: function (error) {
                console.error('AJAX error:', error);
            },
        });
    });
});

function setAPIurl() {
    window.localAPIurl = 'https://dev-api.pioneerrocketry.com';
    window.remoteAPIurl = 'https://api.pioneerrocketry.com';
    window.testingAPIurl = 'https://api.kris-adams3000.workers.dev';
    window.currentAPIurl = null;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.currentAPIurl = localAPIurl;
    } else if (window.location.hostname === 'dev.pioneerrocketry.com') {
        window.currentAPIurl = testingAPIurl;
    } else {
        window.currentAPIurl = remoteAPIurl;
    }
    try {
        //check if the currentAPIurl is valid by calling the api
        fetch(`${currentAPIurl}/calendar/getAllEvents`, {
            method: 'GET',
            headers: {},
        })
            .then((response) => {})
            .catch((error) => {
                window.currentAPIurl = window.testingAPIurl;
            });
    } catch (error) {
        window.currentAPIurl = window.testingAPIurl;
    }
}

async function asyncSetAPIurl() {
    window.localAPIurl = 'http://localhost:8787';
    window.remoteAPIurl = 'https://api.pioneerrocketry.com';
    window.testingAPIurl = 'https://api.kris-adams3000.workers.dev';
    window.currentAPIurl = null;

    // Set initial API URL based on hostname
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.currentAPIurl = window.localAPIurl;
    } else if (window.location.hostname === 'dev.pioneerrocketry.com') {
        window.currentAPIurl = window.testingAPIurl;
    } else {
        window.currentAPIurl = window.remoteAPIurl;
    }

    // Return a promise that resolves with the validated API URL
    return new Promise(async (resolve, reject) => {
        try {
            // Test if the current API URL is valid
            const response = await fetch(`${window.currentAPIurl}/calendar/getAllEvents`, {
                method: 'GET',
            });

            if (response.ok) {
                resolve(window.currentAPIurl);
            } else {
                // If primary URL fails, fallback to testing URL
                window.currentAPIurl = window.testingAPIurl;
                resolve(window.currentAPIurl);
            }
        } catch (error) {
            // If fetch fails, fallback to testing URL
            window.currentAPIurl = window.testingAPIurl;
            resolve(window.currentAPIurl);
        }
    });
}

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
    // ensure the currentAPIurl is set
    await asyncSetAPIurl();
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
    await asyncSetAPIurl();
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
            // Store event id in modal data
            $('#deleteEventModal').data('eventId', event.id);
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteEventModal'));
            deleteModal.show();
        });

        // Only bind once
        $(document).off('click', '#confirmDeleteEventBtn').on('click', '#confirmDeleteEventBtn', function () {
            const eventId = $('#deleteEventModal').data('eventId');
            fetch(`${currentAPIurl}/calendar/removeEvent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId, User: window.user })
            })
            .then(res => res.json())
            .then(data => {
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'));
                if (data.success) {
                    alert('Event deleted successfully!');
                    if (typeof loadEvents === 'function') loadEvents();
                } else {
                    alert('Error deleting event: ' + (data.error || 'Unknown error'));
                }
                deleteModal.hide();
            })
            .catch(err => {
                alert('Error deleting event: ' + err.message);
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteEventModal'));
                deleteModal.hide();
            });
        });
    }
    $('#events').empty().append(table);
}

function updatePage(pageName, config) {
    if (config == null || config == undefined || config == '') {
        console.log('Invalid Config', config);
        return;
    }

    if (pageName == null || pageName == undefined || pageName == '') {
        console.log('Invalid Page Name', pageName);
        return;
    }

    // Make API call to update the page
    return fetch(`${currentAPIurl}/admin/updatePage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: pageName,
            config: {
                ID: config.ID,
                Name: config.Name,
                PageContent: config.PageContent,
                UserAccessLevel: config.UserAccessLevel,
                Modules: config.Modules,
            },
            User: window.user,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                console.log('Page updated successfully');
                return data;
            } else {
                console.error('Failed to update page:', data.error);
                throw new Error(data.error);
            }
        })
        .catch((error) => {
            console.error('Error updating page:', error);
            throw error;
        });
}

// Page Editor Functions
function initializePageEditor() {
    $(document).ready(function () {});
}

function displayPageData(data) {
    console.log('displayPageData called with:', data);
    const tableBody = $('.pageDataBody');
    console.log('Table body element:', tableBody);
    tableBody.empty();

    try {
        if (Array.isArray(data.result)) {
            console.log('Processing array of results');
            data.result.forEach((item) => {
                console.log('Processing item:', item);
                const row = createPageDataRow(item);
                tableBody.append(row);
            });
        } else if (data.result) {
            console.log('Processing single result');
            const row = createPageDataRow(data.result);
            tableBody.append(row);
        } else {
            console.log('No results found in data');
            tableBody.append('<tr><td colspan="5">No data found</td></tr>');
        }
    } catch (error) {
        console.error('Error in displayPageData:', error);
        tableBody.append('<tr><td colspan="5">Error processing data</td></tr>');
    }
}

function createPageContentModal() {
    // Create modal if it doesn't exist
    if (!$('#pageContentEditModal').length) {
        const modal = $(`
            <div class="modal fade" id="pageContentEditModal" tabindex="-1" aria-labelledby="pageContentEditModalLabel">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="pageContentEditModalLabel">Edit Page Content</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="table-responsive">
                                <table class="table table-bordered" id="pageContentTable">
                                    <thead>
                                        <tr>
                                            <th>Section</th>
                                            <th>Content</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <div id="moduleSection" class="mt-4">
                                <h6>Page Modules</h6>
                                <div id="moduleContent" class="table-responsive">
                                    <!-- Module data will be loaded here -->
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="savePageContent">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editModuleModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Module Content</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editModuleForm">
                                <input type="hidden" id="editModuleId">
                                <div class="mb-3">
                                    <label for="editModuleName" class="form-label">Module Name</label>
                                    <input type="text" class="form-control" id="editModuleName">
                                </div>
                                <div class="mb-3">
                                    <label for="editModuleContent" class="form-label">Content</label>
                                    <div id="splitContentArea">
                                        <button type="button" class="form-control btn btn-outline-primary" id="editModuleContent">Edit Module Contents</button>
                                    </div>
                                </div>
                                <div>
                                    <div id="separatedContent" class="mt-3"></div>
                                </div>
                                <div class="mb-3">
                                    <label for="editModuleAccessLevel" class="form-label">Access Level</label>
                                    <input type="number" class="form-control" id="editModuleAccessLevel">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveModuleChanges">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Individual content edit modal -->
            <div class="modal fade " id="individualContentModal" tabindex="-1">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Content</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <textarea class="form-control" id="individualContent" rows="5"></textarea>
                            <div id="livePreview" class="mt-3"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveIndividualContent">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('body').append(modal);

        // Add event handler for content changes
        $('#editModuleContent').on('click', function () {
            parseSeparateContent($(this).val());
        });



        function parseSeparateContent(content) {
            const listOfHiddenClasses = ['moduleSafe'];

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            const separatedContent = $('#separatedContent').empty();

            // Find elements with specific classes (e.g., style1, style2, style3)
            const elements = doc.querySelectorAll('[class]');

            elements.forEach((element, index) => {
                const classNames = element.getAttribute('class');
                const content = element.innerHTML;

                const contentBox = $(`
                <div class="card mb-2 content-box">
                <div class="card-header">
                    Element with class: ${classNames}
                </div>
                <div class="card-body">
                    <button type="button" class="btn btn-outline-primary edit-content-btn" 
                        data-index="${index}" 
                        data-class="${classNames}">
                    Edit Content
                    </button>
                    <div class="content-preview mt-2">
                    ${content}
                    </div>
                </div>
                </div>
            `);

                if (listOfHiddenClasses.some((hiddenClass) => classNames.includes(hiddenClass))) {
                    separatedContent.append(contentBox);
                    contentBox.hide(); // Hide the content box if it contains a hidden class
                } else {
                    separatedContent.append(contentBox);
                }

            });
        }

        // Handle individual content editing
        $(document).on('click', '.edit-content-btn', function () {
            const index = $(this).data('index');
            const className = $(this).data('class');
            const content = $(this).closest('.card-body').find('.content-preview').html();

            $('#individualContent').val(content);
            $('#livePreview').html(content); // Show live preview
            $('#individualContent').off('input')
            $('#individualContent').on('input', function () {
                //parse the html content and show the live preview
                //if its not valid, show the error message
                const content = $(this).val();
                $('#livePreview').html(content); // Update live preview
                try {
                    const parser = new DOMParser();
                    parser.parseFromString(content, 'text/html');
                    
                }catch (error) {
                    console.error('Error parsing HTML:', error);
                    $('#livePreview').html('<div class="alert alert-danger">Invalid HTML content</div>');
                }
            })
            const individualModal = new bootstrap.Modal(document.getElementById('individualContentModal'));

            $('#saveIndividualContent')
                .off('click')
                .on('click', function () {
                    const newContent = $('#individualContent').val();
                    const mainContent = $('#editModuleContent').val();

                    // Update the specific element in the main content
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(mainContent, 'text/html');
                    const elements = doc.querySelectorAll(`[class="${className}"]`);
                    if (elements[index]) {
                        elements[index].innerHTML = newContent;
                        $('#editModuleContent').val(doc.body.innerHTML);
                        parseSeparateContentInModal(doc.body.innerHTML);
                    }

                    individualModal.hide();
                });

            individualModal.show();
        });
    }
}

function createPageDataRow(item) {
    const row = $('<tr>');

    // Create cells with ID and Name as read-only
    const idCell = $('<td>').text(item.ID || '');
    const nameCell = $('<td>').text(item.Name || '');

    // Create content cell with edit button
    const contentCell = $('<td>');
    const contentButton = $('<button>')
        .addClass('btn btn-outline-primary')
        .text('Edit Content')
        .on('click', function () {
            createPageContentModal();
            const modal = new bootstrap.Modal(document.getElementById('pageContentEditModal'));

            try {
                // Parse the content if it's JSON, otherwise use as is
                let content = item.PageContent;
                try {
                    content = JSON.parse(item.PageContent);
                } catch (e) {
                    // If not JSON, create a single row
                    content = { main: item.PageContent };
                }

                // Clear existing table content
                $('#pageContentTable tbody').empty();
                $('#moduleContent').empty();

                // Add rows for each content section
                Object.entries(content).forEach(([section, text]) => {
                    const contentRow = $('<tr>');
                    contentRow.append($('<td>').text(section));
                    contentRow.append($('<td>').append($('<textarea>').addClass('form-control').attr('rows', '5').val(text)));
                    $('#pageContentTable tbody').append(contentRow);
                });

                // Fetch and display modules if they exist
                if (item.Modules) {
                    let moduleIds;
                    try {
                        moduleIds = JSON.parse(item.Modules);
                    } catch (e) {
                        moduleIds = [item.Modules];
                    }

                    // Create module table
                    const moduleTable = $('<table>').addClass('table table-bordered');
                    const moduleHeader = $('<thead>').append($('<tr>').append($('<th>').text('Module ID'), $('<th>').text('Content')));
                    const moduleBody = $('<tbody>');
                    moduleTable.append(moduleHeader, moduleBody);
                    $('#moduleContent').append(moduleTable);

                    // Define mainContent for placeholder detection
                    let mainContent = '';
                    if (content.main) {
                      mainContent = content.main;
                    } else if (typeof content === 'string') {
                      mainContent = content;
                    } else if (typeof content === 'object') {
                      // Use the first section as fallback
                      mainContent = Object.values(content)[0] || '';
                    }

                    // Fetch module data
                    fetch(`${currentAPIurl}/admin/getModule`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            moduleIds: moduleIds,
                            User: window.user,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success && data.result) {
                                // Create a new table with all module details
                                const detailedModuleTable = $('<table>').addClass('table table-bordered');
                                const moduleHeader = $('<thead>').append($('<tr>').append($('<th>').text('ID'), $('<th>').text('Name'), $('<th>').text('Module Content'), $('<th>').text('Access Level'), $('<th>').text('Loaded/Placeholder Present')));
                                const moduleBody = $('<tbody>');

                                data.result.forEach((module) => {
                                    const moduleRow = $('<tr>');
                                    moduleRow.append(
                                        $('<td>').text(module.ID || ''),
                                        $('<td>').text(module.Name || ''),
                                        $('<td>').append(
                                            $('<button>')
                                                .addClass('module-content-preview btn btn-outline-primary')
                                                .css({
                                                    'max-height': '100px',
                                                    'overflow-y': 'auto',
                                                    cursor: 'pointer',
                                                })
                                                .text('Edit Module Content')
                                                .on('click', function () {
                                                    console.log('Module Loaded');
                                                    // Hide the page content modal before showing the module modal
                                                    const pageModal = bootstrap.Modal.getInstance(document.getElementById('pageContentEditModal'));
                                                    if (pageModal) pageModal.hide();
                                                    // Show and fill the static editModuleModal
                                                    $('#editModuleId').val(module.ID);
                                                    $('#editModuleName').val(module.Name);
                                                    $('#editModuleContent').val(module.ModuleContent);
                                                    $('#editModuleAccessLevel').val(module.UserAccessLevel);
                                                    // Parse and preview content
                                                    parseSeparateContentInModal(module.ModuleContent);
                                                    // Show the modal
                                                    const editModuleModal = new bootstrap.Modal(document.getElementById('editModuleModal'));
                                                    editModuleModal.show();
                                                    // When the module modal is closed, show the page content modal again
                                                    $('#editModuleModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                                                        const pageModal = new bootstrap.Modal(document.getElementById('pageContentEditModal'));
                                                        pageModal.show();
                                                    });
                                                    // Handle save module changes
                                                    $('#saveModuleChanges').off('click').on('click', function () {
                                                        const moduleId = $('#editModuleId').val();
                                                        const updatedModule = {
                                                            ID: moduleId,
                                                            Name: $('#editModuleName').val(),
                                                            Content: $('#editModuleContent').val(),
                                                            UserAccessLevel: $('#editModuleAccessLevel').val(),
                                                        };
                                                        // Call API to update module
                                                        fetch(`${currentAPIurl}/admin/updateModule`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify({
                                                                module: updatedModule,
                                                                User: window.user,
                                                            }),
                                                        })
                                                            .then((response) => response.json())
                                                            .then((data) => {
                                                                if (data.success) {
                                                                    bootstrap.Modal.getInstance(document.getElementById('editModuleModal')).hide();
                                                                    // Refresh the module table
                                                                    $('#loadPageBtn').click();
                                                                } else {
                                                                    alert('Error updating module: ' + (data.error || 'Unknown error'));
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                console.error('Error updating module:', error);
                                                                alert('Error updating module: ' + error.message);
                                                            });
                                                    });
                                                    // Live preview and content separation
                                                    $('#editModuleContent').off('input').on('input', function () {
                                                        parseSeparateContentInModal($(this).val());
                                                    });
                                                })
                                        ),
                                        $('<td>').text(module.UserAccessLevel || '0'),
                                        // Placeholder column
                                        (function () {
                                          // Accept both <!--moduleX--> and <!--moduleName-->
                                          const placeholderTag = `<!--module${module.ID}-->`;
                                          const placeholderNameTag = module.Name ? `<!--${module.Name}-->` : '';
                                          const found = mainContent.includes(placeholderTag) || (placeholderNameTag && mainContent.includes(placeholderNameTag));
                                          return $('<td>').html(found ? '✅' : '❌');
                                        })()
                                    );
                                    moduleBody.append(moduleRow);
                                });

                                detailedModuleTable.append(moduleHeader, moduleBody);
                                $('#moduleContent').empty().append(detailedModuleTable);
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching modules:', error);
                            $('#moduleContent').append(
                                $('<div>')
                                    .addClass('alert alert-danger')
                                    .text('Error loading modules: ' + error.message)
                            );
                        });
                } else {
                    $('#moduleContent').append($('<p>').addClass('text-muted').text('No modules associated with this page'));
                }

                // Handle save button click
                $('#savePageContent')
                    .off('click')
                    .on('click', function () {
                        let newContent = {};
                        $('#pageContentTable tbody tr').each(function () {
                            const section = $(this).find('td:first').text();
                            const text = $(this).find('textarea').val();
                            newContent[section] = text;
                        });

                        // If there's only one "main" section, just save the text
                        if (Object.keys(newContent).length === 1 && newContent.main) {
                            item.PageContent = newContent.main;
                        } else {
                            item.PageContent = JSON.stringify(newContent);
                        }

                        enableUpdateButton();
                        modal.hide();
                    });

                modal.show();
            } catch (error) {
                console.error('Error processing content:', error);
                alert('Error processing page content');
            }
        });

    contentCell.append(contentButton);

    // Create editable access level cell
    const accessLevelCell = $('<td>').append(
        $('<input>')
            .attr('type', 'number')
            .addClass('form-control')
            .val(item.UserAccessLevel || 0)
            .on('change', () => enableUpdateButton())
    );

    // Create read-only modules cell
    const modulesCell = $('<td>').text(item.Modules || '');

    // Create update button cell
    const updateButtonCell = $('<td>');
    const updateButton = $('<button>')
        .addClass('btn btn-primary')
        .text('Update')
        .prop('disabled', true)
        .on('click', () =>
            updatePageData(item.Name, {
                ID: parseInt(idCell.text()),
                Name: item.Name,
                PageContent: item.PageContent,
                UserAccessLevel: parseInt(accessLevelCell.find('input').val()),
                Modules: item.Modules,
            })
        );

    updateButtonCell.append(updateButton);

    // Function to enable update button when changes are made
    function enableUpdateButton() {
        updateButton.prop('disabled', false);
    }

    // Append all cells to the row
    row.append(idCell, nameCell, contentCell, accessLevelCell, modulesCell, updateButtonCell);

    return row;
}

function updatePageData(pageName, config) {
    updatePage(pageName, config)
        .then((response) => {
            if (response.success) {
                alert('Page updated successfully!');
                // Refresh the page data
                $('#loadPageBtn').click();
            }
        })
        .catch((error) => {
            alert('Error updating page: ' + error.message);
        });
}

/**
 * Collects and parses event form data for FullCalendar event submission.
 * @param {HTMLFormElement} form - The event creation form element.
 * @returns {Object} - The parsed event object for API submission.
 */
function getEventFormData(form) {
    const eventObj = {};
    for (const el of form.elements) {
        if (!el.name) continue;
        if (el.type === 'checkbox' || el.type === 'radio') continue;
        eventObj[el.name] = el.value;
    }
    // Parse booleans
    [
        'allDay', 'interactive', 'editable', 'startEditable',
        'durationEditable', 'resourceEditable', 'overlap'
    ].forEach(k => {
        if (k in eventObj && eventObj[k] !== "") eventObj[k] = eventObj[k] === 'true';
        else if (eventObj[k] === "") delete eventObj[k];
    });
    // Parse arrays
    if (eventObj.classNames) eventObj.classNames = eventObj.classNames.split(',').map(s => s.trim()).filter(Boolean);
    if (eventObj.resourceIds) eventObj.resourceIds = eventObj.resourceIds.split(',').map(s => s.trim()).filter(Boolean);
    if (eventObj.daysOfWeek) eventObj.daysOfWeek = eventObj.daysOfWeek.split(',').map(Number).filter(n => !isNaN(n));
    // Remove empty optional fields
    Object.keys(eventObj).forEach(k => { if (eventObj[k] === '' || eventObj[k] == null) delete eventObj[k]; });
    // FullCalendar event parsing compliance
    // https://fullcalendar.io/docs/event-parsing
    if (eventObj.start) eventObj.start = new Date(eventObj.start).toISOString();
    if (eventObj.end) eventObj.end = new Date(eventObj.end).toISOString();
    if (eventObj.startRecur) eventObj.startRecur = new Date(eventObj.startRecur).toISOString();
    if (eventObj.endRecur) eventObj.endRecur = new Date(eventObj.endRecur).toISOString();
    return eventObj;
}

/**
 * Submits the event form to the API, using FullCalendar event object structure.
 * @param {HTMLFormElement} form - The event creation form element.
 * @param {Function} [onSuccess] - Optional callback on success.
 * @param {Function} [onError] - Optional callback on error.
 */
async function submitEventForm(form, onSuccess, onError) {
    const eventObj = getEventFormData(form);
    const payload = { event: eventObj };
    if (window.user && window.user.getToken) {
        payload.token = window.user.getToken();
    }
    try {
        const res = await fetch('https://api.pioneerrocketry.com/calendar/addEvent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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

// Helper for parsing and previewing separated content in the modal
function parseSeparateContentInModal(content) {
    const listOfHiddenClasses = ['moduleSafe'];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const separatedContent = $('#separatedContent').empty();
    const elements = doc.querySelectorAll('[class]');
    elements.forEach((element, index) => {
        const classNames = element.getAttribute('class');
        const htmlContent = element.innerHTML;
        const contentBox = $(`
            <div class="card mb-2 content-box">
                <div class="card-header">Element with class: ${classNames}</div>
                <div class="card-body">
                    <button type="button" class="btn btn-outline-primary edit-content-btn" 
                        data-index="${index}" 
                        data-class="${classNames}">
                    Edit Content
                    </button>
                    <div class="content-preview mt-2">${htmlContent}</div>
                </div>
            </div>
        `);
        if (listOfHiddenClasses.some((hiddenClass) => classNames.includes(hiddenClass))) {
            separatedContent.append(contentBox);
            contentBox.hide();
        } else {
            separatedContent.append(contentBox);
        }
    });
    // Individual content edit modal logic
    $(document).off('click', '.edit-content-btn').on('click', '.edit-content-btn', function () {
        const index = $(this).data('index');
        const className = $(this).data('class');
        const content = $(this).closest('.card-body').find('.content-preview').html();
        $('#individualContent').val(content);
        $('#livePreview').html(content);
        $('#individualContent').off('input').on('input', function () {
            const content = $(this).val();
            $('#livePreview').html(content);
            try {
                const parser = new DOMParser();
                parser.parseFromString(content, 'text/html');
            } catch (error) {
                console.error('Error parsing HTML:', error);
                $('#livePreview').html('<div class="alert alert-danger">Invalid HTML content</div>');
            }
        });
        const individualModal = new bootstrap.Modal(document.getElementById('individualContentModal'));
        $('#saveIndividualContent').off('click').on('click', function () {
            const newContent = $('#individualContent').val();
            const mainContent = $('#editModuleContent').val();
            const parser = new DOMParser();
            const doc = parser.parseFromString(mainContent, 'text/html');
            const elements = doc.querySelectorAll(`[class="${className}"]`);
            if (elements[index]) {
                elements[index].innerHTML = newContent;
                $('#editModuleContent').val(doc.body.innerHTML);
                parseSeparateContentInModal(doc.body.innerHTML);
            }
            individualModal.hide();
        });
        individualModal.show();
    });
}
