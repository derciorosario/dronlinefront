import { t } from 'i18next'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function TopAlert() {
  const navigate = useNavigate()
  return (
    <div id="alert-border-5" class="flex items-center p-4 border-t-4 border-gray-300 bg-gray-100" role="alert">
    <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <div class="ms-3 text-sm font-medium text-gray-800 cursor-pointer ">
        {t('messages.conclude_patient_info')} <a onClick={()=>{
          navigate('/profile')
        }} class="font-semibold underline hover:text-gray-800 hover:no-underline">{t('common.view-profile')}</a>
    </div>
   
</div>
  )
}

export default TopAlert