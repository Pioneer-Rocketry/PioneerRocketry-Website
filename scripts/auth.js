

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

  $.ajax({
    type: "POST",
    url: "https://api.pioneerrocketry.com/googleAuth",
    data: response.credential,
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
    console.log("Error: " + data);
  })
  console.log("ID: " + responsePayload.payload.sub);
  console.log("Full Name: " + responsePayload.payload.name);
  console.log("Given Name: " + responsePayload.payload.given_name);
  console.log("Family Name: " + responsePayload.payload.family_name);
  console.log("Image URL: " + responsePayload.payload.picture);
  console.log("Email: " + responsePayload.payload.email);

  //send a post to the worker with the user data to go against the database
  //the worker will then check the db for the user email full name and ID

}
