const socket = io()

const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const loginForm = document.querySelector('form')

loginForm.addEventListener("submit", async(data) => {
    console.log(data)
    const response = await fetch("http://localhost:9000", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    if(response.status === 201) {
        // ...addMessageToUI.
    }
})

const messageTone = new Audio('/tone.mp3')

messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    sendMessage()
})


socket.on('active-users', (data) => {
    clientsTotal.textContent = `Total active users: ${data}`;
});


socket.on('user-id', (userID) => {
    console.log('Received user ID:', userID);
   
    document.getElementById('user-id').innerText = userID;
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
        name : nameInput.value,
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
//