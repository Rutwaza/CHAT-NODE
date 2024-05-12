// const express = require('express');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 4000;
// const server = app.listen(PORT, () => console.log(`Server on port ${PORT}`));
// const mysql = require('mysql');
// const session = require('express-session');
// const bcrypt = require('bcrypt');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Specify the destination folder for uploaded files
// const crypto = require('crypto');

// // Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex'); 
// console.log('Generated secret key:', secretKey);

// const dbConfig = {
//     host: 'localhost',
//     user: 'root', // Replace with your MySQL username
//     password: '', // Replace with your MySQL password
//     database: 'chat' // Replace with your MySQL database name
// };

// const connection = mysql.createConnection(dbConfig);
// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// const io = require('socket.io')(server);

// // Session middleware
// app.use(session({
//     secret: secretKey, // Replace with a secret key for session encryption
//     resave: false,
//     saveUninitialized: false
// }));

// // Define routes
// app.get('/index', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Login route
// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// // Signup route
// app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'signup.html'));
// });

// // Parse URL-encoded bodies for form data
// app.use(express.urlencoded({ extended: false }));

// // Function to retrieve users from the database
// function getUsersFromDatabase(callback) {
//     const query = 'SELECT * FROM users';
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Error retrieving users from database:', err);
//             callback(err, null);
//             return;
//         }
//         callback(null, results);
//     });
// }

// // Signup route handler
// app.post('/signup', upload.single('profile'), (req, res) => {
//     const { username, email, gender, dob, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//         res.status(400).send('Passwords do not match');
//         return;
//     }

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//             console.error('Error hashing password:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         const profilePhoto = req.file ? req.file.path : null;

//         const sql = 'INSERT INTO users (Username, Email, Gender, DateOfBirth, PasswordHash, ProfilePhoto) VALUES (?, ?, ?, ?, ?, ?)';
//         connection.query(sql, [username, email, gender, dob, hashedPassword, profilePhoto], (err, result) => {
//             if (err) {
//                 console.error('Error inserting user into database:', err);
//                 res.status(500).send('Internal Server Error');
//                 return;
//             }
//             res.send('Registered successfully');
//         });
//     });
// });

// // Login route handler
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     getUsersFromDatabase((err, users) => {
//         if (err) {
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         const user = users.find(e => e.Email === email);
//         if (!user) {
//             res.status(401).send('Invalid Email');
//             return;
//         }
//         bcrypt.compare(password, user.PasswordHash, (bcryptErr, result) => {
//             if (bcryptErr) {
//                 res.status(500).send('Internal Server Error');
//                 return;
//             }
//             if (!result) {
//                 res.status(401).send('Invalid Username or Password');
//                 return;
//             }
//             req.session.userID = user.UserID;
//             res.redirect('/index'); // Redirect to /index after login
//         });
//     });
// });

// // Logout route handler
// app.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Error destroying session:', err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.redirect('/login');
//     });
// });

// // Socket.io connection handler  **************************
// function onConnected(socket) {
//     console.log(socket.id);
//     let socketsConnected = new Set();
//     socketsConnected.add(socket.id);
//     io.emit('clients-total', socketsConnected.size);

//     connection.query('SELECT * FROM messages', (err, results) => {
//         if (err) {
//             console.error('Error retrieving messages from database:', err);
//             return;
//         }
//         results.forEach(message => {
//             socket.emit('chat-message', message);
//         });
//     });

//     if (socket.handshake.session && socket.handshake.session.userID) {
//         const userID = socket.handshake.session.userID;
//         socket.emit('user-id', userID);
//     }

//     socket.on('disconnect', () => {
//         console.log('socket disconnected', socket.id);
//         socketsConnected.delete(socket.id);
//         io.emit('clients-total', socketsConnected.size);
//     });

//     socket.on('message', (data) => {
//         saveMessageToDatabase(data);
//         socket.broadcast.emit('chat-message', data);
//     });

//     socket.on('feedback', (data) => {
//         socket.broadcast.emit('feedback', data);
//     });
// }

// io.on('connection', onConnected);

// // Function to save message to the database **************************
// function saveMessageToDatabase(data) {
//     const { name, message, dateTime } = data;
//     const query = 'INSERT INTO messages (name, message, dateTime) VALUES (?, ?, ?)';
//     connection.query(query, [name, message, dateTime], (err, results) => {
//         if (err) {
//             console.error('Error saving message to database:', err);
//             return;
//         }
//         console.log('Message saved to database:', results);
//     });
// }

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mysql = require("mysql")
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const sharedSession = require('express-socket.io-session');

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const io = socketIO(server);

// Serve your HTML files
app.use(express.static('public'));
app.use(cookieParser());

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
const sessionMiddleware = session({
    secret: 'JpV~zQ92F4eK#7$!y@%e&6@8!Dg*m^A',
    resave: false,
    saveUninitialized: true
});

app.use(sessionMiddleware);

// Configure Socket.io to use the same session middleware
io.use(sharedSession(sessionMiddleware, {
    autoSave:true
}));

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Homepage.html'));
});

app.get('/onemess', (req, res) => {
    res.sendFile(path.join(__dirname, 'onemess.html'));
});

