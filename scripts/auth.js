// Google Auth
class User {
    constructor(data, token) {
        this.name = data.name;
        this.email = data.email;
        this.picture = data.picture;
        this.id = data.sub;
        this.token = token;
        this.flags = data.flags || '0';
    }

    //getters
    getUser(id) {
        return this;
    }
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }

    getPicture() {
        return this.picture;
    }

    getToken() {
        return this.token;
    }

    getFlags() {
        return this.flags;
    }

    //setters
    setFlags(flags) {
        this.flags = flags;
    }

    setToken(token) {
        this.token = token;
    }

    setName(name) {
        this.name = name;
    }

    setEmail(email) {
        this.email = email;
    }

    setPicture(picture) {
        this.picture = picture;
    }

    setId(id) {
        this.id = id;
    }

    setCredentials(creds){
        this.credential = creds;
    }
}

//check if user is already verified
$(document).ready(function () {
    console.log('checking for Session');
    setAPIurl();
    if (localStorage.getItem('JWT') != null) {
        console.log('JWT found');
        try {
            localJWTSession = JSON.parse(localStorage.getItem('JWT'));
        } catch (e) {
            console.log(e);
        }
        tempData = { email: localJWTSession.email, name: localJWTSession.name, id: localJWTSession.id, token: localJWTSession.token, flags: localJWTSession.flags };
        window.user = new User(tempData, tempData.token);
        
        $.ajax({
            type: 'POST',
            url: `${currentAPIurl}/googleAuth`,
            data: JSON.stringify(window.user),
            contentType: 'application/json',
        })
            .done(function (data) {
                console.log(JSON.parse(data));
                let flags = JSON.parse(data).flags;
                let sub = JSON.parse(data).email;
                if (parseFloat(flags) >= 2.0) {
                    $('#createEventBtn').show();
                    $('.loginRequired').show();
                    $('.triggerChangeOnLogin').trigger('change');
                    $('.triggerClickOnLogin').trigger('click');
                }
                
                $('#g_id_signin').hide();
                $('#credential_picker_container').hide();
            })
            .fail(function (error) {
                localStorage.removeItem('JWT');
                console.log(error);
                $('#g_id_signin').show();
                window.user = null;
            });
    }else{
        console.log("No JWT Found, Skipping.")
    }
});

//decode JWT
function decodeJwtResponse(token) {
    try {
        let sJWT = token;
        let headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split('.')[0]));
        let payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split('.')[1]));

        let decodedPayload = {
            header: headerObj,
            payload: payloadObj,
        };

        return decodedPayload;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

function onTokenResponse(googleUser) {
    handleCredentialResponse(googleUser);
}

function onErrorCallback(error) {
    console.log('Error: ', error);
}

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //console.log(response);
    const responsePayload = decodeJwtResponse(response.credential);
    //console.log(responsePayload.header);
    window.user = new User(responsePayload.payload, response.credential);

    //console.log(JSON.stringify(window.user))

    $.ajax({
        type: 'POST',
        url: `${currentAPIurl}/googleAuth`,
        data: JSON.stringify({token: response.credential}),
        contentType: 'application/json',
    })
        .done(function (data) {
            console.log(JSON.parse(data));
            let flags = JSON.parse(data).flags;
            let sub = JSON.parse(data).email;
            localStorage.setItem('lastUserEmail', sub);
            console.log(parseFloat(flags));
            if (parseFloat(flags) >= 2.0) {
                localStorage.setItem('JWT', JSON.stringify(window.user));
                $('#createEventBtn').show();
                $('.loginRequired').show();
                $('.triggerChangeOnLogin').trigger('change');
                $('.triggerClickOnLogin').trigger('click');
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
