/**
 * Created by denis on 6/3/2016.
 */

const apiUrl = 'http://localhost:8000'

/**
 * Authed user stuff
 */
export function currentUser(token) {
  return callApi('user', token)
}

/**
 * Private functions
 */

function callApi(endpoint, token, options = {method: 'get'}) {
  const url = `${apiUrl}/${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      console.log(res);
      return res.text()
    })
    .then(text => {
      // debugger
      if (text === 'OK') {
        return []
      }
      if (text.length === 0) {
        return []
      }
      return JSON.parse(text)
    })
}
