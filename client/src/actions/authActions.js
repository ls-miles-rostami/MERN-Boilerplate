import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';

export const registerUser = (userData, history) => {
  return dispatch => {
    axios
      .post('/api/users/register', userData)
      .then(response => history.push('/login'))
      .catch(err => console.log(err.response.data));
  };
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};


//Login - Get user token
export const loginUser = userData => {
  return dispatch => {
    axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save to localStorage -- every response has a success and token property because that is what we set in our response for the /login route
      const { token } = res.data;
      // Set token to localstorage
      localStorage.setItem('jwtToken', token);
      // Set token to the Authorization header - the setAuthToken applies the token to every route
      setAuthToken(token);
      // Decode token to get your user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
      .catch(err => console.log(err.response.data));
  };
};


//Log user out
export const logoutUser = () => {
  return dispatch => {
    //remove token from local storage
    localStorage.removeItem('jwtToken')
    //Remove Authorization header for future request
    setAuthToken(false);
    //Set the current user to empty object which will set isAuthenticated to false
    dispatch(setCurrentUser({}))
  }
}