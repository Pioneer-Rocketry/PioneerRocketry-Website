

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

export function scriptOnReady(){
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
            const response = await fetch(currentAPIurl+apiUrls.url.admin.modules.scripts.create, {
                method: apiUrls.methods.admin.modules.scripts.create,
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
}