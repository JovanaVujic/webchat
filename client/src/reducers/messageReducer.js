import {
  MESSAGES_LOADING,
  GET_MESSAGE,
  GET_MESSAGES,
  CLEAR_CHAT
} from '../actions/types';

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
    case GET_MESSAGE:
      return {
        ...state,
        message: action.payload,
        loading: false
      };
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
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
