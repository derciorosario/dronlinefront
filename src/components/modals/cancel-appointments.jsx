import i18next, { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../Loaders/loader'

export default function CancelAppointmentModel({}) {
    
 const data=useData()
 const {user}=useAuth()

  const [options,setOptions]=useState([])
  const [showReasons,setShowReasons]=useState(false)
  const [selectReason,setSelectedReason]=useState(null)
  const [invoice,setInvoice]=useState(null)
  const [loading,setLoading]=useState(false)
  const [itemsLoaded,setItemsLoaded]=useState(false)

  let required_data=['cancellation_taxes','specialty_categories']

  async function getAppointment(){
    try{

        let response=await data.makeRequest({method:'get',url:`api/get-invoice-by-appointment-id/`+data.appointmentcancelationData?.consultation?.id,withToken:true, error: ``},0);
        setInvoice(response)

     }catch(e){

         console.log(e)

         if(e.message==404){
            toast.error(t('common.item-not-found'))
         }else  if(e.message=='Failed to fetch'){
            toast.error(t('common.check-network'))
         }else{
            toast.error(t('common.unexpected-error'))
         } 

     }
  }

  useEffect(()=>{

      if(data.appointmentcancelationData?.consultation?.type_of_care=="requested" && selectReason){
         cancelRequestedConsultation()
      }

      if(data.appointmentcancelationData?.consultation?.id && data.appointmentcancelationData?.consultation?.type_of_care!="requested"){
          data.handleLoaded('remove',required_data)
          data._get(required_data)
          getAppointment()
      }else{
          setInvoice(null)
      }
  },[data.appointmentcancelationData,selectReason])



  useEffect(()=>{

      setItemsLoaded((invoice && data._loaded.includes('cancellation_taxes') && data._loaded.includes('specialty_categories')))

  },[invoice,data._loaded])


  async function cancelRequestedConsultation(){
   
    data.setIsLoading(true)
    toast.remove()
     
     try{
          await data.makeRequest({method:'post',url:`api/cancel-requested-appointment`,withToken:true,data:{
            appointment_id:data.appointmentcancelationData.consultation.id,
            cancelation_reason:selectReason
          }, error: ``},0);
          toast.success(t('messages.canceled-successfully'))
          data.setAppointmentcancelationData({})
          setShowReasons(false)
          setSelectedReason(null)
          data.setUpdateTable(Math.random())

     }catch(e){

        console.log({e})
        data.setUpdateTable(Math.random())
        setSelectedReason(null)

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


 

  function getAmount(){
    
    if(invoice && data._loaded.includes('cancellation_taxes')){
       let price=parseFloat(invoice?.amount || 0)
       let consultation_price=price
   
       let payment_method=data._cancellation_taxes.filter(i=>i.payment_method==invoice?.payment_method)[0]

       let taxes=0

       if(payment_method.value){
          if(payment_method.is_by_percentage){
              taxes=(parseFloat(price) * (parseFloat(payment_method.value) / 100))
          }else{
              taxes=parseFloat(payment_method.value)
          }
       }

       price-=taxes
       

       return {price,taxes,consultation_price}
    }else{
       return {price:0,taxes:0,consultation_price:0}
    }
  }





  useEffect(()=>{
    setShowReasons(data.appointmentcancelationData?.consultation?.type_of_care=="requested" ? true : false)
  },[data.updateTable])



  
 

  async function createRefund(){
    data.setIsLoading(true)
    toast.remove()
     
     try{
          await data.makeRequest({method:'post',url:`api/refunds/create`,withToken:true,data:{
            appointment_id:data.appointmentcancelationData.consultation.id,
            doctor_id:data.appointmentcancelationData.consultation.doctor_id,
            amount:getAmount().price,
            taxes:getAmount().taxes,
            price:getAmount().consultation_price,
            cancelation_reason:selectReason
          }, error: ``},0);
          toast.success(t('messages.canceled-successfully'))
          data.setAppointmentcancelationData({})
          setShowReasons(false)
          setSelectedReason(null)
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
            setShowReasons(true)
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
   
   
    <div class={`relative p-4 w-full ${showReasons ? 'max-w-[500px]' :'max-w-md'}`}>

         
       
        <div class="relative bg-white rounded-lg shadow">
           
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-lg font-semibold text-gray-900">
                    {t('common.cancel-appointment')}
                </h3>
                <button onClick={()=>{
                    data.setAppointmentcancelationData({})
                    setSelectedReason(false)
                    setShowReasons(false)
                }} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="select-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>


           {showReasons && <div className="px-4 mt-3">
          
              

                <div className="flex items-center mb-4">
                    <span onClick={()=>{
                        setShowReasons(false)
                        setSelectedReason(null)
                    }}  className="table mr-3 px-2 bg-gray-200 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
                        {t('common.go-back')}
                    </span>
                    {!selectReason && <p class="text-gray-800 font-medium">{t('common.reason-for-cancelation')}</p>}
                    {selectReason && <p class="text-gray-700 font-medium">{t('common.resume')}</p>}

                </div>

                {!selectReason && <ul style={{height:'calc(100vh - 300px)'}} class="text-sm font-medium overflow-auto  text-gray-900 bg-white border border-gray-200 rounded-lg">
                    {data.cancelation_reasons.map((i,_i)=>(
                        <li onClick={()=>setSelectedReason(i)} class="w-full border-b border-gray-200 rounded-t-lg">
                            <div class="flex items-center ps-3">
                                <input id={`list-radio-license-${_i}`} type="radio" value="" name="list-radio" class="w-4 h-4 text-honolulu_blue-400 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600  focus:ring-2"/>
                                <label for={`list-radio-license-${_i}`} class="w-full py-3 ms-2 text-sm font-medium text-gray-900">{t('common.'+i)} </label>
                            </div>
                       </li>
                    ))}
                </ul>}


            </div>}
           
    
          
            {!showReasons && <div class="p-4 md:p-5">

                <p class="text-gray-500 mb-4">{t('common.cancelation-methods')}</p>
                <ul class="space-y-4 mb-4">
                    {options.map(i=>(
                        <li  className={`${i.hide ? 'hidden':''}`} onClick={()=>{
                            handleOptions(i.action)
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
            </div>}


         {(selectReason && invoice && itemsLoaded) && <div class="flow-root px-5 pb-5">

          <div class="-my-3 divide-y divide-gray-200">

             <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.consult')}</dt>
              <dd class="text-base font-medium text-gray-900">{data._specialty_categories.filter(i=>i.id==data.appointmentcancelationData?.consultation?.medical_specialty)[0]?.[`${i18next.language}_name`]}</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.payment-method')}</dt>
              <dd class="text-base font-medium text-gray-900">{t('common.'+invoice?.payment_method)}</dd>
            </dl>
            
             <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.paid-before')}</dt>
              <dd class="text-base font-medium text-gray-900">{data.formatNumber(data._cn_op(invoice?.amount))} MT</dd>
            </dl>


            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.cancelation-tax')}</dt>
              <dd class="text-base font-medium text-gray-900">{data.formatNumber(data._cn_op(getAmount().taxes))} MT</dd>
            </dl>


            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-bold text-gray-900">{t('common.amount-to-refund')}</dt>
              <dd class="text-base font-bold text-gray-900">{data.formatNumber(data._cn_op(getAmount().price))} MT</dd>
            </dl>
          </div>

        </div>}


       <div className="p-4 md:p-5">
          {(selectReason && itemsLoaded)  && <button onClick={()=>{
               createRefund()
          }} class={`text-white mt-3 mb-6 inline-flex w-full justify-center ${(selectReason && invoice) ? 'bg-honolulu_blue-400 hover:bg-honolulu_blue-400':'bg-gray-400 pointer-events-none'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                    {t('common.cancel-consultation')}
        </button>}
       </div>

  

      {(!itemsLoaded && selectReason) && <div className="h-[200px] flex flex-col items-center justify-center">
         
            <div className="mb-2">{t('common.loading')}</div>
            <Loader/>

       </div>}




        </div>
    </div>
</div> 

  )
}
