import { ActionTypes } from '../action.types';
import { IUser, IAddUser, IRemoveUser, IChangeLanguage, ILoginM } from '../models';

export default class Actions {
  public static addUser = (userInfo: IUser): IAddUser => {
    return {
      type: ActionTypes.AddUser,
      User: userInfo
    };
  }

  public static removeUser = (): IRemoveUser => {
    return {
      type: ActionTypes.RemoveUser,
      User: null
    };
  }

  public static UpdateLoginM = (updateM: ILoginM) => {
    return {
      type: ActionTypes.UpdateLoginM,
      payload: updateM
    }
  }

  public static updateUserImage = (imgUrl: string) => {
    return {
      type: ActionTypes.UpdateUserImage,
      payload: imgUrl
    }
  }
}