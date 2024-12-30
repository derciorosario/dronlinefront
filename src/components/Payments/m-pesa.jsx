import { t } from 'i18next'
import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Loader from '../Loaders/loader'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

function Mpesa({info}) {
    const data=useData()

    const [loading,setLoading]=useState(false)
    const {user} = useAuth()

    async function SubmitForm(){
        setLoading(true)
        data.setPaymentInfo({...info,loading:true})
    
        try{   
           
            let response=await data.makeRequest({method:'post',url:`api/mpesa/c2b`,withToken:true,data:{
                phone:info?.mpesa_number,
              ...info,
                doctor:null,
                patient_id:user?.data?.id
              }, error: ``},0);

             data.setPaymentInfo({...info,doctor:null,done:true,appointment:response.appointment,loading:false})
             setLoading(false)

        }catch(e){

            data.setPaymentInfo({...info,loading:false})

            console.log({e})
            setLoading(false)
            if(e.message==401){
                toast.error(t('messages.transaction-not-authorized'))
            }else if(e.message==400){
                toast.error(t('common.invalid-data'))
            }else if(e.message==500){
                toast.error(t('common.unexpected-error'))
            }else  if(e.message=='Failed to fetch'){
                toast.error(t('common.check-network'))
            }else{
                toast.error(t('common.unexpected-error'))
            }
          }
      }


    return (
        <div>
            <h3 className="mt-3 font-medium text-[20px] mb-2">{t('common.select-your-mpesa-number')}</h3>
    
          
            <div class="mb-3">
                        <div className="flex items-center">
                              <div class={`bg-gray w-[70px] mr-1 border border-gray-300  text-gray-900 text-sm rounded-[0.4rem] focus:ring-blue-500 focus:border-blue-500 block p-2.5`}>
                                 <span>+258</span>
                              </div> 
                              <input value={info?.mpesa_number} onChange={(e)=>data.setPaymentInfo({...info,mpesa_number:e.target.value.slice(0,9).replace(/[^0-9]/g, '')})} type="text" id="contact" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                        </div>
                        <button onClick={()=>{
                            SubmitForm()
                        }} type="submit" class={`flex relative mt-4 w-full items-center justify-center ${loading ? 'pointer-events-none':''} rounded-lg ${info?.mpesa_number?.length==9 ? 'bg-honolulu_blue-500':'bg-gray-400 pointer-events-none opacity-90'} px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300`}>
                            <span className={`${loading ? 'opacity-0':''}`}> {t('common.proceed-with-payment')}</span>
                            <div className={`${!loading ? ' opacity-0':''} opacity-1 h-full  absolute left-0 top-0 w-full flex items-center justify-center`}>
                                <Loader/> <span>{t('common.verify-phone')}</span>
                            </div>
                        </button>
            </div>
    
            
        </div>
      )
}

export default Mpesa