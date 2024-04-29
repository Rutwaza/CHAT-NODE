const socket = io()

const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')

//const nameInput = document.getElementById('name-input')
//nameInput.value = document.getElementById('username').innerText;

const username = document.getElementById('username')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const feedb = document.getElementById('feedb')
const messageTone = new Audio('/tone.mp3')

//nameInput.value = document.getElementById('username').innerText;

messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    sendMessage()
})


socket.on('active-users', (data) => {
    clientsTotal.textContent = `${data}`;
});

// Listen for user ID from the server
//socket.on('user-id', (userID) => {
//   console.log('Received user ID:', userID);
//   document.getElementById('user-id').innerText = userID;
//});

// Listen for the 'user-info' event emitted by the server
socket.on('user-info', (userInfo) => {
    console.log('Received user info:', userInfo);
    // Do something with the user info, such as updating the UI
    document.getElementById('user-id').innerText = userInfo.userID;
    document.getElementById('username').innerText = userInfo.username;
});

socket.on('email exist', () => {
    alert('this email has already registered.');
});

socket.on('login-error', () => {
    alert('incorrect email or password. Please try again.');
});

function sendMessage() {
    if (messageInput.value === '') return;
    
    const data ={
        name : document.getElementById('username').innerText,
        message : messageInput.value,
        dateTime : new Date()
    };

    addMessageToUI(true, data);
    socket.emit('message', data);
    messageInput.value = '';
}

socket.on('chat-message', (data) =>{
    messageTone.play()
    addMessageToUI(false, data)
})



function addMessageToUI(isOwnMessage, data){
    clearFeedback()
    const currentTime = moment().format(' HH:mm');
    const element = `
                <li class="${isOwnMessage ? "message-right" : "message-left"}">
                    <p class="message">
                        ${data.message}
                        <span>${data.name}  ${currentTime}</span>
                    </p>
                </li>`
                document.getElementById('message-container').innerHTML += element;
                scrollToBottom();
}



function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `✍ ${document.getElementById('username').innerText} is typing ...`
    })
})

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `✍ ${document.getElementById('username').innerText} is typing ...` 
    })
})

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ''
    })
})

socket.on('feedback' , (data) => {
    clearFeedback()
    const element = `
                <li class="message-feedback">
                    <p class="feedback" id="feedback">
                        ${data.feedback}
                    </p>
                </li>`

    feedb.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}

document.addEventListener('DOMContentLoaded', function () {
    const currentTime = moment().format('HH:mm');
    document.getElementById('message-time').textContent = currentTime;
});


/*
document.addEventListener('DOMContentLoaded', function () {
    const isSignedUp = true; 

    if (isSignedUp) {
        window.location.href = './login.html'; 
    } else {
        window.location.href = '/signup.html'; 
    }
});
*/

