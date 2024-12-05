import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import Loader from '../Loaders/loader';


function LogoFile({disabled,label,res,_upload,isUserProfile,_loading}) {

  const data=useData()

  const [upload,setUpload]=useState({
    uploading:false,
    filename:'',
    progress:0,
    ..._upload
  })
  const fileInputRef_1 = React.useRef(null);
  const fileInputRef_2 = React.useRef(null);

  function clearFileInputs(){
      if(fileInputRef_1.current) fileInputRef_1.current.value=""
      if(fileInputRef_2.current) fileInputRef_1.current.value=""
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


    <>

       {isUserProfile ?  <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${_upload.filename}")`}}  className="w-[170px] h-[170px]  flex items-center justify-center  rounded-full bg-gray-200 relative mx-auto">    

                           {(upload.uploading || _loading) && <div className="absolute w-[170px] h-[170px] rounded-full left-0 top-0 flex items-center justify-center  bg-gray-300">
                               <div className=" translate-x-2">
                                   <Loader/>
                               </div>
                           </div>}

                           {!_upload.filename && <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/></svg> }
                           
                           <label htmlFor="_file_logo_input_2" className="absolute cursor-pointer active:opacity-50 right-0 bottom-6 rounded-full w-[30px] h-[30px] bg-honolulu_blue-400 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#fff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                              <input id="_file_logo_input_2" accept=".png,.jpg" ref={fileInputRef_2} type="file" onChange={handleSubmit} className="w-full h-full absolute opacity-0 left-0 top-0"/> 
                            
                           </label>
                    </div> : (
                       <div class="col-span-full mt-6">
                       <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">{label} {!disabled && <span className="font-[12px] text-gray-400">({t('common.optional')})</span>}</label>
                        <div class="mt-2 flex items-center gap-x-3">
                        
                        <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${_upload.filename}")`}} className="w-[60px] h-[60px] border overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                           {!_upload.filename &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>}
                        </div>
                   
                         {!disabled && <>
                   
                           <label htmlFor="_file_logo_input" className="flex relative items-center">
                   
                             <input id="_file_logo_input" accept=".png,.jpg" ref={fileInputRef_1} type="file" onChange={handleSubmit} className="w-full h-full absolute opacity-0 left-0 top-0"/> 
                             {!upload.uploading && <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{upload.filename ? t('common.change') : t('common.select-image')} </button>}
                            
                             {upload.uploading && <div className="w-[150px] h-[4px] bg-gray-400 rounded-[0.4rem] relative">
                                   <div style={{width:`${upload.progress}%`}} className="absolute left-0 top-0  h-full bg-honolulu_blue-400"></div>
                             </div>}
                        
                          </label>
                         
                         </>}
                        </div>
                     </div>
                    )}
    
    </>

   
  )
}

export default LogoFile