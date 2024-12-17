import { currentSessionToken } from './token';
import axios from "axios";
import { BaseURL } from './config';
const LOCAL_URL = window.location.origin;

const BASE_URL = BaseURL;
const request = async ({ url, method, data = {} }) => {
        
    let header = await currentSessionToken();
    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: header
    });

    let response = await axiosInstance.request({
        url,
        method,
        data

    });

    if (response && response.data) {
        return response.data;
    }
    return null
}

export default request;