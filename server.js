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

// // Socket.io connection handler
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

// // Function to save message to the database
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
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const path = require('path'); // Import the path module

const PORT = 8080;

// Serve your HTML files
app.use(express.static('public'));

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Handle root path
app.get('/', (req, res) => {
    // You can send a specific HTML file
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

// Handle login endpoint
// app.post('/login', (req, res) => {
//     // Check user credentials (you need to implement this logic)
//     const validCredentials = true; // Replace with your actual authentication logic

//     if (validCredentials) {
//         // Redirect to the Ghost Line page on successful login
//         res.redirect('/index.html');
//     } else {
//         res.send('Incorrect email or password');
//     }
// });


// Handle login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check the credentials against a database or any other authentication mechanism
    if (email === 'example@email.com' && password === 'password') {
        // Set up a session for the user
        req.session.userID = 123; // Replace 123 with the actual user ID

        // Redirect to the index page on successful login
        res.redirect('/index.html');
    } else {
        // Handle incorrect credentials
        res.send('Incorrect email or password');
    }
});



// Handle signup endpoint
app.post('/signup', (req, res) => {
    console.log('Received signup data:', req.body);

    // Redirect to the login page after successful signup
    res.redirect('./login.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
