// Modules
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const {BrowserWindow} = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let monitorBrowserWindow = null

exports.activate = () => {
    if (monitorBrowserWindow === null) {
        createMonitorWindow()
    }
}

function createMonitorWindow() {

    let windowState = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 400
    })

    // Create a new window
    monitorBrowserWindow = new BrowserWindow({
        width: windowState.width, height: windowState.height,
        x: windowState.x, y: windowState.y,
        minWidth: 300, maxWidth: 800, minHeight: 300, maxHeight: 800,
        // set the title bar style
        titleBarStyle: 'hiddenInset',
        // set the background color to black
        backgroundColor: "#111",
        // Don't show the window until it's ready, this prevents any white flickering
        show: false,
        webPreferences: {nodeIntegration: true/*, webSecurity: false*/}
    })

    windowState.manage(monitorBrowserWindow)

    monitorBrowserWindow.loadFile("src/renderer/html/monitor.html")

    monitorBrowserWindow.webContents.openDevTools()

    monitorBrowserWindow.once('ready-to-show', () => {
        monitorBrowserWindow.show()
    })

    let wc = monitorBrowserWindow.webContents
    wc.on('did-finish-load', () => {
        console.log('monitor window fully loaded')
        console.log('Send init-monitor via monitorBrowserWindow.webContents')
        monitorBrowserWindow.webContents.send('init-monitor', true)
    })
}
