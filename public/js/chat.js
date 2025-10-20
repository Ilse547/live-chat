



const gun = GUN([
    'http://192.168.178.21:3000/gun',
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun'
]);

const chat = gun.get('general-chat');
let username = localStorage.getItem('chatUsername');

// DOM elements
const usernameInput = document.getElementById('username-input');
const setUsernameBtn = document.getElementById('set-username-btn');
const currentUserDiv = document.getElementById('current-user');
const currentUsernameSpan = document.getElementById('current-username');
const editUsernameBtn = document.getElementById('edit-username-btn');
const usernameInputGroup = document.querySelector('.username-input-group');

// Initialize username display
function initializeUsername() {
    if (username && username.trim()) {
        showCurrentUser(username);
    } else {
        showUsernameInput();
    }
}

function showUsernameInput() {
    usernameInputGroup.classList.remove('hidden');
    currentUserDiv.classList.add('hidden');
    usernameInput.focus();
}

function showCurrentUser(name) {
    usernameInputGroup.classList.add('hidden');
    currentUserDiv.classList.remove('hidden');
    currentUsernameSpan.textContent = name;
}

function setUsername() {
    const newUsername = usernameInput.value.trim();
    if (newUsername) {
        username = newUsername;
        localStorage.setItem('chatUsername', username);
        showCurrentUser(username);
        usernameInput.value = '';
    }
}

// Event listeners
setUsernameBtn.addEventListener('click', setUsername);

usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setUsername();
    }
});

editUsernameBtn.addEventListener('click', () => {
    usernameInput.value = username;
    showUsernameInput();
});

// Send message
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    if (input.value.trim() && username) {
        const message = {
            text: input.value.trim(),
            user: username,
            timestamp: Date.now(),
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2,9)
        };
        chat.get('messages').get(message.id).put(message);
        input.value = '';
    } else if (!username) {
        alert('Please set your name first!');
        usernameInput.focus();
    }
});

// Message input Enter key
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('send-btn').click();
    }
});

// Listen for messages
chat.get('messages').map().on((message, key) => {
    if (message && message.text && message.user && message.id) {
        if (!document.getElementById(message.id)) {
            displayMessage(message);
        }
    }
});

function displayMessage(message) {
    const messageDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.id = message.id;
    messageEl.className = 'message';
    
    // Style your own messages differently
    if (message.user === username) {
        messageEl.classList.add('own-message');
    }
    
    messageEl.innerHTML = 
        `<strong>${message.user}:</strong> ${message.text}
        <small>${new Date(message.timestamp).toLocaleTimeString()}</small>`;
    messageDiv.appendChild(messageEl);
    messageDiv.scrollTop = messageDiv.scrollHeight;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeUsername);
