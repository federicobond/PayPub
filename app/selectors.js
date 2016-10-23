import { createSelector } from 'reselect'

const chunksSelector = createSelector(
  state => state.payload
  payload => payload.chunks.map(chunk => chunk.hash)
)
