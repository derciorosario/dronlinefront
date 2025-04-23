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

function AddDependents({ShowOnlyInputs,hideLayout}) {

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
    main_contact_code:'258',
    alternative_contact_code:'258',
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
    hospitalization_history: '',
    family_history_of_diseases: '',
    identification_document:'',
    relationship:'',
    type_of_care:'',
    uploaded_files:[],
    chronic_diseases: [],
    surgery_or_relevant_procedures: [],
    drug_allergies: [],
    continuous_use_of_medications: [],
    has_chronic_diseases:null,
    has_surgery_or_relevant_procedures: null,
    has_drug_allergies:null,
    has_continuous_use_of_medications: null
  }

  const [form,setForm]=useState(initial_form)
  
  useEffect(()=>{
    let v=true

    if(!form.name ||
       !form.gender ||
       !form.main_contact ||
       !form.date_of_birth  ||
       !form.relationship ||
       !form.identification_document ||

       (form.identification_document=="identification_number" && (!form.date_of_issuance_of_the_identity_card || !form.place_of_issuance_of_the_identity_card)) ||
       
       ((!form.passport_number || !form.passport_number_filename) && form.identification_document=="passport_number") ||
       ((!form.identification_number || !form.identification_number_filename) && form.identification_document=="identification_number") ||
       ((!form.birth_certificate || !form.birth_certificate_filename) && form.identification_document=="birth_certificate") 

    ){
      v=false
    }

    setValid(v)
    console.log({form})

 },[form])



  
 useEffect(()=>{
  if(!user || !id || hideLayout){
      if(!id) setForm(initial_form)
      return
  }

  if(document.querySelector('#center-content')) {
    document.querySelector('#center-content').scrollTop=0
  }
  
  (async()=>{
    try{
      
      let response=await data.makeRequest({method:'get',url:`api/dependent/`+id,withToken:true, error: ``},0);

     setForm({...form,...response})

     setLoading(false)

     setItemToEditLoaded(true)

    }catch(e){
      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/dependents')
      }else  if(e.message=='Failed to fetch'){
        navigate('/dependents')
        toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/dependents')  
      }
  }
})()

},[user,pathname])


 async function SubmitForm(){
  setLoading(true)

  try{

   
    if(id && !hideLayout){


      let r=await data.makeRequest({method:'post',url:`api/patient/${form.patient_id}/dependents/`+id,withToken:true,data:{
        ...form
      }, error: ``},0);

      setForm({...form,r})
      
      setMessage(t('messages.updated-successfully'))
      setLoading(false)
      setMessageType('green')

    }else{

      /*if(form.has_chronic_diseases==null || form.has_surgery_or_relevant_procedures==null || form.has_drug_allergies==null ||form. has_continuous_use_of_medications==null){
        setMessage(t('common.fill-all-required-fills'))
        setMessageType('red')
        setLoading(false)
        return
      }*/

     
      let response=await data.makeRequest({method:'post',url:`api/patients/${user?.data?.id}/dependents`,withToken:true,data:{
        ...form,uploaded_files:form.uploaded_files.filter(i=>i.filename),
        has_chronic_diseases:form.has_chronic_diseases==null ? false : form.has_chronic_diseases,
        has_surgery_or_relevant_procedures: form.has_surgery_or_relevant_procedures==null ? false : form.has_surgery_or_relevant_procedures,
        has_drug_allergies:form.has_drug_allergies==null ? false : form.has_drug_allergies,
        has_continuous_use_of_medications: form.has_continuous_use_of_medications==null ? false : form.has_continuous_use_of_medications
      }, error: ``},0)

      if(hideLayout){
        data.setJustCreatedDependent(response)
        data._closeAllPopUps()
       
      }
      setForm({...initial_form,keep_message:true})
      setMessageType('green')
      setMessage(t('messages.added-successfully'))
      setLoading(false)
      data._scrollToSection('center-content')
      setVerifiedInputs([])
      
      setMessageBtnSee({onClick:()=>{
              navigate('/dependent/'+response.id)
              setItemToEditLoaded(false)
              setMessage('')
              if(document.querySelector('#center-content')) {
                document.querySelector('#center-content').scrollTop=0
              }
      }})

      data.handleLoaded('remove','dependents')

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
    console.log({upload})
    setForm({...form,[upload.key]:upload.filename})
  }

  const [formStep,setFormStep]=useState(1)


  if(hideLayout){

    return pageContent()
    
  }

    useEffect(()=>{
     if(!user) return
     if(user?.role!="patient"){
            navigate('/') 
     }
   },[user])


  function pageContent(){
    return (
       <>
       
       {message && <div className="px-[20px] mt-9" id="_register_msg">
               <AdditionalMessage  float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

           {(!itemToEditLoaded && id && !hideLayout) && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}

           <FormLayout hideInputs={user?.role!="patient"} hide={(!itemToEditLoaded && id) && !hideLayout} hideTitle={ShowOnlyInputs} title={!id ? t('menu.add-family') : t('common.update-family')} verified_inputs={verified_inputs} form={form} bottomContent={(
                 <>
                    <div className={`${user?.role!="patient" ? 'hidden':''}`}>
                      <span className="flex mb-5 items-center hidden">{t('common.documents')}  <label className="text-[0.9rem] ml-2">({t('messages.add-atleast-one-document')})</label> <span className="text-red-500">*</span></span>
                      <div className="flex gap-x-4 flex-wrap gap-y-8 mt-5">
                          {form.identification_document=="identification_number" &&  <FileInput _upload={{key:'identification_number_filename',filename:form.identification_number_filename}} res={handleUploadedFiles} label={t('form.identification-doc')} r={true}/>}
                          {form.identification_document=="birth_certificate" &&  <FileInput _upload={{key:'birth_certificate_filename',filename:form.birth_certificate_filename}} res={handleUploadedFiles} label={t('form.birth-certificate')} r={true}/>}
                          {form.identification_document=="passport_number" &&  <FileInput _upload={{key:'passport_number_filename',filename:form.passport_number_filename}} res={handleUploadedFiles} label={t('form.passport')} r={true}/>}
                      </div>
                    </div>
                </>
            )}

            button={(
               <div className={`${user?.role!="patient" ? 'hidden':''} mt-5`}>
                     <FormLayout.Button onClick={SubmitForm} valid={valid} loading={loading} label={loading ? t('common.loading') : t('common.send') }/>
                </div>
            )}
            >
           <FormCard hide={user?.role=="patient"} items={[
              {name:t('form.dependent-name'),value:form.name},
              {name:t('form.relationship'),value:t('common.'+form.relationship)},
              {name:'Email',value:form.email || '-'},
              {name:t('form.main-contact'),value:form.main_contact || '-'},
              {name:t('form.alternative-contact'),value:form.alternative_contact || '-'},
              {name:t('form.address'),value:form.address || '-'},
              {name:t('form.gender'),value: t('common.'+form.gender),hide:!form.gender},
              {name:t('form.hospitalization_history'),value:form.hospitalization_history || '-'},
              {name:t('form.family_history_of_diseases'),value:form.family_history_of_diseases || '-'},
              {name:t('common.identification-document'),value:t('form.'+form.identification_document.replaceAll('_','-')) || '-'},

          
            ]}/>


            <div className="hidden">
               <PatientForm.Stepper formStep={formStep} setFormStep={setFormStep}/>
            </div>

            <div className={`${user?.role!="patient" ? 'hidden':''} hidden w-full`}>
                      <div className="mb-10">
                        <LogoFile res={handleUploadedFiles} _upload={{key:'profile_picture_filename'}} label={t('common.profile-piture')}/>
                      </div>
            </div>

            <PatientForm hideInputs={user?.role!="patient"} setForm={setForm}  form_name={'dependent'} hide={user?.role=="doctor"}  itemsToHide={['password','medical-specialty','order-number','pt_short_biography','pt_long_biography','en_short_biography','en_long_biography','years_of_experience','mobile_payment_method_name','mobile_payment_method_number','bank_payment_method_name','bank_payment_method_nib']} form={form}  verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>

            </FormLayout>
       </>
    )
  }


  return (
     <DefaultLayout disableUpdateButton={true} hide={ShowOnlyInputs || hideLayout} pageContent={{btn:user?.role=="patient" && id ? { onClick:(e)=>{
                 
      navigate('/add-dependent')

   },text:t('menu.add-dependents')}:{}}}>
            {pageContent()}
     </DefaultLayout>
  )
}

export default AddDependents