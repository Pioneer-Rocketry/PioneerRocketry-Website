

function onTokenResponse(googleUser) {
  handleCredentialResponse(googleUser);
}

function onErrorCallback(error) {
  console.log("Error: ", error);
}

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  console.log(response);
  window.userToken = response.credential;
  $.ajax({
    type: "POST",
    url: "https://api.pioneerrocketry.com/googleAuth",
    data: JSON.stringify({ token: response.credential }),
    contentType: "application/json",
   
  }).done(function (data) {
    console.log("Success: " + data);
    //create popper toast for success
    let toastDiv = document.createElement("div");
    toastDiv.setAttribute("id", "liveToast");
    toastDiv.setAttribute("class", "toast");
    let toastBody = document.createElement("div");
    toastBody.setAttribute("class", "toast-body");
    toastBody.setAttribute("id", "liveToastBody");
    toastDiv.appendChild(toastBody);
    toastBody.textContent = "Successful Login: ";
    let toast = new bootstrap.Toast(toastDiv);
    toast.show();
  }).fail(function (data) {
    console.log("Error:", data);
  })

  //send a post to the worker with the user data to go against the database
  //the worker will then check the db for the user email full name and ID

}
