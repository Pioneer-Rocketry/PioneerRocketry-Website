import { onLoad } from "../ui/onReady.js";

export function onTokenResponse(googleUser) {
    handleCredentialResponse(googleUser);
}

export function onErrorCallback(error) {
    console.log('Login Error: ', error);
}

export function handleCredentialResponse(response) {
    $.ajax({
        type: 'POST',
        url: `${currentAPIurl}/googleAuth`,
        data: JSON.stringify({ token: response.credential }),
        contentType: 'application/json',
    })
        .done(function (data) {
            let flags = null;
            try {
                flags = data.result.flags;
            } catch (e) {
                console.log('Error parsing flags:', e);
                console.log('Switching to new Handler');
            }
            //Remove After Updating the API
            if (flags == null || flags == undefined || flags == '') {
                flags = data.result.flags;
            }
            console.log('User Access Level: ' + flags);
            if (parseFloat(flags) >= 2.0) {
                localStorage.setItem('JWT', response.credential);
                onLoad();
            }
            $('#g_id_signin').hide();
            return true;
        })
        .fail(function (data) {
            console.log('Error: ' + data);
            return false;
        });
}

export function sessionLogin() {
    console.log('Checking for Local Session');
    if (localStorage.getItem('JWT') != null) {
        console.log('JWT found');
        try {
            localJWTSession = localStorage.getItem('JWT');
        } catch (e) {
            console.log(e);
        }
        handleCredentialResponse({ credential: localJWTSession });
        setTimeout(function () {
            $('#credential_picker_container').hide();
        }, 1000);
    } else {
        console.log('No Session Found, Skipping.');
    }
}
