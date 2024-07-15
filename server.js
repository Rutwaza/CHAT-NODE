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
const path = require('path');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const sharedSession = require('express-socket.io-session');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8000;
const app = express();
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const io = socketIO(server);

app.use(cookieParser());

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection configuration
const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat'
};

const connection = mysql.createConnection(dbOptions);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Configure session store
const sessionStore = new MySQLStore(dbOptions);

// Configure session middleware
const sessionMiddleware = session({
    key: 'session_cookie_name',
    secret: 'JpV~zQ92F4eK#7$!y@%e&6@8!Dg*m^A',
    store: sessionStore,
    resave: false,
    saveUninitialized: false, // Change to false to avoid creating empty sessions
    cookie: {
        sameSite: 'lax',
        secure: false, // Ensure this is false if not using HTTPS
        maxAge: 180 * 60 * 1000 // 3 hours
    }
});

app.use(sessionMiddleware);

// Configure Socket.io to use the same session middleware
io.use(sharedSession(sessionMiddleware, {
    autoSave: true
}));

// Serve your HTML files
app.use(express.static('public'));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Debugging middleware
app.use((req, res, next) => {
    console.log('Cookies:', req.cookies); // Log cookies
    console.log('Session:', req.session); // Log session data
    next();
});

// Global middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    console.log('Session Data:', req.session); // Log session data
    if (!req.session.userID) {
        console.log('User not authenticated. Redirecting to login.');
        return res.redirect('/login');
    }
    next();
}

// Apply authentication check middleware to protected routes
app.use(['/onemess', '/homepage', '/xman'], isAuthenticated);

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route to serve the protected HTML file
app.get('/onemess', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'onemess.html'));
});

app.get('/xman', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'xman.html'));
});

// Serve homepage page
app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

// Serve the goods posting page
app.get('/post-good', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post-good.html'));
});

// Handle login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM users WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).sendFile(path.join(__dirname, '/public/error_db.html'));
        }

        if (results.length === 0) {
            return res.status(401).sendFile(path.join(__dirname, '/public/error.html'));
        }

        const user = results[0];
        if (password === user.PasswordHash) {
            req.session.userID = user.UserID;
            req.session.username = user.Username;
            req.session.save((err) => { // Ensure the session is saved before redirecting
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).sendFile(path.join(__dirname, '/public/error_db.html'));
                }
                console.log('User ID:', req.session.userID);
                console.log('Username:', req.session.username);
                res.redirect('/homepage');
            });
        } else {
            res.status(401).sendFile(path.join(__dirname, '/public/error.html'));
        }
    });
});

// Handle signup endpoint
app.post('/signup', (req, res) => {
    console.log('Received signup data:', req.body);

    const { username, email, gender, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).sendFile(path.join(__dirname, '/public/error_pass.html'));
    }

    const sql = `INSERT INTO users (Username, Email, Gender, PasswordHash, DateAdded) 
                 VALUES (?, ?, ?, ?, NOW())`;

    connection.query(sql, [username, email, gender, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).redirect('./error_db.html');
        }

        console.log('User signed up successfully');
        res.redirect('./success.html');
    });
});


// Route to handle goods posting
app.post('/post-good', upload.single('image'), (req, res) => {
    const { name, description, sellerID } = req.body;
    const imagePath = req.file.path;

    const sql = 'INSERT INTO goods (name, description, imagePath, sellerID) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, description, imagePath, sellerID], (err, result) => {
        if (err) {
            console.error('Error posting good:', err);
            res.status(500).send('Error posting good');
            return;
        }
        res.send('Good posted successfully');
    });
});


// Route to get all goods
app.get('/goods', (req, res) => {
    const sql = 'SELECT * FROM goods';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching goods:', err);
            res.status(500).send('Error fetching goods');
            return;
        }
        res.json(results);
    });
});

// Route to search for goods
app.get('/search', (req, res) => {
    const { query } = req.query;
    const sql = 'SELECT * FROM goods WHERE name LIKE ? OR description LIKE ?';
    connection.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Error searching goods:', err);
            res.status(500).send('Error searching goods');
            return;
        }
        res.json(results);
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

    connection.query('SELECT * FROM messages', (err, results) => {
        if (err) {
            console.error('Error retrieving messages from database:', err);
            return;
        }
        results.forEach(message => {
            socket.emit('chat-message', message);
        });
    });

    connection.query('SELECT DISTINCT name FROM messages', (err, results) => {
        if (err) {
            console.error('Error retrieving names from database:', err);
            return;
        }

        const names = results.map(result => result.name);

        connection.query('SELECT UserID, Username FROM users WHERE Username IN (?)', [names], (err, userResults) => {
            if (err) {
                console.error('Error retrieving IDs for names:', err);
                return;
            }

            socket.emit('all-members', userResults);
        });
    });

    connection.query('SELECT UserID, Username FROM users', (err, userResults) => {
        if (err) {
            console.error('Error retrieving users from database:', err);
            return;
        }
        socket.emit('all-users', userResults);
    });

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

    socket.on('private-message', (data) => {
        const { recipientID, message } = data;
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

// Function to convert JavaScript date to MySQL format
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
