import axios from 'axios';

import { GET_ERRORS, GET_MESSAGE, GET_MESSAGES, ADD_MESSAGE, CLEAR_CHAT, MESSAGES_LOADING } from './types';

//Get chat history
export const getChatHistory = recipient_id => dispatch => {
  dispatch(setMessagesLoading());
  axios
    .get(`/api/messages/history/${recipient_id}`)
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

// Get last messages from all user`s chat
export const getLastChatMessages = recipientID => dispatch => {
  dispatch(setMessagesLoading());
  axios
    .get(
      '/api/messages/all',
      recipientID
        ? {
            params: {
              recipient: recipientID
            }
          }
        : {}
    )
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

//Send message to recipient and create chat if didn`t exist
export const sendMessage = (recipient, newChat) => dispatch => {
  axios
    .post(`api/messages/to/${recipient}`, newChat)
    .then(res =>
      dispatch({
        type: ADD_MESSAGE,
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

//send reply
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

//Delete chat
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

//Edit message
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
