// Modules
const {dialog} = require('electron')
const {autoUpdater} = require('electron-updater')

// Configure log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Disable automatic download
autoUpdater.autoDownload = false

// Single export to check for and apply any available updates
module.exports = () => {

    // Check for updates (GH Releases)
    autoUpdater.checkForUpdates()

    // Listen for update found
    autoUpdater.on('update-available', () => {
        // Prompt user to start download
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of rb-electron-test is available. Do you want to update now?',
            buttons: ['Update', 'No']
        }, buttonIndex => {
            // Start download on 0
            if (buttonIndex === 0) {
                autoUpdater.downloadUpdate()
            }
        })
    })

    // Listen for the download being ready
    autoUpdater.on('update-downloaded', () => {
        // Prompt user to install the update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install and restart now?',
            buttons: ['Yes', 'Later']
        }, buttonIndex => {
            // Start download on 0
            if (buttonIndex === 0) {
                autoUpdater.quitAndInstall(false, true)
            }
        })
    })
}