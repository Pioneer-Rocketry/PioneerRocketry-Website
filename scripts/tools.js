//if local use localhost
let localAPIurl = "localhost:8787";
let remoteAPIurl = "https://api.pioneerrocketry.com";
let currentAPIurl = null;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    currentAPIurl = localAPIurl;
}else{
    currentAPIurl = remoteAPIurl;
}

function getAllUsers(){
    $.ajax({
        type: "GET",
        url: `${currentAPIurl}/users`,
        success: function (data) {
            console.log(data);
        },
    })
}

async function getHeader() {
    return new Promise((resolve, reject) => {
        fetch('./template.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Return the text response for the next `.then`
            })
            .then(data => {
                
                // Split the data by the header markers and handle potential errors
                const parts = data.split("<!-- Header -->");
                if (parts.length < 3) {
                    throw new Error('Header markers not found');
                }
                resolve(parts[1]); // Get the content between the markers
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                reject(error); // Reject the promise if there was an error
            });
    });
}

async function getFooter() {
    return new Promise((resolve, reject) => {
        fetch('./template.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Return the text response for the next `.then`
            })
            .then(data => {
                
                // Split the data by the header markers and handle potential errors
                const parts = data.split("<!-- Footer -->");
                if (parts.length < 3) {
                    throw new Error('Header markers not found');
                }
                resolve(parts[1]); // Get the content between the markers
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                reject(error); // Reject the promise if there was an error
            });
    });
}