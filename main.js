const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        icon: path.join(__dirname, 'x5.png'), // Add the path to your icon
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Use the preload script
            nodeIntegration: false, // Disable nodeIntegration for security
            contextIsolation: true, // Enable context isolation
        }
    });

    mainWindow.loadURL('http://localhost:8000'); // Load your app's URL

    /*/ Handle window control actions
    ipcMain.on('window-control', (event, action) => {
        if (action === 'minimize') {
            mainWindow.minimize();
        } else if (action === 'maximize') {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        } else if (action === 'close') {
            mainWindow.close();
        }
    }); */
});
