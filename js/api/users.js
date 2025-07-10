export function getAllUsers() {
    $.ajax({
        type: 'GET',
        url: `${currentAPIurl}/users`,
        success: function (data) {
            console.log(data);
            return data;
        },
    });
}

export async function loadUsers() {
    // ensure the currentAPIurl is set
    if (localStorage.getItem('JWT') != null) {
        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: localStorage.getItem('JWT') || '' }),
        };
        let response = await fetch(`${currentAPIurl}/admin/getAllUsers`, settings);
        if (response.ok) {
            createUserTable(await response.json());
        }
    }
}

export function createUserTable(response) {
    let table = $('<table>').addClass('table table-hover placeholder-glow placeholder-sm');

    for (const user of response.users.results) {
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

export async function changeUser(id, flags, name, email) {
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
                token: localStorage.getItem('JWT') || '',
            }),
        });

        const data = await response.json();
        createUserTable(data);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
