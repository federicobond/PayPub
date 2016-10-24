import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import addresses from './reducers/addresses'
import files from './reducers/files'
import modal from './reducers/modal'
import payload from './reducers/payload'
import sync from './reducers/sync'

export default combineReducers({
  addresses,
  files,
  modal,
  payload,
  sync,
})
