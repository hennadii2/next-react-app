import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

function getFollowingBuyers(seller) {
    return fetchWrapper.get(`${baseUrl}/following_buyers/${seller}`);
}

function searchBuyer(postData) {
    return fetchWrapper.post(`${baseUrl}/search/buyer`, postData);
}

function removeFollowing(postData) {
    return fetchWrapper.post(`${baseUrl}/remove_favorite`, postData);
}

export const sellerService = {
    getFollowingBuyers,
    searchBuyer,
    removeFollowing
};
