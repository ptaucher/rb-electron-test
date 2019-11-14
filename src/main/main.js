// Modules
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const {app} = electron
const mainWindow = require('./mainWindow')
const monitorWindow = require('./monitorWindow')
const updater = require('./updater')

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

    mainWindow.activate()
    // monitorWindow.activate()

    // Check for app updates 3 seconds after launch
    // setTimeout( updater, 3000 )
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    mainWindow.activate()
    // montitorWindow.activate()
})





