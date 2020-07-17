import { IServices } from './IService';
import Service from '../../services/services';
import { URLs } from '../../constants/constants';
import AuthService from '../../services/authService/index'
export default class NewsService implements IServices {
  private service: Service;
  private authService: AuthService;
  ddd = localStorage.getItem('language');

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

  public getHeadlines(): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getHeadLines}`;
    return this.service.get(url).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getTopNews(filter: any): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getTopNews}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getNewsbyID(filter: any): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getNewsById}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getNewsbyUserId(filter: any): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getAllNewsByUserId}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getAllNewsForUser(filter: any): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getNewsForUserHomePage}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }


  public getLatestNews(filter: any): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getLatestNews}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public raiseDonationRequest(filter: any): Promise<any> {
    let url = `http://localhost:7777/use/${URLs.raiseDonationRequest}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }
  public updateDonationRequest(orderInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.updateDonationRequest}`;
    return this.service.post(url, orderInfo).then((res: any) => {
        return this.dataOrLogout(res);
    });
}


  public getPosts(filter: any): Promise<any> {
    let url = `http://localhost:7777/use/${URLs.getPosts}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getOnlyNews(filter: any): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}${URLs.getNewsByFilter}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public createNews(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.createNews}`
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

  public getCommentsByRef(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getCommentsByRef}`
    return this.service.post(url, newsInfo).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getPollOptionsByRefId(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getPollOptionsByRefId}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getPollResultsByRefId(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getPollResultsByRefId}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public checkIsUserIsPolled(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.checkIsUserIsPolled}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      if (res.status === 200) {
        return res.data;
      } else if (res.status === false && res.statuscode === 401) {
        return res;
      } else if (res.status === false) {
        return res;
      }
    });
  }


  public SavePollResults(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.SavePollResults}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      if (res.status === 200) {
        return res.data;
      } else if (res.status === false && res.statuscode === 403) {
        this.authService.LogOut();
      } else if (res.status === false && res.statuscode === 401) {
        return res;
      } else if (res.status === false) {
        return res;
      }

    });
  }

  public saveQuestion(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.saveQuestion}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getQAsByRefId(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getQAsByRefId}`
    return this.service.post(url, newsInfo).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public createNewsBySelfAdmin(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.createNewsBySelfAdmin}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public raiseHelpRequest(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.raiseHelpRequest}`;
    return this.service.post(url, newsInfo).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getAllVideos(): Promise<any> {
    var language = localStorage.getItem('language');
    let url = `http://localhost:7777/use/${language}/api/getallvideos`;
    return this.service.get(url).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getProfileById(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getUserInfoAndNewsCount}`;
    return this.service.post(url, newsInfo).then((res: any) => {
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

  public getAllNewsPostedByMe(): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getAllNewsPostedByMe}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getMyHelpRequests(): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getMyHelpRequests}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public sendSelfAdminRequest(): Promise<any> {
    let url = `http://localhost:7777/use${URLs.sendSelfAdminRequest}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllInfoForMyDashboard(): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getAllInfoForMyDashboard}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllNewsPostedByMeAndFilter(data: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getAllNewsPostedByMeAndFilter}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public isAvailable(filter: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.checkIsUserAvailable}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public checkIsRequestSubmitted(): Promise<any> {
    let url = `http://localhost:7777/use${URLs.checkIsRequestSubmitted}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getImages(filter: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getImages}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public getImagesM(filter: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getImagesM}`;
    return this.service.post(url, filter).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public saveQuery(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.saveQuery}`
    return this.service.post(url, newsInfo).then((res: any) => {
      return this.dataOrError(res);
    });
  }


}