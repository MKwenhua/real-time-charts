export default function reducer(state = {
  deposit: 2500
}, action) {

  switch (action.type) {
    case "DEPOSIT_CHANGE2":
      {
        return {
          ...state,
          deposit: action.payload
        }
        break;

      }
  }
  return state
}
