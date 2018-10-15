import cuid from 'cuid'

const CREATE_ASK = 'CREATE_ASK'
const UPDATE_ASK = 'UPDATE_ASK'

export const Status = {
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  UNANSWERED: 'Unanswered',
}

export const createAsk = ({ question, askee, status = Status.UNANSWERED } = {}) => ({
  type: CREATE_ASK,
  payload: {
    question,
    askee,
    status,
    timestamp: Date.now(),
    id: cuid(),
  },
})

export const recordReject = (id) => ({
  type: UPDATE_ASK,
  payload: {
    id,
    status: Status.REJECTED,
  },
})

export const recordAccept = (id) => ({
  type: UPDATE_ASK,
  payload: {
    id,
    status: Status.ACCEPTED,
  },
})

export const updateAskee = (id, askee) => ({
  type: UPDATE_ASK,
  payload: {
    id,
    askee,
  },
})
