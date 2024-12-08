import React, { useEffect, useState } from 'react'
import { useHomeData } from '../../contexts/DataContext'
import { useLocation, useNavigate, useNavigation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BlackLogo from '../../assets/images/dark-logo-1.png'
import { t } from 'i18next'
import { useHomeAuth } from '../../contexts/AuthContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useData } from '../../../contexts/DataContext'

function Header({openSidebar,setOpenSidebar}) {

    const {pathname} = useLocation()
    const navigate = useNavigate()
    const [hw,setHeaderWhite]=useState(false)
  
    const [lang,setLang]=useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'pt')

    const {APP_FRONDEND} = useHomeAuth()
    const {user} = useAuth()
    
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
      setLang(lng)
      localStorage.setItem('lang',lng)
    };
    
 
    const data= useHomeData()
    const appData=useData()
  
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
  
    useEffect(()=>{
      if(pathname=="/") {
          setHeaderWhite(data.scrollY > 200)
      }else{
          setHeaderWhite(true)
      }
  },[data.scrollY])
  
    
    const [menu,setMenu]=useState([])

    useEffect(()=>{
      setMenu([
          {name:t('menu.home'),path:'/'},
          {name:t('menu.about-us'),path:'/?about'},
          {name:t('menu.contact'),path:'/?contact'},
          {name:t('menu.departments'),path:'/?departments',items:data.specialty},
          {name:t('common.faq'),path:'/faq'},
      ])
    },[lang,data.specialty])

   
    const [openLangDialog,setOpenLangDialog]=useState(false)
  

    const handleOutsideClick = (event) => {
      if (!event.target.closest(`_lang`)) {
          document.removeEventListener('click', handleOutsideClick)
      }
   };

    return (
       <div>
           <div className="h-[60px]">

           </div>
           <div className="w-full flex border-b  items-center bg-white justify-between px-[50px] max-md:px-[25px] z-40 absolute  left-0 top-0"> 
            
             <div className="flex items-center gap-x-3 max-xl:hidden">
                     {menu.map((i,_i)=>(
                          
                          <div  onClick={()=>{
                             if(!i.items){
                              navigate(i.path)
                              goto()
                             }
                          }} className={`mt-regular ${i.items && i.items?.length==0 ? 'hidden':''} transition-all ease-in delay-100  _menu_item  cursor-pointer h-[60px] items-center relative flex ml-4 border-b-2 border-b-transparent hover:border-b-honolulu_blue-300`}>
                             <span className="text-[14px]  uppercase">{i.name}</span> {i.items && <label>
                                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M480-360 280-560h400L480-360Z"/></svg>
                            </label>}

                            {i.items && <div className={`bg-honolulu_blue-500  transition-all pointer-events-none ease-in delay-100 translate-y-[20px] _menu_dropdown p-7 opacity-0 absolute left-0 top-[100%] min-w-[130px]`}>
                                    {i.items.map((f,_f)=>(
                                         <div onClick={()=>{
                                          window.location.href='/doctors-list/?medical_specialty='+f.id
                                         }} className="">
                                             <span  className="text-white mt-light border-b opacity-65 hover:opacity-100 border-b-[rgba(255,255,255,0.5)] text-[12px] uppercase flex py-2">{f.name}</span>
                                         </div>
                                    ))}
                              </div>}
                              
                           </div>
                     ))}
             </div>


             <div onClick={()=>{
              data._showPopUp('sidebar')
             }}  className="hidden _sidebar max-xl:flex h-[60px] items-center justify-center cursor-pointer hover:opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
             </div>


             <div className="flex items-center _lang">

               <div className="mr-5">
                  <button type="button" onClick={()=>{
                     navigate('/register')
                  }} class="text-white max-sm:hidden bg-honolulu_blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{t('common.register')}</button>
                  <button type="button" onClick={()=>{
                    if(user){
                        appData.setIsLoading(true)
                        navigate('/login')
                    }else{
                      window.location.href="/login"
                    }
                    
                  }} class="py-2.5  px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Login</button>
               </div>

               <div className="flex mr-4 items-center relative cursor-pointer">

                  <div className="flex items-center" onClick={()=>{
                          data._showPopUp('lang')
                  }}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill={'#000'}><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>
                      <span className={`ml-1 text-[15px]`}>{lang == 'pt' ? 'PT': 'EN'}</span>
                      <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill={'#000'}><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>

                  </div>

                  <div onClick={()=>{

                      changeLanguage(lang != 'pt' ? 'pt': 'en')
                      data._closeAllPopUps()

                  }} className={`bg-white shadow border _lang absolute ${!data._openPopUps.lang ? ' hidden' :''} hover:text-app_primary-400 rounded-[0.3rem] p-2 w-full top-[100%] translate-y-[5px]`}>
                        <span>{lang != 'pt' ? 'PT': 'EN'}</span>
                  </div>
                  </div>
                  <span onClick={()=>data._showPopUp('global_search')} className=" hidden _global_search cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg></span>
             </div>
           </div>

       </div>
    )
}

Header.BottomBar=()=>{
  const navigate = useNavigate()
  const {user} = useAuth()
  return (
    <div className="w-full bg-[rgba(255,255,255,0.5)]  max-md:px-[20px] px-[60px] py-4 flex items-center justify-between">
          <div>
             <img  onClick={()=>{
                    navigate('/')
                    goto()
               }} src={BlackLogo} className="w-[140px] max-md:w-[90px] cursor-pointer"/>    
          </div>

          <div className="flex items-center">
               <div className="flex items-center">

                   <span className="mr-2"><svg className="fill-honolulu_blue-400  h-[45px] max-md:h-[20px]" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg></span>
                    
                   <div className="flex flex-col">
                      <p  className="text-[13px] max-md:text-[12px] uppercase text-honolulu_blue-400 mt-bold">{t('common.central-info')}</p>
                      <span className="text-[25px] max-md:text-[14px] font-medium text-honolulu_blue-500">+258 856462304</span>
                   </div>
                  
               </div>

               <div className="ml-6 max-lg:hidden">
                      <button onClick={()=>{
                           navigate(user?.role=="patient" ? '/doctors' : '/doctors-list')
                      }} className="px-5 py-4 bg-[rgba(255,255,255,0.7)] text-honolulu_blue-300 uppercase text-[14px] border-honolulu_blue-300 border rounded-[0.3rem]">{t('menu.add-appointment')}</button>
               </div>
          </div>
    </div>
  )
}


export default Header