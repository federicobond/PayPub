import { handleActions } from 'redux-actions'

export default handleActions({
  CREATE_RELEASE: (state, action) => {
    return action.payload
  },

  LOADED_RELEASE: (state, action) => {
    return action.payload
  },
}, null)
