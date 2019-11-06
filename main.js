// Modules
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const {
    app,
    BrowserWindow,
    session,
    globalShortcut,
    Tray,
    ipcMain
} = electron
const readItem = require('./readItem')
const updater = require('./updater')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let monitorWindow

// Listen for new item request
ipcMain.on('new-item', (e, itemUrl) => {
    // console.log(itemUrl)

    // Get new item and send back to renderer
    readItem(itemUrl, item => {
        e.sender.send('new-item-success', item)
    })
})

// Create a new BrowserWindow when `app` is ready
function createWindow() {
    let ses = session.defaultSession

    // Check for app updates 3 seconds after launch
    setTimeout( updater, 3000 )

    let windowState = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 650
    })

    mainWindow = new BrowserWindow({
        width: windowState.width, height: windowState.height,
        x: windowState.x, y: windowState.y,
        minWidth: 350, maxWidth: 650, minHeight: 300,
        webPreferences: {nodeIntegration: true},
        titleBarStyle: 'hidden'
    })

    windowState.manage(mainWindow)

    // Load main.html into the new BrowserWindow
    mainWindow.loadFile('renderer/main.html')

    mainWindow.webContents.openDevTools()

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    let wc = mainWindow.webContents
    /*
    wc.on('before-input-event', (e, input) => {
        console.log('Before ' + input.key + ' ' + input.type)
    })
     */
    wc.on('did-finish-load', () => {
        console.log('Content fully loaded')
    })
    wc.on('dom-ready', () => {
        console.log('DOM ready')
    })

    //***//
    globalShortcut.register('f5', function() {
        console.log('f5 is pressed')
        mainWindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function() {
        console.log('CommandOrControl+R is pressed')
        mainWindow.reload()
    })
}

function createMonitorWindow() {
    let windowState = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 400
    })

    // Create a new window
    monitorWindow = new BrowserWindow({
        width: windowState.width, height: windowState.height,
        x: windowState.x, y: windowState.y,
        minWidth: 300, maxWidth: 800, minHeight: 300, maxHeight: 800,
        // set the title bar style
        titleBarStyle: 'hiddenInset',
        // set the background color to black
        backgroundColor: "#111",
        // Don't show the window until it's ready, this prevents any white flickering
        show: false,
        webPreferences: {nodeIntegration: true}
    })

    windowState.manage(monitorWindow)

    monitorWindow.loadFile("renderer/monitor.html")

    monitorWindow.webContents.openDevTools()

    monitorWindow.once('ready-to-show', () => {
        monitorWindow.show()
        monitorWindow.webContents.send('init-monitor', true)
    })
}

/*
app.on('browser-window-blur', () => {
  console.log('App unfocused')
  setTimeout(app.quit, 3000)
})

app.on('browser-window-focus', () => {
  console.log('App focused')
})
*/

// Electron `app` is ready
app.on('ready', () => {
    console.log('App is ready')
    console.log(app.getPath('desktop'))
    console.log(app.getPath('music'))
    console.log(app.getPath('temp'))
    console.log(app.getPath('userData'))
    createWindow()
    createMonitorWindow()
    // setTimeout(app.focus, 1000)
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
    if (monitorWindow === null) {
        createMonitorWindow()
    }
})





