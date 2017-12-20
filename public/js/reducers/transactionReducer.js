import {DEPOSIT_CHANGE} from 'constants/transactions'
export default function reducer(state = {
  deposit: 2500
}, action) {

  switch (action.type) {
    case DEPOSIT_CHANGE: {
        return {
          ...state,
          deposit: action.payload
        }
        break;

      }
  }
  return state
}
