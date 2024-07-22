// Google Auth
class User {
  constructor(data, token) {
    this.name = data.name;
    this.email = data.email;
    this.picture = data.picture;
    this.id = data.sub;
    this.token = token

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

}
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
  console.log(response);

  const responsePayload = decodeJwtResponse(response.credential);
  console.log(responsePayload.header);
  window.user = new User(responsePayload.payload);

  $.ajax({
    type: "POST",
    url: "https://api.pioneerrocketry.com/googleAuth",
    data: JSON.stringify(window.user),
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
