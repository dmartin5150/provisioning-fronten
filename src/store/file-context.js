import React, {useState} from 'react';

const FileContext = React.createContext({
    uploadedFileName:'',
    fileIsUploaded: false,
    fileIsSelected:false,
    setUploadedFileName: () => {},
    setIsUpload: () => {},
    setFileIsSelected: ()=>{}
});



export const FileContextProvider = (props) => {

    const [isUploaded,setIsUploaded] = useState(false);
    const [uploadedFName, setUploadedFName] = useState('');
    const [fIsSelected, setFIsSelected] = useState(false);


    const setUploaded = (fIsUpload)=> {
        setIsUploaded(fIsUpload);
    }   

    const setUploadedName = (fName) => {
        setUploadedFName(fName);
    }

    const setFSelected = (fSelected) => {
        setFIsSelected(fSelected);
    }


    const contextValue = {
        uploadedFileName: uploadedFName,
        fileIsUploaded: isUploaded,
        fileIsSelected:fIsSelected,
        setUploadedFileName: setUploadedName,
        setIsUpload: setUploaded,
        setFileIsSelected: setFSelected
    }

    return (
        <FileContext.Provider value={contextValue}>
            {props.children}
        </FileContext.Provider>
    );

}

export default FileContext;