import { t } from 'i18next'
import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Loader from '../Loaders/loader'
import toast from 'react-hot-toast'

function Delete({show}) {

  const [isDeleting,setIsDeleting]=useState(false)


  const data=useData()  

  async function defaultDeleteFunction(){
      setIsDeleting(true)
    try{
      let response=await data.makeRequest({method:'post',url:data.itemsToDelete.url,withToken:true,data:{
        ids:data.itemsToDelete.items
      }, error: ``},0)

      
      data._closeAllPopUps()
      setTimeout(()=>setIsDeleting(false),300)

      data.setUpdateTable(Math.random())

      return {ok:true,response}

     }catch(e){

      console.log({e})
      
      setIsDeleting(false)

      return {ok:false}
      
     }
  }
  

  return (

<div style={{zIndex:9999}} id="popup-modal" tabindex="-1" className={`overflow-y-auto overflow-x-hidden ${isDeleting ? '_delete':''} flex bg-[rgba(0,0,0,0.3)] ${!show ? 'opacity-0 pointer-events-none translate-y-[10px]':''} transition-all ease-in delay-75 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    <div className="relative p-4 w-full max-w-md max-h-full _delete">
        <div className="bg-white rounded-lg shadow relative overflow-hidden">
            

                {isDeleting &&  <div className="flex justify-center items-center w-full h-full py-14 flex-col bg-white absolute left-0 top-0 h">
                    <span className="flex items-center mb-2">{t('common.deleting')}...</span>
                    <Loader/>
                </div>}
                
                <button onClick={()=>data._closeAllPopUps()} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">{t('common.sure-to-delete')}</h3>
                <button onClick={async ()=>{
                    
                    if(data.itemsToDelete.deleteFunction=='default'){
                       let r=await defaultDeleteFunction()
                       if(r.ok){
                          toast.success(t('messages.deleted-successfully'))
                       }else{
                          toast.error(t('messages.error-while-deleting'))
                       }
                    }

                }} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    {t('common.yes')}
                </button>
                <button onClick={()=>data._closeAllPopUps()} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">{t('common.cancel')}</button>
            </div>
           

        </div>
    </div>
</div>

  )
}

export default Delete