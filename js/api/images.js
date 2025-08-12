// Fetch and display all images in the table
import { apiUrls } from '../../json/api-urls.js';
import { toastMessage } from '../ui/toasts.js';

export function loadImages() {
    $.ajax({
        url: apiUrls.url.admin.images.getAll,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('JWT') || ''}`,
        },
        method: apiUrls.methods.admin.images.getAll,
        success: function (data) {
            const tbody = $('#imageTable tbody').empty();
            if (data.result == 'Empty') {
                toastMessage('No Images Found', 'warning');
                return;
            }
            (data.result || []).forEach(({ image: img }) => {
                const url = `${currentAPIurl}${apiUrls.url.images.get}${encodeURIComponent(img.key.replace('images/', ''))}`;

                // Trim and truncate long names
                const trimmedName = img.key.replace('images/', '').length > 30 ? img.key.replace('images/', '').slice(0, 27) + '...' : img.key.replace('images/', '');
                const trimmedURL = url.length > 40 ? url.slice(0, 37) + '...' : url;

                const row = `
                    <tr>
                        <td class="align-middle text-truncate" title="${img.key.replace('images/', '')}">${trimmedName}</td>
                        <td class="align-middle text-truncate" style="max-width: 300px;" title="${url}">
                            <a href="${url}" target="_blank">${trimmedURL}</a>
                        </td>
                        <td class="align-middle">
                            <img src="${url}" alt="${img.key.replace('images/', '')}" style="max-width:80px; max-height:80px;" class="rounded hoverPreview" />
                        </td>
                        <td class="align-middle">
                            <button class="btn btn-sm btn-primary replace-image-btn" data-name="${img.key.replace('images/', '')}">Replace</button>
                            <button class="btn btn-sm btn-primary delete-image-btn" data-name="${img.key.replace('images/', '')}">Delete</button>
                        </td>
                    </tr>
                `;

                tbody.append(row);
            });
        },
        error: function () {
            toastMessage('Error Loading Images.', 'Error');
            $('#imageTable tbody').empty();
        },
    });
}

export function handleUploadSummary(ajaxData) {
    let successCount = 0,
        failureCount = 0;
    const failedImages = [];
    (ajaxData.results || []).forEach((result) => {
        if (result.error) {
            failureCount++;
            failedImages.push(result.imageName);
        } else {
            successCount++;
        }
    });

    if (successCount && !failureCount) toastMessage(`Uploaded ${successCount} images successfully.`, 'success');
    else if (successCount && failureCount) toastMessage(`Uploaded ${successCount} images with ${failureCount} failures.`, 'warning');
    else if (failureCount) toastMessage(`All ${failureCount} images failed to upload.`, 'danger');
}

// Call this function when the user clicks the "Edit" button for an image
export function openReplaceImageModal(imageId, imageUrl) {
    $('#replaceImageId').val(imageId);
    $('#replaceImagePreview').attr('src', imageUrl);
    $('#replaceImageModal').modal('show');
    // Optionally clear the file input
    $('#replaceImageFile').val('');
}

export function imagesOnReady() {
    $(document).on('click', '.replace-image-btn', function () {
        const imageName = $(this).data('name');
        const imageUrl = `${currentAPIurl}${apiUrls.url.images.get}${encodeURIComponent(imageName)}`;
        $('#replaceImageName').val(imageName);
        $('#replaceImagePreview').attr('src', imageUrl);
        $('#replaceImageModal').modal('show');
        $('#replaceImageFile').val('');
    });

    $(document).on('click', '.delete-image-btn', function () {
        const imageName = $(this).data('name');
        const imageURL = `${currentAPIurl}${apiUrls.url.images.get}${encodeURIComponent(imageName)}`;
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
                url: currentAPIurl + apiUrls.url.admin.images.remove,
                type: apiUrls.methods.admin.images.remove,
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
                url: currentAPIurl + apiUrls.url.admin.images.replace,
                type: apiUrls.methods.admin.images.replace,
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
                url: currentAPIurl + apiUrls.url.admin.images.create,
                method: apiUrls.methods.admin.images.create,
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
}
