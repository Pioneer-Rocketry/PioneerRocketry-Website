import { setAPIurl } from '../main.js';
import { loadPageData } from '../api/pages.js';
import { submitEventForm, loadEvents } from '../api/events.js';
import { imagesOnReady, loadImages } from '../api/images.js';
import { loadUsers } from '../api/users.js';
import { loadCssList } from '../api/css.js';
import { loadScriptList } from '../api/scripts.js';
import { apiUrls } from '../../json/api-urls.js';

export function onReady() {
    imagesOnReady();
     
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
