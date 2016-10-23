import { handleActions } from 'redux-actions'

const initial = {
  loading: false,
  addresses: {},
}

export default handleActions({

  FILES_OPENED: (state, action) => {
    return { ...state, files: action.payload }
  },

  CREATE_RELEASE: (state, action) => {
    return { ...state, payload: action.payload }
  },

  LOADED_RELEASE: (state, action) => {
    return { ...state, payload: action.payload }
  },

  SYNC: (state, action) => {
    return { ...state, sync: action.payload }
  },

  SYNCED_ADDRESS: (state, action) => {
    const { address, status } = action.payload
    return { ...state, addresses: { ...state.addresses, [address]: status } }
  },

  OPEN_MODAL: (state, action) => {
    return { ...state, modal: action.payload }
  },

  CLOSE_MODAL: (state, action) => {
    const { modal, ...rest } = state
    return rest
  }

}, initial)
