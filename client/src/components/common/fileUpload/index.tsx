import * as React from "react";
import './styles.scss';

interface IState {
  uploadedFileInfo: any;
  uploadedFilesInfo: any;
  accept?: string;

}

interface IProps {
  afterFilesUploaded(res: any): void;
  onProgress(filesInfo: any): void;
  Reset: boolean;
  id: string;
  multiple: boolean;
  accept?: string;

}

class FileUpload extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      uploadedFileInfo: [],
      uploadedFilesInfo: [],
      accept: this.props.accept

    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.OnSucess = this.OnSucess.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }


  public OnSucess(some: any) {
  }


  public onProgress(some: any) {
    this.props.onProgress(some);
  }

  onChangeHandler(event: any, onSucess: any, onProgress: any) {
    this.props.afterFilesUploaded(event.target.files);
    if (event.target.files !== null && event.target.files !== undefined && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        let needToUpload = true;
        if (this.state.uploadedFileInfo.length > 0) {
          for (let j = 0; j < this.state.uploadedFileInfo.length; j++) {
            if (event.target.files[i].name === this.state.uploadedFileInfo[j].data.originalName) {
              needToUpload = false;
            }
          }
        }
        if (needToUpload) {
          let datae: any = event.target.files[i];
          const data = new FormData();
          data.append('file', event.target.files[i]);
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/use/api/uploadfiles");
          xhr.upload.addEventListener("progress", function (this, evt) {
            if (evt.lengthComputable) {
              let percentComplete: any = evt.loaded / evt.total;
              let df: any = percentComplete.toFixed(2) * 100;
              datae.progress = df.toFixed(0);
              let db = datae;
              db.progress = df.toFixed(0);
              onProgress(db);
            }
          }, false);
          xhr.onloadstart = function (e) {
          }
          xhr.onloadend = function (e) {
          }
          xhr.send(data);
          xhr.onreadystatechange =
            function () {
              if (this.readyState === 4 && this.status === 200) {
                if (this.response) {
                  var res = JSON.parse(this.response);
                  datae.response = res;
                }
              }
              if (this.readyState === 4 && this.status !== 200) {
                alert('some error occured.');
              }
            };
        }
      }
    }
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.Reset === true) {
      this.setState({
        uploadedFileInfo: [],
        uploadedFilesInfo: []
      });
    }
  }
  private getAcceptString(accept?: string): string {
    if (accept) {
      if (accept == "images") {
        return 'image/*'
      } else {
        return 'audio/*,video/*,image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-powerpoint';
      }
    } else {
      return 'audio/*,video/*,image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.ms-powerpoint';
    }
  }

  public render(): JSX.Element {
    return (
      <>
        <label htmlFor={this.props.id} className="sp-icon" title="Add file" >
          <i className="ms-Icon ms-Icon--Attach" aria-hidden="true"></i>
        </label>
        <input type="file" accept={this.getAcceptString(this.props.accept)} name="files" id={this.props.id} multiple={this.props.multiple} className="sp-file" onChange={(event: any) => this.onChangeHandler(event, this.OnSucess, this.onProgress)} />
      </>
    );
  }
}

export default FileUpload;


