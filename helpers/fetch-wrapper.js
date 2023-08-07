import getConfig from 'next/config';

import { userService } from '../services';

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    put,
    upload,
    delete: _delete
};

function get(api_method, body) {
    return(post(api_method, body));
}

async function upload(api_method, body) {
    return(post(api_method, body));
}

async function post(api_method, body) {
    body.apikey=publicRuntimeConfig.API_KEY;
    body.apisecret=publicRuntimeConfig.API_SECRET;
    body.api_method=api_method;
    console.log('post:body');
    console.log(body);
    const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        headers: { 'Content-Type': 'application/json' },
        //credentials: 'include',
        body: JSON.stringify(body),
    };
    return await fetch(`${publicRuntimeConfig.API_URL}`, requestOptions).then(response => response.json())
    .then(jsondata => handleResponse(jsondata))
}

function put(api_method, body) {
    return(post(api_method, body));
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(api_method, body) {
    return(post(api_method, body));
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

function handleResponse(response){
    console.log('handleResponse:');
    console.log(response);

        if (response.error) {

            alert('Temp error feedback: '+response.message)

            if ([401, 403].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                userService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return response;
}
