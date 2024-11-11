import i18next, { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function CancelAppointmentModel({}) {
    
 const data=useData()
 const {user}=useAuth()

  const [options,setOptions]=useState([])

  async function createRefund(){

    data.setIsLoading(true)
    toast.remove()
     
     try{

          await data.makeRequest({method:'post',url:`api/refunds/create`,withToken:true,data:{
            appointment_id:data.appointmentcancelationData.consultation.id
          }, error: ``},0);
          toast.success(t('messages.canceled-successfully'))
          data.setAppointmentcancelationData({})
          data.setUpdateTable(Math.random())
          data._showPopUp('basic_popup','wait-for-refund')

     }catch(e){

        console.log({e})
        data.setUpdateTable(Math.random())

        if(e.message==500){
            toast.error(t('common.unexpected-error'))
        }else  if(e.message=='Failed to fetch'){
            toast.error(t('common.check-network'))
        }else{
            toast.error(t('common.unexpected-error'))
        }
        

     }

     data.setIsLoading(false)
    
  }

  function handleOptions(action){
    if(action=="refund"){
             createRefund()
    }else{
        setTimeout(()=>data._showPopUp('doctor_list'),200)
        data.setAppointmentcancelationData({...data.appointmentcancelationData,hide:true})
    }
  }

  useEffect(()=>{
     setOptions(
       [{action:'refund',name:t('common.get-refund'),content:t('messages.get-refund')},
        {action:'replace',name:t('common.choose-aother-appointment'),hide:user?.role!="patient",content:t('messages.choose-aother-appointment')}]
     )

  },[i18next.language])

  return (
    
<div id="select-modal" tabindex="-1" aria-hidden="true" class={`overflow-y-auto ${(data.appointmentcancelationData?.consultation?.id && !data.appointmentcancelationData?.hide) ? '':'pointer-events-none opacity-0 translate-y-[100px]'} ease-in transition-all delay-75 bg-[rgba(0,0,0,0.3)] flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}>
    <div class="relative p-4 w-full max-w-md max-h-full">
       
        <div class="relative bg-white rounded-lg shadow">
           
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-lg font-semibold text-gray-900">
                    {t('common.cancel-appointment')}
                </h3>
                <button onClick={()=>data.setAppointmentcancelationData({})} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="select-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
          
            <div class="p-4 md:p-5" onClick={()=>handleOptions(i.action)}>
                <p class="text-gray-500 mb-4">{t('common.cancelation-methods')}</p>
                <ul class="space-y-4 mb-4">
                    {options.map(i=>(
                        <li  className={`${i.hide ? 'hidden':''}`} onClick={()=>{
                            handleOptions(i.action)
                            data.isLoading(true)
                        }}>
                           
                            <label for="job-1" class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer  hover:text-gray-900 hover:bg-gray-100">                           
                                <div class="block flex-1">
                                    <div class="w-full text-lg font-semibold">{i.name}</div>
                                    <div class="w-full text-gray-500">{i.content}</div>
                                </div>
                                <svg class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                            </label>
                        </li>
                    ))}
                </ul>
                <button class="text-white hidden inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Next step
                </button>
            </div>
        </div>
    </div>
</div> 

  )
}
