import { IChoiceGroupOption } from "office-ui-fabric-react";

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

export interface FileUploadStatus {
    status: boolean;
    fileNewName: string;
    filePath: string;
    mimeType: string;
    originalName: string;
}

export interface IId {
    _id: string
}

export class Id {
    _id: string;
    constructor(data: any) {
        this._id = data._id;
    }
}

export interface IStatusForm {
    statusMessage: string;
    status: string;
}
export interface IStatusChangeModel {
    newsInfo: IId;
    status: IStatusForm;
}

export interface IStatusFormErr {
    CommentErr: string;
}

export interface IFile {
    fileNewName: string;
    filePath: string;
    mimeType: string;
    originalName: string;
}

export class FileInfo {
    public fileNewName: string;
    public filePath: string;
    public mimeType: string;
    public originalName: string;

    constructor(file: any) {
        this.fileNewName = file.fileNewName;
        this.filePath = file.filePath;
        this.mimeType = file.mimeType;
        this.originalName = file.fileNewName;
    }
}

export interface IFileT {
    fileNewName: string;
    originalName: string;
    filePath: string;
    mimeType: string;
}

export class FileT {
    public fileNewName: string;
    public filePath: string;
    public mimeType: string;
    public originalName: string;
    public fileType: number;
    constructor(file: any) {
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

export class FileT1 {
    public fileNewName: string;
    public filePath: string;
    public mimeType: string;
    public originalName: string;
    public fileType: number;
    constructor(file: any) {
        this.fileNewName = file.fileNewName;
        this.filePath = file.filePath;
        this.mimeType = file.mimeType;
        this.originalName = file.fileNewName;
        this.fileType = file.fileType;
    }
}

export interface IAddFile extends IFile {
    id: number;
    fileNewNameErr: string;
    filePathErr: string;
    mimeTypeErr: string;
    originalNameErr: string;
}

export class AddFile {
    id: number;
    fileNewName: string;
    filePath: string;
    mimeType: string;
    originalName: string;
    fileNewNameErr: string;
    filePathErr: string;
    mimeTypeErr: string;
    originalNameErr: string;
    constructor(id: number) {
        this.id = id;
        this.fileNewName = '';
        this.filePath = '';
        this.mimeType = '';
        this.originalName = '';
        this.fileNewNameErr = '';
        this.filePathErr = '';
        this.mimeTypeErr = '';
        this.originalNameErr = '';
    }
}

export class AddFile2 {
    id: number;
    fileNewName: string;
    filePath: string;
    mimeType: string;
    originalName: string;
    fileNewNameErr: string;
    filePathErr: string;
    mimeTypeErr: string;
    originalNameErr: string;

    constructor(data: any, id: number) {
        this.id = id;
        this.fileNewName = data.fileNewName;
        this.filePath = data.filePath;
        this.mimeType = data.mimeType;
        this.originalName = data.originalName;
        this.fileNewNameErr = '';
        this.filePathErr = '';
        this.mimeTypeErr = '';
        this.originalNameErr = '';
    }
}

export class EditFile {
    id: string;
    fileNewName: string;
    filePath: string;
    mimeType: string;
    originalName: string;
    fileNewNameErr: string;
    filePathErr: string;
    mimeTypeErr: string;
    originalNameErr: string;
    constructor(newsInfo: ISavedFile) {
        this.id = newsInfo._id;
        this.fileNewName = newsInfo.fileNewName;
        this.filePath = newsInfo.filePath;
        this.mimeType = newsInfo.mimeType;
        this.originalName = newsInfo.originalName;
        this.fileNewNameErr = '';
        this.filePathErr = '';
        this.mimeTypeErr = '';
        this.originalNameErr = '';
    }
}

export interface ISavedFile extends IFile {
    _id: string;
}

export interface INews {
    Title: string;
    Description: string;
    DateTime: string;
    User: string;
    Files: ISavedFile[];
}

export interface INewsDisplay {
    _id: string;
    Title: string;
    Description: string;
    DateTime: string;
    User: string;
    Files: IFile[];
}

export interface ISavedNews extends INews {
    _id: string;
}

export interface ISavedNews2 extends INews {
    _id: string;
    Status: string;
}

export interface ISourceInfo {
    Type: number;
    Url: string;
    Id: number;
}

export interface IProfile {
    ImageUrl: string;
    Name: string;
    _id: string;
}

export interface INewsInfo {
    _id: number;
    Title: string;
    Description: string;
    Time: string;
    Files: ISavedFile[];
    Profile: IProfile;

}

export enum Type {
    Comments = 1,
    Polls,
    Questions,
    None
}
export enum Category {
    news = "news",
    info = "info"
}

export class File {
    public fileNewName: string;
    public filePath: string;
    public mimeType: string;
    public originalName: string;
    public fileType: number;
    constructor(file: any) {
        this.fileNewName = file.fileNewName;
        this.filePath = file.filePath;
        this.mimeType = file.mimeType;
        this.originalName = file.originalName;
        if (file.mimeType === FileType.jpeg || file.mimeType === FileType.png) {
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


export class File2 {
    public fileNewName: string;
    public filePath: string;
    public mimeType: string;
    public originalName: string;
    public fileType: number;
    constructor(file: any) {
        this.fileNewName = file.fileNewName;
        this.filePath = file.filePath;
        this.mimeType = file.mimeType;
        this.originalName = file.originalName;
        if (file.mimeType === FileType.jpeg || file.mimeType === FileType.png) {
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

export interface ICreateNewsForm {
    _id: string;
    Title: string;
    Description: string;
    Category: string[];
    DateTime: string;
    Files: any;
    User: any;
    IsHeadlines: boolean;
    IsTopTen: boolean;
    IsCommentsOn: boolean;
    Type: number;
}


export interface ICreateNewsForm2 {
    _id: string;
    Title: string;
    Description: string;
    Category: string[];
    DateTime: string;
    Files: any;
    User: any;
    IsHeadlines: boolean;
    IsTopTen: boolean;
    Show: boolean;
    Type: number;
    Analysis1: string;
    Analysis2: string;
    Analysis3: string;

}
export class News {
    public _id: string;
    public Title: string;
    public Description: string;
    public Category: string[]
    public DateTime: string;
    public Files: any;
    public User: any;
    public IsHeadlines: boolean;
    public IsTopTen: boolean;
    public IsCommentsOn: boolean;
    public Type: number;
    constructor(data: any) {
        this._id = data._id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.Category = data.Category ? data.Category : [];
        this.IsHeadlines = false;
        this.IsTopTen = false;
        this.IsCommentsOn = false;
        this.Type = 0;
    }
}


export interface IHelpForm {
    _id: string;
    Title: string;
    Description: string;
    WhatToDo: string;
    Category: string;
    DateTime: string;
    Files: any;
    User: any;
}


export class Help {
    public _id: string;
    public Title: string;
    public Description: string;
    public WhatToDo: string;
    public Category: string
    public DateTime: string;
    public Files: any;
    public User: any;

    constructor(data: any) {
        this._id = data._id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.WhatToDo = data.WhatToDo;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.Category = data.Category ? data.Category : '';
        // this.IsHeadlines = false;
        // this.IsTopTen = false;
    }
}


export class Help2 {
    public _id: string;
    public Title: string;
    public Description: string;
    public WhatToDo: string;
    public Category: string
    public DateTime: string;
    public Files: any;
    public User: any;
    public Show: boolean;

    constructor(data: any) {
        this._id = data._id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.WhatToDo = data.WhatToDo;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.Category = data.Category ? data.Category : '';
        this.Show = data.Show;
    }
}


export class HelpEmpty {
    public _id: string;
    public Title: string;
    public Description: string;
    public WhatToDo: string;
    public Category: string
    public DateTime: string;
    public Files: any;
    public User: any;
    public Show: boolean;
    constructor(data: any) {
        this._id = '';
        this.Title = '';
        this.Description = '';
        this.WhatToDo = '';
        this.DateTime = '';
        this.Files = '';
        this.User = '';
        this.Category = '';
        this.Show = false;
    }
}

export class News2 {
    public _id: string;
    public Title: string;
    public Description: string;
    public Category: string[]
    public DateTime: string;
    public Files: any;
    public User: any;
    public IsHeadlines: boolean;
    public IsTopTen: boolean;
    public Show: boolean;
    public Type: number;
    public Analysis1: string;
    public Analysis2: string;
    public Analysis3: string;
    constructor(data: any) {
        this._id = data._id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.Category = data.Category;
        this.IsHeadlines = data.IsHeadlines;
        this.IsTopTen = data.IsTopTen;
        this.Show = data.Show;
        this.Type = data.Type;
        this.Analysis1 = data.Analysis1;
        this.Analysis2 = data.Analysis2;
        this.Analysis3 = data.Analysis3;
    }
}

export class NewsEmpty {
    public _id: string;
    public Title: string;
    public Description: string;
    public Category: []
    public DateTime: string;
    public Files: any;
    public User: any;
    public IsHeadlines: boolean;
    public IsTopTen: boolean;
    public Show: boolean;
    public Type: number;
    public Analysis1: string;
    public Analysis2: string;
    public Analysis3: string;
    constructor(data: any) {
        this._id = '';
        this.Title = '';
        this.Description = '';
        this.DateTime = '';
        this.Files = '';
        this.User = '';
        this.Category = [];
        this.IsHeadlines = false;
        this.IsTopTen = false;
        this.Show = false;
        this.Type = 0;
        this.Analysis1 = '';
        this.Analysis2 = '';
        this.Analysis3 = '';
    }
}

export class NewsInfo {
    public newsInfo: any;
    public status: any
    constructor(newsInfo: any, status: any) {
        this.newsInfo = newsInfo;
        this.status = status;
    }
}

export interface IUser1 {
    _id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    state: string;
    city: string;
    imagePath: string;
    userType: number;
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

export interface IUserI {
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

export interface INewsInfoC {
    _id: string;
    Title: string;
    Description: string;
    DateTime: string;
    Files: IFileC[];
    User: IUserC;
    Type: number;
    ENRefId: string;
    Source?: string;
    Analysis1: string;
    Analysis2: string;
    Analysis3: string;
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

export const AccountStatus = {
    Registered: 1,
    Verified: 2,
    Blocked: 3,
    Rejected: 4
}


export const NewsType = {
    New: 'news',
    Info: 'info',
    Article: 'article'
}

export const HelpDeskType = {
    Personal: 'personal',
    Public: 'public'
}

export const NewsStatus = {
    Submitted: "Submitted",
    Approved: "Approved",
    Rejected: "Rejected",
    Process: "Process"
}

export interface INewsCategoryCount {
    article: number,
    info: number;
    news: number;
    all: number;
}

export interface IHelpDeskCategoryCount {
    personal: number,
    public: number;
    all: number;
}

export interface IHelpRequestCountByStatus {
    Submitted: number,
    Approved: number;
    Rejected: number;
    Process: number;
    All: number;
}

export const UserType = {
    Normal: 1,
    SelftAdmin: 2,
    Admin: 3,
    SuperAdmin: 4
}

export interface IPost {
    _id: string;
    Title: string;
    SubTitle: string;
    AdditionalInfo1: string;
    AdditionalInfo2: string;
    Comment: string;
    Files: IFileC[],
    DateTime: string,
    Type: number;
    PostType: number;
    CreatedBy: IUserC;
}

export interface IDialogPropss {
    show: boolean;
    message: string;
}

export interface IFileInfo {
    fileNewName: string;
    filePath: string;
    originalName: string;
    mimeType: string;
}

export class MainNewsModel {
    public _id: string;
    public Title: string;
    public Description: string;
    public DateTime: string;
    public Files: any;
    public User: any;
    public Type: number;
    public ENRefId: string;
    public Analysis1: string;
    public Analysis2: string;
    public Analysis3: string;
    constructor(data: any) {
        this._id = data._id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.DateTime = data.DateTime;
        this.Files = data.Files;
        this.User = data.User;
        this.Type = data.Type;
        this.ENRefId = data.ENRefId ? data.ENRefId : null
        this.Analysis1 = data.Analysis1;
        this.Analysis2 = data.Analysis2;
        this.Analysis3 = data.Analysis3;
    }
}

export interface IFileAndUser {
    _id: string;
    fileNewName: string;
    mimeType: string;
    originalName: string;
    filePath: string;
    fileType: MainFileType;
    dateTime: string;
    user: string;
}


export const TypeOptions: IChoiceGroupOption[] = [
    { key: 'comments', text: 'Allow Comments' },
    { key: 'questions', text: 'Allow Questions' },
    { key: 'poll', text: 'Allow Polls' },
    { key: 'none', text: 'Not Required' },
];

export const TypeOptions3: IChoiceGroupOption[] = [
    { key: 'comments', text: 'Allow Comments' },
    { key: 'questions', text: 'Allow Questions' },
    { key: 'none', text: 'Not Required' },
];

export const TypeOptions2: IChoiceGroupOption[] = [
    { key: '1', text: 'Allow Comments' },
    { key: '3', text: 'Allow Questions' },
    { key: '2', text: 'Allow Polls' },
    { key: '4', text: 'Not Required' },
];

