// Modules
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const {
    app,
    BrowserWindow,
    session,
    globalShortcut,
    Menu,
    MenuItem,
    Tray
} = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let mainMenu = Menu.buildFromTemplate(require('./menu'))

// Create a new BrowserWindow when `app` is ready
function createWindow() {
    let ses = session.defaultSession

    let windowState = windowStateKeeper({
        defaultWidth: 1000, defaultHeight: 800
    })

    mainWindow = new BrowserWindow({
        width: windowState.width, height: windowState.height,
        x: windowState.x, y: windowState.y,
        minWidth: 300, minHeight: 300,
        webPreferences: {nodeIntegration: true},
        titleBarStyle: 'hidden'
    })

    windowState.manage(mainWindow)

    // Load index.html into the new BrowserWindow
    mainWindow.loadFile('index.html')

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

    Menu.setApplicationMenu(mainMenu)
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
    // setTimeout(app.focus, 1000)
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
