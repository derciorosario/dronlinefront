import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useHomeData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

function ChatFile({show,setShow,_upload,res}) {

  const data=useHomeData()
  const fileInputRef_1 = React.useRef(null);
  const [fileTitle, setFileTitle]=useState('')

  function clearFileInputs(){
      if(fileInputRef_1.current) fileInputRef_1.current.value=""
  }


  const [upload,setUpload]=useState({
    uploading:false,
    filename:'',
    progress:0,
    ..._upload
  })



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
        //setShow(false)
       // res({filename:result.url})
        setUpload(prev=>({...prev,filename:result.url,uploading:false}))
        clearFileInputs()
      } else {
        toast.error(t('common.error-while-uploading-file'))
        close('reset')
        console.error('File upload error:', xhr.statusText);
        clearFileInputs()
      }


    };
  
    // Handle error
    xhr.onerror = function () {
      close('reset')
      toast.error(t('common.error-while-uploading-file'))
      console.error('File upload error:', xhr.statusText);
    };
  
    // Send the form data
    xhr.send(formData);
  };

  function close(reset){
    if(!reset) setShow(false)
    setUpload({
      filename:'',
      uploading:false,
      progress:0
    })
    setFile({})
    setFileTitle('')
  }
  

  const acceptedFileTypes = '.jpg, .jpeg, .png, .gif, .bmp, .pdf, .doc, .docx, .txt, .xls, .xlsx';



  return (


 <div className=" absolute w-full  z-30">


       
    {show && !upload.uploading && <div className="flex justify-center mb-3">
        <span onClick={()=>{
          close()
        }} className="flex items-center cursor-pointer hover:opacity-60">
            <svg className="fill-honolulu_blue-400" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" ><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            <span className="ml-1 underline opacity-80  text-honolulu_blue-400">{t('common.cancel')}</span>
        </span>
    </div>}
            
   

<div class={`w-full grid gap-4 relative mb-5 ease-in transition-all ${!show ? 'opacity-0 pointer-events-none':''}`}>
        
        <div class="w-full py-9 bg-gray-50  shadow-lg  rounded-2xl border border-gray-300 border-dashed">
        
        
        <div class="grid gap-3 relative">


        {(!upload.uploading && !upload.filename) && <div className="flex justify-center">
            <svg class="mx-auto" className="fill-honolulu_blue-500" width="40" height="40" viewBox="0 0 40 40"  xmlns="http://www.w3.org/2000/svg">
            <g id="File">
                <path id="icon" d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z" />
            </g>
            </svg>
        </div>}


        {upload.filename && <span className="flex justify-center">{file.name}</span>}
    
           {!upload.uploading  && 
        <div class="grid gap-1">
            <h4 class={`text-center hidden text-gray-900 text-sm font-medium leading-snug`}>{t('common.drag-file')}</h4>
            <span class={`text-center hidden  text-gray-400 text-xs font-light leading-4`}>{t('common.or')}</span>
            <div class="flex items-center justify-center">
              <label>
                <input accept={acceptedFileTypes} ref={fileInputRef_1} onChange={handleSubmit} type="file" hidden />
                <div class="flex  h-9 px-2 flex-col bg-honolulu_blue-500 rounded-full shadow text-white text-xs font-semibold leading-4 items-center  cursor-pointer justify-center focus:outline-none">{upload.filename ? t('common.change') : t('common.choose-file')}</div>
              </label>
            </div>
          </div>
                
          }


          {upload.uploading && <div className="flex justify-center items-center flex-col">
              <div className="w-[150px] h-[4px] bg-gray-300 rounded-[0.4rem] relative">
                    
                    <div style={{width:`${upload.progress}%`}} className="absolute left-0 top-0  h-full bg-honolulu_blue-400"></div>
      
              </div>
              <span className="mt-2">{`${upload.progress.toFixed(2)}%`}</span>
           </div>}

        


        </div>
        
        </div>
                    
        {upload.filename &&  <div className={`bg-gray absolute px-1 overflow-hidden flex items-center left-[50%] bottom-[-20px] border-gray-300 bg-white  border text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500  w-[80%] translate-x-[-50%]`}>

          <input value={fileTitle} onChange={(e)=>{
            setFileTitle(e.target.value)
          }} placeholder={t('common.title-optional')} className={` p-2.5 outline-none flex-1`}/>
          <div onClick={()=>{
            res({...upload,comment:fileTitle})
            close()
          }} class="flex  h-9 px-5  flex-col bg-green-500 rounded-full shadow text-white text-xs font-semibold leading-4 items-center  cursor-pointer justify-center focus:outline-none">{t('common.send')}</div>
             
        
        </div>}
            
        </div> 


    </div>

   

  )
}

export default ChatFile