import { createAsk, recordAccept, recordReject, updateAskee } from './actions'

export const defaultState = []

export const asksReducer = (state = defaultState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case createAsk().type: {
      return [...state, payload]
    }
    case recordAccept().type:
    case recordReject().type:
    case updateAskee().type: {
      return state.map((obj) => (obj.id === payload.id) ? { ...obj, ...payload } : obj)
    }
    default: return state
  }
}
