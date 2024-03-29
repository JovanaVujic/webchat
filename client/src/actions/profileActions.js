import axios from 'axios';

import {
  GET_ERRORS,
  GET_PROFILE,
  GET_PROFILES,
  SET_CURRENT_USER,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from './types';

//Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile/all')
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

//Create profile
export const createProfile = newProfile => dispatch => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };

  axios
    .post('/api/profile', newProfile, config)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
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

//Delete account
export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure?'))
    axios
      .delete('/api/profile')
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

export const clearCurrentProfile = () => dispatch => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
