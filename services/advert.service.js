const jwt = require('jsonwebtoken');
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

const advertSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('advert')));

export const advertService = {
    advert: advertSubject.asObservable(),
    get advertValue () { return advertSubject.value },
    save,
    getAll,
    getById,
    getPosition,
    getPositions,
    update,
    delete: _delete
};

function save(uid, position, price, fileAdvert) {
    return fetchWrapper.post(`${baseUrl}/adverts`, {uid, position, price, fileAdvert});
}

function getPositions() {
    return fetchWrapper.get(`${baseUrl}/advert-positions`);
}

function getPosition(id) {
    return fetchWrapper.get(`${baseUrl}/advert-position/${id}`);
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}/adverts`);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/adverts/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/adverts/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored user if the logged in user updated their own record
            if (id === userSubject.value._id) {
                // update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));
                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/adverts/${id}`);
}
