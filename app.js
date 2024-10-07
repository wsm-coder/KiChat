let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = null;
let chatRooms = JSON.parse(localStorage.getItem('chatRooms')) || [{ title: 'World Chat', description: 'A chat room for everyone', owner: 'admin' }];
let currentChatRoom = null;

function signUp() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    if (username && password) {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign up successful! Please sign in.');
        document.querySelector('.sign-up-form').style.display = 'none';
        document.querySelector('.sign-in-form').style.display = 'flex';
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
        document.querySelector('.sign-in-form').style.display = 'none';
        document.querySelector('.chat-room-list').style.display = 'flex';
        updateChatRoomList();
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    loggedInUser = null;
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
            messageElement.textContent = `${loggedInUser.username}: ${message}`;
            chatBox.appendChild(messageElement);
            document.getElementById('message').value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
            saveMessage(currentChatRoom.title, messageElement.textContent);
        }
    } else {
        alert('You must be signed in and in a chat room to send messages');
    }
}

function updateChatRoomList() {
    const chatRoomList = document.getElementById('chat-room-list');
    chatRoomList.innerHTML = '';
    chatRooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'chat-room-card';
        roomElement.innerHTML = `<h3>${room.title}</h3><p>${room.description}</p>`;
        roomElement.onclick = () => joinChatRoom(room);
        roomElement.oncontextmenu = (e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to delete the chat room "${room.title}"?`)) {
                deleteChatRoom(room);
            }
        };
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

function joinChatRoom(room) {
    currentChatRoom = room;
    document.querySelector('.chat-room-list').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'flex';
    document.getElementById('chat-room-title-header').textContent = room.title;
    loadChatRoomMessages(room);
}

function saveMessage(roomTitle, message) {
    let messages = JSON.parse(localStorage.getItem(roomTitle)) || [];
    messages.push(message);
    localStorage.setItem(roomTitle, JSON.stringify(messages));
}

function loadChatRoomMessages(room) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    let messages = JSON.parse(localStorage.getItem(room.title)) || [];
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function adjustButtonPositions() {
    const logoutBtn = document.querySelector('.logout-btn');
    const returnBtn = document.querySelector('.return-btn');
    returnBtn.style.position = 'absolute';
    returnBtn.style.right = '10px';
    returnBtn.style.top = '10px';
    logoutBtn.style.position = 'absolute';
    logoutBtn.style.right = '10px';
    logoutBtn.style.top = '40px'; // Adjust this value as needed
}

// Call this function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', adjustButtonPositions);
function returnToChatRoomList() {
    document.querySelector('.chat-container').style.display = 'none';
    document.querySelector('.chat-room-list').style.display = 'flex';
}
