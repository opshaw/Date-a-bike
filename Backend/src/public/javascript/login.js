// Ensure the DOM is loaded before running the code
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        console.log("Form submission prevented");

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const formData = {
            email,
            password
        };

        console.log("Form data collected:", formData);

        // Endpoint and request options
        const url = '/api/v1/users/login';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData) // Convert form data to JSON
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
                localStorage.setItem('userData', JSON.stringify(data.data.user));
                alert(data.message || 'Registration successful');
                setTimeout(() => {
                    window.location.href = '/api/v1/users/dashboard'; // Redirect to the desired URL
                }, 1000); // Delay of 1000ms
            } else {
                alert(data.message || 'Registration failed');
            }

        } catch (error) {
            // Handle any errors that occur during the fetch
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        }
    });
});
