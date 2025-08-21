import React,{useState} from 'react'
import { t } from 'i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Search from '../components/PopUps/search'
import { useHomeData } from '../contexts/DataContext'
import Footer from '../components/Footer'
import i18n from '../i18n'
import Sidebar from '../components/Sidebar'
import Feedback from '../components/PopUps/feedback'
import SelectDoctorAvailability from '../../components/Cards/selectDoctorAvailability'
import PreLoader from '../components/Loaders/preloader'
import BasicPopUp from '../components/PopUp/basic'
import WorkWithUsForm from '../components/Form/work-with-us'
import DoctorRequestSentPopUp from '../components/PopUp/doctor-request-sent'
import Reviews from '../components/PopUps/reviews'
import NurseChat from '../../components/Chatbot/chat-btn-start'

function DefaultLayout({children}) {
  const navigate=useNavigate()
  const data=useHomeData()
  const {pathname} = useLocation()



  return (

    <>
      <PreLoader/>
      <NurseChat hide={pathname=="/login"}/>
      <Reviews show={data._openPopUps.reviews}/>
         <WorkWithUsForm/>
         <DoctorRequestSentPopUp/>
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



      <div id={'top'} className={`w-full overflow-x-hidden`}>
      <SelectDoctorAvailability  item={data.selectedDoctorToSchedule}/>
      <Search show={data._openPopUps.global_search}/>
      <Sidebar/>

      <div className={`${data._openPopUps.sidebar ? 'p-2 blur-md':''} transition duration-150 ease-in-out`}>
        <Header/>
        <div className="w-full">
          {children}
        </div>
      </div>
      <Feedback/>
      </div>

    </>

  )
}

export default DefaultLayout