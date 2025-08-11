import { handleCredentialResponse } from './api/auth.js';
import { apiUrls } from '../json/api-urls.js';

window.apiUrls = apiUrls;

export function setAPIurl() {
    window.productionAPIurl = 'https://pioneerrocketry.com';
    window.currentAPIurl = null;
    if (localStorage.getItem('currentAPIurl') != null) {
        window.currentAPIurl = localStorage.getItem('currentAPIurl');
    } else {
        if (window.location.hostname === 'pioneerrocketry.com') {
            window.currentAPIurl = window.productionAPIurl;
        }
    }
    if (window.location.hostname === 'localhost') {
        window.currentAPIurl = 'http://localhost:8787';
        handleCredentialResponse({ credential: 'TestToken' });
    }
}

// From js/api
import * as auth from './api/auth.js';
// import * as css from './api/css.js';
// import * as events from './api/events.js';
// import * as images from './api/images.js';
// import * as pages from './api/pages.js';
// import * as scripts from './api/scripts.js';
// import * as users from './api/users.js';

// From js/ui
// import * as handlers from './ui/handlers.js';
import * as onReady from './ui/onReady.js';
// import * as toasts from './ui/toasts.js';

// From js/utils
// import * as time from './utils/time.js';

window.auth = auth;
// window.onTokenResponse = auth.onTokenResponse;
// window.onErrorCallback = auth.onErrorCallback;
// window.handleCredentialResponse = auth.handleCredentialResponse;
// window.sessionLogin = auth.sessionLogin;

// window.css = css;
// window.events = events;
// window.images = images;
// window.pages = pages;
// window.scripts = scripts;
// window.users = users;
// window.handlers = handlers;
// window.onReady = onReady;
// window.toasts = toasts;
// window.time = time;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => onReady.onReady());
} else {
    // DOM already ready
    onReady.onReady();
}
