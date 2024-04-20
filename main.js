const socket = io()

const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/tone.mp3')

messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    sendMessage()
})


socket.on('clients-total', (data) => {
    clientsTotal.innerHTML = `Total Clients: ${data}`
})

// Listen for user ID from the server
socket.on('user-id', (userID) => {
    console.log('Received user ID:', userID);
    // Now you can use the userID variable as needed in your client-side code
    // For example, update the UI to display the user ID
    document.getElementById('user-id').innerText = userID;
});

function sendMessage() {
    if (messageInput.value === '') return;
    
    const data ={
        name : nameInput.value,
        message : messageInput.value,
        dateTime : new Date()
    };

    addMessageToUI(true, data);
    socket.emit('message', data);
    messageInput.value = '';
}

socket.on('chat-message', (data) =>{
    //console.log(data)
    messageTone.play()
    addMessageToUI(false, data)
})


function toggleEmojis() {
    const emojiContainer = document.querySelector('.emoji-container');
    emojiContainer.classList.toggle('show');
}

function react(reaction) {
    console.log(`my reaction ${reaction}`);
}


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
        feedback: `✍ ${nameInput.value} is typing ...`
    })
})

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `✍ ${nameInput.value} is typing ...`
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

    messageContainer.innerHTML += element
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