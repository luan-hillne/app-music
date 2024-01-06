import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER,
    headers: {
        'Content-Type': 'application/json'
    }
})

instance.interceptors.request.use(function (config) {
    let token = window.localStorage.getItem('musicApp') && JSON.parse(window.localStorage.getItem('musicApp'))?.accessToken
    if (token) config.headers = {
        authorization: token
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) return response.data;
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    Promise.reject(error);
    return error?.response?.data;
});

export default instance