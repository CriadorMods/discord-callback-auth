
const clientId = '1246414303977013258';
const redirectUri = 'http://127.0.0.1:8080/';
const scopes = 'identify';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const status = document.getElementById('status');

    loginBtn.addEventListener('click', () => {
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scopes}`;
        window.location.href = authUrl;
    });

    logoutBtn.addEventListener('click', () => {
        status.textContent = '';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        localStorage.removeItem('accessToken');
    });

    const token = localStorage.getItem('accessToken');
    if (token) {
        fetchUserInfo(token);
    } else if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (accessToken) {
            status.textContent = 'Authentication successful!';
            localStorage.setItem('accessToken', accessToken);
            fetchUserInfo(accessToken);
        } else {
            status.textContent = 'Authentication failed!';
        }


        history.replaceState(null, null, ' ');
    }
});

function fetchUserInfo(token) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const status = document.getElementById('status');

    fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        status.textContent = `Hello, ${data.username}#${data.discriminator}`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        status.textContent = 'Failed to fetch user info';
    });
}
