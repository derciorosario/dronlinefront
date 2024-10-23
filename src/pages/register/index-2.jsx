import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import CreatePatient from '../patients/create'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'
import GoogleSignIn from '../login/google'
import GoogleIcon from '../../assets/images/google-icon.svg'
import toast from 'react-hot-toast'
import Messages from '../messages'

function Register() {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const fileInputRef_1 = React.useRef(null);
  const fileInputRef_2 = React.useRef(null);
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate()
  const data=useData()
  const [searchParams, setSearchParams] = useSearchParams();

  const [form,setForm]=useState({
    name:'',
    date_of_birth:'',
    main_contact:'',
    alternative_contact:'',
    gender:'',
    email:'',
    passport_number:'',
    birth_certificate:'',
    identification_number:'',
    address:''
  })


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

  async function signUpWithGoogle({email,name}){
    try{
      let response=await data.makeRequest({method:'post',url:`api/check-email`,data:{email}, error: ``},0);
      console.log(response)
    }catch(e){

         console.log({message})
    
        if(e.message==401){

          data.setAuth({type:'google',email,name})
          toast.success(t('messages.added-successfully'))
          return

        }else if(e.message==500){
          setMessage(t('common.unexpected-error'))
        }else  if(e.message=='Failed to fetch'){
            setMessage(t('common.check-network'))
        }else{
            setMessage(t('common.unexpected-error'))
        }

        data._scrollToSection('_register_msg-2')
        
    }
 }








  
  useEffect(()=>{
    let v=true


    if(!form.name ||
       !form.email ||
       !form.address ||
       !form.alternative_contact ||
       !form.gender ||
       !form.main_contact || 
       (!form.passport_number && !form.identification_number && !form.birth_certificate)
    ){
      v=false
    }

    setValid(v)
    setMessage('')

 },[form])

  function clearFileInputs(){
    if(fileInputRef_1.current) fileInputRef_1.current.value=""
    if(fileInputRef_2.current) fileInputRef_2.current.value=""
  }

  return (
    <div className="flex h-[100vh]">

            <div className="login-left-bg  h-[100vh] w-[380px] max-lg:hidden">

            </div>

            <div className="h-[100vh] overflow-y-auto flex-1 _remove_bar">
                <div className="bg-white m-3 py-3 rounded-[0.3rem] overflow-x-hidden pb-[30px] h-[100vh]">
                    <div className="px-[15px]">
                    <h2 className="font-medium text-[22px] mb-2">{t('common.register')}</h2>
                    <p className="text-gray-600 mb-2 text-[0.9rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
                   
                    </div>

                    {data.auth.type!="google" && <div className="w-[260px] mx-[20px] mt-10">
                      <GoogleSignIn isSignup={true} setMessage={setMessage} signUpWithGoogle={signUpWithGoogle}/>
                    </div>}

                   {data.auth.type=="google" &&  <button  onClick={()=>{
                    data.setAuth({...data.auth,type:null})
                    }}   type="button" class="border  bg-red-200 border-red-600 cursor-pointer hover:opacity-65 text-red-500 mx-[20px] mt-10  focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center inline-flex justify-center items-center me-2">
                        <span className="ml-2"> {t('common.cancel-google-signup')}</span>
                    </button>}


                    <div className="px-[20px] mt-9">
                        <Messages id="_register_msg-2" type={messageType}  setMessage={setMessage} message={message}/>
                    </div>

                    <CreatePatient ShowOnlyInputs={'register'}/>
                    
                </div>

                <p className="px-[20px] shadow mb-2"><span className="italic text-gray-600">{t('messages.already-have-acccout')}</span> <span className="text-honolulu_blue-500 font-medium cursor-pointer hover:underline" onClick={()=>navigate('/login')}>Login</span></p>
        

              </div>

    </div>
  )
}

export default Register