// Database connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat'
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM users WHERE Email = ?', [email], (err, results) => {
        if (err) {
            //console.error('Error querying database:', err);
            //res.status(500).send('Error logging in. Please try again later.');
            return res.status(500).sendFile(path.join(__dirname, '/public/error_db.html'));

        }

        if (results.length === 0) {
            //res.status(401).send('Incorrect email or password test_again');
            return res.status(500).sendFile(path.join(__dirname, '/public/error.html'));
        }

        const user = results[0];
        if (password === user.PasswordHash) {
            req.session.userID = user.UserID;
            req.session.username = user.Username; // Store username in session
            console.log('User ID:', req.session.userID);
            console.log('Username:', req.session.username); // Log the username
                        
            res.redirect('/index.html');
        } else {
            res.status(500).sendFile(path.join(__dirname, '/public/error.html'));
        }
    });
});


// Handle signup endpoint
app.post('/signup', (req, res) => {
    console.log('Received signup data:', req.body);

    const { username, email, gender, password } = req.body;

    const sql = `INSERT INTO users (Username, Email, Gender, PasswordHash, DateAdded) 
                 VALUES (?, ?, ?, ?, NOW())`;
    
    connection.query(sql, [username, email, gender, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            // Redirect to the error page
            //res.status(500).send('Error signing up. Please try again later.');
            //res.status(500).sendFile(path.join(__dirname, '/public/error_db.html'));
            //return res.status(500).sendFile(path.join(__dirname, '/public/error_db.html'));
            return res.redirect('./error_db.html');
        }

        console.log('User signed up successfully');
        // Redirect to the success page
        res.redirect('./success.html');
    });
});

             
/////////////////////////////--------------///////////////////////////
// Store the active socket connections
const activeSockets = {};

io.use((socket, next) => {
  // Retrieve the userID from the session
  const userID = socket.handshake.session.userID;
  if (!userID) {
    return next(new Error('User not authenticated'));
  }
  
  // Associate the socket with the user ID
  activeSockets[userID] = socket;
  console.log(`User ${userID} authenticated`);
  return next();
});
///////////////////////////////-------------////////////////////////////

// Socket.io connection handler
function onConnected(socket) {
    console.log(socket.id);
    let socketsConnected = new Set();
    socketsConnected.add(socket.id);
    io.emit('active-users', socketsConnected.size);

    /*
    / Add the socket to the userSockets map when a user connects
    socket.on('user-connect', (userID) => {
        userSockets[userID] = socket;
    });
    */

    connection.query('SELECT * FROM messages', (err, results) => {
        if (err) {
            console.error('Error retrieving messages from database:', err);
            return;
        }
        results.forEach(message => {
            socket.emit('chat-message', message);
        });
    });

    ///////////////////////////////////////////////////////////////////////
        /* Fetch all unique names from the 'messages' table
    connection.query('SELECT DISTINCT name FROM messages', (err, results) => {
        if (err) {
            console.error('Error retrieving names from database:', err);
            return;
        }

        // Iterate through the results and add each name to the members div
        results.forEach(name => {
            console.log(name);
            socket.emit('members',name)
        });
    }); */
    ////////////////////////----testing -------///////////////////////////////
    connection.query('SELECT DISTINCT name FROM messages', (err, results) => {
        if (err) {
            console.error('Error retrieving names from database:', err);
            return;
        }

        // Collect all names into an array
        const names = results.map(result => result.name);

        // Query to retrieve IDs for all names in the array
        connection.query('SELECT UserID, Username FROM users WHERE Username IN (?)', [names], (err, userResults) => {
            if (err) {
                console.error('Error retrieving IDs for names:', err);
                return;
            }
        
            // Emit userResults directly to the client
            socket.emit('all-members', userResults);
        });
        
    });

    /////////////////////////////////////////////////////////////////////////
        // Emit all users to the client
    connection.query('SELECT UserID, Username FROM users', (err, userResults) => {
        if (err) {
            console.error('Error retrieving users from database:', err);
            return;
        }
        // Emit userResults directly to the client
        socket.emit('all-users', userResults);
    });

    /////////////////////////////////////////////////////////////////////////

    if (socket.handshake.session && socket.handshake.session.userID) {
        const userID = socket.handshake.session.userID;
        const username = socket.handshake.session.username;
        socket.emit('user-info', { userID, username });

    }

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('active-users', socketsConnected.size);
    });

    socket.on('message', (data) => {
        saveMessageToDatabase(data);
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });


    ////////>>>>>>>>>>>>>>>>>>>>>handleling private messages<<<<<<<<<<<<<<<<<<<///////////
    // Handle private messages
        socket.on('private-message', (data) => {
            const { recipientID, message} = data;
            console.log(data);
            const senderID = socket.handshake.session.userID;

            if (activeSockets[recipientID]) {
                activeSockets[recipientID].emit('private-message', { sender: senderID, message });
                socket.emit('private-message', { sender: senderID, message });
            } else {
                socket.emit('private-message-error', { error: `Recipient ${recipientID} is not available` });
            }
        });
}

io.on('connection', onConnected);

/// Function to convert JavaScript date to MySQL format
function toMysqlFormat(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Function to save message to the database
function saveMessageToDatabase(data) {
    const { name, message, dateTime } = data;
    const formattedDateTime = toMysqlFormat(new Date(dateTime));
    const query = 'INSERT INTO messages (name, message, dateTime) VALUES (?, ?, ?)';
    connection.query(query, [name, message, formattedDateTime], (err, results) => {
        if (err) {
            console.error('Error saving message to database:', err);
            return;
        }
        console.log('Message saved to database:', results);
    });
}



