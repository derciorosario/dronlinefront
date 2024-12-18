import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'

function AdditionalMessage({type,setMessage,message,float,id,btnSee,btnClose,title}) {

  const timeoutPercentage=useRef(0)
  const [per,setPer]=useState(0)

  useEffect(() => {
    if(!message){
      timeoutPercentage.current=0
      return
    }
    const interval = setInterval(() => {
      timeoutPercentage.current = timeoutPercentage.current + 1;
      if(timeoutPercentage.current==100){
        setMessage('')
      }
      setPer(timeoutPercentage.current)
    }, 50);
    return () => clearInterval(interval);
  }, [message]);


  
  return (
  <div style={{zIndex:'99999'}} id={id} className={`${float ? 'fixed':''} sm:right-10 sm:max-w-[400px] w-full bottom-0 ${!message ? 'translate-y-[100%] opacity-0 pointer-events-none':''}   w-full [&>_div]:w-full  transition-all ease-in duration-150`}>
   
  <div className={`absolute h-[5px] overflow-hidden max-sm:w-full sm:translate-x-[-50%] sm:left-[50%]  top-[0.1rem]  rounded-[0.3rem]`} style={{width:'98%'}}>
 
    <div className={`absolute h-full top-0 left-0 `} style={{background:type || '#111',width:100 - per+'%'}}></div>
    <div className={`h-full w-full`}  style={{background:type || '#111',opacity:'0.4'}}></div>

  </div>
  

  {type=="blue" && <div id="alert-additional-content-1" class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 " role="alert">
  <div class="flex items-center">
    <svg class="flex-shrink-0 w-4 h-4 me-2"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium   mb-2">{title}</h3>
  </div>
  <div class="mt-2 mb-4 text-sm hidden">
  {message} 
  </div>
  <div class="flex">
   {btnSee &&  <button onClick={btnSee?.onClick} type="button" class="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center">
      <svg class="me-2 h-3 w-3"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
      </svg>
      {btnSee?.text || t('common.see')}
    </button>}
    <button onClick={()=>setMessage('')} type="button" class="text-blue-800 bg-transparent border border-blue-800 hover:bg-blue-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center" data-dismiss-target="#alert-additional-content-1" aria-label="Close">
    {btnClose || t('common.close')}
    </button>
  </div>
</div>}


{type=="red" && 
<div id="alert-additional-content-2" class="p-4 shadow mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
  <div class="flex items-center">
    <svg class="flex-shrink-0 w-4 h-4 me-2"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium  mb-2">{title}</h3>
  </div>
  <div class="mt-2 mb-4 text-sm hidden">
  {message}
  </div>
  <div class="flex">
    {btnSee && <button onClick={btnSee?.onClick} type="button" class="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center ">
      <svg class="me-2 h-3 w-3"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
      </svg>
      {btnSee?.text || t('common.see')}
    </button>}
    <button onClick={()=>setMessage('')} type="button" class="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center" data-dismiss-target="#alert-additional-content-2" aria-label="Close">
    {btnClose || t('common.close')}
    </button>
  </div>
</div>}


{type=="green" && <div id="alert-additional-content-3" class="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
  <div class="flex items-center">
    <svg class="flex-shrink-0 w-4 h-4 me-2"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium  mb-2">{title}</h3>
  </div>
  <div class="mt-2 mb-4 text-sm hidden">
  {message}
  </div>
  <div class="flex">
    {btnSee && <button onClick={btnSee?.onClick} type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center">
      <svg class="me-2 h-3 w-3"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
      </svg>
      {btnSee?.text || t('common.see')}
    </button>}
    <button onClick={()=>setMessage('')} type="button" class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center" data-dismiss-target="#alert-additional-content-3" aria-label="Close">
    {btnClose || t('common.close')}
    </button>
  </div>
</div>}


{type=="yellow" && <div id="alert-additional-content-4" class="p-4 mb-4 text-yellow-800 border" role="alert">
  <div class="flex items-center">
    <svg class="flex-shrink-0 w-4 h-4 me-2"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium  mb-2">{title}</h3>
  </div>
  <div class="mt-2 mb-4 text-sm hidden">
     {message}
  </div>
  <div class="flex">
    {btnSee && <button onClick={btnSee?.onClick} type="button" class="text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center">
      <svg class="me-2 h-3 w-3"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
      </svg>
      {btnSee?.text || t('common.see')}
    </button>}
    <button onClick={()=>setMessage('')} type="button" class="text-yellow-800 bg-transparent border border-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center" data-dismiss-target="#alert-additional-content-4" aria-label="Close">
      {btnClose || t('common.close')}
    </button>
  </div>
</div>}



{(type=="none" || !type) &&  <div id="alert-additional-content-5" class="p-4 border border-gray-300 rounded-lg bg-gray-50" role="alert">
  <div class="flex items-center">
    <svg class="flex-shrink-0 w-4 h-4 me-2"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium text-gray-800  mb-2">{title}</h3>
  </div>
  <div class="mt-2 mb-4 text-sm text-gray-800 hidden">
    {message}
  </div>
  <div class="flex">
   {btnSee && <button onClick={btnSee?.onClick} type="button" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center">
      <svg class="me-2 h-3 w-3"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
      </svg>
      {btnSee?.text || t('common.see')}
    </button>}
    <button onClick={()=>setMessage('')} type="button" class="text-gray-800 bg-transparent border border-gray-700 hover:bg-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center" data-dismiss-target="#alert-additional-content-5" aria-label="Close">
      {btnClose || t('common.close')}
    </button>
  </div>
</div>}

    </div>
  )
}

export default AdditionalMessage