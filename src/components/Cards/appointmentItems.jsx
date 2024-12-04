import { t } from 'i18next'
import React from 'react'
import { useData } from '../../contexts/DataContext'
import ClinicalDiary from '../../pages/clinical-diary/index'
import CreateClinicalDiary from '../../pages/clinical-diary/create'
import Exams from '../../pages/exams/index'
import CreateExams from '../../pages/exams/create'
import CreateMedicalPrescription from '../../pages/medical-prescription/create'
import MedicalPrescription from '../../pages/medical-prescription/index'

import { useAuth } from '../../contexts/AuthContext'

function AppointmentItems({show,itemToShow,setItemToShow}) {

 const data=useData()
 const {user} = useAuth()

  return (
     <div  className={`w-full  h-[100vh] bg-[rgba(0,0,0,0.4)] ease-in _doctor_list ${!show ? 'opacity-0 pointer-events-none translate-y-[100px]':''} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>   
         
            <div class="w-full h-[90vh] overflow-y-auto  p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[950px]">    
            <div className="flex mb-3">
                  
                   {(itemToShow?.name?.includes('create')) && <span onClick={()=>{
                           setItemToShow({
                            ...itemToShow,
                            name:itemToShow.name.replace('create','all')
                           })    
                    }} className="table px-2 bg-gray-200 py-2 rounded-[0.3rem] cursor-pointer hover:bg-gray-300">{t('common.go-back')}</span>
}
            </div>

          <div class="flex items-center justify-between mb-4">

          <h5 class="text-xl hidden font-bold leading-none text-gray-900 ">{t('titles.doctors')}</h5>

          <div className="w-full  flex items-center">


             {((itemToShow?.name=="all-clinical-diary" || itemToShow?.name=="all-exams" || itemToShow?.name=="all-medical-prescription") && (user?.role=="doctor" || (!itemToShow?.appointment?.doctor_id && user?.role=="admin" || user?.role=="manager"))) && <button onClick={()=>{
                setItemToShow({
                 ...show,
                 action:'create',
                 appointment:itemToShow?.appointment,
                 name:itemToShow.name=='all-clinical-diary' ?  'create-clinical-diary' : itemToShow?.name == "all-exams" ? 'create-exams' : 'create-medical-prescription'
                })}} type="button" class="text-white bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center me-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                {itemToShow?.name=="all-clinical-diary" && t('menu.add-clinical-diary')}
                {itemToShow?.name=="all-exams" && t('menu.add-exams')}
                {itemToShow?.name=="all-medical-prescription" && t('menu.add-medical-prescription')}
              </button>}
              
          </div>

            <div onClick={()=>{
                setItemToShow(false)
            }} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>         

          </div>


            <div>
                {itemToShow?.name=="all-clinical-diary" && <ClinicalDiary itemToShow={itemToShow} setItemToShow={setItemToShow}  appointment={itemToShow.appointment} hideLayout={true}/>}
                {itemToShow?.name=="create-clinical-diary" && <CreateClinicalDiary setItemToShow={setItemToShow} itemToShow={itemToShow}  hideLayout={true}/>}
                {itemToShow?.name=="all-exams" && <Exams itemToShow={itemToShow} setItemToShow={setItemToShow}  appointment={itemToShow.appointment} hideLayout={true}/>}
                {itemToShow?.name=="create-exams" && <CreateExams setItemToShow={setItemToShow} itemToShow={itemToShow}  hideLayout={true}/>}
                {itemToShow?.name=="all-medical-prescription" && <MedicalPrescription itemToShow={itemToShow} setItemToShow={setItemToShow}  appointment={itemToShow.appointment} hideLayout={true}/>}
                {itemToShow?.name=="create-medical-prescription" && <CreateMedicalPrescription setItemToShow={setItemToShow} itemToShow={itemToShow}  hideLayout={true}/>}
            </div>


           </div>
     </div>       
  )
}

export default AppointmentItems