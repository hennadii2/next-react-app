const jwt = require('jsonwebtoken');
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

const produceSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('produce')));
const userProducesSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user_produces')));
const typeSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('type')));
const sizeSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('size')));
const farmingSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('farming')));
const packagingSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('packaging')));
const seasonsSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('seasons')));

export const produceService = {
    produce: produceSubject.asObservable(),
    type: typeSubject.asObservable(),
    size: sizeSubject.asObservable(),
    farming: farmingSubject.asObservable(),
    packaging: packagingSubject.asObservable(),
    season: seasonsSubject.asObservable(),

    get produceValue() { return produceSubject.value },
    get userProduceValues() { return userProducesSubject.value },
    get typeValue() { return typeSubject.value },
    get sizeValue() { return sizeSubject.value },
    get farmingValue() { return farmingSubject.value },
    get packagingValue() { return packagingSubject.value },
    get seasonsValue() { return seasonsSubject.value },

    storeProduce,
    getProduces,
    getUserProduces,
    getProduceById,
    updateProduce,
    deleteProduce: _deleteProduce,

    storeType,
    getTypes,
    getType,
    //getTypeById,
    getCategories,
    //getCategory,
    getSubCategories,
    //getSubCategory,
    updateType,
    deleteType: _deleteType,

    storeSize,
    getSizes,
    getSizeById,
    updateSize,
    deleteSize: _deleteSize,

    storeFarming,
    getFarmings,
    getFarmingById,
    updateFarming,
    deleteFarming: _deleteFarming,

    storeSeason,
    getSeasons,
    getSeasonById,
    updateSeason,
    deleteSeason: _deleteSeason,

    storePackage,
    getPackages,
    getPackageById,
    updatePackage,
    deletePackage: _deletePackage,
};

function storeProduce(produce) {
    return fetchWrapper.post(`${baseUrl}/products`, produce);
}

function getProduces() {
    return fetchWrapper.get(`${baseUrl}/products`);
}

function getUserProduces(id) {
    return fetchWrapper.get(`${baseUrl}/user/${id}/produces`).then(res => {
        if (!res?.data?.error) {
            userProducesSubject.next(res?.data ?? []);
            localStorage.setItem("user_produces", JSON.stringify(res?.data ?? []));
        }
        return res.data;
    });
}

function getProduceById(id) {
    return fetchWrapper.get(`${baseUrl}/products/${id}`);
}

function updateProduce(id, params) {
    return fetchWrapper.put(`${baseUrl}/products/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored produce if the logged in produce updated their own record
            if (id === produceSubject.value._id) {
                // update local storage
                const produce = { ...produceSubject.value, ...params };
                localStorage.setItem('produce', JSON.stringify(produce));
                // publish updated produce to subscribers
                produceSubject.next(produce);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _deleteProduce(id) {
    return fetchWrapper.delete(`${baseUrl}/products/${id}`);
}

function storeType(type) {
    return fetchWrapper.post(`${baseUrl}/types`, type);
}

/*function getTypeById(id) {
    return fetchWrapper.get(`${baseUrl}/types/${id}`);
}*/

function getCategories() {
    return fetchWrapper.get('get_produce_categories',{});
}

function getType(id) {
    return fetchWrapper.get('get_produce_category',{_id:id});
}

function getSubCategories(category) {
    return fetchWrapper.get(`${baseUrl}/sub-categories/${category}`);
}

/*function getSubCategory(subcategory) {
    return fetchWrapper.get(`${baseUrl}/type/${subcategory}`);
}*/

function getTypes(subcategory) {
    return fetchWrapper.get(`${baseUrl}/types/${subcategory}`);
}

function updateType(id, params) {
    return fetchWrapper.put(`${baseUrl}/type/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored type if the logged in type updated their own record
            if (id === typeSubject.value._id) {
                // update local storage
                const type = { ...typeSubject.value, ...params };
                localStorage.setItem('type', JSON.stringify(type));
                // publish updated user to subscribers
                typeSubject.next(type);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _deleteType(id) {
    return fetchWrapper.delete(`${baseUrl}/products/${id}`);
}

function storeSize(size) {
    return fetchWrapper.post(`${baseUrl}/sizes`, size);
}

function getSizes() {
    return fetchWrapper.get(`${baseUrl}/sizes`);
}

function getSizeById(id) {
    return fetchWrapper.get(`${baseUrl}/products/${id}`);
}

function updateSize(id, params) {
    return fetchWrapper.put(`${baseUrl}/sizes/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored size if the logged in size updated their own record
            if (id === sizeSubject.value._id) {
                // update local storage
                const size = { ...sizeSubject.value, ...params };
                localStorage.setItem('size', JSON.stringify(size));
                // publish updated size to subscribers
                sizeSubject.next(size);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _deleteSize(id) {
    return fetchWrapper.delete(`${baseUrl}/sizes/${id}`);
}

function storeSeason(season) {
    return fetchWrapper.post(`${baseUrl}/seasons`, season);
}

function getSeasons() {
    return fetchWrapper.get(`${baseUrl}/seasons`);
}

function getSeasonById(id) {
    return fetchWrapper.get(`${baseUrl}/seasons/${id}`);
}

function updateSeason(id, params) {
    return fetchWrapper.put(`${baseUrl}/seasons/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored season if the logged in season updated their own record
            if (id === seasonSubject.value._id) {
                // update local storage
                const season = { ...seasonSubject.value, ...params };
                localStorage.setItem('season', JSON.stringify(season));
                // publish updated season to subscribers
                seasonSubject.next(season);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _deleteSeason(id) {
    return fetchWrapper.delete(`${baseUrl}/seasons/${id}`);
}

function storeFarming(farming) {
    return fetchWrapper.post(`${baseUrl}/farmings`, farming);
}

function getFarmings() {
    return fetchWrapper.get(`${baseUrl}/farmings`);
}

function getFarmingById(id) {
    return fetchWrapper.get(`${baseUrl}/farmings/${id}`);
}

function updateFarming(id, params) {
    return fetchWrapper.put(`${baseUrl}/farmings/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored farming if the logged in farming updated their own record
            if (id === farmingSubject.value._id) {
                // update local storage
                const farming = { ...farmingSubject.value, ...params };
                localStorage.setItem('farming', JSON.stringify(farming));
                // publish updated farming to subscribers
                farmingSubject.next(farming);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _deleteFarming(id) {
    return fetchWrapper.delete(`${baseUrl}/farmings/${id}`);
}

function storePackage(packaging) {
    return fetchWrapper.post(`${baseUrl}/packages`, packaging);
}

function getPackages() {
    return fetchWrapper.get(`${baseUrl}/packages`);
}

function getPackageById(id) {
    return fetchWrapper.get(`${baseUrl}/packages/${id}`);
}

function updatePackage(id, params) {
    return fetchWrapper.put(`${baseUrl}/packages/${id}`, params)
        .then(x => {
            console.log("X", x);
            // update stored packaging if the logged in package updated their own record
            if (id === packagingSubject.value._id) {
                // update local storage
                const packaging = { ...packagingSubject.value, ...params };
                localStorage.setItem('packaging', JSON.stringify(packaging));
                // publish updated package to subscribers
                packagingSubject.next(packaging);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _deletePackage(id) {
    return fetchWrapper.delete(`${baseUrl}/packages/${id}`);
}
