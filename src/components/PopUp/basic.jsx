import { t } from 'i18next'
import React from 'react'
import { useData } from '../../contexts/DataContext'

function BasicPopUp({link,title,btnConfirm,btnCancel,message,show}) {
  const data=useData()
  return (
     <div id="info-popup" tabindex="-1" class={`overflow-y-auto ${data._openPopUps.basic_popup=="you-have-saved-appointment"  ?  '_basic_popup':''} bg-[rgba(0,0,0,0.3)] ${!show ? 'opacity-0 translate-y-[60px] pointer-events-none':''} fixed top-0 right-0 items-center flex justify-center left-0 z-50 w-full  delay-0 ease-in transition-all md:inset-0 h-[100vh]`}>
      <div class="relative _basic_popup p-4 bg-white rounded-lg shadow w-[500px]  max-md:w-[90%]  md:p-8 table">
                <div class="mb-4 text-sm font-light text-gray-500 ">
                    <h3 class="mb-3 text-2xl font-bold text-gray-900">{title}</h3>
                    <p>
                        {message}
                    </p>
                </div>
                <div class="justify-between items-center pt-0 space-y-4 sm:flex sm:space-y-0">
                    {link && <a onClick={link?.onClick} class="font-medium cursor-pointer text-honolulu_blue-400 hover:underline">{link?.text}</a>}
                    <div class="items-center space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
                        {btnCancel && <button  onClick={btnCancel?.onClick} id="close-modal" type="button"  class="py-2 px-4 w-full text-sm font-medium text-gray-500  bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">{btnCancel?.text || t('common.confirm')}</button>}
                        <button onClick={btnConfirm?.onClick} id="confirm-button" type="button" class="py-2 px-4 w-full text-sm font-medium text-center rounded-lg text-white bg-primary-700 sm:w-auto bg-honolulu_blue-500 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300">{btnConfirm?.text || t('common.confirm')}</button>
                    </div>
                </div>
    </div>
    </div>

  )
}

export default BasicPopUp