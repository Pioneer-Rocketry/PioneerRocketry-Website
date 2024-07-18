// Google Sign In
function onSignIn(googleUser) {
    console.log("Signed in: ", googleUser);
    
    let id_token = googleUser.getAuthResponse().id_token;
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
