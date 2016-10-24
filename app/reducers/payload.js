import { handleActions } from 'redux-actions'

export default handleActions({
  CREATE_RELEASE: (state, action) => {
    return action.payload
  },
  LOADED_RELEASE: (state, action) => {
    return action.payload
  },
  UPDATE_LOCATION: (state, action) => {
    if (action.payload.pathname === '/') {
      return null
    }
    return state
  },
}, null)
