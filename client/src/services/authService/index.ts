import Service from '../services';
import { store } from '../../app';
import Actions from '../../Redux/Actions/actions';
import { URLs } from '../../constants/constants';

export default class AuthService {
    private service: Service;
    constructor() {
        this.service = new Service();
    }

    public Login(userInfo: any): Promise<any> {
        let url = `http://localhost:7777/use${URLs.login}`;
        const promise = new Promise((resolve, reject) => {
            this.service.post(url, userInfo)
                .then(
                    (data: any) => {
                        if (data.status || data.status === 200) {
                            let res = data.data
                            if (res.statusmsg.status === true) {
                                localStorage.setItem('MBwebToken', res.MBwebToken);
                                localStorage.setItem('User', JSON.stringify(res.User));
                                store.dispatch(Actions.addUser(res.User));
                                resolve(res.statusmsg);
                            } else {
                                resolve(res.statusmsg);
                            }
                        } else {
                            resolve(data);
                        }
                    },
                    msg => { 
                        reject(msg);
                    }
                ).catch((err) => {

                });
        });
        return promise;
    }

    public verifyEmail(data: any): Promise<any> {
        let url = "http://localhost:7777/use/api/verifyemail";
        return this.service.post(url, data, true).then((res: any) => {
            if (res.status === 200) {
                return res.data;
            } else if (res.status === false) {
                return res;
            }
        });
    }

    public verifyOTP(data: any): Promise<any> {
        let url = "http://localhost:7777/use/api/verifyotp";
        return this.service.post(url, data, true).then((res: any) => {
            if (res.status === 200) {
                return res.data;
            } else if (res.status === false) {
                return res;
            }
        });
    }

    public verifyUser(data: any): Promise<any> {
        let url = "http://localhost:7777/use/api/verifyuserforgetpassword";
        return this.service.post(url, data, true).then((res: any) => {
            if (res.status === 200) {
                return res.data;
            } else if (res.status === false) {
                return res;
            }
        });
    }

    public resetPassword(data: any): Promise<any> {
        let url = "http://localhost:7777/use/api/forgetpassword";
        return this.service.post(url, data, true).then((res: any) => {
            if (res.status === 200) {
                return res.data;
            } else if (res.status === false) {
                return res;
            }
        });
    }

    public isLoggedIn() {
        var user: any;
        if (localStorage.getItem('User')) {
            user = localStorage.getItem('User');
            return JSON.parse(user);
        } else {
            return null;
        }
    }

    public isLogged() {
        if (localStorage.getItem('User')) {
            return true;
        } else {
            return false;
        }
    }

    public LogOut() {
        localStorage.clear();
        store.dispatch(Actions.removeUser());
        window.location.replace(`/`);
        return { message: 'logged out successfully.', statuscode: 1, status: true };
    }

    public LogOut1() {
        localStorage.clear();
        store.dispatch(Actions.removeUser());
        return { message: 'logged out successfully.', statuscode: 1, status: true };
    }
}