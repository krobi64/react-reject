import { describe } from 'riteway'

import { createAsk, recordAccept, recordReject, Status, updateAskee } from './actions'
import { asksReducer as reducer, defaultState } from './reducer'

const pluck = (term, arry) => arry.map(({ [term]: prop }) => prop )

describe('reducers', async should => {
  const { assert } = should()

  assert({
    given: 'an undefined state',
    should: 'return the default state',
    actual: reducer(),
    expected: defaultState,
  })

  {
    const action = { type: '__foo' }
    const currentState = 'bar'

    assert({
      given: 'an action not in scope for this reducer',
      should: 'return the currentState',
      actual: reducer(currentState, action),
      expected: currentState,
    })
  }

  {
    const action = createAsk({ question: 'What is the airspeed of a laden swallow?', askee: 'Tim' })
    const nextState = reducer(undefined, action)
    const actual = nextState.map(({ question, askee, status }) => ({ question, askee, status }))
    const expected = [
      {
        question: 'What is the airspeed of a laden swallow?',
        askee: 'Tim',
        status: 'Unanswered',
      },
    ]

    assert({
      given: 'a create action',
      should: 'return the state with the added ask',
      actual,
      expected,
    })
  }

  {
    const firstAction = createAsk({ question: 'What is the airspeed of a laden swallow?', askee: 'Tim' })
    const initialState = reducer(undefined, firstAction)
    const secondAction = createAsk({question: 'What is your name?', askee: 'Jeff' })
    const newState = reducer(initialState, secondAction)
    const expected = [ firstAction.payload, secondAction.payload ]

    assert({
      given: 'an initial state and a new ask',
      should: 'return a state containing two asks',
      actual: newState,
      expected,
    })
  }

  {
    const existingAsk = createAsk({ question: 'What is the airspeed of a laden swallow?', askee: 'Tim' })
    const initialState = reducer(undefined, existingAsk)
    const nextState = reducer(initialState, recordReject(existingAsk.payload.id))
    const actual = pluck('status', nextState)

    assert({
      given: 'an existing ask and a recordReject action',
      should: `set the status to ${Status.REJECTED}`,
      actual,
      expected: [Status.REJECTED],
    })
  }

  {
    const existingAsk = createAsk({ question: 'What is the airspeed of a laden swallow?', askee: 'Tim' })
    const initialState = reducer(undefined, existingAsk)
    const actual = reducer(initialState, recordReject('1233'))

    assert({
      given: 'an existing ask and a recordReject action with an invalid id',
      should: 'return the initial state without any updates',
      actual,
      expected: initialState,
    })
  }

  {
    const existingAsk = createAsk({ question: 'What is the airspeed of a laden swallow?', askee: 'Tim' })
    const initialState = reducer(undefined, existingAsk)
    const nextState = reducer(initialState, recordAccept(existingAsk.payload.id))
    const actual = pluck('status', nextState)

    assert({
      given: 'an existing ask and a recordAccept action',
      should: `set the status to ${Status.ACCEPTED}`,
      actual,
      expected: [Status.ACCEPTED],
    })
  }

  {
    const existingAsk = createAsk({ question: 'What is the airspeed of a laden swallow?', askee: 'Tim' })
    const initialState = reducer(undefined, existingAsk)
    const newAskee = 'Jeff'
    const nextState = reducer(initialState, updateAskee(existingAsk.payload.id, newAskee))
    const actual = pluck('askee', nextState)

    assert({
      given: 'an existing ask with an updateAskee action',
      should: `set the askee to ${newAskee}`,
      actual,
      expected: [newAskee],
    })
  }
})
