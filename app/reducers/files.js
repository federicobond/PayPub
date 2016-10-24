
import { handleActions } from 'redux-actions'

export default handleActions({
  FILES_OPENED: (state, action) => {
    return action.payload
  },
}, null)
