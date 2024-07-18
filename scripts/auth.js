//decode JWT
function decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Decode payload (base64url encoded)
      const payload = parts[1];
      const decodedPayload = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(payload));

      return decodedPayload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }


// Google Sign In
function onSignIn(googleUser) {
    console.log("Signed in: ", googleUser);
    
    let id_token =decodeJWT(googleUser.credentials);
    console.log(id_token);
    fetch('https://google-auth.kris-adams3000.workers.dev/googleRedirect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: id_token })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Handle authenticated user
    })
    .catch(error => console.error('Error:', error));
}
