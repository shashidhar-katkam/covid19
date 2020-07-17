import * as React from "react";
import '../styles.scss';
import { ISavedFile, FileType } from '../../../models/models';
import { DefaultButton } from "office-ui-fabric-react";
import Service from '../service';

interface IState {

}

interface IProps {
  files: ISavedFile[];
}

class FilesDisplayList extends React.Component<IProps, IState> {
  private service: Service;
  constructor(props: IProps) {
    super(props);
    this.state = {

    }
    this.service = new Service();
    this._downloadFile = this._downloadFile.bind(this);
    this._deleteFile = this._deleteFile.bind(this);

  }

  private _downloadFile(fileUrl: string, fileName: string) {
    this.service.downloadFile({ path: fileUrl, name: fileName });
  }

  private _deleteFile(file: any) {
    this.service.deleteFile(file).then((res: any) => {
      console.log(res);
    });
  }

  public render(): JSX.Element {
    return (<div className="attachement-container">
      {
        this.props.files.length > 0 ? <>
          <div className="ms-Grid" >
            <div className="ms-Grid-row item" style={{ marginLeft: "-5px" }}>
              <div className="ms-Grid-col ms-sm4">
                <h6 className="msg-headings">Attachments</h6>
              </div>
              <div className="ms-Grid-col ms-sm4">
                <h6>Action</h6>
              </div>
              <div className="ms-Grid-col ms-sm4">
                <h6>Delete</h6>
              </div>
            </div>
          </div>
          <div className="ms-Grid attachments" >
            {(this.props.files.map((file: ISavedFile, index: number) => {
              return <div className="ms-Grid-row item" id={file._id}>
                <div className="ms-Grid-col ms-sm4">
                  {(file.mimeType !== FileType.facebook && file.mimeType !== FileType.youtube && file.mimeType !== FileType.othersImage) ?
                    <a rel="noopener noreferrer" href={`http://localhost:7777/${file.filePath}`} target="_blank">{file.originalName}</a> :
                    <a rel="noopener noreferrer" href={file.filePath} target="_blank">{file.originalName}</a>}
                </div>

                <div className="ms-Grid-col ms-sm4">
                  <DefaultButton className="sp-btn-m sp-btn-success" onClick={() => this._downloadFile(file.filePath, file.fileNewName)} text="Download" />
                </div>
                <div className="ms-Grid-col ms-sm4">
                  <DefaultButton className="sp-btn-m sp-btn-danger" onClick={() => this._deleteFile(file)} text="Delete" />
                </div>
              </div>;
            }))}
          </div> </>
          : <p className="sp-danger">No Attachments.</p>
      }
    </div >
    );
  }

}

export default FilesDisplayList;