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

    if(data.name == document.getElementById('username').innerText){
    addMessageToUI(true, data)
    }else{
        addMessageToUI(false, data)  
    }
})

socket.on('all-members', (userResults) => {
    // Assuming you want to display the user data in the console
    console.log('All Members:');
    console.log(userResults);
    // Alternatively, you can process and display the user data in the UI
    userResults.forEach(user => {
        // Display each user's UserID and Username
        console.log(`UserID: ${user.UserID}, Username: ${user.Username}`);
        membersui(user);

        // You can also update the UI with this data if needed
    });
});

function membersui(user){
    const element = `
                <li>
                    <p>
                        ${user.Username}
                    </p>
                    <button id="inb" class="inbox-btn" data-userid="${user.UserID}">Inbox</button>
                </li>`
                document.getElementById('memberp').innerHTML += element;
                
}

//////////////////////////////////////////////////////////////

   //making username button redirect to private chat
   // Event listener for the "Inbox" button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('inbox-btn')) {
        const userId = event.target.dataset.userid;
        // Redirect the user to the onemess.html page while preserving the session
        window.location.href = `http://localhost:8000/onemess.html?userId=${userId}`;
    }
});

////////////////////////////////////////////////////////////////



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


