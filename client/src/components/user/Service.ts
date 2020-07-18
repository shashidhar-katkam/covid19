import Service from '../../services/services';
import { URLs } from '../../constants/constants';
import AuthService from '../../services/authService/index'
export default class NewsService {
  private service: Service;
  private authService: AuthService;

  constructor() {
    this.service = new Service();
    this.authService = new AuthService();
  }

  private dataOrLogout(res: any): any {
    if (res.status === 200) {
      return res.data;
    } else if (res.status === false && res.statuscode === 403) {
      this.authService.LogOut();
    } else if (res.status === false && res.statuscode === 401) {
      this.authService.LogOut();
    } else if (res.status === false) {
      return res;
    }
  }

  private dataOrError(res: any): any {
    if (res.status === 200) {
      return res.data;
    } else if (res.status === false) {
      return res;
    }
  }

  public createStory(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.createStory}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getStories(filter: any): Promise<any> {
    let url = `http://localhost:7777/use/${URLs.getStories}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public raiseHelpRequest1(filter: any): Promise<any> {
    let url = `http://localhost:7777/use/${URLs.raiseHelpRequest1}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getHelpRequests1(filter: any): Promise<any> {
    let url = `http://localhost:7777/use/${URLs.getHelpRequests1}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getProfileByIdF(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getMyProfileInfo}`;
    return this.service.post(url, {}, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }



  public updateProfile(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.updateMyProfile}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public changePassword(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.changePassword}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public isAvailable(filter: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.checkIsUserAvailable}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getCommentsByRef(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getCommentsByRef}`
    return this.service.post(url, newsInfo).then((res: any) => {
      return this.dataOrError(res);
    });
  }


  public postComment(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.postComment}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrError(res);

    });
  }

  public updateDonationRequest(orderInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.updateDonationRequest}`;
    return this.service.post(url, orderInfo).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public raiseDonationRequest(filter: any): Promise<any> {
    let url = `http://localhost:7777/use/${URLs.raiseDonationRequest}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

}