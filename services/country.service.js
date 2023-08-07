import getConfig from 'next/config';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

function getCountry() {
    return fetchWrapper.get(`${baseUrl}/country`);
}

function getRegionByCountry(country) {
    return fetchWrapper.get(`${baseUrl}/country/${country}/region`);
}

function getCityByRegion(region) {
    return fetchWrapper.get(`${baseUrl}/country/region/${region}/city`);
}

export const countryService = {
    getCountry,
    getRegionByCountry,
    getCityByRegion,
};
