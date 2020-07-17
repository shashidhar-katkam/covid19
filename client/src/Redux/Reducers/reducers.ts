import { ActionTypes } from "../action.types";
import { IUser, IUserState } from '../models';
import { staticConsants } from '../../constants/staticConstants';
let language = localStorage.getItem('language');
let lan = language && language === 'en' ? 'en' : 'te';

function getStaticConstants(lan: string) {
  if (lan === 'en') {
    return staticConsants.en;
  } else {
    return staticConsants.te;
  }
}

const initialState: IUserState = {
  User: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    _id: '',
    imagePath: '',
    userType: 0
  },
  language: lan,
  staticConstants: getStaticConstants(lan),
  login: { show: false, message: '' }
};

export interface IReducerActions {
  type: string;
  User: IUser;
}

export interface ILanguageAction {
  type: string;
  language: string;
}


export type IReducerActionss = IReducerActions | ILanguageAction;

export function UserReducer(
  state: IUserState = initialState,
  action: any
): IUserState {
  switch (action.type) {
    case ActionTypes.AddUser:
      return {
        ...state, User: action.User
      };
    case ActionTypes.RemoveUser:
      return {
        ...state, User: action.User
      };
    case ActionTypes.UpdateUserImage:
      localStorage.setItem('User', JSON.stringify({ ...state.User, imagePath: action.payload }));
      return {
        ...state, User: { ...state.User, imagePath: action.payload }
      };
    case ActionTypes.ChangeLanguage:
      return {
        ...state, language: action.language, staticConstants: getStaticConstants(action.language)
      };
    case ActionTypes.UpdateLoginM:
      return {
        ...state, login: action.payload
      }
    default:
      return state;
  }
}