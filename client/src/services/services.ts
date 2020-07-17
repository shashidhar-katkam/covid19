import axios from 'axios';

export default class Service {
    public get(url: string, isAuthRequired?: boolean) {
        let config;
        if (isAuthRequired) {
            config = {
                headers: {
                    'Authorization': `MBwebToken ${localStorage.getItem('MBwebToken') ? localStorage.getItem('MBwebToken') : ''}`
                }
            };
        } else {
            config = {};
        }

        return axios.get(url, config)
            .then(res => {
                if (res.status === 200) {
                    return res;
                }
            }).catch((err: any) => {
                if (err && err.response) {
                    return {
                        status: false,
                        statuscode: err.response.status,
                        message: err.response.statusText
                    }
                } else {
                    return {
                        status: false,
                        statuscode: 143,
                        message: err.message
                    }
                }
            });
    }

    public post(url: string, data: any, isAuthRequired?: boolean): Promise<any> {
        let config;
        if (isAuthRequired) {
            config = {
                headers: {
                    'Authorization': `MBwebToken ${localStorage.getItem('MBwebToken') ? localStorage.getItem('MBwebToken') : ''}`
                }
            };
        } else {
            config = {};
        }
        return axios.post(url, data, config)
            .then(res => {
                if (res.status === 200) {
                    return res;
                }
            }).catch(err => {
                if (err && err.response) {
                    return {
                        status: false,
                        statuscode: err.response.status,
                        message: err.response.statusText
                    }
                } else {
                    return {
                        status: false,
                        statuscode: 143,
                        message: err.message
                    }
                }
            });
    }
}