import React, { useEffect, useState } from 'react'
import Logo from '../../assets/images/light-logo-2.png'
import { t } from 'i18next'
import i18n from '../../i18n'
import {useNavigate,useLocation} from 'react-router-dom'
import { useHomeData } from '../../contexts/DataContext'
import { useAuth } from '../../../contexts/AuthContext'
function Footer({serviceItems}) {

  const {pathname} = useLocation()
  const navigate=useNavigate()

  const {serverTime} = useAuth()

  const data=useHomeData()

  function goto(){
  
    if(window.location.href.includes('/?about')){
         data._scrollToSection('about')
    }else if(window.location.href.includes('/?contact')){
         data._scrollToSection('contact')
    }else if(window.location.href.includes('/?departments')){
         data._scrollToSection('departments')
    }else if(pathname=="/"){
        data._scrollToSection('home')
    }

  }
  
  useEffect(()=>{
     goto()
  },[])


  return (
    <>
          
  

<div className="w-full bg-honolulu_blue-700" id="contact">
            <div className="flex px-[100px] max-lg:px-[20px] py-[60px] gap-4 max-md:flex-wrap max-md:gap-y-10">
                <div className="w-full max-md:w-[33%] max-sm:w-full">
                   
                    <img className="w-[140px]" src={Logo}/>
                    <span className="text-white opacity-90 my-3 flex">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                   
                    <div className="w-full flex items-center mt-4">
                       <svg className="fill-white mr-2" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg> 
                       <a className="text-white" href="mailto:help@dronline.com">help@dronline.com</a>                  
                    </div>

                    <div className="w-full flex items-center mt-2">
                      <svg className="fill-white mr-2" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>
                      <a className="text-white" href="tel:258856462304">+258 865642304</a>                  
                    </div>

                 </div>

                 <div className="w-full max-md:w-[33%] max-sm:w-full">
                    <h2 className="mt-bold text-white text-[20px]">{t('common.services')}</h2>
                    <div className="flex flex-wrap gap-3 flex-col mt-3">

                      {(serviceItems || [
                      {name:t('common.service-1'),desc:t('common.service-1-desc')},
                      {name:t('common.service-2'),desc:t('common.service-2-desc')},
                      {name:t('common.service-3'),desc:t('common.service-3-desc')},
                      {name:t('common.service-4'),desc:t('common.service-4-desc')}
                    ]).map((i,_i)=>(
                        
                        <span onClick={()=>{
                          let c=document.getElementById('services');
                          c.scrollIntoView();
                        }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{i.name}</span>
                        
                      ))}
                    </div>
                </div>

                <div className="w-full max-md:w-[33%] max-sm:w-full">
                     <h2 className="mt-bold text-white text-[20px]">Links</h2>
                     <div className="flex flex-wrap gap-3 flex-col mt-3">
                        <span onClick={()=>{
                                                navigate('/')
                                                goto()
                        }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{t('menu.home')}</span>
                        <span onClick={()=>{
                                                navigate('/?about')
                                                goto()
                        }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{t('menu.about-us')}</span>
                        <span onClick={()=>{
                                                navigate('/?departments')
                                                goto()
                        }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{t('menu.departments')}</span>
                    </div>
                </div>


                <div className="w-full max-md:w-[33%] max-sm:w-full">
                     <h2 className="mt-bold text-white text-[20px]">{t('common.information')}</h2>
                     <div className="flex flex-wrap gap-3 flex-col mt-3">
                       
                      <div className="mr-5 _doctor_reuqest_form">
                         <button type="button" onClick={()=>{
                           data._showPopUp('doctor_reuqest_form')
                          }} class="text-white  bg-honolulu_blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                            {t('common.work-with-us')}
                          </button>
                      </div>

                      <span onClick={()=>{
                                 navigate('/how-to-cancel-my-consultation')                
                       }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{t('common.how-to-cancel-my-consultation')}</span>
                                              

                        <span onClick={()=>{
                                  navigate('/privacy')
                                  goto()
                        }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{t('common.privacy')}</span>
                        
                        <span onClick={()=>{
                                                navigate('/terms')
                                                goto()
                        }} className="text-white opacity-90  mt-light cursor-pointer hover:opacity-100">{t('common.terms')}</span>
                    </div>
                </div>



            </div>
    </div>

    <div className="" id="newsletter">

<div className="w-full py-[40px] px-[100px] max-md:px-[20px] bg-honolulu_blue-600 flex justify-between items-center">

     <div className="flex w-[320px] hidden max-md:w-full  items-center bg-white rounded-[0.3rem] p-2 relative">
          <input onFocus={()=>data._showPopUp('show_doctors_list')}  placeholder={t('common.insert-email-to-subscribe')} className="w-full _show_doctors_list px-2 outline-none"/>                           
          <svg className="fill-honolulu_blue-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>          
     </div>

     <div className="flex items-center gap-x-1 text-white">
        &copy; {serverTime?.date?.split('-')?.[0]} <span className="hidden">{t('common.all-right-reserved')}</span>
     </div>

     <span onClick={()=>{
         window.location.href="https://wa.me/258856462304"
     }} className="ml-[20px] cursor-pointer hover:opacity-65">

           <svg className="fill-honolulu_blue-400"  height="30px"  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
               viewBox="0 0 308 308" xml:space="preserve">
             <g id="XMLID_468_">
               <path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
                 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687
                 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887
                 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153
                 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348
                 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802
                 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922
                 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0
                 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458
                 C233.168,179.508,230.845,178.393,227.904,176.981z"/>
               <path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716
                 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396
                 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z
                 M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188
                 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677
                 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867
                 C276.546,215.678,222.799,268.994,156.734,268.994z"/>
               </g>
             </svg>

       </span>
</div>


</div>


    </>
   
  )
}
export default Footer