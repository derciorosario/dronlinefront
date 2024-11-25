import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import Messages from '../messages/index'
import { t } from 'i18next'
import FileInput from '../../components/Inputs/file'
import PatientForm from '../../components/Patient/form'
import { useData } from '../../contexts/DataContext'
import AdditionalMessage from '../messages/additional'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import PreLoader from '../../components/Loaders/preloader'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'

function index({ShowOnlyInputs}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const fileInputRef_1 = React.useRef(null);
  const fileInputRef_2 = React.useRef(null);
  const data = useData()
  let from="appointments"

  const { id } = useParams()
  const {pathname,search } = useLocation()
  const navigate = useNavigate()
  const {user}=useAuth()
  const [loading,setLoading]=useState(id ? true : false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [MessageBtnSee,setMessageBtnSee]=useState(null)
  let required_data=['specialty_categories']


  useEffect(()=>{
        
    if(!user) return
    setTimeout(()=>(
      data._get(required_data) 
    ),500)

},[user,pathname])

let initial_form={}

  const [form,setForm]=useState(initial_form)


  useEffect(()=>{
    
    let v=true

    if(
       (form.value==null || form.value==undefined)
    ){
      v=false
    }

    console.log({form})
    setValid(v)
 },[form])


 useEffect(()=>{

  if(!id && form.id){
    setForm(initial_form)
  }

},[pathname])
 

 useEffect(()=>{

    
  
  if(!user || !id){
      return
  }
  
  (async()=>{
    try{

     let response=await data.makeRequest({method:'get',url:`api/cancellation-taxes/`+id,withToken:true, error: ``},0);

    
     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){
   
      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/cancellation-taxes')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/cancellation-taxes')  
      }
  }
  
})()
  

},[user,pathname])







  async function SubmitForm(){

       setLoading(true)


    try{



      if(id){


        let r=await data.makeRequest({method:'post',url:`api/cancellation-taxes/`+id,withToken:true,data:form, error: ``},0);
  
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')



      }else{

        let response=await data.makeRequest({method:'post',url:`api/specialty-categories/`,withToken:true,data:form, error: ``},0);

        console.log({response})
  
        setForm({...initial_form})
        setMessageType('green')
        setMessage(t('messages.added-successfully'))
        setLoading(false)
        setVerifiedInputs([])
      
    

      }
     

    }catch(e){

      console.log({e})

      setMessageType('red')
      data._scrollToSection('_register_msg')
      if(e.message==409){
        setMessage(t('common.name-exists'))
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
    if(user?.role=="manager" && !user?.data?.permissions?.specialty_categories?.includes('create') && !id){
           navigate('/') 
    }
  },[user])


  useEffect(()=>{
      if(form.is_by_percentage && form.value > 100){
        setForm({...form,value:0})
      }
  },[form])



  return (
     <DefaultLayout>
         
            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

            {!itemToEditLoaded && id && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}
           

           <FormLayout  hide={!itemToEditLoaded && id} title={id ? t('common.edit-category') : t('common.add-category')} verified_inputs={verified_inputs} form={form}
          
                    button={(
                    <div className={`mt-[40px] ${(user?.role=="manager" && !user?.data?.permissions?.specialty_categories?.includes('update') && id) ? 'hidden':''}`}>
                        <FormLayout.Button onClick={()=>{
                            SubmitForm()
                        }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.send')}/>
                    </div>
                    )}
                    >

                    <FormCard items={[
                        {name:t('common.payment-method'),value:t('common.'+form.payment_method)}
                     ]}/>



                    <FormLayout.Input  verified_inputs={verified_inputs} form={form} selectOptions={
                      [
                        {name:t('common.by_percentage'),value:true},
                        {name:t('common.fixed'),value:false},
                      ]
                      } onBlur={()=>setVerifiedInputs([...verified_inputs,'application-method'])} label={t('common.application-method')} onChange={(e)=>setForm({...form,is_by_percentage:(e.target.value == "true"  ? true :  e.target.value == "false" ? false : e.target.value)})} field={'is_by_percentage'} value={form.is_by_percentage}/>
                      

                     <FormLayout.Input 
                        verified_inputs={verified_inputs} 
                        form={form}
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'value'])} 
                        label={t('common.value')}
                        r={true} 
                        onChange={(e) => setForm({...form, value: e.target.value > 100 && form.is_by_percentage ? 100 : e.target.value.replace(/[^0-9]/g, '')})} 
                        field={'value'} 
                        value={form.value}
                    />

            </FormLayout>

     </DefaultLayout>
  )
}

export default index