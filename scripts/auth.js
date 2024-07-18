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

function onTokenResponse(googleUser) {
    handleCredentialResponse(googleUser);
}

function onErrorCallback(error) {
  console.log("Error: ", error);
}

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  const responsePayload = decodeJwtResponse(response.credential).payload;
    console.log(responsePayload);
  console.log("ID: " + responsePayload.sub);
  console.log("Full Name: " + responsePayload.name);
  console.log("Given Name: " + responsePayload.given_name);
  console.log("Family Name: " + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);

  //send a post to the worker with the user data to go against the database
  //the worker will then check the db for the user email full name and ID
}
