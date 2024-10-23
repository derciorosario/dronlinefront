import React,{useEffect, useState} from 'react'
import { useData } from '../contexts/DataContext'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer/index.jsx'
import Header from '../components/Header/index.jsx'
import NotsBar from '../components/NotsBar/index.jsx'
import TopAlert from '../components/Alerts/topAlert.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import BasicPopUp from '../components/PopUp/basic.jsx'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

import DoctorList from '../components/Cards/doctorList.jsx'
import Delete from '../components/modals/delete.jsx'
import ConfirmDialog from '../components/modals/confirm.jsx'
import MedicalPrescriptionPrint from '../components/Print/medical_prescription.jsx'
import SelectDoctorAvailability from '../components/Cards/selectDoctorAvailability.jsx'
import PaymentProcess from '../components/Payments/index.jsx'

function DefaultLayout({children,hide,pageContent}) {
    
  const [openSidebar,setOpenSidebar]=useState(false)
  const data=useData()
  const {user} = useAuth()
  const navigate=useNavigate()

  return (

    <div id={'top'} className={`flex ${!hide ? 'bg-[#F9F9F9]':''} w-full`}>

               
               <PaymentProcess info={data.paymentInfo}/>
               <SelectDoctorAvailability  item={data.selectedDoctorToSchedule}/>
               <Delete show={data._openPopUps.delete}/>

               <DoctorList show={data._openPopUps.doctor_list}/>

               <BasicPopUp show={data._openPopUps.basic_popup} title={

                data._openPopUps.basic_popup=="conclude_patient_info" ?
                t('common.add-info'): data._openPopUps.basic_popup=="contact-us-if-delay" ? t('common.info') : ""}

                btnConfirm={{text:t('common.understood'),onClick:()=>{
                  data._closeAllPopUps()
                }}}
                link={data._openPopUps.basic_popup=="conclude_patient_info" ? {text:t('common.view-profile'),onClick:()=>{
                   navigate('/profile')
                   data._closeAllPopUps()

                }}: {}}
              message={
                 data._openPopUps.basic_popup=="conclude_patient_info" ?
                 t('messages.conclude_patient_info'): data._openPopUps.basic_popup=="contact-us-if-delay" ? t('messages.contact-us-if-delay') : ''} />
              {!hide && <div className="h-full">
                <SideBar/>
              </div>}


          <div id="center-content" className={`flex-1 h-[100vh] ${hide!="register" ? 'overflow-y-auto':''} relative`}>
                 {user?.role=="patient" && !user?.data?.date_of_birth && <TopAlert/>}
                 {!hide && <Header pageContent={pageContent}/>}
                 <div className="mx-[20px] relative">
                    {pageContent && <div className="py-[20px]">
                      <h2 className="text-[22px] font-medium">{pageContent.title}</h2>
                      
                               {pageContent.page=="specialists" && <div className="flex items-center">
                               <p className="text-gray-600">{pageContent.desc}</p>
                               <button onClick={()=>{
                                   navigate('/add-appointments?scheduled_type_of_care=requested')
                               }} type="button" class="text-white bg-honolulu_blue-400 ml-2 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center me-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M360-440h80v-110h80v110h80v-190l-120-80-120 80v190Zm120 254q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                                 {t('common.home-care')}
                              </button>
                              
                      </div>}
                    </div>}
                    {children}
                    <div className="h-full"></div>
                 </div>
                 {!hide && <Footer/>}
          </div>

          <div className="h-full hidden">

                      <NotsBar/>

          </div>

          

    </div>

  )
}

export default DefaultLayout