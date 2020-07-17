import { IStaticConstants2 } from '../constants/static';

export interface IUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IUser1 {
  _id: string
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imagePath: string;
  userType: number;
  email: string;
}

export interface ILoginM {
  show: boolean;
  message: string;
}
export interface IUserState {
  User: IUser1;
  language: string;
  staticConstants: IStaticConstants2;
  login: ILoginM;
}

export interface IAddUser {
  type: string;
  User: IUser;
}


export interface IRemoveUser {
  type: string;
  User: any;
}


export interface IChangeLanguage {
  type: string;
  language: string;
}
