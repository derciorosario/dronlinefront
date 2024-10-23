import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';


function LogoFile({disabled,label,res,_upload}) {

  const data=useData()

  const [upload,setUpload]=useState({
    uploading:false,
    filename:'',
    progress:0,
    ..._upload
  })
  const fileInputRef_1 = React.useRef(null);

  function clearFileInputs(){
      if(fileInputRef_1.current) fileInputRef_1.current.value=""
  }

 
  useEffect(()=>{
    res(upload)
  },[upload])

  
  const [file,setFile]=useState({})
   
  const handleSubmit = async (event) => {
    let f = event.target.files[0];
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
        console.log(percentComplete)
      }
    };
  
    xhr.open('POST', data.APP_BASE_URL + '/api/upload', true);
    xhr.setRequestHeader('Accept', 'application/json');
  
    // Handle the response
    xhr.onload = function () {
      
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        //console.log({ url: result.url });
        setUpload(prev=>({...prev,filename:result.url,uploading:false}))
        clearFileInputs()
      } else {
        console.error('File upload error:', xhr.statusText);
        toast.error(t('common.error-while-uploading-file'))
        reset()
        clearFileInputs()
      }
    };
  
    // Handle error
    xhr.onerror = function () {
      toast.error(t('common.error-while-uploading-file'))
      console.error('File upload error:', xhr.statusText);
      reset()
    };
  
    // Send the form data
    xhr.send(formData);
  };


  function reset(){
    setUpload({
      uploading:false,
      filename:'',
      progress:0
    })
    setFile({})
  }


  return (

    <div class="col-span-full mt-6">
    <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">{label} {!disabled && <span className="font-[12px] text-gray-400">({t('common.optional')})</span>}</label>
     <div class="mt-2 flex items-center gap-x-3">
     
     <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${data.APP_BASE_URL+"/"+data.SERVER_FILE_STORAGE_PATH+"/"+upload.filename?.replaceAll(' ','%20')}")`}} className="w-[60px] h-[60px] border overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
        {!upload.filename &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>}
     </div>

      {!disabled && <>

        <label className="flex relative items-center">

          <input accept=".png,.jpg" ref={fileInputRef_1} type="file" onChange={handleSubmit} className="w-full h-full absolute opacity-0 left-0 top-0"/> 
          {!upload.uploading && <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{upload.filename ? t('common.change') : t('common.select-image')} </button>}
         
          {upload.uploading && <div className="w-[150px] h-[4px] bg-gray-400 rounded-[0.4rem] relative">
                <div style={{width:`${upload.progress}%`}} className="absolute left-0 top-0  h-full bg-honolulu_blue-400"></div>
          </div>}
     
       </label>
      
      </>}
     </div>
  </div>
  )
}

export default LogoFile