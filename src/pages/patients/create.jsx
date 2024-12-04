import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import Messages from '../messages/index'
import { init, t } from 'i18next'
import FileInput from '../../components/Inputs/file'
import PatientForm from '../../components/Patient/form'
import { useData } from '../../contexts/DataContext'
import AdditionalMessage from '../messages/additional'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'
import LogoFile from '../../components/Inputs/logo'

function addPatients({ShowOnlyInputs}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const [loading,setLoading]=useState(false);
  const data = useData()

  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [MessageBtnSee,setMessageBtnSee]=useState(null)
  const {user}= useAuth()

  let initial_form={
    name:'',
    date_of_birth:'',
    main_contact:'',
    alternative_contact:'',
    main_contact_code:'258',
    alternative_contact_code:'258',
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

    has_chronic_diseases:null,
    has_surgery_or_relevant_procedures: null,
    has_drug_allergies:null,
    has_continuous_use_of_medications: null,
    insurance_company:'',
    policy_number:''

  }

  const [form,setForm]=useState(initial_form)


  
  useEffect(()=>{
    let v=true
    if(
      !form.name ||
       !form.email ||
       !form.address ||
       !form.gender ||
       !form.main_contact ||
       !form.date_of_birth ||
       !form.identification_document ||

       ((!form.passport_number || !form.passport_number_filename) && form.identification_document=="passport_number") ||
       ((!form.identification_number || !form.identification_number_filename) && form.identification_document=="identification_number") ||
       ((!form.birth_certificate || !form.birth_certificate_filename) && form.identification_document=="birth_certificate") ||
    
       !form.marital_status ||
       !form.country_of_residence || 
       !form.occupation ||
       !form.residential_address ||
       !form.nationality ||
       !form.marital_status ||
       !form.country_of_residence 
    ){
      v=false
    }
    setValid(v)
    console.log({form})
 },[form])



  
 useEffect(()=>{
  if(!user || !id){
      return
  }

  if(document.querySelector('#center-content')) {
    document.querySelector('#center-content').scrollTop=0
  }
  
  (async()=>{
    try{
      let response=await data.makeRequest({method:'get',url:`api/patient/`+id,withToken:true, error: ``},0);

     setForm({...form,...response})

     setLoading(false)

     setItemToEditLoaded(true)

    }catch(e){


      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/patients')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/patients')  
      }
  }
})()

},[user,pathname])


 async function SubmitForm(){


  setLoading(true)

  try{

   
    if(id){


      let r=await data.makeRequest({method:'post',url:`api/patient/`+id,withToken:true,data:{
        ...form
      }, error: ``},0);

      setForm({...form,r})
      
      setMessage(t('messages.updated-successfully'))
      setLoading(false)
      setMessageType('green')

    }else{

      if(form.has_chronic_diseases==null || form.has_surgery_or_relevant_procedures==null || form.has_drug_allergies==null || form.has_continuous_use_of_medications==null){
        setMessage(t('common.fill-all-required-fills'))
        setMessageType('red')
        setLoading(false)
        return
      }

      if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
        setMessage(t('common.invalid-email'))
        setMessageType('red')
        setLoading(false)
        return
      }
   
      let response=await data.makeRequest({method:'post',url:`api/register-patient`,withToken:true,data:{
        ...form,uploaded_files:form.uploaded_files.filter(i=>i.filename)
      }, error: ``},0)

      setForm({...initial_form,keep_message:true})
      setMessageType('green')
      setMessage(t('messages.added-successfully'))
      setLoading(false)
      data._scrollToSection('center-content')
      setVerifiedInputs([])
      setMessageBtnSee({onClick:()=>{
              navigate('/patient/'+response.id)
              setItemToEditLoaded(false)
              setMessage('')
              if(document.querySelector('#center-content')) {
                document.querySelector('#center-content').scrollTop=0
              }
      }})

      data.handleLoaded('remove','patients')

    }

  }catch(e){

    console.log({e})
  
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

  function handleUploadedFiles(upload){
    setForm({...form,[upload.key]:upload.filename})
  }

 

  useEffect(()=>{
    if(!user) return
    if(user?.role=="manager" && !user?.data?.permissions?.patient?.includes('create') && !id){
           navigate('/') 
    }
  },[user])



  return (
     <DefaultLayout hide={ShowOnlyInputs}>
          
           {message && <div className="px-[20px] mt-9" id="_register_msg">
               <AdditionalMessage  float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

           {!itemToEditLoaded && id && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}

           <FormLayout  hideInputs={user?.role=="doctor"} hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={user?.role=="doctor" ? t('common.patient') : id ? t('common.update-patiente') : t('menu.add-patient')} verified_inputs={verified_inputs} form={form} bottomContent={(
                 <>    
                  <div className={`${user?.role=="doctor" ? 'hidden':''} mt-5`}>
                    <span className="flex mb-5 items-center hidden">{t('common.documents')}  <label className="text-[0.9rem] ml-2">({t('messages.add-atleast-one-document')})</label> <span className="text-red-500">*</span></span>
                    <div className="flex gap-x-4 flex-wrap gap-y-8">
                        {form.identification_document=="identification_number" &&  <FileInput _upload={{key:'identification_number_filename',filename:form.identification_number_filename}} res={handleUploadedFiles} label={t('form.identification-doc')} r={true}/>}
                        {form.identification_document=="birth_certificate" &&  <FileInput _upload={{key:'birth_certificate_filename',filename:form.birth_certificate_filename}} res={handleUploadedFiles} label={t('form.birth-certificate')} r={true}/>}
                        {form.identification_document=="passport_number" &&  <FileInput _upload={{key:'passport_number_filename',filename:form.passport_number_filename}} res={handleUploadedFiles} label={t('form.passport')} r={true}/>}
                    </div>
                  </div>
                </>
            )}

            button={(
                <div className={`${user?.role=="doctor" ? 'hidden':''}  ${(user?.role=="manager" && !user?.data?.permissions?.patient?.includes('update') && id) ? 'hidden':''}   mt-10`}>
                     <FormLayout.Button onClick={SubmitForm} valid={valid} loading={loading} label={loading ? t('common.loading') : t('common.send') }/>
                </div>
            )}
            >

           <FormCard hide={user?.role!="doctor"} items={[
              {name:t('form.patient-name'),value:form.name},
              {name:'Email',value:form.email},
              {name:t('form.main-contact'),value:form.main_contact},
              {hide:!form.hospitalization_history,name:t('form.hospitalization_history'),value:form.hospitalization_history},
              {hide:!form.family_history_of_diseases,name:t('form.family_history_of_diseases'),value:form.family_history_of_diseases},
              {hide:!form.has_drug_allergies,name:t('form.drug_allergies'),value:form.has_drug_allergies ? form.drug_allergies.map(i=>i.name).join(', ') : ''},
              {hide:!form.has_chronic_diseases,name:t('form.chronic_diseases'),value:form.has_chronic_diseases ? form.chronic_diseases.map(i=>i.name).join(', ') : ''},
              {hide:!form.has_continuous_use_of_medications,name:t('form.continuous_use_of_medications'),value: form.has_continuous_use_of_medications ? form.continuous_use_of_medications.map(i=>i.name).join(', ') : ''},
              {hide:!form.has_surgery_or_relevant_procedures,name:t('form.surgery_or_relevant_procedures'),value: form.has_surgery_or_relevant_procedures ? form.surgery_or_relevant_procedures.map(i=>i.name).join(', ') : ''},
              {name:t('form.gender'),value: t('common.'+form.gender),hide:!form.gender},
            ]}/>

             <div className={`${user?.role=="doctor" ? 'hidden':''} w-full`}>
              <div className="mb-10">
                <LogoFile res={handleUploadedFiles} _upload={{key:'profile_picture_filename',filename:form.profile_picture_filename}} label={t('common.profile-piture')}/>
              </div>
            </div>

            <PatientForm setForm={setForm}  form_name={'patient'} hide={user?.role=="doctor"}  itemsToHide={['password','medical-specialty','order-number','pt_short_biography','pt_long_biography','en_short_biography','en_long_biography','years_of_experience']} form={form}  verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>

            </FormLayout>
     </DefaultLayout>
  )
}

export default addPatients