// Google Auth

//decode JWT
function decodeJwtResponse(token) {
  try {
    let sJWT = token;
    let headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split(".")[0]));
    let payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split(".")[1]));

    let decodedPayload = {
      header: headerObj,
      payload: payloadObj,
    };

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Google Sign In
function onSignIn(googleUser) {
  console.log("Signed in: ", googleUser);


  const client = google.accounts.oauth2.initTokenClient({
    client_id: "663378314498-3g2pd0cjt832jjv09i16k9brf8jb8n0p.apps.googleusercontent.com",
    callback: "onTokenResponse",
    scope: 'https://www.googleapis.com/auth/userinfo.email\
    https://www.googleapis.com/auth/userinfo.profile\
    openid'
  });
  console.log(client);
  handleCredentialResponse(googleUser);
}

function onTokenResponse(tokenResponse) {
  console.log("Token Response: ", tokenResponse);
}

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  const responsePayload = decodeJwtResponse(response.credential).payload;

  console.log("ID: " + responsePayload.sub);
  console.log("Full Name: " + responsePayload.name);
  console.log("Given Name: " + responsePayload.given_name);
  console.log("Family Name: " + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);
}
