import { handleActions } from 'redux-actions'

export default handleActions({
  SYNCED_ADDRESS: (state, action) => {
    const { address, status } = action.payload
    return { ...state, [address]: status }
  },
  UPDATE_LOCATION: () => ({}),
}, {})
