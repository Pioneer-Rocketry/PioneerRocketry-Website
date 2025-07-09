// Fetch and display all images in the table
import { toastMessage } from "../ui/toasts.js";

export function loadImages() {
    $.ajax({
        url: `${window.currentAPIurl}/images`,
        method: 'GET',
        success: function (data) {
            const tbody = $('#imageTable tbody').empty();

            (data.images || []).forEach(({ image: img }) => {
                const url = `${window.currentAPIurl}/image/${encodeURIComponent(img.key)}`;

                // Trim and truncate long names
                const trimmedName = img.key.length > 30 ? img.key.slice(0, 27) + '...' : img.key;
                const trimmedURL = url.length > 40 ? url.slice(0, 37) + '...' : url;

                const row = `
                    <tr>
                        <td class="align-middle text-truncate" title="${img.key}">${trimmedName}</td>
                        <td class="align-middle text-truncate" style="max-width: 300px;" title="${url}">
                            <a href="${url}" target="_blank">${trimmedURL}</a>
                        </td>
                        <td class="align-middle">
                            <img src="${url}" alt="${img.key}" style="max-width:80px; max-height:80px;" class="rounded hoverPreview" />
                        </td>
                        <td class="align-middle">
                            <button class="btn btn-sm btn-primary replace-image-btn" data-name="${img.key}">Replace</button>
                            <button class="btn btn-sm btn-primary delete-image-btn" data-name="${img.key}">Delete</button>
                        </td>
                    </tr>
                `;

                tbody.append(row);
            });
        },
        error: function () {
            toastMessage('No Images to load.', 'warning');
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