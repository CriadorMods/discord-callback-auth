const clientId = '1246414303977013258';
const redirectUri = 'https://criadormods.github.io/discord-callback-auth/';
const scopes = 'identify';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const status = document.getElementById('status');
    const profile = document.getElementById('profile');

    loginBtn.addEventListener('click', () => {
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scopes}`;
        window.location.href = authUrl;
    });

    logoutBtn.addEventListener('click', () => {
        status.textContent = '';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        profile.style.display = 'none';
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

        // Remove the hash from the URL for a cleaner UI
        history.replaceState(null, null, ' ');
    }
});

function fetchUserInfo(token) {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const status = document.getElementById('status');
    const profile = document.getElementById('profile');
    const avatar = document.getElementById('avatar');
    const username = document.getElementById('username');

    fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        status.textContent = `Hello, ${data.username}#${data.discriminator}`;
        avatar.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        username.textContent = `${data.username}#${data.discriminator}`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        profile.style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        status.textContent = 'Failed to fetch user info';
    });
}
