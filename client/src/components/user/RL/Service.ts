import Service from '../../../services/services';
import { URLs } from '../../../constants/constants';

export default class NewsService {
  private service: Service;
  constructor() {
    this.service = new Service();
  }

  public Login(userInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.login}`;
    return this.service.post(url, userInfo).then((res: any) => {
      if (res.status === 200) {
        return res.data;
      }
    });
  }

  public RegisterUser(userInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.registerUser}`;
    return this.service.post(url, userInfo).then((res: any) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return res;
      }
    });
  }
}