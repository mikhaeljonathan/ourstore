import axios from "axios";
import { BE_HOSTNAME, BE_PORT, BE_PROTOCOL } from "../App";

const URI = 'https://skripsipastia.xyz';
// const URI = `${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}`;

export function addRequest(path, body, config) {
    return axios.post(`${URI}/${path}`, body, config)
        .then(response => response.data);
}

export function getRequest(path, config) {
    return axios.get(`${URI}/${path}`, config)
        .then(response => response.data);
}

export function deleteRequest(path, config) {
    return axios.delete(`${URI}/${path}`, config)
        .then(response => response.data);
}

export function updateRequest(path, raw, config) {
    return axios.patch(`${URI}/${path}`, raw, config)
        .then(response => response.data);
}

export function postRequest(path, raw, config) {
    return axios.post(`${URI}/${path}`, raw, config)
        .then(response => response.data);
}

export function get(path, headers, params) {
    const config = {
        headers: headers,
        params: params
    }
    return axios.get(`${URI}/${path}`, config);
}

export function post(path, headers, body) {
    const config = {
        headers: headers
    }

    return axios.post(`${URI}/${path}`, body, config);
}

export function put(path, headers, body) {
    const config = {
        headers: headers
    }

    return axios.put(`${URI}/${path}`, body, config);
}
