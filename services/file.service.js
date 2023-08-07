import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.API_URL}`;

export const config = {
  api: {
    bodyParser: false
  }
};

export const fileService = {
    upload
};

function upload(id, type, fileData) {
    return fetchWrapper.upload(`${baseUrl}/imageUploader/${id}/${type}`, fileData)
        .then(x => {
            return x;
        });    
}
