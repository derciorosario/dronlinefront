import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import FileInput from '../../components/Inputs/file'
import PatientForm from '../../components/Patient/form'
import { useData } from '../../contexts/DataContext'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AdditionalMessage from '../messages/additional'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import LogoFIle from '../../components/Inputs/logo'
import toast from 'react-hot-toast'
import _var from '../../assets/vaiables.json'

function addPatients({ShowOnlyInputs}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const data = useData()
  const [searchParams] = useSearchParams();
    
  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  
  const [loading,setLoading]=useState(false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [MessageBtnSee,setMessageBtnSee]=useState(null)
  const [doctorRequestToBeLoaded,setDoctorRequestToBeLoaded]=useState(false)

  const {user} = useAuth()

  let initial_form={
    name:'',
    date_of_birth:'',
    main_contact:'',
    main_contact_code:'258',
    alternative_contact_code:'258',
    alternative_contact:'',
    gender:'',
    password:'',
    email:'',
    passport_number:'',
    birth_certificate:'',
    identification_number:'',
    address:'',
    passport_number_filename:'',
    identification_number_filename:'',
    birth_certificate_filename:'',
    order_id:'',
    marital_status: "",
    occupation: "",
    nationality: "",
    identification_document:'',
    country_of_residence: "",
    province_of_residence: "",
    residential_address: "",
    pt_short_biography:'',
    en_short_biography:'',
    long_biography:'',
    years_of_experience:'',
    use_app_gain_percentage:false,
    uploaded_files:[]
    
  }

  const [form,setForm]=useState(initial_form)
  
  useEffect(()=>{

    let v=true

    if(!form.name ||
       !form.email ||
       !form.address ||
       !form.medical_specialty ||
       !form.gender ||
       !form.main_contact ||
       !form.pt_short_biography  ||
       !form.en_short_biography  ||
       !form.date_of_birth ||
       !form.identification_document ||

       ((!form.passport_number || !form.passport_number_filename) && form.identification_document=="passport_number") ||
       ((!form.identification_number || !form.identification_number_filename) && form.identification_document=="identification_number") ||
       ((!form.birth_certificate || !form.birth_certificate_filename) && form.identification_document=="birth_certificate") ||

       (form.identification_document=="identification_number" && (!form.date_of_issuance_of_the_identity_card || !form.place_of_issuance_of_the_identity_card)) ||
      
       !form.country_of_residence || 
       !form.occupation ||
       !form.nationality ||
       !form.country_of_residence ||
       !form.years_of_experience
    
    ){
       v=false
    }

    setValid(v)

 },[form])


 let required_data=['specialty_categories']

 useEffect(()=>{
       if(!user) return
       setTimeout(()=>(
         data._get(required_data) 
       ),500)

 },[user,pathname])

 
 useEffect(()=>{

  if(!user || !id){
      setForm(initial_form)
      return
  }

  if(document.querySelector('#center-content')) {
    document.querySelector('#center-content').scrollTop=0
  }
  
  (async()=>{
    try{

      let response=await data.makeRequest({method:'get',url:`api/doctor/`+id,withToken:true, error: ``},0);
      setForm({...form,...response})
      setLoading(false)
      setItemToEditLoaded(true)

    }catch(e){
      console.log({e})

      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/doctors')
      }else  if(e.message=='Failed to fetch'){
         toast.error(t('common.check-network'))
         navigate('/doctors')
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/doctors')  
      }
  }
})()

},[user,pathname])




useEffect(()=>{

  let res=data._sendFilter(searchParams)
  if(!res.add_from_doctor_request_id){
      return
  }

  (async()=>{
    try{

      let response=await data.makeRequest({method:'get',url:`api/doctor-requests/`+res.add_from_doctor_request_id,withToken:true, error: ``},0);
      setForm({...form,...response,
        main_contact:response.contact,
        residential_address:response.address,
        identification_document:'identification_number',
        pt_long_biography:response.additional_info
      })
      console.log({response})
      setDoctorRequestToBeLoaded(true)

    }catch(e){

      if(e.message==404){
         toast.error(t('common.item-not-found'))
      }else  if(e.message=='Failed to fetch'){
         toast.error(t('common.check-network')) 
      }else{
        toast.error(t('common.unexpected-error'))
      }

      setDoctorRequestToBeLoaded(true)
  }
})()

},[user,pathname])




  async function SubmitForm(){

    setLoading(true)
    
    if(form.uploaded_files.some(i=>i.filename && !i.name)){
      setMessage(t('common.add-document-name'))
      setMessageType('red')
      setLoading(false)
      return
    }

    try{
      if(id){
        
        let r=await data.makeRequest({method:'post',url:`api/doctor/`+id,withToken:true,data:{
          ...form,
          uploaded_files:form.uploaded_files.filter(i=>i.filename)
        }, error: ``},0);
        setForm({...form,r})
        setMessage(t('messages.updated-successfully'))
        setLoading(false)
        setMessageType('green')

      }else{

        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
          setMessage(t('common.invalid-email'))
          setMessageType('red')
          setLoading(false)
          return
        }

     
        let response=await data.makeRequest({method:'post',url:`api/register-doctor`,withToken:true,data:{
          ...form,uploaded_files:form.uploaded_files.filter(i=>i.filename)
        }, error: ``},0)
  

        setLoading(false)

        setForm({...initial_form,keep_message:true})
        setMessageType('green')
        setMessage(t('messages.added-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')
        setVerifiedInputs([])
        setMessageBtnSee({onClick:()=>{
                navigate('/doctor/'+response.id)
                setItemToEditLoaded(false)
                setMessage('')
                if(document.querySelector('#center-content')) {
                  document.querySelector('#center-content').scrollTop=0
                }
        }})
        data.handleLoaded('remove','doctors')


      }
    }catch(e){

      setMessageType('red')

      if(e.message==409){
        setMessage(t('common.email-used'))
      }else if(e.message==400){
        setMessage(t('common.invalid-data'))
      }else if(e.message==500){
        setMessage(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
          setMessage(t('common.check-network'))
      }else{
          setMessage(t('common.unexpected-error'))
      }

      setLoading(false)
      
      
    }
  }

  
  useEffect(()=>{
    if(!user) return
    if(user?.role=="manager" && !user?.data?.permissions?.doctor?.includes('create') && !id){
           navigate('/') 
    }
  },[user])



  
  function handleUploadedFiles(upload){

    setForm({...form,[upload.key]:upload.filename})
    
  }


  function handleUploadeduploaded_files(upload){
    setForm({...form,uploaded_files:form.uploaded_files.map(i=>{
        if(i.id==upload.key){
          return {...i,filename:upload.filename}
        }else{
         return i
        }
    })})
  }




  return (

     <DefaultLayout hide={ShowOnlyInputs} disableUpdateButton={true} pageContent={{btn:!((user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('create'))) && id) ? null : {onClick:(e)=>{
      navigate('/add-doctors')
     },text:t('menu.add-doctors')}}}>

            <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
          
            {(!itemToEditLoaded && id || (!id && new URLSearchParams(window.location.search).get('add_from_doctor_request_id') && !doctorRequestToBeLoaded)) && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}

           <FormLayout hide={!itemToEditLoaded && id || (!id && new URLSearchParams(window.location.search).get('add_from_doctor_request_id') && !doctorRequestToBeLoaded)} hideTitle={ShowOnlyInputs} title={id ? t('common.update-doctor') : t('common.add-doctor')} verified_inputs={verified_inputs} form={form}
           
            bottomContent={(
                <div className="mt-5">

                
                  <span className="flex mb-5 items-center hidden">{t('common.documents')}  <label className="text-[0.9rem] ml-2">({t('messages.add-atleast-one-document')})</label> <span className="text-red-500">*</span></span>
                  
                  
                  <div className="flex gap-x-4 flex-wrap gap-y-8">
                      {form.identification_document=="identification_number" &&  <FileInput _upload={{key:'identification_number_filename',filename:form.identification_number_filename}} res={handleUploadedFiles} label={t('form.identification-doc')} r={true}/>}
                      {form.identification_document=="birth_certificate" &&  <FileInput _upload={{key:'birth_certificate_filename',filename:form.birth_certificate_filename}} res={handleUploadedFiles} label={t('form.birth-certificate')} r={true}/>}
                      {form.identification_document=="passport_number" &&  <FileInput _upload={{key:'passport_number_filename',filename:form.passport_number_filename}} res={handleUploadedFiles} label={t('form.passport')} r={true}/>}
                  </div>

                  
                  <div>
                     <FormLayout.Input disabled={form.use_app_gain_percentage} ignoreVilidation={form.use_app_gain_percentage} r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'gain_percentage'])} label={t('common.gain_percentage')} onChange={(e)=>setForm({...form,gain_percentage:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'gain_percentage'} value={form.gain_percentage}/>
                
                     <div className="flex items-center mt-2 mb-10">
                           <label>
                            <input onClick={()=>{
                              setForm({...form,
                                use_app_gain_percentage:!Boolean(form.use_app_gain_percentage),
                                gain_percentage:form.use_app_gain_percentage ? form.gain_percentage : 0,
                              })
                            }} checked={form.use_app_gain_percentage} type="checkbox" className="mr-2"/>
                            <span>{t('common.use-app-gain-percentage')}</span>
                           </label>
                        </div>
                    </div>

                  <span className="flex mb-5 items-center mt-8">
                    
                      {t('common.other-documents')} 
                    
                      <button onClick={()=>{
                          let id=Math.random().toString().replace('.','')
                          setForm({...form,uploaded_files:[...form.uploaded_files,{
                            name:'',filename:'', id
                          }]})
                          setTimeout(() => {
                              try{
                                document.getElementById(id).focus()
                              }catch(e){
                                console.log({id})
                              }
                          }, 200);
                      }} _ type="button" class="text-white ml-4 bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        {t('common.add-document')}
                      </button>
                  
                  </span>


                  <div className="flex gap-x-4 flex-wrap gap-y-4">
                      
                      {form.uploaded_files.map(i=>(

                          <div key={i.id} className="flex items-center">
                            
                            <div>
                            <input id={i.id} style={{borderBottom:'0'}} value={i.name} placeholder={t('common.document-name')} onChange={(e)=>{
                                 setForm({...form,uploaded_files:form.uploaded_files.map(f=>{
                                    if(f.id==i.id){
                                      return {...f,name:e.target.value}
                                    }else{
                                      return f
                                    }
                                 })})
                            }}   class={`bg-gray border border-gray-300  text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1`}/>
                            
                            <FileInput  _upload={{key:i.id,filename:i.filename}} res={handleUploadeduploaded_files} r={true}/>
                           
                            </div>
                              
                            <span onClick={()=>{
                                setForm({...form,uploaded_files:form.uploaded_files.filter(f=>f.id!=i.id)})
                              }} className="ml-2 cursor-pointer hover:opacity-65">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                </span>
                           

                            </div>
                      ))}
                      
                  </div>


                  <div className="w-full">

                      <div className="gap-x-4 flex-wrap mt-4">
                                    {(form.id || !id) && <FileInput onlyImages={true} _upload={{key:'signature_filename',filename:form.signature_filename}} res={handleUploadedFiles} label={t('common.signature')}/>}
                                    <div className="w-[300px] flex items-center justify-center bg-gray-300 h-[100px] rounded-[0.3rem]">
                                        {!form.signature_filename && <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                                        </svg>}
                                        {form.signature_filename && <img className="object-cover border w-auto h-full" src={form.signature_filename}/>}
                                    </div>
                      </div>
                      <div className="gap-x-4 flex-wrap mt-4">
                                     {(form.id || !id) && <FileInput onlyImages={true} _upload={{key:'stamp_filename',filename:form.stamp_filename}} res={handleUploadedFiles} label={t('common.stamp')}/>}
                                    <div className="w-[300px] flex items-center justify-center bg-gray-300 h-[100px] rounded-[0.3rem]">
                                        {!form.stamp_filename && <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                                        </svg>}
                                        {form.stamp_filename && <img className="object-cover border w-auto h-full" src={form.stamp_filename}/>}
                                    </div>
                      </div>
                     
                  </div>


                  


                </div>
            )}


                  button={(
                    <div className={`mt-[60px] ${(user?.role=="manager" && !user?.data?.permissions?.doctor?.includes('update') && id) ? 'hidden':''} `}>
                      <FormLayout.Button onClick={SubmitForm} valid={valid} loading={loading} label={loading ? t('common.loading') : id ? t('common.update') : t('common.send') }/>
                    </div>
                  )}
                  >

                   <div className="mb-10 w-full">
                     <LogoFIle res={handleUploadedFiles} _upload={{key:'profile_picture_filename',filename:form.profile_picture_filename}} label={t('common.profile-piture')}/>
                  </div>

          
              <PatientForm form_name={'doctors'} itemsToHide={['password','hospitalization_history','family_history_of_diseases','insurance_company','policy_number']} form={form} setForm={setForm} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>

            </FormLayout>

     </DefaultLayout>
  )
}

export default addPatients