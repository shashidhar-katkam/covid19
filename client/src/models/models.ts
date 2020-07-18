
export interface IDialogPropss {
    show: boolean;
    message: string;
}


export interface ISavedStory {
    _id: string;
    Name: string;
    Age: string;
    Diceases: string[];
    Files: IFileC[];
    User: IUserC;
    Symptoms: string;
    Treatment: string;
    MoreToSay: string;
    DateTime: string;
}

export interface ISaveHelpCovid {
    _id: string;
    name: string;
    phoneNumber: string;
    problem: string;
    user: IUserC;
    expect: string;
    dateTime: string;
}

export class HelpCovidModel {
    public _id: string;
    public name: string;
    public phoneNumber: string;
    public problem: string;
    public expect: string;
    public user: any;
    public dateTime:string;
    constructor(data: any) {
        this._id = data._id;
        this.name = data.name;
        this.phoneNumber = data.phoneNumber;
        this.problem = data.problem;
        this.dateTime = data.dateTime;
        this.user = data.user;
        this.expect = data.expect;
    }
}


export class StoryModel {
    public _id: string;
    public Name: string;
    public Age: string;
    public Diceases: string[];
    public Files: IFileC[];
    public User: IUserC;
    public Symptoms: string;
    public Treatment: string;
    public MoreToSay: string;
    public DateTime: string;
    constructor(data: any) {
        this._id = data._id;
        this.Name = data.Name;
        this.Treatment = data.Treatment;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.Age = data.Age;
        this.Diceases = data.Diceases;
        this.Symptoms = data.Symptoms;
        this.MoreToSay = data.MoreToSay;
    }
}
export enum FileType {
    png = "image/png",
    mp3 = "audio/mp3",
    jif = "image/gif",
    jpeg = "image/jpeg",
    mp4 = "video/mp4",
    msword = "application/msword",
    pdf = "application/pdf",
    youtube = "Youtube",
    facebook = "Facebook",
    othersImage = "Image URL"
}

export enum MainFileType {
    localImage,
    localVideo,
    facebookVideo,
    youtubeVideo,
    audio,
    othersImage,
    others,
}

export class FileT {
    public fileNewName: string;
    public filePath: string;
    public mimeType: string;
    public originalName: string;
    public fileType: number;

    constructor(file: any) {
        debugger;
        this.fileNewName = file.fileNewName;
        this.filePath = file.filePath;
        this.mimeType = file.mimeType;
        this.originalName = file.fileNewName;

        if (file.mimeType === FileType.jpeg || file.mimeType === FileType.png || file.mimeType === FileType.jif) {
            this.fileType = MainFileType.localImage;
        } else if (file.mimeType === FileType.mp4) {
            this.fileType = MainFileType.localVideo;

        } else if (file.mimeType === FileType.youtube) {
            this.fileType = MainFileType.youtubeVideo;

        } else if (file.mimeType === FileType.facebook) {
            this.fileType = MainFileType.facebookVideo;

        } else if (file.mimeType === FileType.mp3) {
            this.fileType = MainFileType.audio;
        } else if (file.mimeType === FileType.othersImage) {
            this.fileType = MainFileType.othersImage;
        }
        else {
            this.fileType = MainFileType.others;
        }
    }
}




export interface IUser {
    phoneNumber: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    state: string;
    city: string;
    imagePath: string;
}

export interface IUserErr {
    phoneNumberErr: string;
    passwordErr: string;
    firstNameErr: string;
    lastNameErr: string;
    genderErr: string;
    emailErr: string;
    stateErr: string;
    cityErr: string;
}

export interface ILoginForm {
    phoneNumber: string;
    password: string;
}

export interface ILoginFormErr {
    phoneNumberErr: string;
    passwordErr: string;
}

export enum FormType {
    Login = 1,
    Register = 2,
    ForgetPassword = 3,
    EMailVerify = 4
}

export interface IFileC {
    fileNewName: string;
    filePath: string;
    _id: string;
    mimeType: string;
    originalName: string;
    fileType: number;
}

export interface IUserC {
    firstName: string,
    lastName: string,
    imagePath: string,
    _id: string;
}

export class BasicUserInfo {
    firstName: string;
    lastName: string;
    imagePath: string;
    _id: string;

    constructor(user: any) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.imagePath = user.imagePath;
        this._id = user._id;
    }
}
export interface IComment {
    _id: string;
    CommetPoster: IUserC;
    Comment: string;
    DateTime: string;
}

export enum ErrorMessages {
    firstNameIsRequired = 'Firstname is Required.',
    lastNameIsRequired = 'Lastname is Required.',
    oldPasswordIsRequired = 'Old password is required',
    newPasswordIsRequired = 'New password is required',
    confirmPasswordIsRequired = 'Confirm password is required',
    oldAndNewpasswordShouldNotSame = "Old and new password should not be same.",
    emailIsRequired = 'Email is Required',
    InvalidEmail = 'Invalid email',
    userNameIsRequired = 'Username is required',
    onlyNumbers = 'Only numbers allowed',
    cityIsRequired = 'City is required',
    stateIsRequired = 'State is required'
}

export interface IFileInfo {
    fileNewName: string;
    filePath: string;
    originalName: string;
    mimeType: string;
    fileType: number;
}

