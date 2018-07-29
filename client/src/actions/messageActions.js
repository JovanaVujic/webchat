import axios from 'axios';

import {
  GET_ERRORS,
  GET_MESSAGE,
  GET_MESSAGES,
  CLEAR_CHAT,
  MESSAGES_LOADING
} from './types';

export const getChatHistory = chat_id => dispatch => {
  dispatch(setMessagesLoading());
  axios
    .get(`/api/messages/chat/${chat_id}`)
    .then(res => {
      dispatch({
        type: GET_MESSAGES,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_MESSAGES,
        payload: null
      })
    );
};

// Get all profiles
export const getLastChatMessages = (recipientID) => dispatch => {
  dispatch(setMessagesLoading());
  axios
    .get('/api/messages/all', recipientID ? {
      params: {
        recipient: recipientID
      }
    } : {})
    .then(res =>
      dispatch({
        type: GET_MESSAGES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MESSAGES,
        payload: null
      })
    );
};

export const createChat = (recipient, newChat) => dispatch => {
  axios
    .post(`api/messages/to/${recipient}`, newChat)
    .then(res =>
      dispatch({
        type: GET_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const sendReply = chat_id => dispatch => {
  axios
    .post(`api/messages/chat/${chat_id}`)
    .then(res =>
      dispatch({
        type: GET_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteChat = chat_id => dispatch => {
  if (window.confirm('Are you sure?'))
    axios
      .delete('api/messages/chat/:chat_id')
      .then(res =>
        dispatch({
          type: CLEAR_CHAT,
          payload: chat_id
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
};

export const editMessage = message_id => dispatch => {
  axios
    .post(`api/messages/${message_id}`)
    .then(res =>
      dispatch({
        type: GET_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setMessagesLoading = () => {
  return {
    type: MESSAGES_LOADING
  };
};
