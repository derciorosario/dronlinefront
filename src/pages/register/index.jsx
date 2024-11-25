import { exists, t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'

import axios from 'axios';
import GoogleSignIn from '../login/google';
import Messages from '../messages';
import VerifyRegisterEmail from '../../components/modals/verify-register-email';
import ButtonLoader from '../../components/Loaders/button';
import toast from 'react-hot-toast';
import _var from '../../assets/vaiables.json'


axios.defaults.withCredentials = true;

function Login() {

  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [messageType,setMessageType]=useState('red')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [showConfirmDialog,setShowConfirmDialog]=useState(false)
  const [formUpdater,setFormUpdater]=useState(false)
  const [success,setSuccess] = useState(false)
  

  const [form,setForm]=useState({
    email:'',
    password:'',
    main_contact:'',
    name:'',
    main_contact_code:'258',
    confirm_password:''
  })

  const data = useData()
  const navigate = useNavigate()

  useEffect(()=>{

    let v=true
    if(
       !form.email ||
       ((!form.password) && data.auth.type!="google") ||
       ((!form.confirm_password) && data.auth.type!="google") ||
       !form.name ||
       (!form.main_contact)
    ){
      v=false
    }

    setValid(v)
    setMessage('')

 },[form,formUpdater])




 async function signUpWithGoogle({email,name}){

     setMessage('')

    setForm(prev=>({...prev,email,name}))

    data.setAuth({type:'google',email,name})

    let check_email=await checkEmail(email)
    
    if(check_email || check_email==null){
      data.setAuth({...data.auth,type:null})
      return
    }
   
    if(!form.main_contact){
      setShowConfirmDialog(true)
    }else{
      VerifyCode()
    }
   

 }




 function validadeErrors(e){
      if(e.message==404){
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



 async function checkEmail(email){
  
  setMessage('')
  setLoading(true)

  try{

    let response=await data.makeRequest({method:'post',url:`api/check-email`,data:{email:email || form.email}, error: ``},0);
    
    if(response){
      data._scrollToSection('top')
      setMessage(t('common.email-used'))
    }

    setLoading(false)

    return  response
  
  }catch(e){
    data._scrollToSection('top')
    setLoading(false)

    if(e.message=='Failed to fetch'){
        setMessage(t('common.check-network'))
    }else{
        setMessage(t('common.unexpected-error'))
    }

    return null

  }

 }



 async function SendCode(){

  setMessage('')

  if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
     setMessage(t('common.invalid-email'))
     data._scrollToSection('top')
     return
  }

  if(form.confirm_password != form.password){
    setMessage(t('messages.password-mismatch'))
    data._scrollToSection('top')
    return
  }

  if(form.password.length <= 7){
    setMessage(t('messages.password-min-8'))
    data._scrollToSection('top')
    return
  }

  let check_email=await checkEmail()
  
  if(check_email || check_email==null){
     return
  }



  setLoading(true)

  try{
    let response=await data.makeRequest({method:'post',url:`api/send_verification_code`,data:{email:form.email}, error: ``},0);
    setLoading(false)
    setShowConfirmDialog(true)
    

  }catch(e){
    data._scrollToSection('top')
    setLoading(false)
   
    if(e.message==500){
      setMessage(t('common.unexpected-error'))
    }else  if(e.message=='Failed to fetch'){
        setMessage(t('common.check-network'))
    }else{
        setMessage(t('common.unexpected-error'))
    }
  }


}

async function resendCode(){
   setMessage('')
   SendCode()
}





async function VerifyCode(){

    setMessage('')
    setLoading(true)

    try{

        let response=await data.makeRequest({method:'post',url:`api/verify_code`,data:{...form,register:true,register_method:data.auth.type || 'email'}, error: ``},0);
        localStorage.setItem('token',response.token)
        toast.success(t('messages.successfully-registered'))
        window.location.href=data.getScheduledAppointment() || "/dashboard"

    }catch(e){

        setLoading(false)
        data._scrollToSection('top')
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

}





  return (
    <div className="flex" id="top">

            <VerifyRegisterEmail success={success} resendCode={resendCode} message={message} setMessage={setMessage} setForm={setForm} loading={loading} SubmitForm={VerifyCode} form={form} setShow={setShowConfirmDialog} show={showConfirmDialog}/>

            <div className="login-left-bg flex-1 min-h-[100vh] max-lg:hidden cursor-pointer" onClick={()=>navigate('/')}>

            </div>

            <div className="px-[90px] py-[40px] max-sm:px-[20px] flex max-lg:w-full  justify-center items-center">
             
              <div class="w-[450px]  max-lg:w-full">

                 <div className="flex items-center justify-between mb-10">

                     <div>
                     <h2 className="font-medium text-[22px] mb-2 mr-3">{t('common.register-as-patient')}</h2>
                     <p className="text-gray-600 text-[0.9rem]">{t('common.insert-your-info-to-initiate-consulting')} </p>
                
                     </div>
                  
                     <span onClick={() => {
                         localStorage.setItem('show_work_with_us_popup',1)
                         navigate('/')
                    }} className="inline-flex text-center justify-center px-2 bg-gray-200 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
                      {t('common.register-as-doctor')}
                    </span>
                 
                 

                 </div>
                
                  {!showConfirmDialog &&  <Messages  id={'_login_msg'} type={messageType} setMessage={setMessage} message={message}/>}

                  {data.auth.type!="google"  && <GoogleSignIn setLoading={setLoading}  isSignup={true} setMessage={setMessage} signUpWithGoogle={signUpWithGoogle}/>}

                   {(data.auth.type=="google" && !showConfirmDialog) &&  <button  onClick={()=>{
                    data.setAuth({...data.auth,type:null})
                    setFormUpdater(Math.random())
                    }}   type="button" class="border  bg-red-100 w-full mb-[30px]  border-red-600 cursor-pointer hover:opacity-65 text-red-500  mt-10  focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center inline-flex justify-center items-center">
                        <span> {t('common.cancel-google-signup')}</span>
                   </button>}


                  {data.auth.type!="google" && <div className="flex items-center my-3 mt-4">
                      <div className="w-full bg-gray-300 h-[1px]"></div>
                      <div className="px-2">{t('common.or')}</div>
                      <div className="w-full bg-gray-300 h-[1px]"></div>
                  </div>}
                  
                  <div class="mb-5">
                      <label for="name" class="block mb-2 text-sm font-medium">{t('form.full-name')}</label>
                      <input onKeyPress={(e)=>{
                          if (e.key == 'Enter' && valid) SendCode()
                      }} value={form.name}  onChange={(e)=>setForm({...form,name:e.target.value})}  id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
                  </div>

               
                  
                  <div class="mb-5">
                      <label for="email" class={`block mb-2 text-sm font-medium`}>Email</label>
                      <input onKeyPress={(e)=>{
                          if (e.key == 'Enter' && valid) SendCode()
                      }} style={{opacity:data.auth.type=="google"  ?40:1}} disabled={data.auth.type=="google"} value={form.email}  onChange={(e)=>setForm({...form,email:e.target.value})} type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
                  </div>
                  {data.auth.type!="google" && <>
                      
                    <div class="mb-3">
                        <label for="password" class="block mb-2 text-sm font-medium">{t('form.password')}</label>
                        <input onKeyPress={(e)=>{
                          if (e.key == 'Enter' && valid) SendCode()
                        }}  value={form.password} placeholder={t('messages.password-min-8')} onChange={(e)=>setForm({...form,password:e.target.value})} type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>

                    <div class="mb-3">
                        <label for="confirm-password" class="block mb-2 text-sm font-medium">{t('form.confirm-password')}</label>
                        <input onKeyPress={(e)=>{
                          if (e.key == 'Enter' && valid) SendCode()
                        }}  value={form.confirm_password} placeholder="" onChange={(e)=>setForm({...form,confirm_password:e.target.value})} type="password" id="confirm-password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>

                  </>}

                  
                    <div class="mb-3">
                        <label for="contact" class="block mb-2 text-sm font-medium">{t('form.contact')}</label>
                        <div className="flex items-center">
                              <select  onChange={(e)=>setForm({...form,main_contact_code:e.target.value})} value={form.main_contact_code} class={`bg-gray w-[90px] mr-1 border border-gray-300  text-gray-900 text-sm rounded-[0.4rem] focus:ring-blue-500 focus:border-blue-500 block p-2.5`}>
                                  {_var.contry_codes.map(i=>(
                                    <option selected={form.main_contact_code==i.code ? true : false}  value={i.code}>+{i.code}</option>
                                  ))}
                              </select> 
                              <input onKeyPress={(e)=>{
                                if (e.key == 'Enter' && valid) SendCode()
                               }} value={form.main_contact} onChange={(e)=>setForm({...form,main_contact:e.target.value.replace(/[^0-9]/g, '')})} type="text" id="contact" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                   
                        </div>
                      </div>

                  

                  {!showConfirmDialog && <button onClick={SendCode} type="submit" class={`text-white mt-7 ${loading ? 'pointer-events-none':''}  ${valid ? 'bg-blue-700 hover:bg-blue-800':'bg-gray-400  pointer-events-none'} flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}>
                       {(loading && !showConfirmDialog) && <ButtonLoader/>}
                      <span>{(loading && !showConfirmDialog) ? t('common.loading') +"..." : t('common.send')}</span>
                   </button>}

                    
                    <p className="px-[10px] mt-5 mb-2"><span className="italic text-gray-600">{t('messages.already-have-acccout')}</span> <span className="text-honolulu_blue-500 font-medium cursor-pointer hover:underline" onClick={()=>navigate('/login')}>Login</span></p>
                 
               
              

               
              </div>
            </div>

           


    </div>
  )
}

export default Login