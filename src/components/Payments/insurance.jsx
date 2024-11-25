import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Loader from '../Loaders/loader'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function InsurancePayment({info}) {

  const data=useData()
  const [loading,setLoading]=useState(false)
  const [changeInsurance,setChangeInsurance]=useState(false)
  const [changePolicyNumber,setChangePolicyNumber]=useState(false)

  const {user}=useAuth()

  useEffect(()=>{
    data.setPaymentInfo({...info,insurance_company:user?.data.policy_number,policy_number:user?.data.policy_number})
  },[])

  async function SubmitForm(){     
      setLoading(true)
  
      try{   
         
          let response=await data.makeRequest({method:'post',url:`api/insurance-payment`,withToken:true,data:{
            ...info
            }, error: ``},0);

           data.setPaymentInfo({...info,doctor:null,done:true,appointment:response.appointment})
           setLoading(false)


      }catch(e){

          console.log({e})
          setLoading(false)

         if(e.message==400){
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
    <div className="w-full mt-4">
       <div class="mb-5">
          <label for="insurance_company" class="block mb-2 text-sm font-medium">{t('form.insurance_company')}</label>
          <div className="flex items-center">
             <input value={info.insurance_company} onChange={(e)=>data.setPaymentInfo({...info,insurance_company:e.target.value})}  id="insurance_company" class={`bg-gray-50 border ${!changeInsurance ? 'opacity-70 pointer-events-none':''} border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`} placeholder=""/>
             {(!changeInsurance && user?.data.insurance_company) && <div onClick={()=>setChangeInsurance(true)} className="flex justify-center flex-col items-center ml-1 cursor-pointer hover:opacity-70"> 
                <svg class="me-2 h-4 w-4 sm:h-5 sm:w-5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>
                <span className="text-[14px] text-honolulu_blue-400 underline">{t('common.change')}</span>
             </div>}
          </div>
          {(changeInsurance && user?.data?.insurance_company != info.insurance_company) && <span onClick={()=>{
            data.setPaymentInfo({...info,insurance_company:user?.data?.insurance_company})
            setChangeInsurance(false)
          }} className="underline text-honolulu_blue-400 cursor-pointer hover:opacity-60">{t('common.use-the-defined-insurance-company')}</span>}
      </div>

      <div class="mb-5">
          <label for="policy_number" class="block mb-2 text-sm font-medium">{t('form.policy_number')}</label>
          <div className="flex items-center">
             <input value={info.policy_number} onChange={(e)=>data.setPaymentInfo({...info,policy_number:e.target.value})}  id="policy_number" class={`bg-gray-50 border ${!changePolicyNumber ? 'opacity-70 pointer-events-none':''} border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`} placeholder=""/>
             {(!changePolicyNumber && user?.data.policy_number) && <div onClick={()=>setChangePolicyNumber(true)} className="flex justify-center flex-col items-center ml-1 cursor-pointer hover:opacity-70"> 
                <svg class="me-2 h-4 w-4 sm:h-5 sm:w-5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>
                <span className="text-[14px] text-honolulu_blue-400 underline">{t('common.change')}</span>
             </div>}
          </div>
          {(changePolicyNumber && user?.data?.policy_number != info.policy_number) && <span onClick={()=>{
            data.setPaymentInfo({...info,policy_number:user?.data?.policy_number})
            setChangePolicyNumber(false)
          }} className="underline text-honolulu_blue-400 cursor-pointer hover:opacity-60">{t('common.use-the-defined-policy-number')}</span>}
      </div>


      <button onClick={()=>{
                            SubmitForm()
                        }} type="submit" class={`flex relative mt-4 w-full items-center justify-center ${loading ? 'pointer-events-none':''} rounded-lg ${(info?.policy_number && info?.insurance_company) ? 'bg-honolulu_blue-500':'bg-gray-400 pointer-events-none opacity-90'} px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300`}>
                            <span className={`${loading ? 'opacity-0':''}`}> {t('common.proceed-with-payment')}</span>
                            <div className={`${!loading ? ' opacity-0':''} opacity-1 h-full  absolute left-0 top-0 w-full flex items-center justify-center`}>
                                <Loader/> <span>{t('common.loading')}</span>
                            </div>
      </button>



    </div>
  )
}
