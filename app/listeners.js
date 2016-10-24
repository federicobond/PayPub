import {
  filesOpened,
  loadedRelease,
  sync,
  syncedAddress,
}  from './actions'
import store from './store'

const ipc = require('electron').ipcRenderer

ipc.on('selected-files', (event, path) => {
  store.dispatch(filesOpened(path))
})

ipc.on('loaded-release', (event, data) => {
  store.dispatch(loadedRelease(data))
})

ipc.on('sync', (event, data) => {
  store.dispatch(sync(data))
})

ipc.on('synced-address', (event, data) => {
  store.dispatch(syncedAddress(data))
})
