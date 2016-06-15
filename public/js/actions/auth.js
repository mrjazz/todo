import { LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS } from '../constants/AuthTypes';
import { checkHttpStatus, parseJSON } from '../lib/httpUtils';
import jwtDecode from 'jwt-decode';


export function loginUserFailure(error) {
  localStorage.removeItem('token');
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status : error.response.status,
      statusText : error.response.statusText
    }
  }
}

export function loginUserSuccess(token) {
  localStorage.setItem('token', token);
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function loginUser(email, password) {
  return function(dispatch) {
    dispatch(loginUserRequest());
    return fetch('http://localhost:8000/auth/getToken/', {
      method: 'post',
      // credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        try {
          let decoded = jwtDecode(response.token);
          console.log(decoded);
          dispatch(loginUserSuccess(response.token));
          // dispatch(pushState(null, redirect));
        } catch (e) {
          dispatch(loginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token'
            }
          }));
        }
      })
      .catch(error => {
        dispatch(loginUserFailure(error));
      })
  }
}
