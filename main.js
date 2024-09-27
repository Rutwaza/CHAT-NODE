const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const serverApp = express();

// Express server logic here (e.g., routes, WebSocket handling, etc.)

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
