import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'

import axios from 'axios';
import GoogleSignIn from './google';
import Messages from '../messages';
import ButtonLoader from '../../components/Loaders/button';
import toast from 'react-hot-toast';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';
import RecoverPasswordModal from '../../components/modals/recover-password';
import ConfirmUserByEmailCode from '../../components/modals/confirm-by-email-code';
import i18n from '../../i18n';

axios.defaults.withCredentials = true;

function Login() {

  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [messageType,setMessageType]=useState('red')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [nextpage,setNextPage]=useState(null)
  const [searchParams, setSearchParams] = useSearchParams();
  const [showRecoverPasswordDialog,setShowRecoverPasswordDialog]=useState(false)
  const [showConfirmCodeByEmailDialog,setShowConfirmCodeByEmailDialog]=useState(false)
  const [success,setSuccess] = useState(false)
  const [recoverPasswordStatus,setRecoverPasswordStatus]=useState('code_not_sent')
  const [confirmCodeByEmailStatus,setConfirmCodeByEmailStatus]=useState('code_not_sent')

  const data = useData()
  const {user,check_user,setRecoveringPassword} = useAuth()



  const [lang,setLang]=useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'pt')
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng)
    localStorage.setItem('lang',lng)
  };
  useEffect(()=>{
   if(new URLSearchParams(window.location.search).get('recover-password')){
     setShowRecoverPasswordDialog(true)
     return
   }
    

      if(user){
          data.setIsLoading(false)
          if(location.href.includes('nextpage')){
              if(user?.role=="patient"){
                let url=data.getScheduledAppointment() || "/dashboard"
                 navigate(url)
                 return
              }else{
                 return
              }
          }
        
         navigate('/dashboard')
      }
    
  },[user])


  useEffect(()=>{
      (async()=>{
        try{
          if(!await check_user()){
            data.setIsLoading(false)
          }
        }catch(e){
          data.setIsLoading(false)
        }
    })()
  },[])


  const [form,setForm]=useState({
      email:'',
      password:''
  })


  const navigate = useNavigate()


  useEffect(()=>{
    let v=true

    if(
       !form.email ||
       !form.password
    ){
      v=false
    }
    setValid(v)
    setMessage('')

 },[form])


 async function signUpWithGoogle({email,name}){

    
    data.setAuth({type:'google',email,name})
    SubmitForm({email,register_method:'google'})
  

}


 function validadeErrors(e){

    if(e.message==403){
      setMessage(t('common.user-inactive-contact-support'))
    }else if(e.message==404){
        setMessage(t('common.user-not-found'))
    }else if(e.message==401){
      setMessage(t('common.wrong-password'))
    }else if(e.message==400){
      setMessage(t('common.invalid-data'))
    }else if(e.message==500){
      setMessage(t('common.unexpected-error'))
    }else  if(e.message=='Failed to fetch'){
        setMessage(t('common.check-network'))
    }else{
        setMessage(t('common.unexpected-error'))
    }
    

 }



 useEffect(()=>{

      setNextPage(new URLSearchParams(window.location.search).get('nextpage') || null) 

 },[])

 useEffect(()=>{


     if(nextpage){

        data._showPopUp('basic_popup','login-to-proceed-with-consultation')
        let res=data._sendFilter(searchParams)
        
        if(res.scheduled_doctor && res.scheduled_hours && res.scheduled_weekday && res.scheduled_date && res.type_of_care){
            
            localStorage.setItem('appointment',JSON.stringify({
                    scheduled_date:res.scheduled_date,
                    scheduled_hours:res.scheduled_hours,
                    scheduled_weekday:res.scheduled_weekday,
                    scheduled_doctor:res.scheduled_doctor,
                    type_of_care:res.type_of_care
            }))

            localStorage.setItem('scheduling',new Date().toISOString())

        }

       }

},[nextpage])




function codeVerificationErrors(e){
  if(e.message==400){
    setMessage(t('common.invalid-code'))
  }else if(e.message==500){
    setMessage(t('common.unexpected-error'))
  }else  if(e.message=='Failed to fetch'){
      setMessage(t('common.check-network'))
  }else{
      setMessage(t('common.unexpected-error'))
  }
}


