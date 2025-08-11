import { setAPIurl } from '../main.js';
import { loadPageData } from '../api/pages.js';
import { submitEventForm, loadEvents } from '../api/events.js';
import { toastMessage } from './toasts.js';
import { handleUploadSummary, loadImages } from '../api/images.js';
import { loadUsers } from '../api/users.js';
import { loadCssList } from '../api/css.js';
import { loadScriptList } from '../api/scripts.js';

export function onReady() {
    window.pageLoaded = false;

    setAPIurl();
    $('.loginRequired').hide();

    if (location.host.match(/^[0-9.:]+$/)) {
        //set the user to a test user that only works on localhost
        localStorage.setItem('JWT', 'TestToken');
    }
    $('#reRunOnload').on('click', function () {
        onLoad(true);
    });

    $('#loadPageBtn').on('click', function () {
        const pageName = document.getElementById('pageName').value;
        loadPageData(pageName);
    });

    $('#apiUrlSelector').val(window.currentAPIurl);
    $('#apiUrlSelector').on('input', function () {
        const selectedUrl = $(this).val();
        window.currentAPIurl = selectedUrl;
        currentAPIurl = selectedUrl;
        localStorage.setItem('currentAPIurl', selectedUrl);
        console.log('API URL changed to:', selectedUrl);
    });

    // Days of week checkboxes to hidden input
    $('#daysOfWeekButtons input[type="checkbox"]').on('change', function () {
        const selected = $('#daysOfWeekButtons input[type="checkbox"]:checked')
            .map(function () {
                return this.value;
            })
            .get();
        $('#eventDaysOfWeek').val(selected.join(','));
    });

    $('#createEventForm').on('submit', async function (event) {
        event.preventDefault();
        const form = event.target;
        submitEventForm(
            form,
            function (result) {
                if (typeof loadEvents === 'function') loadEvents();
                const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('createEventModal'));
                modal.hide();
                form.reset();
            },
            function (error) {
                console.log('Error: ' + (error.error || error.errorMessage || 'Unknown error'));
            }
        );
        $("#createEventSubmit").text('Create Event');
    });

    $(document).on('click', '.replace-image-btn', function () {
        const imageName = $(this).data('name');
        const imageUrl = `${currentAPIurl}/images/${encodeURIComponent(imageName)}`;
        $('#replaceImageName').val(imageName);
        $('#replaceImagePreview').attr('src', imageUrl);
        $('#replaceImageModal').modal('show');
        $('#replaceImageFile').val('');
    });

    $(document).on('click', '.delete-image-btn', function () {
        const imageName = $(this).data('name');
        const imageURL = `${currentAPIurl}/images/${encodeURIComponent(imageName)}`;
        $('#deleteImageName').text(imageName);
        $('#deleteImage').attr('src', imageURL).attr('alt', imageName);
        $('#confirmDeleteImageModal').modal('show');
    });

    $('#confirmDeleteImageBtn')
        .off('click')
        .on('click', function (e) {
            e.preventDefault();
            const imageName = $('#deleteImageName').text();
            $.ajax({
                url: `${currentAPIurl}/images/delete`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ token: localStorage.getItem('JWT') || '', imageName }),
                success: function () {
                    toastMessage('Image deleted successfully.', 'success');
                    setTimeout(loadImages, 5000);
                },
                error: function () {
                    toastMessage('Failed to delete image.', 'danger');
                },
            });
        });

    $('#replaceImageFile').on('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#replaceImageNewPreview').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            $('#replaceImagePreview').attr('src', '');
            $('#replaceImageNewPreview').attr('src', '');
        }
    });

    $('#replaceImageModal').on('hidden.bs.modal', function () {
        $('#replaceImageFile').val('');
        $('#replaceImagePreview').attr('src', '');
    });

    $('#replaceImageForm')
        .off('submit')
        .on('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.append('imageName', $('#replaceImageName').val());
            formData.append('token', localStorage.getItem('JWT') || '');

            $.ajax({
                url: `${currentAPIurl}/images/replace`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    $('#replaceImageModal').modal('hide');
                    setTimeout(loadImages, 500);
                },
                error: function () {
                    toastMessage('Failed to replace image.', 'danger');
                },
            });
        });

    $('#newImageFile').on('input', function () {
        const files = Array.from(this.files);
        $('#newImageSubmit').prop('disabled', files.length === 0);

        if (files.length > 0) {
            $('#newImageName').val(files.map((f) => f.name).join(', '));
            const reader = new FileReader();
            reader.onload = (e) => $('#newImagePreview').attr('src', e.target.result);
            reader.readAsDataURL(files[0]);
        } else {
            $('#newImageName').val('');
            $('#newImagePreview').attr('src', '');
        }
    });

    $('#createImageForm')
        .off('submit')
        .on('submit', function (e) {
            e.preventDefault();
            const files = $('#newImageFile')[0].files;
            if (files.length === 0) return toastMessage('Please select at least one image.', 'warning');

            const formData = new FormData();
            formData.append('token', localStorage.getItem('JWT') || '');
            for (const file of files) formData.append('imageFile', file);

            $.ajax({
                url: `${window.currentAPIurl}/images/upload`,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    $('#newImageModal').modal('hide');
                    loadImages();
                    $('#newImageFile').val('');
                    $('#newImageName').val('');
                    $('#newImagePreview').attr('src', '');
                    handleUploadSummary(data);
                },
                error: function () {
                    toastMessage('Failed to upload images.', 'danger');
                },
            });
        });
    $(document).on('mouseenter', '.hoverPreview', function () {
        const src = $(this).attr('src');
        $('#fullscreenImage').attr('src', src);
        $('#imageFullscreenOverlay').removeClass('hide').addClass('show');
    });

    $(document).on('mouseleave', '.hoverPreview', function () {
        $('#imageFullscreenOverlay').addClass('hide').removeClass('show');
    });
    $('#scriptForm').on('submit', async function (e) {
        e.preventDefault();
        const scriptFileInput = document.getElementById('scriptFile');
        let scriptContent = '';
        if (scriptFileInput.files && scriptFileInput.files[0]) {
            scriptContent = await scriptFileInput.files[0].text();
        } else {
            alert('Please select a script file.');
            return;
        }
        const scriptData = {
            ID: $('#scriptId').val(),
            Name: $('#scriptName').val(),
            Content: scriptContent,
            UserAccessLevel: $('#scriptAccess').val(),
        };
        try {
            const response = await fetch(`${currentAPIurl}/module/createScript`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    script: scriptData,
                    token: localStorage.getItem('JWT') || '',
                }),
            });

            const data = await response.json();
            if (data.success) {
                $('#createScriptModal').modal('hide');
                loadScriptList(); // Refresh the script list
            } else {
                alert('Error updating script: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving script:', error);
            alert('Error saving script: ' + error.message);
        }
    });

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
            const response = await fetch(`${currentAPIurl}/module/createCss`, {
                method: 'POST',
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

export function onLoad(force = false) {
    if (!force && !window.pageLoaded) {
        window.pageLoaded = true;
        $('#createEventBtn').show();
        $('.loginRequired').show();
        loadUsers();
        loadCssList();
        loadScriptList();
        loadImages();
        loadEvents();
    }
}
