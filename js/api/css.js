import { apiUrls } from "../../json/api-urls.js";
import { toastMessage } from "../ui/toasts.js";

export function loadCssList() {
    $.ajax({
        url: apiUrls.url.admin.modules.css.getAll,
        method: apiUrls.methods.admin.modules.css.getAll,
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (response) {
            $('#cssTable tbody').empty();

            const cssList = response.result?.css || [];

            if (cssList.length === 0) {
                toastMessage("No CSS Files Found.", "warning");
                return;
            }

            cssList.forEach(css => {
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
            toastMessage("Error Loading CSS files: "+ error, "warning");
        }
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

export function deleteCss(id){
    //TODO: fill this in
}
