//check if user is already verified
$(document).ready(function () {
    console.log('checking for Session');
    setAPIurl();
    if (localStorage.getItem('JWT') != null) {
        console.log('JWT found');
        try {
            localJWTSession = localStorage.getItem('JWT');
        } catch (e) {
            console.log(e);
        }
        handleCredentialResponse({ credential: localJWTSession });
    } else {
        console.log('No JWT Found, Skipping.');
    }
});

function onTokenResponse(googleUser) {
    handleCredentialResponse(googleUser);
}

function onErrorCallback(error) {
    console.log('Error: ', error);
}

function handleCredentialResponse(response) {
    $.ajax({
        type: 'POST',
        url: `${currentAPIurl}/googleAuth`,
        data: JSON.stringify({ token: response.credential }),
        contentType: 'application/json',
    })
        .done(function (data) {
            //data is within data.results
            //data = JSON.parse(data).result;
            let flags = JSON.parse(data).flags;
            let sub = JSON.parse(data).email;
            console.log('User Access Leve: ' + flags);
            if (parseFloat(flags) >= 2.0) {
                localStorage.setItem('JWT', response.credential);
                $('#createEventBtn').show();
                $('.loginRequired').show();
                $('.triggerChangeOnLogin').trigger('change');
                $('.triggerClickOnLogin').trigger('click');
                loadCssList();
                loadScriptList();
                loadImages();
                loadEvents();
                loadUserData();
            }
            $('#g_id_signin').hide();
            //create popper toast for success
            let toastDiv = document.createElement('div');
            toastDiv.setAttribute('id', 'liveToast');
            toastDiv.setAttribute('class', 'toast');
            let toastBody = document.createElement('div');
            toastBody.setAttribute('class', 'toast-body');
            toastBody.setAttribute('id', 'liveToastBody');
            toastDiv.appendChild(toastBody);
            toastBody.textContent = 'Successful Login: ';
            let toast = new bootstrap.Toast(toastDiv);
            toast.show();
        })
        .fail(function (data) {
            console.log('Error: ' + data);
        });

    //send a post to the worker with the user data to go against the database
    //the worker will then check the db for the user email full name and ID
}
