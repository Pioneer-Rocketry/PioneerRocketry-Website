import { setAPIurl } from '../main.js';
import { loadPageData } from '../api/pages.js';
import { loadEvents, eventsOnReady } from '../api/events.js';
import { imagesOnReady, loadImages } from '../api/images.js';
import { loadUsers } from '../api/users.js';
import { cssOnReady, loadCssList } from '../api/css.js';
import { loadScriptList, scriptOnReady } from '../api/scripts.js';


export function onReady() {
    imagesOnReady();
    eventsOnReady();
    cssOnReady();
    scriptOnReady();

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
