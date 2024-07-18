//decode JWT
function decodeJWT(token) {
  try {
    sJWT = token;
    var headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split(".")[0]));
    var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(sJWT.split(".")[1]));

    var decodedPayload = {
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

  let id_token = decodeJWT(googleUser.credentials);
  console.log(id_token);
  fetch("https://google-auth.kris-adams3000.workers.dev/googleRedirect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: id_token }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Handle authenticated user
    })
    .catch((error) => console.error("Error:", error));
}
