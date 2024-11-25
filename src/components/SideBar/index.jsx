import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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

import { t } from 'i18next';
import { useAuth } from '../../contexts/AuthContext';

function SideBar() {

    const {pathname}=useLocation()
    const navigate = useNavigate()
    const {user} = useAuth()

    const menuItems = [

      {name:t('menu.home'),path:'/dashboard',paths:['/dashboard'],field:'dashboard',icon:'dashboard',access:['all'],manager_access:true},
      {name:t('menu.find-a-specialist'),path:'/specialists',paths:['/specialists'],field:'specialists',icon:'find_doctor',access:['admin','patient']},
     
      {name:t('menu.appointments'),path:'/appointments',field:'appointments',icon:'appointments',sub_menus:[
          {name:t('menu.all-appointments'),path:'/appointments',paths:['appointments','appointment/:id'],manager_access:true},
          {name:t('menu.add-appointments'),path:'/add-appointments',paths:['add-appointments'],access:['patient']},
      ],access:['all'],manager_access:{name:'appointments',per:['read']}},

      {name:t('menu.family'),path:'/dependents',field:'dependents',icon:'dependent',sub_menus:[
        {name:t('menu.all-family'),path:'/dependents',paths:['dependents','dependent/:id']},
        {name:t('menu.add-family'),path:'/add-dependent',paths:['add-dependent'],access:['patient']},
      ],access:['patient']},

      {name:user?.role=="doctor" ? t('menu.my-patients') : t('menu.patients'),path:'/patients',field:'patients',icon:'patient',sub_menus:[
        {name:t('menu.all-patients'),path:'/patients',paths:['patients','patient/:id'],manager_access:{name:'patient',per:['read']}},
        {name:t('menu.add-patients'),path:'/add-patient',paths:['add-patient'],access:['admin'],manager_access:{name:'patient',per:['create']}},
      ],access:['admin','doctor'],manager_access:{name:'patient',per:['read']}},

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
     
     
     {name:t('menu.scheduler'),path:'/scheduler',paths:['/scheduler'],field:'scheduler',icon:'scheduler',access:['doctor','patient']},
      
     //{name:t('menu.payment-management'),path:'/payment-management',paths:['/payment-management','/payment-management/:id'],field:'payment-management',icon:'payment_management',access:['admin'],manager_access:{name:'payment_management',per:['read','reject','approve']}},

     {name:user?.role=="patient" ? t('common.payments') : t('menu.payment-management'),path:'/payment-management',field:'payment-management',icon:'payment_management',sub_menus:[
      {name:t('common.payments'),path:'/payment-management',paths:['/payment-management','/payment-management/:id'],manager_access:true},
      {name:t('common.refunds'),path:'/refunds',paths:['/refunds'],manager_access:true},
     ],access:['admin','patient'],manager_access:{name:'payment_management',per:['read','reject','approve']}},
    

     {name:'Feedback',path:'/app-feedback',field:'app-feedback',icon:'feedback',sub_menus:[
        {name:t('menu.app-feedback'),path:'/app-feedback',paths:['app-feedback'],manager_access:{name:'feedback',per:['read']}},
        {name:t('menu.appointment-feedback'),path:'/appointment-feedback',paths:['appointment-feedback'],manager_access:{name:'feedback',per:['read']}},
     ],access:['admin'],manager_access:{name:'feedback',per:['read']}},
    
     {name:t('menu.app-settings'),path:'/faqs',field:'faq',icon:'app_settings',sub_menus:[
      {name:'FAQ',path:'/faqs',paths:['faqs','faq/:id','faq'],manager_access:true},
      {name:t('common.app-settings'),path:'/app-settings',paths:['app-settings'],manager_access:{name:'app_settings',per:['update']}},
     ],access:['admin'],manager_access:{name:'app_settings',per:['read']}},


      {name:t('menu.settings'),path:'/profile',field:'settings',icon:'settings',sub_menus:[
        {name:t('menu.profile'),path:'/profile',paths:['profile'],access:['all'],manager_access:true},
        {name:t('menu.consultation-availability'),path:'/consultation-availability',paths:['consultation-availability'],access:['doctor']}, //manager_access:{name:'doctor_availability',per:['read','update']}
      ],access:['patient','doctor','admin'],manager_access:true},

    
     
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
      specialty_categories:SpecialtyCategoriesIcon

  }

    const [menuOpen, setMenuOpen] = useState([]);

    function closeAndOpen(path){
        if(menuOpen.includes(path)){
          setMenuOpen(menuOpen.filter(i=>i!=path))
        }else{
          setMenuOpen([...menuOpen,path])
        }
    }

    useEffect(()=>{
       let mainPath=pathname.split('/')[1]

       menuItems.forEach(i=>{
             if(i.sub_menus) {
                  i.sub_menus.map(f=>{

                   if(f.path.includes(mainPath) && mainPath){
                      setMenuOpen([i.path])
                   }

                  })
             }else{
                  if(i.path.includes(mainPath) && mainPath){
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

              

              return show || user.data.permissions[item.manager_access?.name]?.some(i=>item.manager_access?.per?.includes(i)) || item.manager_access==true
         }
       
         return item.access.includes(user?.role) || item.access.includes('all')


      }else{

         if(user?.role=="manager" && user){
           return user.data.permissions[item.manager_access?.name]?.some(i=>item.manager_access?.per?.includes(i)) || item.manager_access==true
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




    return (
    <div className="min-w-[230px] max-w-[240px] bg-white h-[100vh]">

           <div className="flex justify-center py-[20px] mb-6 cursor-pointer">
                <h1 className="text-[25px] font-medium" onClick={()=>navigate('/')}>
                   <img src={LogoIcon} width={120}/>
                </h1>
           </div>

           <div className="">
                    {menuItems.map((item, index) => (
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
                                         if(!item.sub_menus) navigate(item.path)
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
                                            <NavLink
                                                to={i.path} 
                                                className={`text-[0.9rem] ${!checkAccess(i,'isSub') ? 'hidden':''}  ${checkActive(i,true) ? 'text-honolulu_blue-500 font-medium':' opacity-80'} hover:text-honolulu_blue-500`}
                                            >
                                                {i.name} 
                                            </NavLink>
                                          ))}
                                      </div>
                              </div>}
                        </div>
                    ))}
           </div>

    </div>
  )
}

export default SideBar