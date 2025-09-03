import { apiUrls } from '../../json/api-urls.js';
import { toastMessage } from '../ui/toasts.js';

export function loadCssList() {
    $.ajax({
        url: apiUrls.url.admin.modules.css.getAll,
        method: apiUrls.methods.admin.modules.css.getAll,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('JWT') || ''}`,
        },
        success: function (response) {
            $('#cssTable tbody').empty();

            const cssList = response.result?.css || [];

            if (cssList.length === 0) {
                toastMessage('No CSS Files Found.', 'warning');
                return;
            }

            cssList.forEach((css) => {
                const row = $('<tr>');
                row.append(
                    $('<td>').text(css.ID),
                    $('<td>').text(css.Name),
                    $('<td>').text(css.UserAccessLevel),
                    $('<td>').append(
                        $('<button>')
                            .addClass('btn btn-primary me-2')
                            .text('Edit')
                            .click(() => openCssModal(css)),
                        $('<button>')
                            .addClass('btn btn-danger')
                            .text('Delete')
                            .click(() => {
                                if (confirm('Are you sure you want to delete this CSS?')) {
                                    deleteCss(css.ID);
                                }
                            })
                    )
                );
                $('#cssTable tbody').append(row);
            });
        },
        error: function (xhr, status, error) {
            $('#cssTable tbody').html('<tr><td colspan="4" class="text-danger">Error loading CSS list</td></tr>');
            toastMessage('Error Loading CSS files: ' + error, 'warning');
        },
    });
}

export function openCssModal(css) {
    if (css) {
        // Editing existing CSS
        $('#cssId').val(css.ID);
        $('#cssName').val(css.Name);
        $('#cssContent').val(css.Content);
        $('#cssAccess').val(css.UserAccessLevel);
        $('#cssSubmitBtn').text('Update');
    } else {
        // Creating new CSS
        $('#cssForm')[0].reset();
        $('#cssId').val('');
        $('#cssSubmitBtn').text('Create');
    }
    $('#createCssModal').modal('show');
}

export function deleteCss(id) {
    //TODO: fill this in
}

export function cssOnReady(){
        $('#cssForm').on('submit', async function (e) {
        e.preventDefault();
        const cssFileInput = document.getElementById('cssFile');
        let cssContent = '';
        if (cssFileInput.files && cssFileInput.files[0]) {
            cssContent = await cssFileInput.files[0].text();
        } else {
            alert('Please select a CSS file.');
            return;
        }
        const cssData = {
            ID: $('#cssId').val(),
            Name: $('#cssName').val(),
            Content: cssContent,
            UserAccessLevel: $('#cssAccess').val(),
        };
        try {
            const response = await fetch(currentAPIurl+apiUrls.url.admin.modules.css.create, {
                method: apiUrls.methods.admin.modules.css.create,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    css: cssData,
                    token: localStorage.getItem('JWT') || '',
                }),
            });
            const data = await response.json();
            if (data.success) {
                $('#createCssModal').modal('hide');
                loadCssList(); // Refresh the CSS list
            } else {
                alert('Error updating CSS: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving CSS:', error);
            alert('Error saving CSS: ' + error.message);
        }
    });
}
