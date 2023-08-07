const jwt = require('jsonwebtoken');
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

const contentSubject = new BehaviorSubject(process.browser && isJsonString(localStorage.getItem('content')) && JSON.parse(localStorage.getItem('content')));

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const contentService = {
    content: contentSubject.asObservable(),
    get contentValue () { return contentSubject.value },
    getContents,
};

function getContents() {
    return fetchWrapper.post('get_content',{name:'Homepage'})
        .then(content => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            if (content.error) {
            } else {
                contentSubject.next(content.content);
                localStorage.setItem('content', JSON.stringify(content.content));
            }

            return content.content;
        });
}
