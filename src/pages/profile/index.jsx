import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'

import { t } from 'i18next'
import { useAuth } from '../../contexts/AuthContext'
import PersonalPage from './pages/personal'
import LoginPage from './pages/login-and-password'
import { useData } from '../../contexts/DataContext'
import ConfirmDialog from '../../components/modals/confirm'
import FormLayout from '../../layout/DefaultFormLayout'
import toast from 'react-hot-toast'
import Loader from '../../components/Loaders/loader'
import SystemPage from './pages/system'
import LogoFile from '../../components/Inputs/logo'
import {  useNavigate, useSearchParams } from 'react-router-dom'
import SignaturePage from './pages/signature'

function index() {

    const data=useData()
    const {user,logout,setIsLoading,setUser}=useAuth()
    const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
    const [updatingProfile,setUpdatingProfile]=useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()

    function logout_user(){
        logout()
        setIsLoading(true)
    }

    const [formStep,setFormStep]=useState(1)
    const [loading,setLoading]=useState(false)

    useEffect(()=>{

        if(!user){
            return
        }

        (async()=>{
          try{
           let response=await data.makeRequest({method:'get',url:`api/userdata/`,withToken:true, error: ``},0);
           setForm({...form,...user,...response.data,app_settings:{...response.app_settings[0],value:JSON.parse(response.app_settings[0].value)}})
           setLoading(false)
           setItemToEditLoaded(true)
          }catch(e){
              console.log({e})
              toast.error(t('common.unexpected-error'))
              navigate('/')  
          }
      })()
      
    },[user])

  

    function Icon({name,active}){
        return (
            <>
              { name=="login-and-password" ? <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>
              : name=="signature" ? <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M563-491q73-54 114-118.5T718-738q0-32-10.5-47T679-800q-47 0-83 79.5T560-541q0 14 .5 26.5T563-491ZM120-120v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80ZM136-280l-56-56 64-64-64-64 56-56 64 64 64-64 56 56-64 64 64 64-56 56-64-64-64 64Zm482-40q-30 0-55-11.5T520-369q-25 14-51.5 25T414-322l-28-75q28-10 53.5-21.5T489-443q-5-22-7.5-48t-2.5-56q0-144 57-238.5T679-880q52 0 85 38.5T797-734q0 86-54.5 170T591-413q7 7 14.5 10.5T621-399q26 0 60.5-33t62.5-87l73 34q-7 17-11 41t1 42q10-5 23.5-17t27.5-30l63 49q-26 36-60 58t-63 22q-21 0-37.5-12.5T733-371q-28 25-57 38t-58 13Z"/></svg> 
              : name=="personal-info" ? <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
              : name=="system-info" ? <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M440-280h80l12-60q12-5 22.5-10.5T576-364l58 18 40-68-46-40q2-14 2-26t-2-26l46-40-40-68-58 18q-11-8-21.5-13.5T532-620l-12-60h-80l-12 60q-12 5-22.5 10.5T384-596l-58-18-40 68 46 40q-2 14-2 26t2 26l-46 40 40 68 58-18q11 8 21.5 13.5T428-340l12 60Zm40-120q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
              : name=="dependents" ? <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M160-160v-280 280Zm640 0v-280 280Zm-40-480q17 0 28.5-11.5T800-680q0-17-11.5-28.5T760-720q-17 0-28.5 11.5T720-680q0 17 11.5 28.5T760-640Zm0 80q-51 0-85.5-34.5T640-680q0-50 34.5-85t85.5-35q50 0 85 35t35 85q0 51-35 85.5T760-560ZM480-680q25 0 42.5-17t17.5-43q0-25-17.5-42.5T480-800q-26 0-43 17.5T420-740q0 26 17 43t43 17Zm0 80q-59 0-99.5-40.5T340-740q0-58 40.5-99t99.5-41q58 0 99 41t41 99q0 59-41 99.5T480-600ZM320-425q0 30 32 70t128 127q94-85 127-125t33-72q0-23-15-39t-37-16q-14 0-26.5 6T541-457l-48 57h-27l-48-57q-8-11-20.5-17t-25.5-6q-23 0-37.5 16T320-425Zm-80 0q0-53 36-94t96-41q31 0 59.5 14t48.5 38q20-24 48-38t60-14q60 0 96 41.5t36 93.5q0 53-38.5 104.5T524-160l-44 40-44-40Q315-270 277.5-321T240-425Zm-40-215q17 0 28.5-11.5T240-680q0-17-11.5-28.5T200-720q-17 0-28.5 11.5T160-680q0 17 11.5 28.5T200-640ZM483-80v-80h317v-280H682v-80h118q33 0 56.5 23.5T880-440v360H483Zm-323-80h323v80H80v-360q0-33 23-56.5t57-23.5h118v80H160v280Zm40-400q-51 0-85.5-34.5T80-680q0-50 34.5-85t85.5-35q50 0 85 35t35 85q0 51-35 85.5T200-560Zm280-180Zm-280 60Zm560 0Z"/></svg> 
              : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>}
            </>
        )
    }

    const [currentPage,setCurrentPage]=useState('personal-info')
 
    let pages=[
        {t_label:'personal-info',name:'personal-info'},
        {t_label:'login-and-password',name:'login-and-password'},
       // {t_label:'system-info',name:'system-info'},
        {t_label:'signature',name:'signature'},
        {t_label:'logout',name:'logout'},
    ]

    const [verified_inputs,setVerifiedInputs]=useState([])
    const [valid,setValid]=useState(false)

    let initial_form={
      name:'',
      date_of_birth:'',
      main_contact:'',
      alternative_contact:'',
      gender:'',
      password:'',
      email:'',
      passport_number:'',
      birth_certificate:'',
      identification_number:'',
      passport_number_filename:'',
      identification_number_filename:'',
      birth_certificate_filename:'',
      address:'',
      marital_status: "",
      occupation: "",
      nationality: "",
      country_of_residence: "",
      province_of_residence: "",
      residential_address: "",
      identification_document:'',
      hospitalization_history: '',
      family_history_of_diseases: '',
      type_of_care:'',
      uploaded_files:[],
      chronic_diseases: [],
      surgery_or_relevant_procedures: [],
      drug_allergies: [],
      continuous_use_of_medications: [],
      new_password:'',
      has_chronic_diseases:null,
      has_surgery_or_relevant_procedures: null,
      has_drug_allergies:null,
      has_continuous_use_of_medications: null
    }
  
    const [form,setForm]=useState(initial_form)

    useEffect(()=>{

      if(!itemToEditLoaded) return
      let res=data._sendFilter(searchParams)
      
      if(res.add_info){
        goToForm()
      }

    },[itemToEditLoaded])


    function goToForm(){
     
        const Section = document.getElementById('info-form');
        if (Section) {
          Section.scrollIntoView({ behavior:'smooth'});
        }
     
     
    }



    useEffect(()=>{
      let v=true

      if(formStep==1 && currentPage=="personal-info"){

        if(
           !form.name ||
           !form.email ||
           !form.address ||
           !form.gender ||
           !form.main_contact ||
           !form.date_of_birth ||
           !form.identification_document ||
           (form.identification_document=="identification_number" && (!form.date_of_issuance_of_the_identity_card || !form.place_of_issuance_of_the_identity_card)) ||
           ((!form.passport_number || !form.passport_number_filename) && form.identification_document=="passport_number") ||
           ((!form.identification_number || !form.identification_number_filename) && form.identification_document=="identification_number") ||
           ((!form.birth_certificate || !form.birth_certificate_filename) && form.identification_document=="birth_certificate") ||
           !form.country_of_residence || 
           !form.occupation ||
           !form.nationality ||
           !form.country_of_residence 
        ){
          v=false
        }

      }else if(currentPage=="login-and-password"){

        if((!form.last_password && !(user?.register_method=="google" && user?.changed_password==false)) || !form.new_password || !form.confirm_password){
            v=false
        }

      }else if(currentPage=="signature"){

      }
      setValid(v)
   },[form,currentPage])



   useEffect(()=>{
       if((user?.role=="manager" || user?.role=="admin") && currentPage=="personal-info"){
           setCurrentPage('login-and-password')
       }
   },[user])



async function updateSystemSettings() {
    setLoading(true)

    try{

      let r=await data.makeRequest({method:'post',url:`api/settings/`+form.app_settings.id,withToken:true,data:{...form.app_settings,value:JSON.stringify(form.app_settings.value)}, error: ``},0);
      setLoading(false)
      toast.success(t('messages.updated-successfully'))

    }catch(e){

      setLoading(false)

      console.log({e})
      
      if(e.message==500){
        toast.error(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
        toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
      }

    }
  
}

 async function updateCredentials(){

       setLoading(true)

        try{

          if(form.confirm_password != form.new_password){
            toast.error(t('messages.password-mismatch'))
            setLoading(false)
            return
          }
        
          if(form.new_password.length <= 7){
            toast.error(t('messages.password-min-8'))
            setLoading(false)
            return
          }

          let r=await data.makeRequest({method:'post',url:`api/change-password`,withToken:true,data:{
            new_password:form.new_password,
            last_password:form.last_password,
          }, error: ``},0);

          setUser({...user,changed_password:true})
          
          setLoading(false)
          toast.success(t('messages.updated-successfully'))
          setForm({...form,new_password:'',last_password:'',confirm_password:''})
          setVerifiedInputs([])
          
        }catch(e){
          setLoading(false)
          console.log({e})

          if(e.message==409){
            toast.error(t('common.last-password-incorrect'))
          }else if(e.message==500){
            toast.error(t('common.unexpected-error'))
          }else  if(e.message=='Failed to fetch'){
            toast.error(t('common.check-network'))
          }else{
            toast.error(t('common.unexpected-error'))
          }

        }

    }


    async function updateDoctorSignature(){
       
            setLoading(true)
          
            try{
                
                  await data.makeRequest({method:'post',url:`api/doctor/`+user?.data.id,withToken:true,data:{
                    ...form
                  }, error: ``},0);
        
        
                  toast.success(t('messages.updated-successfully'))
                  setLoading(false)
      
          
            }catch(e){
      
              console.log({e})
          
              if(e.message==409){
                toast.error(t('common.email-used'))
              }else if(e.message==400){
                toast.error(t('common.invalid-data'))
              }else if(e.message==500){
                toast.error(t('common.unexpected-error'))
              }else  if(e.message=='Failed to fetch'){
                toast.error(t('common.check-network'))
              }else{
                toast.error(t('common.unexpected-error'))
              }
              setLoading(false)
            }
       
      
    }


    async function SubmitForm(){

      console.log({form})
      setLoading(true)
    
      try{
          if(formStep==2){

            if(form.has_chronic_diseases==null || form.has_surgery_or_relevant_procedures==null || form.has_drug_allergies==null ||form. has_continuous_use_of_medications==null){
              toast.error(t('common.fill-all-required-fills'))
              setLoading(false)
              return
            }
          }
    
          let r=await data.makeRequest({method:'post',url:`api/patient/`+user?.data.id,withToken:true,data:{
            ...form
          }, error: ``},0);


          let res=data._sendFilter(searchParams)

    
          setForm({...form,...r.patient})
          setUser({...user,data:r.patient})
          
          toast.success(t('messages.updated-successfully'))
          setLoading(false)


          if(res.adding_appointment){
              navigate('/add-appointments')
          }
    
      
    
      }catch(e){

        console.log({e})
    
        if(e.message==409){
          toast.error(t('common.email-used'))
        }else if(e.message==400){
          toast.error(t('common.invalid-data'))
        }else if(e.message==500){
          toast.error(t('common.unexpected-error'))
        }else  if(e.message=='Failed to fetch'){
          toast.error(t('common.check-network'))
        }else{
          toast.error(t('common.unexpected-error'))
        }
        setLoading(false)
      }
    }

  async  function handleUploadedFiles(upload){

      
       setForm({...form,[upload.key]:upload.filename})

      if(upload.key=="profile_picture_filename" && upload.filename && upload.filename!=user?.profile_picture_filename){

        setUpdatingProfile(true)
        setLoading(true)
        toast.remove()

        toast.loading(t('common.updating-company-profile'))

        try{

         

          await data.makeRequest({method:'post',url:`api/update-profile-picture`,withToken:true,data:{
            profile_picture_filename:upload.filename
          }, error: ``},3);

          toast.remove()

          setUpdatingProfile(false)
          toast.success(t('messages.updated-successfully'))
          setUser({...user,profile_picture_filename:upload.filename})
          setLoading(false)


        }catch(e){

         toast.remove()

         setUpdatingProfile(false)
         setLoading(false)

         
          
        if(e.message==500){
          toast.error(t('common.unexpected-error'))
        }else  if(e.message=='Failed to fetch'){
          toast.error(t('common.check-network'))
        }else{
          toast.error(t('common.unexpected-error'))
        }

        }

      }
    }


    
    return (

      <DefaultLayout>


              <div className={`w-full h-[60vh] ${!itemToEditLoaded ? 'flex':'hidden'} items-center justify-center`}>
                <div className="flex flex-col items-center justify-center">
                     <Loader/>
                     <span className="flex mt-2">{t('common.loading')}...</span>
                </div>
              </div>

        <ConfirmDialog res={logout_user} show={data._openPopUps.confim_message} />
       
        <div className={`w-full ${!itemToEditLoaded ? 'hidden':''} p-5 max-sm:p-0 gap-x-2 flex max-lg:flex-col`}>
          
             <div className="w-[300px] p-3 rounded-[0.3rem] bg-white max-lg:w-full max-lg:mb-3">
                  

                   {user && <LogoFile isUserProfile={true} _loading={updatingProfile} res={handleUploadedFiles} _upload={{key:'profile_picture_filename',filename:user?.profile_picture_filename}} label={t('common.profile-piture')}/>}

                    <div className="my-4 flex-col flex justify-center items-center px-2">
                           <span className="font-medium">{user?.name}</span>
                           <span>{t('common.'+user?.role)}</span>
                           <span className="text-gray-500 block break-all w-full text-center">{user?.email}</span>
                    </div>

                    <div className="mt-4 px-2 gap-y-2">

                        {pages.filter(i=>(i.name!="signature" || user?.role=="doctor") &&  (i.name!="personal-info" || (user?.role=="patient" || user?.role=="doctor"))).map(i=>(
                            <div onClick={()=>{

                                  if(i.name=="logout"){
                                    data._showPopUp('confim_message',t('common.sure-to-logout'))
                                  }else{
                                    setCurrentPage(i.name)
                                  }

                                  if(i.name!="logout" && window.innerWidth <= 1023){
                                      goToForm()
                                  }
                            }} className={`flex ${i.name=="system-info" && user?.role!="admin" ? 'hidden':''} _confim_message mb-2 items-center cursor-pointer hover:bg-honolulu_blue-400 _profile_left_item ${currentPage==i.name ? 'bg-honolulu_blue-400 text-white':''} p-2 rounded-[0.3rem]`}>
                                <Icon name={i.name} active={currentPage==i.name}/>
                                <span className="ml-3">{t('common.'+i.t_label)}</span>
                            </div>
                        ))}
                        
                    </div>

             </div>



             <div className="flex-1"  id="info-form">


                  {currentPage=="personal-info" && <ol class="flex mb-3 items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white  rounded-[0.4rem]  sm:text-base sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                      <li onClick={()=>setFormStep(1)} class={`flex relative items-center cursor-pointer hover:opacity-50 ${formStep==1 ? 'text-honolulu_blue-500':''}`}>
                          <span class="flex items-center justify-center me-2 text-xs shrink-0">
                                <label><svg className={`${formStep==1 ? 'fill-honolulu_blue-500':''}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></label>
                           </span>
                          <span class="hidden sm:inline-flex">{t('common.personal-info')}</span>
                          <svg class={`w-3 h-3  ms- hidden sm:ms-4 rtl:rotate-180`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                          </svg>
                          {formStep == 1 && <span className="w-full bg-honolulu_blue-400 h-[1px] rounded absolute top-[100%] translate-y-[15px] left-0"></span>}
                      </li>

                      <li onClick={()=>setFormStep(2)} class={`flex items-center relative cursor-pointer hover:opacity-50 ${formStep==2 ? 'text-honolulu_blue-500':''}`}>
                          <span class="flex items-center justify-center me-2 text-xs rounded-full shrink-0">
                               <span><svg className={`${formStep==2 ? 'fill-honolulu_blue-500':''}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-240h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80Zm240-140h240v-60H520v60Zm0 120h160v-60H520v60ZM160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm280-440h80v-200h-80v200Zm40 220Z"/></svg></span>
                           </span>
                          <span class="hidden sm:inline-flex"> {t('common.medical-info')}</span>
                          <svg class="w-3 h-3 hidden ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
                          </svg>
                          {formStep == 2 && <span className="w-full bg-honolulu_blue-400 h-[1px] rounded absolute top-[100%] translate-y-[15px] left-0"></span>}
                      </li>
                  </ol>}

                  <div className="p-3 rounded-[0.3rem] bg-white flex-1 min-h-[100vh]">
               
                    {currentPage!= "personal-info" && <h2 className="text-[20px] font-medium">{t('common.'+currentPage)}</h2>}
                    <div className={`flex flex-wrap ${currentPage=="personal-info" && user?.role=="doctor" ? 'opacity-70 pointer-events-none':''} gap-x-2`}>
                        {currentPage=="personal-info" && <PersonalPage handleUploadedFiles={handleUploadedFiles} formStep={formStep} setFormStep={setFormStep} form={form} setForm={setForm}  verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>}
                        {currentPage=="signature" && <SignaturePage handleUploadedFiles={handleUploadedFiles} formStep={formStep} setFormStep={setFormStep} form={form} setForm={setForm}  verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>}
                        {currentPage=="system-info" && <SystemPage handleUploadedFiles={handleUploadedFiles} formStep={formStep} setFormStep={setFormStep} form={form} setForm={setForm}  verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>}
                        {currentPage=="login-and-password" && <LoginPage setForm={setForm} form={form} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>}
                    </div>

                     
                   {(user?.role=="patient" || currentPage=="login-and-password" || currentPage=="system-info" || currentPage=="signature") && <div className={`mt-10`}>
                         
                          <FormLayout.Button onClick={()=>{
                             if(currentPage=="personal-info"){
                                 SubmitForm()
                             }else if(currentPage=="signature"){
                                 updateDoctorSignature()
                             }else if(currentPage=="system-info"){
                                 updateSystemSettings()
                             }else{
                                 updateCredentials()
                             }
                          }} valid={valid} loading={loading} label={loading ? t('common.loading') : t('common.update') }/>

                          
                 
                  </div>}

                  </div>

             </div>
        </div>
    </DefaultLayout>
  )
 

}

export default index