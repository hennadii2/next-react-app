const jwt = require('jsonwebtoken');
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

const userSubject = new BehaviorSubject(process.browser && isJsonString(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')));

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    updateProfile,
    resetPassword,
    delete: _delete
};

function login(login_email, login_password) {
    return fetchWrapper.post('login', { login_email:login_email, login_password:login_password })
        .then(user => {
            console.log('userloggedin:');
            console.log(user);
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            if(user.data){
              userSubject.next(user.data);
              localStorage.setItem('user', JSON.stringify(user.data));
            }
            return user.data;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    //Router.push('/');
    window.location.href = "/";
}

function register(user) {
    return fetchWrapper.post('register', user);
}

function setSellerAccount(user) {
    return fetchWrapper.post('seller_account', user);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, session_id, params) {
    //{
    params.user_id=id;
    params.session_id=session_id;
    //}
    return fetchWrapper.post('update_profile', params)
        .then(x => {
            console.log("X", x);
            // update stored user if the logged in user updated their own record
            if (id === userSubject.value._id) {
                // update local storage
                const user = { ...userSubject.value, ...x.data };
                localStorage.setItem('user', JSON.stringify(user));
                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

function updateProfile(id, params) {
    return fetchWrapper.upload(`${baseUrl}/update-profile/${id}`, params)
        .then(x => {
            if (id === userSubject.value._id) {
                // update local storage
                const user = x?.data?.[0];
                console.log("user", user);
                localStorage.setItem('user', JSON.stringify(user));
                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

function resetPassword(id, params) {
    return fetchWrapper.put(`${baseUrl}/resetpassword/${id}`, params)
        .then(x => {
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
