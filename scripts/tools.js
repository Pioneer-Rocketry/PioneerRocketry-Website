// this will hold the database connection with ajax calls.
//this will be used later down the road when i feel like adding some complexity to this.
//i want to be able to add the ability to add events to the calendar and also dynamically pull them from the database.
//this wont be an easy task because everything will need to be encrypted to be stored in github.
//all we need to do is have the user enter a key and send that to the database side to decrypt the data.
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