document.addEventListener("DOMContentLoaded", async () => {
  const url = "/api/v1/users/current-user";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".fullname").textContent = data.data.fullName;
      document.querySelector(".email").textContent = data.data.email;
      document.querySelector(".username").textContent = data.data.username;
      console.log("Data fetched successfully");
    })
    .catch((error) => console.log("Error while fetching data:", error));
});

const logoutButton = document.getElementById("logout-button");
// Handle the logout button click event
logoutButton.addEventListener("click", async() => {
  // Make a POST request to the logout endpoint
  const url = '/api/v1/users/logout';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        try {
            // Send POST request to the server
            const response = await fetch(url, options);
            console.log("Request sent to server");

            // Parse response JSON
            const data = await response.json();
            console.log("Response from server:", data);

            // Handle response data
            if (data.success) {
                alert(data.message || 'Logout Successfull');
                setTimeout(() => {
                    window.location.href = '/api/v1/landing'; // Redirect to the desired URL
                }, 500); // Delay of 1000ms
            } else {
                alert(data.message || 'Error Occured');
            }

        } catch (error) {
            // Handle any errors that occur during the fetch
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        }
});
