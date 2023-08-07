import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

function getMembership() {
    return fetchWrapper.get(`get_membership_types`,{});
}

export const membershipService = {
    getMembership,
};
