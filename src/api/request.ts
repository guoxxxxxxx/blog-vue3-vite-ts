// const baseUrl = "http://192.168.50.37:8080";
const baseUrl = "http://localhost:8080"

// 请求加载动画
import NProgress from 'nprogress';


import axios from "axios";
import { errTips, successTips } from '@/utils';

const request = axios.create({
    baseURL: baseUrl,
    timeout: 1000 * 3,
})

// 请求拦截器开启动画
request.interceptors.request.use((config) => {
    // NProgress.start();
    return config;
}, error => {
    return Promise.reject(error);
})
// 响应拦截器关闭动画
axios.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});


export default request;