let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;
let chatRooms = JSON.parse(localStorage.getItem('chatRooms')) || [{ title: 'World Chat', description: 'A chat room for everyone', owner: 'admin' }];
let currentChatRoom = null;
let typingTimeout;

function signUp() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    if (username && password) {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        loggedInUser = { username, password };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        document.querySelector('.sign-up-form').style.display = 'none';
        document.querySelector('.chat-room-list').style.display = 'flex';
        updateChatRoomList();
    } else {
        alert('Please enter both username and password');
    }
}

function signIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        loggedInUser = user;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        document.querySelector('.sign-in-form').style.display = 'none';
        document.querySelector('.chat-room-list').style.display = 'flex';
        updateChatRoomList();
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    loggedInUser = null;
    localStorage.removeItem('loggedInUser');
    document.querySelector('.chat-container').style.display = 'none';
    document.querySelector('.chat-room-list').style.display = 'none';
    document.querySelector('.sign-in-form').style.display = 'flex';
}

function sendMessage() {
    if (loggedInUser && currentChatRoom) {
        const message = document.getElementById('message').value;
        if (message) {
            const chatBox = document.getElementById('chat-box');
            const messageElement = document.createElement('div');
            messageElement.className = 'message-box';
            messageElement.innerHTML = `<span>${loggedInUser.username}: ${message}</span><span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
            messageElement.oncontextmenu = (e) => {
                e.preventDefault();
                if (currentChatRoom.title !== 'World Chat' && confirm('Do you want to delete this message?')) {
                    chatBox.removeChild(messageElement);
                    deleteMessage(currentChatRoom.title, messageElement.innerHTML);
                }
            };
            chatBox.appendChild(messageElement);
            document.getElementById('message').value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
            saveMessage(currentChatRoom.title, messageElement.innerHTML);
        }
    } else {
        alert('You must be signed in and in a chat room to send messages');
    }
}

function saveMessage(roomTitle, message) {
    let messages = JSON.parse(localStorage.getItem(roomTitle)) || [];
    messages.push(message);
    localStorage.setItem(roomTitle, JSON.stringify(messages));
}

function loadMessages(roomTitle) {
    const messages = JSON.parse(localStorage.getItem(roomTitle)) || [];
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-box';
        messageElement.innerHTML = msg;
        messageElement.oncontextmenu = (e) => {
            e.preventDefault();
            if (roomTitle !== 'World Chat' && confirm('Do you want to delete this message?')) {
                chatBox.removeChild(messageElement);
                deleteMessage(roomTitle, messageElement.innerHTML);
            }
        };
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function deleteMessage(roomTitle, message) {
    let messages = JSON.parse(localStorage.getItem(roomTitle)) || [];
    messages = messages.filter(msg => msg !== message);
    localStorage.setItem(roomTitle, JSON.stringify(messages));
}

function joinChatRoom(room) {
    currentChatRoom = room;
    document.querySelector('.chat-room-list').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'flex';
    document.getElementById('chat-room-title-header').textContent = room.title;
    loadMessages(room.title);
}

function returnToChatRoomList() {
    document.querySelector('.chat-container').style.display = 'none';
    document.querySelector('.chat-room-list').style.display = 'flex';
}

function updateChatRoomList() {
    const chatRoomList = document.getElementById('chat-room-list');
    chatRoomList.innerHTML = '';
    chatRooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'chat-room-card';
        roomElement.innerHTML = `<h3>${room.title}</h3><p>${room.description}</p>`;
        roomElement.onclick = () => joinChatRoom(room);
        if (room.title !== 'World Chat') {
            roomElement.oncontextmenu = (e) => {
                e.preventDefault();
                if (confirm(`Are you sure you want to delete the chat room "${room.title}"?`)) {
                    deleteChatRoom(room);
                }
            };
        }
        chatRoomList.appendChild(roomElement);
    });
}

function deleteChatRoom(room) {
    chatRooms = chatRooms.filter(r => r !== room);
    localStorage.setItem('chatRooms', JSON.stringify(chatRooms));
    updateChatRoomList();
}

function showCreateChatRoomForm() {
    document.querySelector('.chat-room-list').style.display = 'none';
    document.querySelector('.create-chat-room-form').style.display = 'flex';
}

function cancelCreateChatRoom() {
    document.querySelector('.create-chat-room-form').style.display = 'none';
    document.querySelector('.chat-room-list').style.display = 'flex';
}

function createChatRoom() {
    const title = document.getElementById('chat-room-title').value;
    const description = document.getElementById('chat-room-description').value;
    if (title && description) {
        chatRooms.push({ title, description, owner: loggedInUser.username });
        localStorage.setItem('chatRooms', JSON.stringify(chatRooms));
        updateChatRoomList();
        cancelCreateChatRoom();
    } else {
        alert('Please enter both title and description');
    }
}

function showSignInForm() {
    document.querySelector('.sign-up-form').style.display = 'none';
    document.querySelector('.sign-in-form').style.display = 'flex';
}

function showSignUpForm() {
    document.querySelector('.sign-in-form').style.display = 'none';
    document.querySelector('.sign-up-form').style.display = 'flex';
}

function checkRememberedUser() {
    if (loggedInUser) {
        document.querySelector('.sign-in-form').style.display = 'none';
        document.querySelector('.sign-up-form').style.display = 'none';
        document.querySelector('.chat-room-list').style.display = 'flex';
        updateChatRoomList();
    } else {
        document.querySelector('.sign-up-form').style.display = 'flex';
    }
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingIndicator.style.display = 'none';
    }, 1000);
}

document.getElementById('message').addEventListener('input', showTypingIndicator);

window.onload = checkRememberedUser;
