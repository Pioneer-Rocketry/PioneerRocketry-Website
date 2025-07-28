

export function loadScriptList() {
    // TODO: Replace with actual API call
    $('#scriptTable tbody').empty();
}

export function openScriptModal(script) {
    if (script) {
        $('#scriptId').val(script.id);
        $('#scriptName').val(script.name);
        $('#scriptContent').val(script.content);
        $('#scriptAccess').val(script.access);
        $('#scriptSubmitBtn').html('Update');
    } else {
        $('#scriptForm')[0].reset();
        $('#scriptId').val('');
        $('#scriptSubmitBtn').html('Create');
    }
    $('#createScriptModal').modal('show');
}
