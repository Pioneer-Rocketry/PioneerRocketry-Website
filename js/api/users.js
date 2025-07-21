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
    const viewerFlag = 0.0;
    const helperFlag = 5.0;
    const managerFlag = 10.0;
    const manageUsersFlag = 15.0;
    const adminFlag = 20.0;
    const superAdminFlag = 25.0;

    // Create the table structure
    let table = $('<table>').addClass('table table-hover placeholder-glow placeholder-sm');

    for (const user of response.users.results) {
        console.log(user);
        let row = $('<tr>').appendTo(table);
        let cellName = $('<td>').text(user.name);
        let cellEmail = $('<td>').text(user.email);
        let cellId = $('<td>').text(user.id);
        row.append(cellName, cellEmail, cellId);

        // Create the dropdown for flags
        let flagSelect = $('<select>').attr('id', `${user.id}flag`).addClass('form-select')
        
        let viewer = $('<option>').text('Viewer').val(viewerFlag)
        let member = $('<option>').text('Member').val(helperFlag)
        let helper = $('<option>').text('Helper').val(managerFlag)
        let manageUsers = $('<option>').text('Manage Users').val(manageUsersFlag)
        let admin = $('<option>').text('Admin').val(adminFlag)
        let superAdmin = $('<option>').text('Super Admin').val(superAdminFlag)
        
        flagSelect.append(viewer, member, helper , manageUsers, admin, superAdmin);
        flagSelect.attr('data-flags', user.flags);
        flagSelect.find(`option[value="${user.flags}"]`).prop('selected', true);
        let cellFlags = $('<td>').append(flagSelect);
        row.append(cellFlags);
        
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
