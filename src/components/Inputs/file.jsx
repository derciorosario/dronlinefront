import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

function FileInput({_upload,label,res,r,onlyImages}) {
      let id=Math.random()
      const data = useData()
     
      const fileInputRef_1 = React.useRef(null);

      function clearFileInputs(){
          if(fileInputRef_1.current) fileInputRef_1.current.value=""
      }



    const [upload,setUpload]=useState({
      uploading:false,
      filename:'',
      progress:0,
      ..._upload
    })

 
    useEffect(()=>{
         if(res)  res(upload)
    },[upload])

    const [file,setFile]=useState({name:_upload.filename?.replace(data.APP_BASE_URL+"/"+data.SERVER_FILE_STORAGE_PATH+"/",'')})
   
    const acceptedImageFileTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

    const handleSubmit = async (event) => {

    
      let f = event.target.files[0];

      if((f.size/1024/1024) > 10){
          toast.error(t('common.only-files-less-than'))
          return
      }


      if(onlyImages && !acceptedImageFileTypes.includes(`.${(f.name.split('.')[f.name.split('.').length - 1]).toLowerCase()}`)){
          toast.error(t('common.file-not-allowed'))
          return
      }
                   
      const formData = new FormData();
      formData.append('file', f);
      let fileName = uuidv4();
      formData.append('filename', fileName);
    
      setFile(f);
    
      const xhr = new XMLHttpRequest();

      setUpload(prev=>({...prev,uploading:true}))
    
      // Monitor the progress of the upload
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUpload(prev=>({...prev,progress:percentComplete}))
        }
      };
  

      xhr.open('POST', data.APP_BASE_URL + '/api/upload', true);
      xhr.setRequestHeader('Accept', 'application/json');
    
      // Handle the response
      xhr.onload = function () {
        
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          //console.log({ url: result.url });
          setLastFile(null)
          setUpload(prev=>({...prev,filename:result.url,uploading:false}))
          setFile({...file,name:result.url.split('/')[result.url.split('/').length - 1]})
          clearFileInputs()
        } else {
          toast.error(t('common.error-while-uploading-file'))
          reset()
          console.error('File upload error:', xhr.statusText);
          clearFileInputs()
        }
      };
    
      // Handle error
      xhr.onerror = function () {
        toast.error(t('common.error-while-uploading-file'))
        reset()
        console.error('File upload error:', xhr.statusText);
      };
    
      // Send the form data
      xhr.send(formData);
    };
    
    
    function reset(){
     
        setUpload( prev=>({...prev,uploading:true,
        uploading:false,
        progress:0}))
        setFile({})
    }



  const [lastFile,setLastFile]=useState(null)
  

  return (

    <div className="w-[500px] max-md:w-full">
      
       {label &&   <span class="block mb-2 text-sm text-gray-900" for={id}>{label} {!r && <span className="text-gray-500 ml-1">{`(${t('common.optional')})`.toLowerCase()}</span>} {r && <span className="text-red-500">*</span>}</span>}
        
        <div className={`flex items-center w-full text-sm h-[40px] text-gray-900 border overflow-hidden border-gray-300 rounded-[0.3rem]   bg-gray-50`}>
             
             <label className={`h-full relative ${upload.uploading ? 'pointer-events-none':''} ${!res ? 'hidden':''}  hover:bg-gray-500 cursor-pointer bg-gray-400 text-white inline-flex justify-center items-center px-2`}>
                 <span className={`${upload.uploading ? 'opacity-0':''} `}>{(file.name || _upload.filename) ? t('common.upload-another-file') : t('common.upload-file')}</span>
                 <input accept={onlyImages ? acceptedImageFileTypes : ''} ref={fileInputRef_1} onChange={handleSubmit} type="file" hidden/>
                 {upload.uploading && <div className="flex items-center justify-center absolute w-full top-0 left-0 h-full">{`${upload.progress.toString().split('.')[0]}%`}</div>}
             </label>

             <div className="flex-1 flex items-center relative h-full">
             
             {upload.uploading && <div style={{width:`${upload.progress.toString().split('.')[0]}%`}} className="bg-[rgba(0,0,0,0.3)] h-full left-0 top-0 absolute"></div>}

             {/** <span className="ml-3 text-[0.8rem] truncate">{file.name ? file.name : _upload.filename ? ' ' : t('common.no-file-selected')}</span> */}
             
             {!(file.name || _upload.filename) && <span className="ml-3 text-[0.8rem] truncate">{t('common.no-file-selected')}</span>}
            
             {(upload.filename) && <div className="flex-1 justify-end w-full flex px-2">
                    <svg className="opacity-30" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                    <span onClick={()=>data.handleDownload(file.name)} className="ml-2 cursor-pointer hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></span>
                    <span onClick={()=>{
                          setFile({})
                          setUpload(prev=>({...prev,uploading:true,
                          uploading:false,
                          filename:'',
                          progress:0}))
                          setLastFile(upload.filename)
                    }} className={`ml-1 hover:*:fill-red-500 cursor-pointer ${!res ? 'hidden':''}`}><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg></span>
             </div>}

              {lastFile && <div onClick={()=>{
                  setUpload(prev=>({...prev,uploading:true,
                    uploading:false,
                    filename:lastFile,
                    progress:0}))
                    setFile({...file,name:lastFile.split('/')[lastFile.split('/').length - 1]})
                    setLastFile(null)
              }} className="flex-1 justify-end flex px-2 cursor-pointer hover:opacity-80">
                 <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M120-600v-240h80v134q50-62 122.5-98T480-840q118 0 210.5 67T820-600h-87q-34-72-101-116t-152-44q-57 0-107.5 21T284-680h76v80H120Zm120 360h480L570-440 450-280l-90-120-120 160ZM200-80q-33 0-56.5-23.5T120-160v-320h80v320h560v-320h80v320q0 33-23.5 56.5T760-80H200Z"/></svg>
             </div>}

             </div>



        </div>
        <div class="mt-1 text-sm text-gray-500" id="user_avatar_help"></div>
    </div>

  )
}

export default FileInput