function LoginOk(response){
      localStorage.setItem('token',response.token)
      toast.success(t('messages.successfully-loggedin'))
      let url=data.getScheduledAppointment() || "/dashboard"
      window.location.href=url
}
async function VerifyCodeForLogin() {
  setMessage('')
  setLoading(true)

  try{
      let response=await data.makeRequest({method:'post',url:`api/verify_code_for_login`,data:{...form}, error: ``},0);
      LoginOk(response)
  }catch(e){
      setLoading(false)
      data._scrollToSection('top')
      codeVerificationErrors(e)
  }


}


async function VerifyCode(){
  setMessage('')
  setLoading(true)

  try{
      let response=await data.makeRequest({method:'post',url:`api/verify_code_for_password_recovery`,data:{...form}, error: ``},0);
      localStorage.setItem('token',response.token)

      setShowRecoverPasswordDialog(false)
      setRecoveringPassword(true)
      data._showPopUp('basic_popup','password-recovered')
     
      
  }catch(e){
      setLoading(false)
      data._scrollToSection('top')
      codeVerificationErrors(e)
  }

}


async function SubmitForm(options){

    setMessage('')
    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) && options?.register_method!="google"){
       setMessage(t('common.invalid-email'))
       document.querySelector('#_login_msg').scrollTop=0
       return
    }

    setLoading(true)
 
    try{

      let response=await data.makeRequest({method:'post',url:`api/login`,data:{...form,email:options?.email || form.email,register_method:options.register_method || 'email'}, error: ``},0);
      console.log(response)

      if(response?.token){
        LoginOk(response)
        return
      }
      setShowConfirmCodeByEmailDialog(true)
      setConfirmCodeByEmailStatus('code_sent')
      setLoading(false)

    }catch(e){
        console.log({e})
        setLoading(false)
        validadeErrors(e)
    }
  }


  



  async function SendCode(){

    setMessage('')

    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
       setMessage(t('common.invalid-email'))
       data._scrollToSection('top')
       return
    }
  
    setLoading(true)
    setForm({...form,code:''})
  
  
    try{

      await data.makeRequest({method:'post',url:`api/send_verification_code`,data:{email:form.email,validate_existing_email:true}, error: ``},0);
      setLoading(false)
      if(showRecoverPasswordDialog){
        setRecoverPasswordStatus('code_sent')
      }
    }catch(e){
       data._scrollToSection('top')
       setLoading(false)
      if(e.message==404){
        setMessage(t('common.user-not-found'))
      }else if(e.message==500){
        setMessage(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
          setMessage(t('common.check-network'))
      }else{
          setMessage(t('common.unexpected-error'))
      }
    }

  }


  function recoverPasswordSubmit(){
        if(recoverPasswordStatus=="code_not_sent"){
                    SendCode()
        }
        if(recoverPasswordStatus=="code_sent"){
                   VerifyCode()
        }
  }



  return (

<DefaultLayout hideAll={true} hide={true} removeMargin={true} hideSupportBadges={true}>

<div className="flex">

<div onClick={()=>navigate('/')} className="bg-honolulu_blue-500  hover:bg-honolulu_blue-600 absolute left-2 top-2 z-20 px-2 py-2 rounded max-md:py-1 cursor-pointer flex items-center">          
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                        <span className="text-white">{t('common.home')}</span>
</div>



<div className="flex ml-3  absolute right-2 top-2  mr-4 items-center  cursor-pointer" style={{zIndex:9}}>

                    <select onChange={(e)=>{
                         changeLanguage(e.target.value)
                    }} value={lang} className="mr-2 bg-transparent border-0 outline-none">
                          <option value={'pt'} disabled={lang=="pt"}>PT</option>
                          <option value={'en'} disabled={lang=="en"}>EN</option>
                    </select>
</div>


 
 <ConfirmUserByEmailCode status={confirmCodeByEmailStatus} setStatus={setConfirmCodeByEmailStatus} success={success} resendCode={SendCode}  message={message} setMessage={setMessage} setForm={setForm} loading={loading} SubmitForm={VerifyCodeForLogin} form={form} setShow={setShowConfirmCodeByEmailDialog} show={showConfirmCodeByEmailDialog}/>
 <RecoverPasswordModal status={recoverPasswordStatus} setStatus={setRecoverPasswordStatus} success={success} resendCode={SendCode}  message={message} setMessage={setMessage} setForm={setForm} loading={loading} SubmitForm={recoverPasswordSubmit} form={form} setShow={setShowRecoverPasswordDialog} show={showRecoverPasswordDialog}/>

<div className="login-left-bg flex-1 min-h-[100vh] bg-gray-200"></div>

<div className="px-[90px] py-[40px] max-sm:px-[20px] flex max-lg:w-full  justify-center items-center">
 
<div class="w-[400px] max-md:pt-5  max-lg:w-full">
      <div className="flex items-center">
          <h2 className="font-medium text-[22px] mb-2">Login <label className="mx-2 font-normal text-gray-400"> | </label> <span onClick={()=>{
             navigate('/register')
          }} className="text-[20px] text-honolulu_blue-400 underline cursor-pointer"> {t('common.register')}</span></h2>
         {user && <span onClick={() => {
                            navigate('/dashboard')
                        }} className="inline-flex ml-4 text-center text-white justify-center px-2 bg-honolulu_blue-400 py-1 text-[14px] rounded-full cursor-pointer hover:bg-honolulu_blue-500">
                          {t('common.login-as',{name:user?.name})}
          </span>}
      </div>
      
      <p className="text-gray-600 mb-4 text-[0.9rem]">{t('common.login-msg')}</p>
      {!showRecoverPasswordDialog && !showConfirmCodeByEmailDialog && <Messages  id={'_login_msg'} type={messageType} setMessage={setMessage} message={message}/>}
      <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium">Email</label>
          <input onChange={(e)=>setForm({...form,email:e.target.value})} type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
      </div>
      <div class="mb-3">
          <label for="password" class="block mb-2 text-sm font-medium">{t('form.password')}</label>
          <input  onChange={(e)=>setForm({...form,password:e.target.value})} type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              
      </div>

      {!loading && <div className="flex justify-end">

          <p onClick={()=>{
              setShowRecoverPasswordDialog(true)
              setMessage('')
          }} className="text-sm font-normal mb-5 cursor-pointer hover:underline  text-gray-500 ">
              {t('common.recover-password')}
          </p>

      </div>}

      <div style={{display:'none'}} class="flex items-start mb-5">
          <div class="flex items-center h-5">
          <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"/>
          </div>
          <label  for="remember" class="ms-2 text-sm font-medium text-gray-900"></label>
      </div>

       <button onClick={SubmitForm} type="submit" class={`text-white mt-7 ${loading ? 'pointer-events-none':''}  ${valid ? 'bg-blue-700 hover:bg-blue-800':'bg-gray-400  pointer-events-none'} flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}>
           {(loading) && <ButtonLoader/>}
          <span>{(loading) ? t('common.loading') +"..." : t('common.send')}</span>
       </button>


      {!loading && <>
        <div className="flex items-center my-3">
          <div className="w-full bg-gray-300 h-[1px]"></div>
          <div className="px-2">{t('common.or')}</div>
          <div className="w-full bg-gray-300 h-[1px]"></div>
      </div>

       <GoogleSignIn setMessage={setMessage} signUpWithGoogle={signUpWithGoogle}/>

      </>}
      
      <p className="mt-6"><span className="italic text-gray-600" >{t('messages.dont-have-acccout-yet')}</span> <span className="text-honolulu_blue-500 font-medium cursor-pointer hover:underline" onClick={()=>{
        navigate('/register')
        data.setAuth({...data.auth,type:null})
      }}>{t('common.create')}</span></p>

  </div>

</div>




</div>

     </DefaultLayout>
  )
}

export default Login