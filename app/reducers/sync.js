import { handleActions } from 'redux-actions'

export default handleActions({
  SYNC: (state, action) => {
    return action.payload
  },
}, null)
