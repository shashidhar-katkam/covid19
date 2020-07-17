


export default class Common {


    public static _onProgress(filesInfo: any, tempFiles: any) {
        let added = false;
        if (tempFiles.length > 0) {
            for (let j = 0; j < tempFiles.length; j++) {
                if (tempFiles[j].name === filesInfo.name) {
                    tempFiles = tempFiles.map(
                        (file: any) => {
                            if (file.name === filesInfo.name) {
                                return file;
                            } else {
                                return file
                            }
                        });
                } else {
                    if (!added) {
                        if (tempFiles[j].name === filesInfo.name) {
                            tempFiles = tempFiles.map(
                                (file: any) => {
                                    if (file.name === filesInfo.name) {
                                        return file;
                                    } else {
                                        return file
                                    }
                                });
                        } else {
                            tempFiles = [...tempFiles, filesInfo];
                        }
                    }
                    added = true;
                }
            }
        } else {
            tempFiles = [...tempFiles, filesInfo];
        }
        return this.getUnique(tempFiles);
    }

    private static getUnique(array: any) {
        var uniqueArray = [];
        if (array.length > 0) {
            for (let value of array) {
                if (uniqueArray.indexOf(value) === -1) {
                    uniqueArray.push(value);
                }
            }
        }
        return uniqueArray;
    }
}