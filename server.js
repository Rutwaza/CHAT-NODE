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
const { type } = require('os');
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


// USING EXTERNAL VARIABLES DATABASES

/* // Database connection configuration
const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const connection = mysql.createConnection(dbOptions);*/

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
// Middleware to serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debugging middleware
app.use((req, res, next) => {
    //console.log('Cookies:', req.cookies); // Log cookies
    //console.log('Session:', req.session); // Log session data
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


// Serve notifications page
app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notifications.html'));
});


// Serve the goods posting page
app.get('/post-good', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post-good.html'));
});

app.get('/groups',(req,res) =>{
    res.sendFile(path.join(__dirname,'public', 'groups.html'));
})

app.get('/groupage',(req,res) => {
    res.sendFile(path.join(__dirname,'public', 'groupage.html'));
})

app.get('/uploads', (req, res) => {
    res.send(path.join(__dirname, 'uploads'));
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
    const sql = `
        SELECT g.id, g.name, g.description, g.imagePath, g.likes, u.Username, u.UserID 
        FROM goods g 
        JOIN users u ON g.sellerID = u.UserID
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching goods:', err);
            res.status(500).send('Error fetching goods');
            return;
        }
        res.json(results);
        //console.log(results);
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

// Endpoint to check if items are liked
app.get('/check-likes', (req, res) => {
    const userId = req.session.userID; // Assuming user ID is available
    connection.query('SELECT goodId FROM likes WHERE userId = ?', [userId], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json(results);
    });
});
         
// Endpoint to handle like
app.post('/like', (req, res) => {
    const userId = req.session.userID; // Assuming user ID is available
    const { goodId } = req.body;

    // Fetch the good owner's userID and username for the notification
    connection.query('SELECT sellerID FROM goods WHERE id = ?', [goodId], (error, results) => {
        if (error) return res.status(500).json({ error });

        if (results.length === 0) {
            return res.status(404).json({ error: 'Good not found' });
        }

        const goodOwnerID = results[0].sellerID;
        const likerUsername = req.session.username; // Assuming username is stored in session

        // Add like to the database
        connection.query('INSERT INTO likes (userId, goodId) VALUES (?, ?)', [userId, goodId], (error, results) => {
            if (error) return res.status(500).json({ error });

            // Increment the like count in the goods table
            connection.query('UPDATE goods SET likes = likes + 1 WHERE id = ?', [goodId], (error, results) => {
                if (error) return res.status(500).json({ error });

                // Save a notification for the good owner
                const notificationMessage = `${likerUsername} has liked your good`;
                connection.query('INSERT INTO notifications (userID, type, message) VALUES (?, ?, ?)', [goodOwnerID, 'like', notificationMessage], (error, results) => {
                    if (error) return res.status(500).json({ error });

                    // Emit the new-notification event to the specific user
                    if (activeSockets[goodOwnerID]) {
                        activeSockets[goodOwnerID].emit('new-notification', { message: notificationMessage });
                    }

                    res.json({ success: true });
                });
            });
        });
    });
});


////-----------Create endpoints to retrieve the chat list and messages------------/////
app.get('/chats', (req, res) => {
    const userID = req.session.userID;

    const query = `
        SELECT DISTINCT
            CASE
                WHEN senderID = ? THEN recipientID
                WHEN recipientID = ? THEN senderID
            END AS chatUserID
        FROM inbox
        WHERE senderID = ? OR recipientID = ?`;

    connection.query(query, [userID, userID, userID, userID], (err, results) => {
        if (err) {
            console.error('Error retrieving chat list:', err);
            res.status(500).send('Server error');
            return;
        }

        // Assuming you have a users table to get usernames
        const userIDs = results.map(row => row.chatUserID);
        const userQuery = 'SELECT UserID, Username FROM users WHERE UserID IN (?)';
        connection.query(userQuery, [userIDs], (userErr, userResults) => {
            if (userErr) {
                console.error('Error retrieving user info:', userErr);
                res.status(500).send('Server error');
                return;
            }
            res.json(userResults);
        });
    });
});

app.get('/messages/:chatUserID', (req, res) => {
    const userID = req.session.userID;
    const chatUserID = req.params.chatUserID;

    const query = `
        SELECT *
        FROM inbox
        WHERE (senderID = ? AND recipientID = ?)
        OR (senderID = ? AND recipientID = ?)
        ORDER BY timestamp`;

    connection.query(query, [userID, chatUserID, chatUserID, userID], (err, results) => {
        if (err) {
            console.error('Error retrieving messages:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

app.post('/api/private/deleteMessage', (req, res) => {
    const { messageID, userID } = req.body;

    //console.log('fovvvvv' + messageID);

    // Check if the user is the sender of the message
    const query = 'DELETE FROM inbox WHERE id = ? AND senderID = ?';
    connection.query(query, [messageID, userID], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to delete message' });
        }
        if (result.affectedRows === 0) {
            return res.status(403).json({ success: false, error: 'You can only delete your own messages' });
        }
        res.json({ success: true });
    });
});

///////---------------------------------------------------------///////////////////

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Name of the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

//---------------------------------------->>>
app.get('/unread-message-count', (req, res) => {
    const userID = req.session.userID;
    //console.log("userrrr notif" + userID);

    const query = 'SELECT COUNT(*) AS unreadCount FROM inbox WHERE recipientID = ? AND isRead = FALSE';
    connection.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error counting unread messages:', err);
            res.status(500).json({ success: false, error: 'Server error' });
            return;
        }
        const unreadCount = results[0].unreadCount;
        res.json({ unreadCount });
    });
});

app.post('/mark-messages-as-read/:recipientID', (req, res) => {
    const userID = req.session.userID;
    const recipientID = req.params.recipientID;

    const query = `
        UPDATE inbox
        SET isRead = TRUE
        WHERE recipientID = ? AND senderID = ? AND isRead = FALSE`;

    connection.query(query, [userID, recipientID], (err, results) => {
        if (err) {
            console.error('Error marking messages as read:', err);
            res.status(500).json({ success: false, error: 'Server error' });
            return;
        }
        res.json({ success: true });
    });
});


// Endpoint to fetch notifications
app.get('/api/notifications', (req, res) => {
    const userId = req.session.userID; // Assuming user ID is available

    // Fetch notifications from the database
    connection.query('SELECT * FROM notifications WHERE userId = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Send notifications as JSON
        res.json(results.map(notification => ({
            message: notification.message,
            createdAt: notification.createdAt,
            type: notification.type,
            id: notification.id,
            userID: notification.userID,
            senderID: notification.senderID
        })));
    });
});

// Endpoint to mark notifications as read
app.post('/api/mark-notifications-as-read', (req, res) => {
    const userId = req.session.userID; // Assuming user ID is available

    // Update notifications to mark them as read
    connection.query('UPDATE notifications SET isRead = 1 WHERE userId = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error marking notifications as read:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Emit event to update unread count on the client side
        io.to(userId).emit('unread-notes-count', { unreadCount: 0 });

        res.json({ success: true });
    });
});



// Endpoint to fetch unread notifications count
app.get('/unread-notifications-count', (req, res) => {
    const userId = req.session.userID;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = 'SELECT COUNT(*) AS unreadCount FROM notifications WHERE userID = ? AND isRead = 0';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json({ unreadCount: results[0].unreadCount });
    });
});


// Endpoint to delete a notification
app.delete('/api/notifications/:id', (req, res) => {
    const notificationId = req.params.id;

    connection.query('DELETE FROM notifications WHERE id = ?', [notificationId], (error, results) => {
        if (error) {
            console.error('Error deleting notification:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ success: true });
    });
});


// Endpoint to delete all notifications for the user
app.delete('/api/notifications_delete_all', (req, res) => {
    const userId = req.session.userID;
    console.log("nots id ud " + userId);

    if (!userId) {
        return res.status(403).json({ success: false, error: 'User not authenticated' });
    }

    // Delete all notifications for the user
    const deleteQuery = 'DELETE FROM notifications WHERE userID = ?';
    connection.query(deleteQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error deleting notifications--:', err);
            return res.status(500).json({ success: false, error: 'Failed to delete notifications' });
        }

        res.json({ success: true });
    });
});


// Endpoint to create a new group
app.post('/api/groups/create', (req, res) => {
    const { group_name, passcode, max_members } = req.body;
    const created_by = req.session.userID;

    if (!created_by) {
        return res.status(403).json({ success: false, error: 'User not authenticated' });
    }

    const query = 'INSERT INTO groups (groupName, groupPasscode, createdBy, memberLimit, createdAt) VALUES (?, ?, ?, ?, NOW())';
    connection.query(query, [group_name, passcode, created_by, max_members], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to create group' });
        }
        const group_id = result.insertId;
        // Automatically add the creator as a member of the group
        const membershipQuery = 'INSERT INTO group_members (groupID, userID, joinedAt) VALUES (?, ?, NOW())';
        connection.query(membershipQuery, [group_id, created_by], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to add creator to group' });
            }
            res.json({ success: true, group_id });
        });
    });
});

// Endpoint to join an existing group
app.post('/api/groups/join', (req, res) => {
    const { group_id, passcode } = req.body;
    const user_id = req.session.userID;

    if (!user_id) {
        return res.status(403).json({ success: false, error: 'User not authenticated' });
    }

    console.log('Received group_id:', group_id);
    console.log('Received passcode:', passcode);

    const query = 'SELECT groupPasscode FROM groups WHERE groupID = ?';
    connection.query(query, [group_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }

        console.log('Stored passcode:', results[0].groupPasscode);

        if (results[0].groupPasscode !== passcode) {
            return res.status(403).json({ success: false, error: 'Incorrect passcode' });
        }

        // Add user to the group
        const membershipQuery = 'INSERT INTO group_members (groupID, userID) VALUES (?, ?)';
        connection.query(membershipQuery, [group_id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to join group' });
            }
            res.json({ success: true });
        });
    });
});


// Endpoint to search for groups by name
app.get('/api/groups/search', (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery) {
        return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const query = 'SELECT groupID, groupName FROM groups WHERE groupName LIKE ?';
    connection.query(query, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to search for groups' });
        }

        res.json({ success: true, groups: results });
    });
});

// Endpoint to get all members of a group
app.get('/api/groups/:group_id/members', (req, res) => {
    const group_id = req.params.group_id;
    console.log("th fk ID" + group_id);

    const query = `
        SELECT users.UserID, users.Username  
        FROM group_members 
        JOIN users ON group_members.UserID = users.UserID 
        WHERE group_members.groupID = ?
    `;
    connection.query(query, [group_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve group members' });
        }
        res.json({ success: true, members: results });
        console.log(results+ "check in");
    });
});

// Example Express route to check group ownership
app.get('/api/groups/:groupID/isOwner', (req, res) => {
    const groupID = req.params.groupID;
    const userID = parseInt(req.query.userID, 10);

    const query = 'SELECT createdBy FROM groups WHERE groupID = ?';
    connection.query(query, [groupID], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: 'Database query failed' });
        }

        if (result.length > 0) {
            const createdBy = result[0].createdBy;
            const isOwner = createdBy === userID;
            console.log(`GroupID: ${groupID}, CreatedBy: ${createdBy}, UserID: ${userID}, IsOwner: ${isOwner}`);
            res.json({ success: true, isOwner });
        } else {
            res.json({ success: false, message: 'Group not found' });
        }
    });
});

// Endpoint to remove a member from the group
app.post('/api/groups/:group_id/members/remove', (req, res) => {
    const group_id = req.params.group_id;
    const member_id = req.body.member_id;
    const user_id = req.session.userID;


    if (!user_id) {
        return res.status(403).json({ success: false, error: 'User not authenticated' });
    }

    // Check if the user is the owner of the group
    const ownerQuery = 'SELECT createdBy FROM groups WHERE groupID = ?';
    connection.query(ownerQuery, [group_id], (err, results) => {
        if (err || results.length === 0 || results[0].createdBy !== user_id) {
            return res.status(403).json({ success: false, error: 'Only the group owner can remove members' });
        }

        // Remove the member from the group
        const removeQuery = 'DELETE FROM group_members WHERE groupID = ? AND userID = ?';
        connection.query(removeQuery, [group_id, member_id], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to remove member from group' });
            }
            res.json({ success: true });
        });
    });
});

// Endpoint to leave a group
app.post('/api/groups/leave', (req, res) => {
    const { groupID, userID } = req.body;

    if (!userID) {
        return res.status(403).json({ success: false, error: 'User not authenticated' });
    }

    // Check if the user is the group owner
    const checkOwnerQuery = 'SELECT createdBy FROM groups WHERE groupID = ?';
    connection.query(checkOwnerQuery, [groupID], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }

        const createdBy = results[0].createdBy;

        if (userID === createdBy) {
            return res.status(403).json({ success: false, error: 'Owner cannot leave the group, consider deleting the group instead' });
        }

        // Remove the user from the group
        const removeMemberQuery = 'DELETE FROM group_members WHERE groupID = ? AND userID = ?';
        connection.query(removeMemberQuery, [groupID, userID], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to leave the group' });
            }

            res.json({ success: true });
        });
    });
});

// Endpoint to check if the user is a member of a group
app.get('/api/groups/:group_id/checkMembership', (req, res) => {
    const group_id = req.params.group_id;
    const user_id = req.session.userID;

    if (!user_id) {
        return res.status(403).json({ success: false, error: 'User not authenticated' });
    }

    const query = 'SELECT * FROM group_members WHERE groupID = ? AND userID = ?';
    connection.query(query, [group_id, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to check membership' });
        }

        if (results.length > 0) {
            res.json({ success: true, isMember: true });
        } else {
            res.json({ success: true, isMember: false });
        }
    });
});


// Endpoint to get group details
// Endpoint to get group details including the creator's name
app.get('/api/groups/:group_id/details', (req, res) => {
    const group_id = req.params.group_id;

    const query = `
       SELECT groups.groupName, users.Username AS creator_name
        FROM groups
        JOIN users ON groups.createdBy = users.UserID
        WHERE groups.groupID = ?;
    `;
    connection.query(query, [group_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve group details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, error: 'Group not found' });
        }
        res.json({ success: true, group: results[0] });
    });
});

// Endpoint to get all messages from a group
app.get('/api/groups/:group_id/messages', (req, res) => {
    const group_id = req.params.group_id;

    const query = `
        SELECT group_messages.messageID, users.Username, group_messages.message, group_messages.sentAt, group_messages.userID
        FROM group_messages
        JOIN users ON group_messages.userID = users.UserID
        WHERE group_messages.groupID = ?
        ORDER BY group_messages.sentAt ASC
    `;

    connection.query(query, [group_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
        }
        res.json({ success: true, messages: results });
    });
});

// Endpoint to delete a message
app.post('/api/groups/:group_id/messages/:message_id/delete', (req, res) => {
    const { group_id, message_id } = req.params;
    const user_id = req.session.userID;

    const query = 'DELETE FROM group_messages WHERE messageID = ? AND userID = ? AND groupID = ?';
    connection.query(query, [message_id, user_id, group_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to delete message' });
        }
        if (result.affectedRows === 0) {
            return res.status(403).json({ success: false, error: 'You are not authorized to delete this message' });
        }
        res.json({ success: true });
    });
})

// Endpoint to get groups created by the user
app.get('/api/user/:userID/createdGroups', (req, res) => {
    const userID = req.params.userID;

    const query = `
        SELECT groupID, groupName
        FROM groups
        WHERE createdBy = ?
    `;

    connection.query(query, [userID], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve groups' });
        }
        res.json({ success: true, groups: results });
    });
});

// Endpoint to get all groups
app.get('/api/all_groups', (req, res) => {
    const query = 'SELECT groupID, groupName FROM groups';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve groups' });
        }
        res.json({ success: true, groups: results });
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

    // Join the group room
    socket.on('joinGroup', ({ groupID }) => {
        socket.join(groupID);
        console.log(`User ${socket.id} joined group ${groupID}`);
    });

    // Handle sending a message
    socket.on('sendMessage', ({ groupID, userID, message }) => {
        // First, fetch the username from the database using the userID
        const userQuery = 'SELECT Username FROM users WHERE UserID = ?';
        connection.query(userQuery, [userID], (err, userResults) => {
            if (err || userResults.length === 0) {
                console.error('Failed to retrieve username:', err);
                return;
            }

            const username = userResults[0].Username;

            // Now, insert the message into the database
            const query = 'INSERT INTO group_messages (groupID, userID, message) VALUES (?, ?, ?)';
            connection.query(query, [groupID, userID, message], (err, result) => {
                if (err) {
                    console.error('Failed to send message:', err);
                    return;
                }

                const messageID = result.insertId;  // Get the ID of the inserted message

                // Broadcast the message to all members of the group, including the username and messageID
                io.to(groupID).emit('receiveMessage', {
                    username,  // Send the username instead of the userID
                    message,
                    messageID, // Send the messageID
                    userID,    // Send the userID to check for the delete button
                    timestamp: new Date()
                });
            });
        });
    });



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
        const senderID = socket.handshake.session.userID;
    
        const usernameQuery = 'SELECT Username FROM users WHERE UserID = ?';
        connection.query(usernameQuery, [senderID], (err, results) => {
            if (err) {
                console.error('Error fetching sender username from the database:', err);
                socket.emit('private-message-error', { error: 'Failed to fetch sender username' });
                return;
            }
    
            const senderUsername = results[0].Username;
    
            const query = 'INSERT INTO inbox (senderID, recipientID, message, isRead, senderUsername) VALUES (?, ?, ?, FALSE, ?)';
            connection.query(query, [senderID, recipientID, message, senderUsername], (err, result) => {
                if (err) {
                    console.error('Error saving message to the database:', err);
                    socket.emit('private-message-error', { error: 'Failed to save message' });
                    return;
                }
    
                const messageID = result.insertId;  // Get the inserted message ID
                console.log('this ans that' +  messageID);
    
                // Create a notification for the recipient
                const notificationMessage = `${senderUsername} sent you a message: "${message}"`;
                const notificationQuery = 'INSERT INTO notifications (userID, type, message, senderID) VALUES (?, ?, ?, ?)';
                connection.query(notificationQuery, [recipientID, 'inbox', notificationMessage, senderID], (err, results) => {
                    if (err) {
                        console.error('Error creating notification:', err);
                        return;
                    }
    
                    if (activeSockets[recipientID]) {
                        activeSockets[recipientID].emit('new-notification', { message: notificationMessage });
                        activeSockets[recipientID].emit('private-message', { messageID, sender: senderID, senderUsername, message });
                    }
    
                    updateUnreadMessageCount(recipientID);
                });
    
                // Notify the sender that the message was sent successfully
                socket.emit('private-message', { messageID, sender: senderID, senderUsername, message });
            });
        });
    });
    
    
}

io.on('connection', onConnected);

//---------------------------->>

function updateUnreadMessageCount(userID) {
    const query = 'SELECT COUNT(*) AS unreadCount FROM inbox WHERE recipientID = ? AND isRead = FALSE';
    connection.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error counting unread messages:', err);
            return;
        }
        const unreadCount = results[0].unreadCount;
        if (activeSockets[userID]) {
            activeSockets[userID].emit('unread-message-count', { unreadCount });
        }
    });
}

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
