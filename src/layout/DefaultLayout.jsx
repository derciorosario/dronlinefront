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
import { useLocation, useNavigate } from 'react-router-dom'

import DoctorList from '../components/Cards/doctorList.jsx'
import Delete from '../components/modals/delete.jsx'
import SelectDoctorAvailability from '../components/Cards/selectDoctorAvailability.jsx'
import PaymentProcess from '../components/Payments/index.jsx'
import AddDependentPopUp from '../components/modals/add-dependent.jsx'
import PreLoader from '../components/Loaders/preloader.jsx'
import SinglePrint from '../components/Print/single.jsx'
import Notifications from '../components/PopUp/notifications.jsx'
import SupportChat from '../components/modals/support-chat.jsx'
import Feedback from '../components/PopUp/feedback.jsx'
import Reviews from '../components/PopUp/reviews.jsx'
import CancelAppointmentModel from '../components/modals/cancel-appointments.jsx'
import DownloadProgress from '../components/Loaders/download-progress.jsx'
import SupportBadge from '../components/Badges/support-badge.jsx'
import WorkWithUsForm from '../../../landingpage/src/components/Form/work-with-us.jsx'
import ChangePasswordModal from '../components/modals/change-password.jsx'

function DefaultLayout({children,hide,showDates,pageContent,removeMargin,hideAll,disableUpdateButton,refreshOnUpdate,hideSupportBadges,startDate,endDate,setStartDate,setEndDate}) {
    

  const data=useData()
  const {user,setIsLoading,setPathName} = useAuth()
  const navigate=useNavigate()

  const {pathname} = useLocation()
  useEffect(()=>{
    setPathName(pathname)
  },[pathname])

  const [showDateFilters,setShowDateFilters]=useState(false)

  return (

    <div id={'top'} className={`flex ${!hide ? 'bg-[#F9F9F9]':''} w-full`}>
      
               <ChangePasswordModal/>
               <Reviews show={data._openPopUps.reviews}/>
               <Feedback show={data._openPopUps.feedback}/>
               <Notifications show={data._openPopUps.notifications}/>
               <PreLoader/>
               <SupportChat show={data._openPopUps.support_messages}/>
               <PaymentProcess info={data.paymentInfo}/>
               <SelectDoctorAvailability  item={data.selectedDoctorToSchedule}/>
               <CancelAppointmentModel show={data._openPopUps.cancel_appointment}/>

               <DownloadProgress progress={data.downloadProgress}/>
              
               <Delete show={data._openPopUps.delete}/>

               <SinglePrint item={data.singlePrintContent} setItem={data.setSinglePrintContent}/>

               <DoctorList show={data._openPopUps.doctor_list}/>

               <AddDependentPopUp show={data._openPopUps.add_dependent}/>
               
               <BasicPopUp show={data._openPopUps.basic_popup && !(user?.role=="patient" && data._openPopUps.basic_popup=="login-to-proceed-with-consultation")} title={data._openPopUps.basic_popup=="password-recovered" ? t('messages.password-recovered') :
                
                data._openPopUps.basic_popup=="define-same-gain-perentage-for-all" ? t('common.sure-to-continue') :  data._openPopUps.basic_popup=="consultation-is-already-canceled" ? t('messages.consultation-is-already-canceled') : data._openPopUps.basic_popup=="unable-to-load-consultation-items" ? t('messages.unable-to-load-consultation-items') :  data._openPopUps.basic_popup=="wait-for-refund" ?  t('messages.wait-for-refund'): data._openPopUps.basic_popup=="appointment-no-longer-available" ? t('messages.appointment-no-longer-available') : data._openPopUps.basic_popup=="you-have-saved-appointment" ? t('common.draft-saved') : data._openPopUps.basic_popup=="conclude_patient_info" ?
               
                t('common.add-info'): data._openPopUps.basic_popup=="contact-us-if-delay" ? t('common.info') : t('common.info')}

                btnConfirm={{text:data._openPopUps.basic_popup=="password-recovered" ? t('common.understood') : data._openPopUps.basic_popup=="define-same-gain-perentage-for-all" ? t('common.cancel') : data._openPopUps.basic_popup=="unable-to-load-consultation-items" ? t('common.cancel') : data._openPopUps.basic_popup=="you-have-saved-appointment" ? t('common.ignore') : data._openPopUps.basic_popup=="conclude_patient_info" ? t('common.do-it-later')  : t('common.understood'),onClick:()=>{
                  
                  if(data._openPopUps.basic_popup=="password-recovered"){
                    data.setIsLoading(true)
                    let url=data.getScheduledAppointment() || "/dashboard"
                    window.location.href=url
                    return
                  }
                  
                  data._closeAllPopUps()
                  if(data._openPopUps.basic_popup=="you-have-saved-appointment"){
                    localStorage.removeItem('saved_appointment_url')
                  }
                }}}
                

                 link={data._openPopUps.basic_popup=="define-same-gain-perentage-for-all" ? {text:t('common.continue'),onClick:()=>{
                      data.setGainPerentageForAll()
                 }} : data._openPopUps.basic_popup=="unable-to-load-consultation-items" ?  {
                   text:t('common.try-again'),onClick:()=>{

                    window.location.reload()

                  }}:data._openPopUps.basic_popup=="you-have-saved-appointment" ?  {text:t('common.use-saved-draft'),onClick:()=>{
                    data._closeAllPopUps()
                    data.setIsLoading(true)
                    window.location.href=`add-appointments`+localStorage.getItem('saved_appointment_url')
                    localStorage.removeItem('saved_appointment_url')
                 }} : data._openPopUps.basic_popup=="conclude_patient_info" ? {text:t('common.view-profile'),onClick:()=>{
                   navigate('/profile')
                   data._closeAllPopUps()
                 }}: {}}
                
              message={
                data._openPopUps.basic_popup=="you-have-saved-appointment" ? t('messages.you-have-saved-appointment') : data._openPopUps.basic_popup=="conclude_patient_info" ?
                 t('messages.conclude_patient_info'): data._openPopUps.basic_popup=="contact-us-if-delay" ? t('messages.contact-us-if-delay') : data._openPopUps.basic_popup=="login-to-proceed-with-consultation" ? t('messages.login-to-proceed-with-consultation')  : ''} />

              {!hide && <div className="h-full">
                <SideBar/>
              </div>}


          <div id="center-content" className={`flex-1 h-[100vh] ${hide!="register" ? 'overflow-y-auto':''} relative`}>

                 {(!hideSupportBadges &&  ((user?.role=="manager" && user?.data?.permissions?.support?.includes('read')) || user?.role=="admin")) && <SupportBadge/>}
                 
                 {user?.role=="patient" && !user?.data?.date_of_birth && !hideAll && <TopAlert/>}
                 {!hide && <Header pageContent={pageContent}/>}

                 <div className={`${!removeMargin ? 'mx-[20px] ':''} relative mb-24`}>
                    {(pageContent) && <div className="py-[20px] md:flex">
                         <div>
                                  <div className="flex items-center max-md:mb-5">
                                      {(pageContent.btnGoBack &&  !pageContent.btnGoBack?.hide) && <button onClick={pageContent?.btnGoBack?.onClick} type="button" class="text-white bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center me-2">
                                        <div>{pageContent?.btnGoBack?.text || t('common.go-back')}</div>
                                      </button>}
                                      <h2 className="text-[22px] font-medium">{pageContent.title}</h2>
                                  </div>
                                    
                                  {(pageContent.page=="specialists" && user?.role=="patient") ? <div className="flex items-center">
                                  <p className="text-gray-600">{pageContent.desc}</p>
                                  <button onClick={()=>{
                                        navigate('/add-appointments?scheduled_type_of_care=requested')
                                  }} type="button" class="text-white bg-honolulu_blue-400 ml-2 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center me-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M360-440h80v-110h80v110h80v-190l-120-80-120 80v190Zm120 254q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                                      {t('common.home-care')}
                                  </button>
                                  
                          </div> : (
                              <p className="text-gray-600">{pageContent.desc}</p>
                          )}
                      </div>

                     
                      {!disableUpdateButton && <div className="flex-1 flex justify-end items-end">
                        {showDates && <div className="flex items-end">

                          {showDateFilters && <div className="flex items-center flex-1 md:justify-end mr-3">

                            <div className="items-center mr-1">
                              <h6 className="text-[0.8rem] font-medium text-gray-900 mr-2">
                                  {t('common.start')}
                              </h6>
                              <input onChange={(e)=>setStartDate(e.target.value)} value={startDate} type="date" className="w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
                            </div>

                            <div className="items-center">
                              <h6 className="text-[0.8rem] font-medium text-gray-900 mr-2">
                                  {t('common.end')}
                              </h6>
                              <input onChange={(e)=>setEndDate(e.target.value)} value={endDate} type="date" className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
                            </div>
                          </div>}

                           <button onClick={()=>setShowDateFilters(!showDateFilters)} type="button" className="text-white w-full mr-3 bg-honolulu_blue-500 font-medium rounded-full text-sm px-3 py-1.5 flex items-center  focus:outline-none">
                            {showDateFilters && <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff">
                              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>}
                            {!showDateFilters && <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg>}
                            
                            <span className="ml-1 max-md:hidden">{t('common.filters')}</span>
                           </button>

                          </div>}

                      

                                      <div onClick={() => {

                                          if(refreshOnUpdate){
                                             setIsLoading(true)
                                             window.locationPaymentProcessload()
                                          }else{
                                            data.setUpdateTable(Math.random())
                                          }
                                      }} className="px-2 mt-2 _refresh_btn inline-flex bg-gray-200 text-gray-400 py-1 items-center text-[12px] rounded-full cursor-pointer hover:bg-honolulu_blue-500">         
                                      <svg className="fill-gray-400" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
                                      <span className="max-md:hidden">{t('common.refresh')}</span>
                                </div>
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