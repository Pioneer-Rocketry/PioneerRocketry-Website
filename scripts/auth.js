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

  let responsePayload = decodeJwtResponse(googleUser.credential);
  
  fetch("https://google-auth.kris-adams3000.workers.dev/googleRedirect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: responsePayload.sub }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Handle authenticated user
    })
    .catch((error) => console.error("Error:", error));
    handleCredentialResponse(googleUser)
}

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
 }