// Modules
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const {
    BrowserWindow,
    globalShortcut,
    ipcMain
} = electron
const readItem = require('./readItem')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainBrowserwindow = null

// Listen for new item request
ipcMain.on('new-item', (e, itemUrl) => {
    console.log('Received new-item via ipcMain: ' + itemUrl)

    // Get new item and send back to renderer
    readItem(itemUrl, item => {
        console.log('send new-item-success back to e.sender: ' + item)
        e.sender.send('new-item-success', item)
    })
})

exports.activate = () => {

    console.log('activateMain')
    console.log(mainBrowserwindow)
    if (mainBrowserwindow === null) {
        createMainWindow()
    }
}

// Create a new BrowserWindow when `app` is ready
function createMainWindow() {

    let windowState = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 650
    })

    mainBrowserwindow = new BrowserWindow({
        width: windowState.width, height: windowState.height,
        x: windowState.x, y: windowState.y,
        minWidth: 350, maxWidth: 650, minHeight: 300,
        webPreferences: {nodeIntegration: true/*, webSecurity: false*/},
        titleBarStyle: 'hidden'
    })

    windowState.manage(mainBrowserwindow)

    // Load main.html into the new BrowserWindow
    mainBrowserwindow.loadFile('src/renderer/html/main.html')

    mainBrowserwindow.webContents.openDevTools()

    // Listen for window being closed
    mainBrowserwindow.on('closed', () => {
        mainBrowserwindow = null
    })

    let wc = mainBrowserwindow.webContents
    /*
    wc.on('before-input-event', (e, input) => {
        console.log('Before ' + input.key + ' ' + input.type)
    })
     */
    wc.on('did-finish-load', () => {
        console.log('main window fully loaded')
    })
    wc.on('dom-ready', () => {
        console.log('DOM ready')
    })

    //***//
    globalShortcut.register('f5', function () {
        console.log('f5 is pressed')
        mainBrowserwindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed')
        mainBrowserwindow.reload()
    })
}




