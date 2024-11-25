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

axios.defaults.withCredentials = true;

function Login() {

  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [messageType,setMessageType]=useState('red')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [nextpage,setNextPage]=useState(null)
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useData()

  const {user,check_user} = useAuth()
  useEffect(()=>{

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
      localStorage.setItem('token',response.token)
      toast.success(t('messages.successfully-loggedin'))
      let url=data.getScheduledAppointment() || "/dashboard"
      window.location.href=url

    }catch(e){
        console.log({e})
        setLoading(false)
        validadeErrors(e)
    }

  }

  return (

<DefaultLayout hideAll={true} hide={true} removeMargin={true} hideSupportBadges={true}>

<div className="flex">

<div className="login-left-bg flex-1 min-h-[100vh] cursor-pointer" onClick={()=>navigate('/')}></div>

<div className="px-[90px] py-[40px] max-sm:px-[20px] flex max-lg:w-full  justify-center items-center">
 
<div class="w-[400px]  max-lg:w-full">
      <h2 className="font-medium text-[22px] mb-2">Login</h2>
      <p className="text-gray-600 mb-4 text-[0.9rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      <Messages  id={'_login_msg'} type={messageType} setMessage={setMessage} message={message}/>
      <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium">Email</label>
          <input onChange={(e)=>setForm({...form,email:e.target.value})} type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
      </div>
      <div class="mb-3">
          <label for="password" class="block mb-2 text-sm font-medium">{t('form.password')}</label>
          <input  onChange={(e)=>setForm({...form,password:e.target.value})} type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
              
      </div>


      {!loading && <p onClick={()=>alert('In development!')} className="text-sm font-normal text-right mb-5 cursor-pointer hover:underline  text-gray-500 ">
                   {t('common.recover-password')}
      </p>}


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