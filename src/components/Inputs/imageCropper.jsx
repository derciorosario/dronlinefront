import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import { v4 as uuidv4 } from "uuid";
import { useData } from "../../contexts/DataContext";
import { t } from "i18next";

const LogoImageCropper = ({ onUpload }) => {

  const data=useData()
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const croppedImg = await getCroppedImg(data.imageSrc, croppedAreaPixels);
    data.setCroppedImage(croppedImg);
  }, [data.imageSrc]);


  
  return (
    <div style={{zIndex:999}} id="crud-modal" tabindex="-1" aria-hidden="true" class={`overflow-y-auto bg-[rgba(0,0,0,0.7)] flex ease-in delay-100 transition-all ${!data.imageSrc ? 'opacity-0 pointer-events-none translate-y-[50px]':''} overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
           
      <div class={`relative ${!data.imageSrc ? 'hidden':''} delay-0 transition-none _crop_image p-4 bg-white rounded-lg shadow max-w-[300px]  max-sm:w-[200px]  md:p-8 table`}>

          <div class="flex items-center justify-between mb-4">

          <h5 class="text-xl max-md:text-[1rem] font-bold leading-none text-gray-900 flex items-center">{t('common.crop-image')}</h5>

          <div onClick={()=>{
             data.setImageSrc(null)
          }} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>         

          </div>
      <div class="justify-between mb-4">
            {data.imageSrc && (
              <div className="w-[300px] rounded-[0.3rem] h-[300px] relative max-sm:w-[200px] max-sm:h-[200px] bg-slate-500">
                <Cropper
                  image={data.imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={7 / 8}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}

             <div className="flex justify-center w-full mt-3">
                <button onClick={()=>{
                  localStorage.setItem('upload-cron-image',true)
                  data.setImageSrc(null)
                  data.setUploadFromCrop(Math.random())
                }} id="confirm-button" type="button" class="py-2 px-4 w-full text-sm font-medium text-center rounded-lg text-white bg-primary-700  bg-honolulu_blue-500 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300">{t('common.confirm')}</button>
             </div>

             {/**data.croppedImage && <img src={URL.createObjectURL(data.croppedImage)} alt="Cropped Preview" />**/} 
      </div>
      </div>
    </div>
  );
};

export default LogoImageCropper;
