import { MESSAGES_LOADING, GET_MESSAGE, GET_MESSAGES, ADD_MESSAGE, DELETE_MESSAGE, CLEAR_CHAT } from '../actions/types';

const initialState = {
  message: {},
  messages: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MESSAGES_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
    case GET_MESSAGE:
      return {
        ...state,
        message: action.payload,
        loading: false
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: state.messages ? [action.payload, ...state.messages] : [action.payload]
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(message => message._id !== action.payload)
      };
    case CLEAR_CHAT:
      return {
        ...state,
        messages: null
      };

    default:
      return state;
  }
}
