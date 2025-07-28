export function toastMessage(message, type = 'info') {
    const toastContainer = $('#toastContainer');

    // Determine icon color based on type
    let iconColor;
    let bgClass;

    switch (type) {
        case 'success':
            iconColor = '#198754';
            bgClass = 'bg-success';
            break;
        case 'warning':
            iconColor = '#ffc107';
            bgClass = 'bg-warning';
            break;
        case 'danger':
            iconColor = '#dc3545';
            bgClass = 'bg-danger';
            break;
        default:
            iconColor = '#0d6efd';
            bgClass = 'bg-info';
            break;
    }

    // Create Toast DOM structure
    const toast = $(`
        <div class="toast  text-white border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true" style="min-width: 300px;">
            <div class="toast-header">
                <i class="fa-solid fa-circle me-2" style="color: ${iconColor};"></i>
                <strong class="me-auto text-capitalize">${type}</strong>
                <small>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `);

    // Append to container
    toastContainer.append(toast);

    // Show toast using Bootstrap's API
    const bsToast = new bootstrap.Toast(toast[0], { delay: 5000 });
    bsToast.show();

    // Remove from DOM after hidden
    toast.on('hidden.bs.toast', function () {
        $(this).remove();
    });
}
