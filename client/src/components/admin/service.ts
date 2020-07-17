import { IServices } from './IService';
import Service from '../../services/services';
import { URLs } from '../../constants/constants';
import AuthService from '../../services/authService/index'
import Axios from 'axios';


export default class NewsService implements IServices {
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

  public getNewsforApprove(): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getLatestNewsSubmittedByUser}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllUserPostedNews(): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllNewsPostedByUser}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getNewsByFilter(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getMainNewsByFilter}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public downloadFile(data: any): any {
    let url = `http://localhost:7777${data.path}`;
    Axios({
      url: url,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  public deleteFile(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.deleteFile}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getAllNewsByUserId(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllNewsByUserId}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getAllUserPostedNewsByFilter(filter: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllUserPostedNewsByFilter}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllUsersBySearch(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllUsersBySearch}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getHelpRequestsCountByStatus(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getHelpRequestsCountByStatus}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getNewsCountByStatus(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getNewsCountByStatus}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getPostsCountByStatus(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getPostsCountByStatus}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getHelpRequestsCountByCategory(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getHelpRequestsCountByCategory}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getRejectedNews(): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getRejectedNews}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  // public getallNewsForAdmin(): Promise<any> {
  //   let url = "http://localhost:7777/adm/api/getallnewsad";
  //   return this.service.get(url).then((res: any) => { return res.data });
  // }

  public getAllMainNewsForAdmin(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getMainNewsByFilter2}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllUsersByFilter3(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllUsersByFilter3}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllMainNewsForAdminByFilter(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getMainNewsByFilter3}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getNewsByFilterAll(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getNewsByFilterAll}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getNewsCountByCategory(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getNewsCountByCategory}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getNewsByRef(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getTNewsByERefId}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public saveNews(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.approveAndPostNews}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public acceptHelpRequestAndCreate(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.acceptHelpRequestAndCreate}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public updateNews(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updateMainNews}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllFiles(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllFiles}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getFilesByFilterAll(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getFilesByFilterAll}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public createNews(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.createMainNews}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public createVideo(videoInfo: any): Promise<any> {
    let url = "http://localhost:7777/adm/api/addvideo";
    return this.service.post(url, videoInfo, true);
  }

  public getProfileById(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getUserDetailsById}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getUserDetailsByIdAndNewsCount(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getUserDetailsByIdAndNewsCount}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllUsers(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllUsersByFilter}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getUsersCountByAccountStatus(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getUsersCountByAccountStatus}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllSelfAdminRequests(): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllSelfAdminRequests}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }



  public getRejectedUsers(): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getRejectedUsers}`;
    return this.service.get(url, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public updateProfile(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updateProfile}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public updateProfileForSelfAdmin(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updateProfileForSelfAdmin}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllHelpReqestsForAdmin(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllHelpReqestsForAdmin}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllUserNewsForAdmin(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllUserNewsForAdmin}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getAllPostsForAdmin(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllPostsForAdmin}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getAllEnHelpReqestsForAdmin(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getAllEnHelpReqestsForAdmin}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getHelpRequestInTeByERefId(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getHelpRequestInTeByERefId}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public updateHelpRequestInET(data: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updateHelpRequestInET}`;
    return this.service.post(url, data, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public createPost(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.SavePersonInfo}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public updatePost(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updatePost}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public getPollOptionsByRefId(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/use${URLs.getPollOptionsByRefId}`
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public deleteUploadedFile(fileInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.deleteUploadedFile}`;
    return this.service.post(url, fileInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public addImages(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.addImages}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getImages(filter: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getImages}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public updateImage(filter: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updateImage}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }

  public addImagesM(newsInfo: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.addImagesM}`;
    return this.service.post(url, newsInfo, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }


  public getImagesM(filter: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.getImagesM}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrLogout(res);
    });
  }

  public updateImageM(filter: any): Promise<any> {
    let url = `http://localhost:7777/adm${URLs.updateImageM}`;
    return this.service.post(url, filter, true).then((res: any) => {
      return this.dataOrError(res);
    });
  }


  public translateToTelugu(query: string): Promise<any> {
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${query}`;
    return this.service.get(url);
  }

  public translateToTelugu2(query: string): Promise<any> {
    let url = "http://api.bing.net/json.aspx?JsonCallback=?";
    let data = {
      'AppId': 'YOUR_API_KEY',
      'Query': query.substr(0, 5000),
      'Sources': 'Translation',
      'Version': '2.2',
      'Translation.SourceLanguage': 'sl',
      'Translation.TargetLanguage': 'tl',
      'JsonType': 'callback'
    }
    return this.service.post(url, data);
  }

  // public getAllUsers(): Promise<any> {
  //   let url = "http://localhost:7777/adm/api/getallusers";
  //   return this.service.get(url).then((res: any) => { return res.data });
  // }

}