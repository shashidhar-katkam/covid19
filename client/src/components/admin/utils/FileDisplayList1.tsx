import * as React from "react";
import '../styles.scss';
import { ISavedFile, FileType } from '../../../models/models';

interface IState {

}

interface IProps {
    files: ISavedFile[];
}

class FilesDisplayList1 extends React.Component<IProps, IState> {

    public render(): JSX.Element {
        return (<div className="attachement-container">
            {
                this.props.files.length > 0 ? <>
                    <div className="ms-Grid" >
                        <div className="ms-Grid-row item" style={{ marginLeft: "-5px" }}>
                            <div className="ms-Grid-col ms-sm12">
                                <h6 className="msg-headings">Attachments</h6>
                            </div>
                        </div>
                    </div>
                    <div className="ms-Grid attachments" >
                        {(this.props.files.map((file: ISavedFile, index: number) => {
                            return <div className="ms-Grid-row item" id={file._id}>
                                <div className="ms-Grid-col ms-sm12">
                                    {(file.mimeType !== FileType.facebook && file.mimeType !== FileType.youtube && file.mimeType !== FileType.othersImage) ?
                                        <a rel="noopener noreferrer" href={`http://localhost:7777/${file.filePath}`} target="_blank">{file.originalName}</a> :
                                        <a rel="noopener noreferrer" href={file.filePath} target="_blank">{file.originalName}</a>}
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

export default FilesDisplayList1;