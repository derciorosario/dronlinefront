import { t, use } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import SelectPayemntMethod from './selectPayemntMethod';
import SendProof from './proof';
import Mpesa from './m-pesa';
import toast from 'react-hot-toast';
import InsurancePayment from './insurance';

function PaymentProcess({ info }) {

  const data=useData();

  return (
    <div className={`w-full h-[100vh] bg-[rgba(0,0,0,0.2)]  ease-in _doctor_list ${(!info?.type_of_care || info.done) ? 'opacity-0 pointer-events-none translate-y-[100px]' : ''} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>
      <div id="payment_popup" className="w-full max-h-[90vh] overflow-y-auto p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[600px]">
               
        <div className={`flex absolute mb-3 top-1 ${info.loading ? 'opacity-0 pointer-events-none':''} left-2`}>
          <span onClick={() => {
               if(info.step==3){
                 data.setPaymentInfo({done:true,is_proof:true})
               }else{
                 data.setPaymentInfo({})
               }
          }} className="table px-2 bg-gray-200 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
            {info.step==3 ? t('common.close') : t('common.go-back')}
          </span>
        </div>

        {info.step!=3 && <div className={`flex absolute mb-3 top-1 ${info.loading ? 'opacity-0 pointer-events-none':''} right-2`}>
            <span onClick={() => {
                localStorage.setItem('saved_appointment_url',window.location.search)
                toast.success(t('messages.successfully-saved'))
            }} className="table px-2 bg-honolulu_blue-500 text-white right-1 top-1 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
              {t('common.close-and-save')}
            </span>

        </div>}


      <ol class="items-center mt-3 border-b pb-4 flex w-full max-w-2xl text-center text-sm font-medium text-gray-500  sm:text-base">
        <li class="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200  sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span class="flex items-center after:mx-2 after:text-gray-200 after:content-['/']  sm:after:hidden">
            <svg class={`me-2 h-4 w-4 sm:h-5 sm:w-5 ${(info.step==1 || !info.step) ? '':' fill-green-500'}`} aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"  viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <label className={`flex-1 ${(info.step==1 || !info.step) ? 'font-medium text-black':'font-normal text-green-500'}`}>{t('common.payment-method')}</label>
            </span>
        </li>

        <li class="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200  sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
            <svg class={`me-2 h-4 w-4 sm:h-5 sm:w-5 ${info.step == 3 ? 'fill-green-500':''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <label className={`flex-1 ${info.step==2 ? 'font-medium text-black':info.step >= 2 ? 'font-normal text-green-500':''}`}>{t('common.payment')}</label>
            </span>
        </li>

        <li class="flex shrink-0 items-center">
            <svg class={`me-2 h-4 w-4 sm:h-5 sm:w-5 ${info.step == 3 ? 'fill-green-500':''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <label className={`flex-1 ${info.step == 3 ? 'font-normal text-green-500':''}`}>{t('common.completion')}</label>
        </li>
      </ol>


      <div className="justify-between mb-4 mt-5">
                {info.step==2 && <div className="flex justify-end">

                  <span onClick={()=>{
                    data.setPaymentInfo(({...info,step:1,payment_method:null}))
                    document.querySelector('#payment_popup').scrollTo(0,0)
                }} className="cursor-pointer  underline  text-[14px]">{t('common.select-another-payment-method')}</span>
                  
                  </div>}
                {(!info.step || info.step==1) && <SelectPayemntMethod info={info}/>}
                {(info.step==2 && info.payment_method=='bank_transfer') && <SendProof info={info}/>}
                {(info.step==2 && info.payment_method=='mpesa') && <Mpesa info={info}/>}
                {(info.step==2 && info.payment_method=="insurance") && <InsurancePayment info={info}/>}

                {(info.step==3 && info.payment_method=='bank_transfer') && <div>
                     <h3 className="mt-3 font-medium text-[20px] mb-2">{t('common.proof-sent')}</h3>
                     <div class="p-4 text-sm text-gray-800 rounded-lg bg-gray-50" role="alert">
                      <span class="font-medium"></span> {t('common.wait-for-approval')}
                     </div>

                     {info.type_of_care=="urgent" && <div class="p-4 mb-4 mt-4 text-sm text-yellow-800 rounded-lg bg-yellow-50" role="alert">
                        <span class="font-medium"></span>{t('messages.contact-us-if-delay')} 
                      </div>}
                </div>}
      </div>

      </div>
    </div>
  );
}

export default PaymentProcess;
