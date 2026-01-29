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

import * as auth from './api/auth.js';
import * as onReady from './ui/onReady.js';
window.auth = auth;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => onReady.onReady());
} else {
    // DOM already in ready state
    onReady.onReady();
}
