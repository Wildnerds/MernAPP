const form = document.getElementById('form');
const messageTag = document.getElementById('message');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const notification = document.getElementById('notification');
const submitBTN = document.getElementById('submit');
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]{8,}$/;

form.style.display = 'none';
let token, id;

window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    token = params.get('token');
    id = params.get('id');

    const res = await fetch('/auth/verify-password-reset-token', {
        method: 'POST',
        body: JSON.stringify({ token, id }),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    if (!res.ok) {
        const { message } = await res.json();
        messageTag.innerText = message;
        messageTag.classList.add('error');
        return;
    }

    messageTag.style.display = "none";
    form.style.display = 'block';
});

const displayNotification = (message, type) => {
    notification.style.display = "block";
    notification.innerText = message;
    notification.className = ""; // Clear any previous classes
    notification.classList.add(type);
};

const handleSubmit = async (evt) => {
    evt.preventDefault();

    // Validate password
    if (!passwordRegex.test(password.value)) {
        return displayNotification("Invalid password. Use alpha numeric and special characters.", "error");
    }

    if (password.value !== confirmPassword.value) {
        return displayNotification("Passwords do not match.", "error");
    }

    // Disable submit button and show loading state
    submitBTN.disabled = true;
    submitBTN.innerText = "Please wait...";

    // Submit form to reset password
    const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ id, token, password: password.value })
    });

    // Enable submit button and reset text
    submitBTN.disabled = false;
    submitBTN.innerText = "Update password";

    if (!res.ok) {
        const { message } = await res.json();
        return displayNotification(message, "error");
    }

    // Password reset successful
    messageTag.style.display = "block";
    messageTag.innerText = "Password Reset Successful";
    form.style.display = "none";
};

form.addEventListener('submit', handleSubmit);
