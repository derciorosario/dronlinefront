import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Loader from '../Loaders/loader'
import ConfirmDialog from '../modals/confirm'
import { useData } from '../../contexts/DataContext'
import { useLocation, useNavigate } from 'react-router-dom'
import i18n from '../../i18n'

function Header({pageContent,headerLeftContent}) {

  const {user,logout} = useAuth()
  const data=useData()
  const navigate=useNavigate()
  const [unreadNotifications,setUnreadNotifications]=useState(0)
  const [lang,setLang]=useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'pt')
  const {pathname} = useLocation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng)
    localStorage.setItem('lang',lng)
  };
  
  function logout_user(){
      logout()
  }

  async function getUnreadNotificationMessages(){
    try{
        let r=await data.makeRequest({method:'get',url:`api/unread-notifications`,withToken:true, error: ``},0);
        if(localStorage.getItem('changing_doctor_calendar')){
          return
        }
        setUnreadNotifications(r.unread_count)
    }catch(e){
        console.log(e)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
        getUnreadNotificationMessages()
    }, 10000)
    return () => clearInterval(interval);
  }, []);

  const [unreadSupportMessages,setUnreadSupportMessages]=useState(0)
  async function getUnreadSupportMessages(){
      try{
          let r=await data.makeRequest({method:'get',url:'api/get-unread-messages',withToken:true, error: ``},0);
          if(localStorage.getItem('changing_doctor_calendar')){
            return
          }
          setUnreadSupportMessages(r.unread_messages_count)
      }catch(e){
          console.log(e)
      }
  }
  
  useEffect(() => {
      if(user?.role=="manager" || user?.role=="admin" || !user){
        return
      }
      const interval = setInterval(() => {
          getUnreadSupportMessages()
      }, 5000)
      return () => clearInterval(interval);
  }, [user]);


  const [supportMsgCount,setSupportMsgCount]=useState(0)

  useEffect(()=>{
    setSupportMsgCount((user?.role=="patient" || user?.role=="doctor") ? unreadSupportMessages : data.unreadSupportMessages)
  },[data.unreadSupportMessages,unreadSupportMessages])


  return (
    <div className="w-full">
      
         <ConfirmDialog res={logout_user} show={data._openPopUps.confim_message} />

         <div className="flex items-center justify-between h-[70px]  px-[10px] bg-white rounded-bl-[0.3rem]">
               
               <div className="flex md:justify-end flex-1">
                  
                   {/***<h2 className="text-[25px] cursor-pointer font-medium md:hidden mr-10" onClick={()=>navigate('/')}>
                      <img src={LogoIcon} width={50} className="flex-shrink-0"/>
                   </h2> */}

                   {headerLeftContent}
                   
                   {!pathname.includes('/meeting/zoom/appointment') && <div onClick={()=>navigate('/')} className="bg-slate-300 px-2 py-2 rounded md:hidden cursor-pointer">          
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                   </div>}

                   {pageContent?.loading==true && <Loader/>}
                   

                  {pageContent?.btn?.onClick && <button onClick={pageContent?.btn?.onClick} type="button" class={`text-white max-md:right-3  max-md:fixed max-md:shadow bottom-[100px] z-30 bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center me-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                    <div className="max-lg:hidden">{pageContent?.btn?.text}</div>
                  </button>}
               </div>
               
               <div className="flex items-center justify-end">

               {((user?.role!="manager" ||  user?.data?.permissions?.support?.includes('read')) && !pathname.includes('/meeting/zoom/appointment')) && <button onClick={()=>{
                  data._showPopUp('support_messages')
               }} type="button" class="text-gray-600 _support_messages focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm md:px-5 py-1 text-center inline-flex items-center me-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z"/></svg>
                <span className="max-md:hidden">{(user?.role=="admin" || user?.role=="manager") ? t('common._support') : t('common.support')}</span>
                
                {supportMsgCount!=0 && <span className="md:ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">{supportMsgCount}</span>}
              
              </button>}


                  <div onClick={()=>{
                     data._showPopUp('header_user_dropdown')
                  }} className="sm:ml-7 _header_user_dropdown relative bg-gray-100 rounded-[0.3rem] py-1 px-2.5 cursor-pointer flex justify-center items-center">
                    
                    {!data._openPopUps.header_user_dropdown && <div className="absolute bottom-0 right-1 translate-y-[0.7rem] z-10">
                          <span className="bg-honolulu_blue-500 px-1 py-[0.05rem] text-white rounded-[0.3rem] text-[0.7rem]">{t('common.'+user?.role)}</span>
                    </div>}

                    <div style={{backgroundRepeat:'no-repeat',backgroundSize:"contain",backgroundPosition:"center",backgroundImage:`url("${user?.profile_picture_filename}")`}} class="relative inline-flex items-center justify-center w-8 h-8  bg-gray-200 rounded-full mr-3">
                        {!user?.profile_picture_filename && <span class="font-medium text-gray-600">{user?.name?.charAt()?.toLocaleUpperCase()}</span>}
                    </div>

                    <span className="max-lg:hidden">{user?.name}</span>
                    <svg className={`${!data._openPopUps.header_user_dropdown ? '':'rotate-180'} delay-75 transition-all ease-in`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                    
                    {data._openPopUps.header_user_dropdown && <div id="dropdown" class="z-10 bg-white min-w-[130px] absolute  left-0 top-[100%] divide-y divide-gray-100 rounded-lg shadow w-full">
                        <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                          <li onClick={()=>{

                              navigate('/profile')
                              setTimeout(()=>{
                                 data._closeAllPopUps()
                              },100)

                          }} className="flex items-center px-4 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                            <a href="#" class="block py-2">{t('common.profile')}</a>
                          </li>

                           <li onClick={()=>{
                               data._closeAllPopUps()
                               setTimeout(()=>{
                                data._showPopUp('confim_message',t('common.sure-to-logout'))
                               },300)

                           }} className="flex _header_user_dropdown items-center px-4  hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                            <a href="#" class="block ml-2 py-2">{t('common.logout')}</a>
                          </li>
                        </ul>
                    </div>}
                    

                  </div>


                  <div className="flex ml-3  _lang  mr-4 items-center relative cursor-pointer" style={{zIndex:9}}>

                      <div className="flex items-center" onClick={()=>{
                              data._showPopUp('lang')
                      }}>
                           <span className={`ml-1 text-[15px]`}>{lang == 'pt' ? 'PT': 'EN'}</span>
                          <svg className={`${data._openPopUps.lang ? '':'rotate-180'} delay-75 transition-all ease-in`} xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill={'#000'}><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>
                          
                      </div>

                      <div onClick={()=>{

                          changeLanguage(lang != 'pt' ? 'pt': 'en')
                          data._closeAllPopUps()

                      }} className={`bg-white shadow border absolute ${!data._openPopUps.lang ? ' hidden' :''} hover:text-app_primary-400 rounded-[0.3rem] p-2 w-full top-[100%] translate-y-[5px]`}>
                            <span>{lang != 'pt' ? 'PT': 'EN'}</span>
                      </div>
                  </div>


            
                  <div onClick={()=>{
                       data._showPopUp('notifications')
                  }} class="relative mr-5 _notifications cursor-pointer  inline-flex items-center justify-center h-10 border border-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
                      {unreadNotifications!=0 && <span className=" bg-honolulu_blue-400 text-white rounded-[0.3rem] px-[0.2rem] h-[20px] min-w-[20px] flex items-center justify-center absolute top-1 right-[-1rem]">{unreadNotifications}</span>}
                  </div>
                  </div>
         </div>
          
    </div>
  )
}

export default Header