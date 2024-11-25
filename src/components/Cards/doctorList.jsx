import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import Specialists from '../../pages/specialists/index'
import { useData } from '../../contexts/DataContext'


function DoctorList({show}) {

 const data=useData()

  return (

     <div  className={`w-full  h-[100vh] bg-[rgba(0,0,0,0.4)] ease-in  _doctor_list ${(show && !data.selectedDoctorToSchedule?.id) ? '':'opacity-0 pointer-events-none translate-y-[100px]'} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>   
          <div class="w-full h-[90vh] overflow-y-auto  p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[950px]">
                     

          <div class="flex items-center justify-between mb-4">

          <h5 class="text-xl font-bold leading-none text-gray-900 ">{t('titles.doctors')}</h5>
          
          <div onClick={()=>{
            data._closeAllPopUps()
            data.setAppointmentcancelationData({})
          }} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>         

          </div>

          <div>
              <Specialists showOnlyList={true}/>
          </div>


           </div>
     </div>
           
  )
}

export default DoctorList