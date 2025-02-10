import React, { useEffect, useState } from 'react'
import {  useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '../../assets/images/menu-icons/dashboard.svg'
import PatientIcon from '../../assets/images/menu-icons/patient.svg'
import LogoIcon from '../../assets/images/dark-logo-1.png'
import MedicalPrescriptionIcon from '../../assets/images/menu-icons/medical-prescription.svg'
import ClinicalDiaryIcon from '../../assets/images/menu-icons/clinical-diary.svg'
import AppointmentsIcon from '../../assets/images/menu-icons/appointments.svg'
import DoctorIcon from '../../assets/images/menu-icons/doctor.svg'
import schedulerIcon from '../../assets/images/menu-icons/scheduler.svg'
import SettingsIcon from '../../assets/images/menu-icons/settings.svg'
import ExamIcon from '../../assets/images/menu-icons/exams.svg'
import FindDoctorIcon from '../../assets/images/menu-icons/find-doctors.svg'
import DependentIcon from '../../assets/images/menu-icons/dependent.svg'
import PaymentManagement from '../../assets/images/menu-icons/payment-management.svg' 
import managersIcon from '../../assets/images/menu-icons/managers.svg'
import FeedbackIcon from '../../assets/images/menu-icons/feedback.svg'
import AppSettingsIcon from '../../assets/images/menu-icons/app-settings.svg'
import StatsIcon from '../../assets/images/menu-icons/stats.svg'
import SpecialtyCategoriesIcon from '../../assets/images/menu-icons/specialty-categories.svg'
import MoreIcon from '../../assets/images/menu-icons/more.svg'
import MedicalCerificateIcon from '../../assets/images/menu-icons/medical-certificate.svg'
import AvailabilityIcon from '../../assets/images/menu-icons/availability.svg'
import WaitingListIcon from '../../assets/images/menu-icons/waitinglist.svg'

import { t } from 'i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

function SideBar({hideSidebar}) {

    const {pathname}=useLocation()
    const navigate = useNavigate()
    const {user} = useAuth()
    const data=useData()
    const [openMobileMenu,setOpenMobileMenu]=useState(false)

    const menuItems = [
      {name:t('menu.home'),path:'/dashboard',paths:['/dashboard'],field:'dashboard',icon:'dashboard',access:['all'],manager_access:true,showInMobile:true},
      {name:t('menu.find-a-specialist'),path:'/specialists',paths:['/specialists'],field:'specialists',icon:'find_doctor',access:['admin','patient']},
     
      {name:t('menu.appointments'),path:'/appointments',field:'appointments',icon:'appointments',sub_menus:[
          {name:t('menu.all-appointments'),path:'/appointments',paths:['appointments','appointment/:id'],manager_access:true},
          {name:t('menu.add-appointments'),path:'/add-appointments',paths:['add-appointments'],access:['patient']},
      ],access:['all'],manager_access:{name:'appointments',per:['read']},showInMobile:true},

      {name:t('menu.family'),path:'/dependents',field:'dependents',icon:'dependent',sub_menus:[
        {name:t('menu.all-family'),path:'/dependents',paths:['dependents','dependent/:id']},
        {name:t('menu.add-family'),path:'/add-dependent',paths:['add-dependent'],access:['patient']},
      ],access:['patient']},

      {name:user?.role=="doctor" ? t('menu.my-patients') : t('menu.patients'),path:'/patients',field:'patients',icon:'patient',sub_menus:[
        {name:t('menu.all-patients'),path:'/patients',paths:['patients','patient/:id'],manager_access:{name:'patient',per:['read']}},
        {name:t('menu.add-patients'),path:'/add-patient',paths:['add-patient'],access:['admin'],manager_access:{name:'patient',per:['create']}},
      ],access:['admin','doctor'],manager_access:{name:'patient',per:['read']},showInMobile:true},

      {name:t('menu.doctors'),path:'/doctors',field:'doctors',icon:'doctor',sub_menus:[
        {name:t('menu.doctors'),path:'/doctors',paths:['doctors','doctor/:id'],manager_access:{name:'doctor',per:['read']}},
        {name:t('menu.add-doctors'),path:'/add-doctors',paths:['add-doctors'],manager_access:{name:'doctor',per:['create']}},
        /* {name:t('menu.specialty-categories'),path:'/specialty-categories',paths:['specialty-categories','specialty-category/:id','add-specialty-category'],manager_access:{name:'specialty_categories',per:['read']}},  */
        {name:t('menu.membership-requests'),path:'/membership-requests',paths:['/membership-requests','/membership-requests/:id'],field:'membership-requests',access:['admin'],manager_access:{name:'doctor_requests',per:['read']}},
      ],access:['admin'],manager_access:{name:'doctor',per:['read']},permission_pedendents:['doctor_requests']},

      {name:t('menu.managers'),path:'/managers',field:'managers',icon:'manager',sub_menus:[
        {name:t('menu.managers'),path:'/managers',paths:['managers','manager/:id']},
        {name:t('menu.add-managers'),path:'/add-managers',paths:['add-managers']},
      ],access:['admin']},

      {name:t('menu.specialties-and-prices'),path:'/specialty-categories',icon:'specialty_categories',sub_menus:[
        {name:t('menu.specialties-and-prices'),path:'/specialty-categories',paths:['specialty-categories','specialty-category/:id','add-specialty-category'],manager_access:{name:'specialty_categories',per:['read']}},
        {name:t('common.cancellation-taxes'),path:'/cancellation-taxes',paths:['cancellation-taxes','cancellation-taxes/:id'],manager_access:{name:'specialty_categories',per:['read']}},    
      ],access:['admin'],manager_access:{name:'specialty_categories',per:['read']}},
     
      {name:'Logs',path:'/logs',field:'app-feedback',icon:'logs',sub_menus:[
        {name:t('common.action-logs'),path:'/logs',paths:['logs'],manager_access:{name:'stats',per:['read']}},
        {name:t('common.duration-logs'),path:'/user-activities',paths:['/user-activities'],manager_access:{name:'stats',per:['read']}},
      ],access:['admin'],manager_access:{name:'stats',per:['read']}},
     
     {name:t('menu.scheduler'),path:'/scheduler',paths:['/scheduler'],field:'scheduler',icon:'scheduler',access:['doctor','patient'],showInMobile:true},
     //{name:t('menu.payment-management'),path:'/payment-management',paths:['/payment-management','/payment-management/:id'],field:'payment-management',icon:'payment_management',access:['admin'],manager_access:{name:'payment_management',per:['read','reject','approve']}},

     {name:user?.role=="patient" || data.isMobile ? t('common.payments') : t('menu.payment-management'),path:'/payment-management',field:'payment-management',icon:'payment_management',sub_menus:[
      {name:t('common.payments'),path:'/payment-management',paths:['/payment-management','/payment-management/:id'],manager_access:true},
      {name:t('common.refunds'),path:'/refunds',paths:['/refunds'],manager_access:true},
     ],access:['admin','patient'],manager_access:{name:'payment_management',per:['read','reject','approve']},showInMobile:true},
    
     {name:t('common.medical-certificates'),path:'/medical-certificates',paths:['/medical-certificates','medical-certificate/:id'], field:'medical-certificate',icon:'medical_certificate',access:['admin','manager','patient','doctor'],manager_access:{name:'medical_certificates',per:['read','reject','approve']}},
    
     {name:t('common.waiting-list'),path:'/waiting-list',field:'waiting_list',icon:'waiting_list',sub_menus:[
      {name:t('common.list'),path:'/waiting-list',paths:['/waiting-list','waiting-list/:id'],access:['admin','manager'],manager_access:{name:'waiting_list',per:['read']}},
      {name:t('common.stats'),path:'/waiting-list-stats',paths:['waiting-list-stats'],access:['admin','manager'],manager_access:{name:'waiting_list',per:['read']}},
     ],access:['admin'],manager_access:{name:'waiting_list',per:['read']}},

     {name:'Feedback',path:'/app-feedback',field:'app-feedback',icon:'feedback',sub_menus:[
        {name:t('menu.app-feedback'),path:'/app-feedback',paths:['app-feedback'],manager_access:{name:'feedback',per:['read']}},
        {name:t('menu.appointment-feedback'),path:'/appointment-feedback',paths:['appointment-feedback'],manager_access:{name:'feedback',per:['read']}},
     ],access:['admin'],manager_access:{name:'feedback',per:['read']}},
    
     {name:t('menu.app-settings'),path:'/faqs',field:'faq',icon:'app_settings',sub_menus:[
      {name:'FAQ',path:'/faqs',paths:['faqs','faq/:id','faq'],manager_access:true},
      {name:t('common.app-settings'),path:'/app-settings',paths:['app-settings'],manager_access:{name:'app_settings',per:['update']}},
     ],access:['admin'],manager_access:{name:'app_settings',per:['read']}},

     {name:t('menu.consultation-availability'),path:'/consultation-availability',paths:['consultation-availability'],field:'consultation-availability',icon:'consultation_availability',access:['doctor']},
     
     {name:t('menu.settings'),path:'/profile',field:'settings',icon:'settings',sub_menus:[
        {name:t('menu.profile'),path:'/profile',paths:['profile'],access:['all'],manager_access:true},
     ],access:['patient','doctor','admin'],manager_access:true},
      
     {name:t('menu.more'),path:'/more',paths:['/more'],field:'more',icon:'more',access:['all'],manager_access:true,showInMobile:true},
  ]


  let images={

      dashboard:DashboardIcon,
      patient:PatientIcon,
      appointments:AppointmentsIcon,
      medical_prescription:MedicalPrescriptionIcon,
      clinical_diary:ClinicalDiaryIcon,
      doctor:DoctorIcon,
      scheduler:schedulerIcon,
      settings:SettingsIcon,
      exams:ExamIcon,
      find_doctor:FindDoctorIcon,
      dependent:DependentIcon,
      payment_management:PaymentManagement,
      manager:managersIcon,
      app_settings:AppSettingsIcon,
      feedback:FeedbackIcon,
      logs:StatsIcon,
      medical_certificate:MedicalCerificateIcon,
      specialty_categories:SpecialtyCategoriesIcon,
      more:MoreIcon,
      consultation_availability:AvailabilityIcon,
      waiting_list:WaitingListIcon

  }

    const [menuOpen, setMenuOpen] = useState([]);

    function closeAndOpen(path,isMobile){
        if(menuOpen.includes(path)){
          setMenuOpen(menuOpen.filter(i=>i!=path))
        }else{

          if(isMobile && !openMobileMenu){
            data._showPopUp('mobile_menu')
            setMenuOpen([path])
          }else{
            setMenuOpen([...menuOpen,path])
          }
          
        }
    }

  
    function handleResize(){
      data.setIsMobile(window.innerWidth <= 768)
    }

      useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => {
          document.removeEventListener("resize", handleResize);
      };
    }, []);
    

    useEffect(()=>{
         if(data.isMobile && data._openPopUps.mobile_menu==false && !openMobileMenu){
          setMenuOpen([])
         }
    },[data._openPopUps])

   
    useEffect(()=>{
       let mainPath=pathname.split('/')[1]

       menuItems.forEach(i=>{
             if(i.sub_menus) {
                  i.sub_menus.map(f=>{

                   if(f.path.includes(mainPath) && mainPath && !data.isMobile){
                      setMenuOpen([i.path])
                   }

                  })
             }else{
                  if(i.path.includes(mainPath) && mainPath && !data.isMobile){
                       setMenuOpen([i.path])
                  }
             }
       })
    },[pathname])


    
  function checkAccess(item,isSub){
    
      if(!isSub){

         if(user?.role=="manager" && user){
               let show=false
              
              if(item.permission_pedendents){
                item.permission_pedendents.forEach(d=>{
                      if(user?.data?.permissions[d]?.includes('read')){
                         show=true
                     }
                })
              }

              return show || user?.data.permissions[item.manager_access?.name]?.some(i=>item.manager_access?.per?.includes(i)) || item.manager_access==true
         }


       
         return item.access.includes(user?.role) || item.access.includes('all')

         
      }else{

         if(user?.role=="manager" && user){
           return user?.data.permissions[item.manager_access?.name]?.some(i=>item.manager_access?.per?.includes(i)) || item.manager_access==true
         }

        return  item.access?.includes(user?.role) || !item.access || item.access?.includes('all')
      }

  }


    function checkActive(item,isSub){

        if(!item) return false

        let macth=false
 
        if(isSub || !item.sub_menus){
         
 
          item.paths.forEach(p=>{
               let _pathname=p.includes(':') ? pathname.split('/').filter((_,_i)=>_i!=pathname.split('/').length - 1).join('') : pathname.split('/').join('')
               let path=p.split('/').join('').split(':')[0]
 
               if(path == _pathname) {
                 macth=true
               }
          })
           
          return macth
 
        }else{
 
          item.sub_menus.forEach(sub=>{
               sub.paths.forEach(p=>{
                 let _pathname=p.includes(':') ? pathname.split('/').filter((_,_i)=>_i!=pathname.split('/').length - 1).join('') : pathname.split('/').join('')
                 let path=p.split('/').join('').split(':')[0]
   
                 if(path == _pathname) {
                     macth=true
                 }
               })
          })
          return macth
        }
    }


    const [openPopUps,setOpenPopUps]=useState([])

   

    useEffect(()=>{

       let _open=[]
       let _full_w_popups=['support_messages','cancel_appointment','doctor_list']
       Object.keys(data._openPopUps).forEach(i=>{
          if(data._openPopUps[i] && _full_w_popups.includes(i)){
            _open.push(i)
          }
       })

       setOpenPopUps(_open)
    },[data._openPopUps])

    return (
      <>
      
      <div className={`${openPopUps.length!=0 || data.paymentInfo?.type_of_care || (data.appointmentcancelationData?.consultation?.id && !data.appointmentcancelationData?.hide) || data.selectedDoctorToSchedule?.id || data._openPopUps.appointment_messages || data._openPopUps.add_dependent  || data._openPopUps.notifications || data._openPopUps.feedback ? 'hidden':'fixed'}  -bottom-2 md:hidden _mobile_menu  left-0 w-full bg-white flex items-center border-t border-t-gray-200 rounded-t-[15px] cursor-pointer shadow-sm`} style={{zIndex:999}}>
             <div className="w-full px-2 py-4 flex items-center justify-around relative">

                {menuItems.filter(i=>i.showInMobile).map((item, index)=>(
                   <div>
                        {item.sub_menus && <div className={`absolute shadow bottom-[100%] border-t-gray-200 rounded-t-[15px] w-full left-0 ${item.path} ${menuOpen.includes(item.path) && !openMobileMenu ? '':'hidden'}`}>
                                <div className={`rounded-[0.3rem]  bg-gray-300 p-[10px] flex flex-col`}>
                                    {item.sub_menus.map(i=>(
                                      <span onClick={()=>{
                                        setMenuOpen([])
                                        navigate(i.path)
                                      }}
                                          className={`text-[1rem]  py-2 flex ${!checkAccess(i,'isSub') ? 'hidden':''}  ${checkActive(i,true) ? 'text-honolulu_blue-500 font-medium':' opacity-80'} hover:text-honolulu_blue-500`}
                                      >
                                          {i.name} 
                                      </span>
                                    ))}
                                </div>
                       </div>}

                    <div  onClick={()=>{

                            data._closeAllPopUps()
                            data.setShowFilters(false)
                            if(item.field=="more"){
                              setOpenMobileMenu(!openMobileMenu)
                              setMenuOpen([])
                              return
                            }

                            setOpenMobileMenu(false)
                            if(item.sub_menus){
                              closeAndOpen(item.path,'isMobile')
                            }else{
                              navigate(item.path)
                            }
                            
                    }} key={index} className={`flex-col flex items-center ${!checkAccess(item) ? 'hidden':''}`}  >

                        <img width={25} src={images[item.icon]} className=""/>
                        <span className={`${((checkActive(item) && !openMobileMenu) || (openMobileMenu && item.field=="more")) ? 'text-honolulu_blue-500 font-medium':''} text-[0.8rem]`}> {item.name}</span>
                    </div>
                    </div>
                ))}
             </div>
      </div>

      <div className={`min-w-[230px] ${hideSidebar ? 'hidden':''}  md:max-w-[240px] max-md:${openMobileMenu ? 'w-full':'hidden'} max-md:flex flex-col bg-white h-[100vh] max-md:fixed max-md:z-50  left-0 top-0`}>

      <div className="flex justify-center max-md:justify-around py-[20px] mb-6 cursor-pointer items-center">
          <h1 className="text-[25px] font-medium" onClick={()=>navigate('/')}>
              <img src={LogoIcon} width={120} />
          </h1>
          <div onClick={()=>{
            setOpenMobileMenu(false)
            setMenuOpen([])
          }}  className="w-[30px] md:hidden cursor-pointer h-[30px] right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">

              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>

          </div>
      </div>

      <div className="overflow-auto max-md:mb-28">
              {menuItems.filter(i=>i.field!="more").map((item, index) => (
                  <div key={index} className={`mb-4 ${!checkAccess(item) ? 'hidden':''}`}>
                        <div className={`px-[20px] flex relative hover:*:cursor-pointer hover:*:text-honolulu_blue-500`} onClick={()=>{
                            if(item.sub_menus){
                              closeAndOpen(item.path)
                            }
                        }}>
                            {checkActive(item) && <span className="bg-honolulu_blue-500 w-[3px]  rounded-[0.3rem] h-full flex absolute left-0 top-0"></span>}
                            <img onClick={()=>navigate(item.path)} src={images[item.icon]} className="mr-4"/>
                            <div className="flex justify-between flex-1">
                                  <a onClick={()=>{
                                    if(!item.sub_menus) {
                                      navigate(item.path)
                                      setOpenMobileMenu(false)
                                    }
                                      
                                  }}
                                    className={`${checkActive(item) ? 'text-honolulu_blue-500 font-medium':''} hover:text-honolulu_blue-500`}
                                  >
                                    {item.name}
                                  </a>

                                {item.sub_menus && <div className={`${menuOpen.includes(item.path) ? 'rotate-180':''} transition-all duration-100`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                                </div>}
                                
                            </div>
                        </div>

                        {item.sub_menus && <div className={`p-[15px] ${item.path} ${menuOpen.includes(item.path) ? '':'hidden'}`}>
                                <div className={`rounded-[0.3rem]  bg-gray-100 p-[10px] flex flex-col gap-y-2 ml-2`}>
                                    {item.sub_menus.map(i=>(
                                      <span onClick={()=>{
                                        setOpenMobileMenu(false)
                                        navigate(i.path)
                                      }}
                                     
                                          className={`text-[0.9rem] ${!checkAccess(i,'isSub') ? 'hidden':''}  ${checkActive(i,true) ? 'text-honolulu_blue-500 font-medium':' opacity-80'} hover:text-honolulu_blue-500  cursor-pointer`}
                                      >
                                          {i.name} 
                                      </span>
                                    ))}
                                </div>
                        </div>}
                  </div>
              ))}
      </div>

      </div>

      
      </>
  )
}

export default SideBar