import { handleActions } from 'redux-actions'

export default handleActions({
  OPEN_MODAL: (state, action) => {
    return action.payload
  },

  CLOSE_MODAL: () => null
}, null)
