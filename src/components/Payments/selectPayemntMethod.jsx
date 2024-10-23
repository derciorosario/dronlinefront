import React from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next'

function SelectPayemntMethod({info}) {
 
  const data=useData()
  return (
    <div>

    <h3 className="mt-7 font-medium text-[20px]">{t('common.select-payment-method')}</h3>

    <div class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-900"></h3>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 cursor-pointer" onClick={()=>{
                     data.setPaymentInfo(({...info,payment_method:'mpesa'}))
                  }}>
              <div class="flex items-start">
                <div class="flex h-5 items-center">

                  <input checked={info?.payment_method=="mpesa"} id="dhl" aria-describedby="dhl-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600" />
                </div>

                <div class="ms-4 text-sm">
                  <label for="dhl" class="font-medium leading-none text-gray-900 cursor-pointer"> M-pesa </label>
                  <p id="dhl-text" class="mt-1 text-xs font-normal text-gray-500"></p>
                </div>
              </div>
            </div>

            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 cursor-pointer" onClick={()=>{
                     data.setPaymentInfo(({...info,payment_method:'bank_transfer'}))
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
          </div>
   </div>


    <div class="mt-6 w-full">
        <div class="flow-root">
          <div class="-my-3 divide-y divide-gray-200">
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.consult')}</dt>
              <dd class="text-base font-medium text-gray-900">{info?.medical_specialty}</dd>
            </dl>
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('form.type-of-care')}</dt>
              <dd class="text-base font-medium text-gray-900">{info?.type_of_care}</dd>
            </dl>
            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.doctor')}</dt>
              <dd class="text-base font-medium text-gray-900">{info?.doctor?.name}</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">Subtotal</dt>
              <dd class="text-base font-medium text-gray-900">2.000MT</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-normal text-gray-500">{t('common.taxes')}</dt>
              <dd class="text-base font-medium text-gray-900">0MT</dd>
            </dl>

            <dl class="flex items-center justify-between gap-4 py-3">
              <dt class="text-base font-bold text-gray-900">Total</dt>
              <dd class="text-base font-bold text-gray-900">2.000MT</dd>
            </dl>
          </div>
        </div>

        <div class="space-y-3 mt-2">
          <button onClick={()=>{
             data.setPaymentInfo(({...info,step:2}))
             document.querySelector('#payment_popup').scrollTo(0,0)
          }} type="submit" class={`flex w-full items-center justify-center rounded-lg ${info.payment_method ? 'bg-honolulu_blue-500':'bg-gray-400 pointer-events-none opacity-90'} px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300`}>
             {t('common.proceed-with-payment')}
          </button>
          <p class=" hidden text-sm font-normal text-gray-500">One or more items in your cart require an account. <a href="#" title="" class="font-medium text-primary-700 underline hover:no-underline">Sign in or create an account now.</a>.</p>
        </div>
      </div>

        </div>
  )
}

export default SelectPayemntMethod