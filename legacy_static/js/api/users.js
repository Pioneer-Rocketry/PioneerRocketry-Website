import { apiUrls } from '../../json/api-urls.js';
import { toastMessage } from '../ui/toasts.js';

export async function loadUsers() {
    // ensure the currentAPIurl is set
    if (localStorage.getItem('JWT') != null) {
        const settings = {
            method: apiUrls.methods.admin.users.getAll,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('JWT') || ''}`,
            },
        };
        let response = await fetch(apiUrls.url.admin.users.getAll, settings);
        if (response.ok) {
            createUserTable(await response.json());
        }
    }
}

export function createUserTable(response) {
    const viewerFlag = 0;
    const helperFlag = 5;
    const managerFlag = 10;
    const manageUsersFlag = 15;
    const adminFlag = 20;
    const superAdminFlag = 25;

    // Create the table structure
    let table = $('<table>').addClass('table table-hover placeholder-glow placeholder-sm');

    for (const user of response.result.results) {
        let row = $('<tr>').appendTo(table);
        let cellName = $('<td>').text(user.name);
        let cellEmail = $('<td>').text(user.email);
        let cellId = $('<td>').text(user.id);
        let strippedFlag = JSON.stringify(user.flags, (_, v) => Math.trunc(v));
        row.append(cellName, cellEmail, cellId);

        // Create the dropdown for flags
        let flagSelect = $('<select>').attr('id', `${user.id}flag`).addClass('form-select');

        let viewer = $('<option>').text('Viewer').val(viewerFlag);
        let member = $('<option>').text('Member').val(helperFlag);
        let helper = $('<option>').text('Helper').val(managerFlag);
        let manageUsers = $('<option>').text('Manage Users').val(manageUsersFlag);
        let admin = $('<option>').text('Admin').val(adminFlag);
        let superAdmin = $('<option>').text('Super Admin').val(superAdminFlag);

        flagSelect.append(viewer, member, helper, manageUsers, admin, superAdmin);
        flagSelect.attr('data-flags', strippedFlag);
        flagSelect.find(`option[value="${strippedFlag}"]`).prop('selected', true);
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
            changeUser(user.id, flagSelect.val());
        });
    }

    // Clear previous table and append the new one
    $('#users').empty().append(table);
}

export async function changeUser(id, newFlag) {
    try {
        const url = `${currentAPIurl}${apiUrls.url.admin.users.update}`;

        const response = await fetch(url, {
            method: apiUrls.methods.admin.users.update,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('JWT') || ''}`,
            },
            body: JSON.stringify({
                flag: newFlag,
                id: id,
            }),
        });

        const data = await response.json();
        if(data.success == true){
            toastMessage("User Updated Successfully", "success")
            loadUsers();
        }else if(data.success==false){
            toastMessage("User Update Incomplete", "danger")
            loadUsers();
        }else{
            toastMessage("User Update Incomplete", "danger")
            loadUsers();
        }
        
        
    } catch (error) {
        console.log(error);
    }
}
