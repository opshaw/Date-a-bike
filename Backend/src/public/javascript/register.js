// Ensure the DOM is loaded before running the code
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        console.log("Form submission prevented");

        const fullName = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Regular expression to check for letters and numbers only
        const usernamePattern = /^[a-zA-Z0-9]+$/;
    
        // Username validation
        if (!username) {
            alert('Username is required');
            return;
        }
        if (!usernamePattern.test(username)) {
            alert('Username must contain only letters and numbers');
            return;
        }
    
        // Check if email is already registered (dummy check, replace with actual server-side check)
        const registeredEmails = ['test@example.com', 'user@example.com']; // Example registered emails
        if (registeredEmails.includes(email)) {
            document.getElementById('emailExistsMessage').style.display = 'block';
            document.getElementById('emailError').style.display = 'block';
            return;
        }
    
        // Check if passwords match
        if (password !== confirmPassword) {
            document.getElementById('passwordError').style.display = 'block';
            return;
        }

        // Collect form data
        const formData = {
            fullName,
            username,
            email,
            password
        };

        console.log("Form data collected:", formData);

        // Endpoint and request options
        const url = '/api/v1/users/register';
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
                alert(data.message || 'Registration successful');
                setTimeout(() => {
                    window.location.href = '/api/v1/users/login'; // Redirect to the desired URL
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
