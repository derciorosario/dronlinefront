import { t } from 'i18next'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import Loader from '../Loaders/loader';
import { useAuth } from '../../contexts/AuthContext';

function SendProof({info}) {

    let id=Math.random()

    const fileInputRef_1 = React.useRef(null);
    const {user} = useAuth()

    function clearFileInputs(){
        if(fileInputRef_1.current) fileInputRef_1.current.value=""
    }


    const [upload,setUpload]=useState({
      uploading:false,
      filename:'',
      progress:0,
    })

    const data = useData()

    const [file,setFile]=useState({})

    function reset(){
      setUpload({
        uploading:false,
        filename:'',
        progress:0
      })
      setFile({})
    }

  const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      handleSubmit(file)
  
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const handleSubmit = async (f) => {

    const formData = new FormData();
    formData.append('file', f);
    let fileName = uuidv4();
    formData.append('filename', fileName);
    formData.append('formdata',JSON.stringify({...info,patient_id:user?.data?.id}))
  
    setFile(f);

    data.setPaymentInfo({...info,loading:true})

    const xhr = new XMLHttpRequest();

    setUpload(prev=>({...prev,uploading:true}))

   
  
    // Monitor the progress of the upload
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log({percentComplete})
        setUpload(prev=>({...prev,progress:percentComplete}))
      }
    };
  
    xhr.open('POST', data.APP_BASE_URL + '/api/bank-transfer/send-proof', true);
    xhr.setRequestHeader('Accept', 'application/json');
  
    // Handle the response
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        setUpload(prev=>({...prev,filename:result.url,uploading:false}))
        data.setPaymentInfo({...info,step:3,loading:false})
        clearFileInputs()
      } else {
        data.setPaymentInfo({...info,loading:false})
        toast.error(t('common.error-while-uploading-file'))
        reset()
        console.error('File upload error:', xhr.statusText);
        clearFileInputs()
      }
    };
  
    // Handle error
    xhr.onerror = function () {
      toast.error(t('common.error-while-uploading-file'))
      data.setPaymentInfo({...info,loading:false})
      reset()
      console.error('File upload error:', xhr.statusText);
    };
  
    xhr.send(formData);
  };


  const acceptedFileTypes = '.jpg, .jpeg, .png, .gif, .bmp, .pdf, .doc, .docx, .txt, .xls, .xlsx';


  return (

   
    <div>

        <h3 className="mt-3 font-medium text-[20px] mb-2">{t('common.send-the-proof')}</h3>
         <div class="mt-6 w-full mb-5">
        <div class="flow-root">
          <div class="-my-3 divide-y divide-gray-200">
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.bank_name')}</dt>
              <dd class="text-base font-medium text-gray-900">Moza Banco</dd>
            </dl>
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.account-number')}</dt>
              <dd class="text-base font-medium text-gray-900 flex items-center cursor-pointer" onClick={()=>data.handleCopyClick('2327942010001')}>2327942010001<span className="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg></span></dd>
            </dl>
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">NIB</dt>
              <dd class="text-base font-medium text-gray-900 flex items-center cursor-pointer" onClick={()=>data.handleCopyClick('003400002327942010169')}>003400002327942010169<span className="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg></span></dd>
            </dl>
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">IBAN</dt>
              <dd class="text-base font-medium text-gray-900 flex items-center cursor-pointer" onClick={()=>data.handleCopyClick('MZ59 003400002327942010169')}>MZ59 003400002327942010169<span className="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg></span></dd>
            </dl>
          </div>
        </div>
      </div>



         
      <div  onDrop={handleDrop}
                        onDragOver={handleDragOver} class="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
      
      {!upload.uploading && <div class="grid gap-1">
      <div className="flex justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>
      </div>
      <h2 class="text-center text-gray-400   text-xs leading-4">PNG, JPG, PDF</h2>
      </div>}
      <div class="grid gap-2">
      <h4 class={`text-center ${upload.uploading ? 'hidden':''} text-gray-900 text-sm font-medium leading-snug`}>{t('common.get-proof')}</h4>
   
        {!upload.uploading  && 
        <div class="flex items-center justify-center">
            <label>
              <input accept={acceptedFileTypes} ref={fileInputRef_1} onChange={(event)=>handleSubmit(event.target.files[0])} type="file" hidden />
              <div class="flex  h-9 px-2 flex-col bg-honolulu_blue-500 rounded-full shadow text-white text-xs font-semibold leading-4 items-center  cursor-pointer justify-center focus:outline-none">{upload.filename ? t('common.change') : t('common.choose-file')}</div>
            </label>
        </div>

        }

        {/**(upload.uploading && upload.progress < 100) && <div className="flex justify-center items-center flex-col relative">


              <div className="w-[150px] h-[4px] bg-gray-300 rounded-[0.4rem] relative">
                    
                    <div style={{width:`${upload.progress}%`}} className="absolute left-0 top-0  h-full bg-honolulu_blue-400"></div>
      
              </div>
              <span className="mt-2">{`${upload.progress.toFixed(2)}%`}</span>
        </div>**/}

        {(upload.uploading) && <div className="flex items-center  w-full justify-center flex-col">
                 <Loader/>
        </div>}

        

      </div>
      </div>
    </div>
  )
}

export default SendProof