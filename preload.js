const { contextBridge, ipcRenderer } = require('electron');

// Expose window control functions to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
    windowControl: (action) => ipcRenderer.send('window-control', action)
});
