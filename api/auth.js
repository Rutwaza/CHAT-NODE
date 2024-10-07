// api/auth.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql'); // Make sure to require mysql if using it

// Database connection
const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};
const connection = mysql.createConnection(dbOptions);

// Handle login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM users WHERE Email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).sendFile(path.join(__dirname, 'https://hackersden-lvr341qj2-nelsons-projects-35a52f9b.vercel.app/error_db.html'));
        }

        if (results.length === 0) {
            return res.status(401).sendFile(path.join(__dirname, 'https://hackersden-lvr341qj2-nelsons-projects-35a52f9b.vercel.app/error.html'));
        }

        const user = results[0];
        if (password === user.PasswordHash) {
            req.session.userID = user.UserID;
            req.session.username = user.Username;
            req.session.save((err) => { // Ensure the session is saved before redirecting
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).sendFile(path.join(__dirname, 'https://hackersden-lvr341qj2-nelsons-projects-35a52f9b.vercel.app/error_db.html'));
                }
                console.log('User ID:', req.session.userID);
                console.log('Username:', req.session.username);
                res.redirect('https://hackersden-lvr341qj2-nelsons-projects-35a52f9b.vercel.app/homepage.html');
            });
        } else {
            res.status(401).sendFile(path.join(__dirname, 'https://hackersden-lvr341qj2-nelsons-projects-35a52f9b.vercel.app/error.html'));
        }
    });
});

// Add more routes (signup, etc.) as needed

module.exports = router;
