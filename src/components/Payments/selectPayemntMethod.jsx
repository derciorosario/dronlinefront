import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next'
import Loader from '../Loaders/loader'
import toast from 'react-hot-toast'
import i18next from 'i18next'

function SelectPayemntMethod({info}) {
  const data=useData()
  const [invoice,setInvoice]=useState(null)
  let required_data=['cancellation_taxes','specialty_categories']

  useEffect(() => {
    if(!info?.payment_method) return
    data.handleLoaded('remove',required_data)
    data._get(required_data)

  }, [info]);

  
  async function getAppointment(){
    try{

        let response=await data.makeRequest({method:'get',url:`api/get-invoice-by-appointment-id/`+info?.canceled_appointment_id,withToken:true, error: ``},0);
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
    
    if(info?.canceled_appointment_id){
        getAppointment()
    }else{
        setInvoice(null)
    }

  },[info])


  async function createNoAmountPayment(form_data){
         try{

            data.setIsLoading(true)

            let r=await data.makeRequest({method:'post',url:`api/no-amount-payment/create`,withToken:true,data:{
              ...form_data
            }, error: ``},0);

            data.setIsLoading(false)
            data.setPaymentInfo({...info,step:3})
          
         }catch(e){
             data.setIsLoading(false)
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



  function getAmount(){

    let cat=data._specialty_categories.filter(i=>i.id==info?.medical_specialty)[0]
    if(cat && data._loaded.includes('cancellation_taxes') && info?.payment_method && (info?.canceled_appointment_id && invoice || !info?.canceled_appointment_id)){
       
       let price=0
       let refund=0
       let refund_with_no_tax=0
       let consultation_price=0


       if(info?.type_of_care=="scheduled"){
           price=cat.normal_consultation_price
       }else if(info?.type_of_care=="urgent"){
           price=cat.urgent_consultation_price
       }else{
           price=cat.home_consultation_price
       }

       consultation_price=price

       let payment_method=data._cancellation_taxes.filter(i=>i.payment_method==info?.payment_method)[0]

       let taxes=0

       if(info?.canceled_appointment_id){
     
          //calc 
          let invoice_amount=parseFloat(invoice?.price || 0) /// let invoice_amount=parseFloat(invoice.amount)

          let amount_to_pay=price > invoice_amount ? price - invoice_amount : 0

          if(invoice_amount==price){
            amount_to_pay=0
          }
          
          price=amount_to_pay

          refund=!price ? invoice_amount - price : 

          refund_with_no_tax=refund

          /*if(refund){
            if(payment_method.is_by_percentage){
              taxes=(parseFloat(refund) * (parseFloat(payment_method.value) / 100))
            }else{
              taxes=parseFloat(payment_method.value)
            }
            refund=refund-taxes
          }*/

       }

       return {price,taxes,refund,refund_with_no_tax,consultation_price}
    }else{
       return {price:0,taxes:0,refund:0,refund_with_no_tax:0,consultation_price:0}
    }

  }
  
 
  return (
    <div>

    <h3 className="mt-7 font-medium text-[20px] mb-3">{t('common.select-payment-method')}</h3>

    <div class="space-y-4">

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 cursor-pointer" onClick={()=>{
                     data.setPaymentInfo(({...info,payment_method:'mpesa'}))
                     document.querySelector('#payment_popup').scrollTop=document.querySelector('#payment_popup')?.clientHeight || 0
               }}>

              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input checked={info?.payment_method=="mpesa"} id="mpesa" aria-describedby="mpesa-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600" />
                </div>
                
                <div class="ms-4 text-sm">
                  <label for="mpesa" class="font-medium leading-none text-gray-900 cursor-pointer"> M-pesa </label>
                  <p id="mpesa-text" class="mt-1 text-xs font-normal text-gray-500"></p>
                </div>
              </div>
            </div>


            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 cursor-pointer" onClick={()=>{
                     data.setPaymentInfo(({...info,payment_method:'paypal'}))
                     document.querySelector('#payment_popup').scrollTop=document.querySelector('#payment_popup')?.clientHeight || 0
                  }}>
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input checked={info?.payment_method=="paypal"} id="paypal" aria-describedby="paypal-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600" />
                </div>

                <div class="ms-4 text-sm">
                  <label for="paypal" class="font-medium leading-none text-gray-900 cursor-pointer"> Paypal </label>
                  <p id="paypal-text" class="mt-1 text-xs font-normal text-gray-500">{t('common.taxes-may-apply')}</p>
                </div>
              </div>
            </div>

            <div class="rounded-lg  border border-gray-200 bg-gray-50 p-4 ps-4 cursor-pointer" onClick={()=>{
                     data.setPaymentInfo(({...info,payment_method:'bank_transfer'}))
                     document.querySelector('#payment_popup').scrollTop=document.querySelector('#payment_popup').clientHeight
            }}>

              <div class="flex items-start">
               
                <div class="flex h-5 items-center">
                  <input checked={info?.payment_method=="bank_transfer"} id="fedex" aria-describedby="fedex-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600" />
                </div>

                <div class="ms-4 text-sm">
                  <label for="fedex" class="font-medium leading-none text-gray-900 cursor-pointer"> {t('common.bank-transfer')}</label>
                  <p id="fedex-text" class="mt-1 text-xs font-normal text-gray-500"></p>
                </div>

              </div>
            </div>


            <div class="rounded-lg hidden border border-gray-200 bg-gray-50 p-4 ps-4 cursor-pointer" onClick={()=>{
                     data.setPaymentInfo(({...info,payment_method:'insurance'}))
                     document.querySelector('#payment_popup').scrollTop=document.querySelector('#payment_popup').clientHeight
            }}>
              <div class="flex items-start">
                <div class="flex h-5 items-center">
                  <input checked={info?.payment_method=="insurance"} id="fedex" aria-describedby="fedex-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600" />
                </div>

                <div class="ms-4 text-sm">
                  <label for="fedex" class="font-medium leading-none text-gray-900 cursor-pointer"> {t('common.insurance')}</label>
                  <p id="fedex-text" class="mt-1 text-xs font-normal text-gray-500"></p>
                </div>
              </div>
            </div>

          </div>
   </div>


    <div class={`mt-6 w-full ${!info?.payment_method ? 'hidden':''}`}> 
        <div class="flow-root">
          <div class="-my-3 divide-y divide-gray-200">

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.consult')}</dt>
              <dd class="text-base font-medium text-gray-900 text-right">{data._specialty_categories.filter(i=>i.id==info?.medical_specialty)[0]?.[i18next.language+"_name"]}</dd>
            </dl>
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('form.type-of-care')}</dt>
              <dd class="text-base font-medium text-gray-900 text-right">{t('form.'+info?.type_of_care+"-c")} {info?.type_of_care=="scheduled"  ? `(Normal)` :''}</dd>
            </dl>

            {info?.type_of_care!="requested" && <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.doctor')}</dt>
              <dd class="text-base font-medium text-gray-900 text-right">{(data._doctors?.data || []).filter(i=>i.id==info?.doctor_id)[0]?.name}</dd>
            </dl>}

            {getAmount().refund!=0 && <>
              <dl class="flex items-center justify-between gap-4 py-3">
                <dt class="text-base font-normal text-gray-500">{t('common.paid-before')}</dt>
                <dd class="text-base font-medium text-gray-900 text-right">{data.formatNumber(data._cn_op(invoice?.price))} MT</dd>
              </dl>

             {invoice?.amount!=getAmount().consultation_price && <>
                <dl class="flex items-center justify-between gap-4 py-3 hidden">
                <dt class="text-base font-normal text-gray-500">{t('common.cancelation-tax')}</dt>
                <dd class="text-base font-medium text-gray-900 text-right">{data.formatNumber(data._cn_op(getAmount().taxes))} MT</dd>
                </dl>

                <dl class="flex items-center justify-between gap-4 py-3">
                <dt class="text-base font-normal text-gray-500">{t('common.amount-to-refund')}</dt>
                <dd class="text-base font-medium text-gray-900 text-right">{data.formatNumber(data._cn_op(getAmount().refund))} MT</dd>
                </dl>
              </>}
              
              <dl class="flex items-center justify-between gap-4 py-3">
                <dt class="text-base font-normal text-gray-500">{t('common.consultation-price')}</dt>
                <dd class="text-base font-medium text-gray-900 line-through text-right">{data.formatNumber(data._cn_op(getAmount().consultation_price))} MT</dd>
              </dl>
            </>}


            {(getAmount().refund==0 && getAmount().price!=getAmount().refund && info?.canceled_appointment_id) && <>
             
              <dl class="flex items-center justify-between gap-4 py-3">
                <dt class="text-base font-normal text-gray-500">{t('common.paid-before')}</dt>
                <dd class="text-base font-medium text-gray-900 text-right">{data.formatNumber(data._cn_op(invoice?.price))} MT</dd>
              </dl>

              <dl class="flex items-center justify-between gap-4 py-3">
                <dt class="text-base font-normal text-gray-500">{t('common.consultation-price')}</dt>
                <dd class="text-base font-medium text-gray-900 line-through text-right">{data.formatNumber(data._cn_op(getAmount().consultation_price))} MT</dd>
              </dl>
            </>}


            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-bold text-gray-900">{t('common.total-to-pay')}</dt>
              <dd class="text-base font-bold text-gray-900 text-right">
                 <>
                    {data._loaded.includes('cancellation_taxes') && (info?.canceled_appointment_id && invoice || !info?.canceled_appointment_id) && `${data.formatNumber(data._cn_op(getAmount().price))} MT`}
                    {!(data._loaded.includes('cancellation_taxes') && (info?.canceled_appointment_id && invoice || !info?.canceled_appointment_id)) && <div>
                        <Loader/>
                    </div>}
                  </>
              </dd>
            </dl>
          </div>
        </div>

        <div class="space-y-3 mt-2">

          <button onClick={()=>{
             let form_data=({...info,step:2,amount:getAmount().price,taxes:getAmount().taxes,price:getAmount().consultation_price})
             if(getAmount().price==0){
                  createNoAmountPayment(form_data)
                  return
             }
             data.setPaymentInfo(form_data)
             document.querySelector('#payment_popup').scrollTo(0,0)
          }} type="submit" class={`flex w-full items-center justify-center rounded-lg ${(info?.payment_method && data._loaded.includes('cancellation_taxes')) ? 'bg-honolulu_blue-500':'bg-gray-400 pointer-events-none opacity-90'} px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300`}>
             {t('common.proceed-with-payment')}
          </button>
          <p class=" hidden text-sm font-normal text-gray-500">One or more items in your cart require an account. <a href="#" title="" class="font-medium text-primary-700 underline hover:no-underline">Sign in or create an account now.</a>.</p>
       </div>
      </div>

        </div>
  )
}

export default SelectPayemntMethod