const fs = require('fs')
const electron = require('electron')
const ipc = electron.ipcMain
const dialog = electron.dialog

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    minWidth: 768, minHeight: 500,
    backgroundColor: '#101218'
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
app.on('ready', () => {
  updateExplorer()
  setInterval(updateExplorer, 20000)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on('open-file-dialog', function(event, options) {
  options = options || {}

  const window = BrowserWindow.fromWebContents(event.sender)

  dialog.showOpenDialog(window, {
    properties: ['openFile', options.multi ? 'multiSelections' : undefined],
  }, function(files) {

    if (!files) {
      return
    }
    event.sender.send('selected-files', files)
  })
})

ipc.on('save-file-dialog', function(event) {

  const window = BrowserWindow.fromWebContents(event.sender)

  dialog.showSaveDialog(window, {}, function(file) {
    event.sender.send('selected-save-file', file)
  })
})

ipc.on('load-file', function(event, path) {

  fs.readFile(path, function(err, data) {
    event.sender.send('loaded-file', err || data)
  })

})

ipc.on('load-release', function(event, path) {

  fs.readFile(path, function(err, data) {

    const window = BrowserWindow.fromWebContents(event.sender)
    window.setTitle(path.split('/').pop())
    window.setRepresentedFilename(path)

    try {
      data = JSON.parse(data)
    } catch (e) {
      err = new Error('file is not a valid release')
    }

    event.sender.send('loaded-release', err || data)
  })

})

ipc.on('save-release', function(event, path, data) {

  fs.writeFile(path, data, function(err) {
    if (err) {
      event.sender.send('saved-release', err)
      return
    }

    event.sender.send('saved-release')
  })
  
})

const insight = require('./insight')

ipc.on('sync-addresses', function(event, addresses) {
  addresses.forEach((address) => {
    insight.address(address, function(err, info) {
      if (err) {
        event.sender.send('synced-address', err)
        return
      }

      const status = {
        balance: info.balance,
        unconfirmedBalance: info.unconfirmedBalance,
        released: info.totalSent > 0
      }
      event.sender.send('synced-address', { address, status })
    })
  })
})

ipc.on('recover-key', function(event, address) {
  insight.addressTxs(address, function(err, info) {
    if (err) {
      event.sender.send('recovered-key', err)
      return
    }

    event.sender.send('recovered-key', { address, key })
  })
})


function updateExplorer() {
  if (mainWindow) {
    insight.sync(function(err, res) {
      mainWindow.send('sync', res)
    })
  }
}
