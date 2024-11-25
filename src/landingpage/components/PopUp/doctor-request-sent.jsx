import React from 'react'
import { useHomeData } from '../../contexts/DataContext'
import { useTranslation } from 'react-i18next';

function DoctorRequestSentPopUp() {
 const { t, i18n } = useTranslation();

  const data=useHomeData()

  return (
    
        <div style={{zIndex:999}} id="popup-modal" tabindex="-1" class={`overflow-y-auto overflow-x-hidden bg-[rgba(0,0,0,0.7)] ease-in delay-100 transition-all ${!data._openPopUps.doctor_reuqest_sent ? 'opacity-0 pointer-events-none':''} flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}>
            <div class="relative p-4 w-full max-w-md max-h-full">
                <div class="relative bg-white rounded-lg shadow">
                    <div class="p-4 md:p-5 text-center">                    
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" className="fill-green-600"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                        </div>
                        <h3 class="mb-5 text-lg font-normal text-gray-500 ">{t('common.your-doctor-request-was-sent-successfully')}</h3>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default DoctorRequestSentPopUp