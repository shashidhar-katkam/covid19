export interface typ {
  isShow: boolean;
  value: string;
  errorMessage: string;
}

export interface passwordd {
  isShow: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  oldPasswordErr: string;
  newPasswordErr: string;
  confirmPasswordErr: string;
}
export interface name {
  isShow: boolean;
  firstName: string;
  lastName: string;
  firstNameErr: string;
  lastNameErr: string;
}

export interface address {
  isShow: boolean;
  state: string;
  stateErr: string;
  city: string;
  cityErr: string;
}
