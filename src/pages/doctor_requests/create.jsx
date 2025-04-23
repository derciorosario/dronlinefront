import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import { useData } from '../../contexts/DataContext'
import AdditionalMessage from '../messages/additional'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'
import Comment from '../../components/modals/comments'
import Loader from '../../components/Loaders/loader'
import AppointmentItems from '../../components/Cards/appointmentItems'
import SearchInput from '../../components/Inputs/search'
import FileInput from '../../components/Inputs/file'

function AppointmentInvoice({ShowOnlyInputs}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const data = useData()
  let from="appointment_invoices"

  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const {user}=useAuth()
  const [loading,setLoading]=useState(id ? true : false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
       

  let initial_form={
    created_at:'',
    uploaded_files:[]
  }


  const [form,setForm]=useState(initial_form)



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

     let response=await data.makeRequest({method:'get',url:`api/doctor-requests/`+id,withToken:true, error: ``},0);

     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){
      console.log(e)

      
      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/membership-requests')
      }else  if(e.message=='Failed to fetch'){
        navigate('/membership-requests')
        toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/membership-requests')  
      }
  }
  
})()

},[user,pathname,itemToEditLoaded])


useEffect(()=>{
  if(data.updateTable){
      setItemToEditLoaded(false)
  }
},[data.updateTable])





useEffect(()=>{
  if(!user) return
  if((user?.role=="patient" || user?.role=="doctor") || (user?.role=="manager" && !user?.data?.permissions?.doctor_requests?.includes('create'))){
         navigate('/') 
  }
},[user])





return (

<div>   

 <DefaultLayout hide={ShowOnlyInputs}>



  {!itemToEditLoaded && id && <div className="mt-10">
    <DefaultFormSkeleton/>
  </div>}


  <div>

  <FormLayout  hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={t('menu.membership-requests')} verified_inputs={verified_inputs} form={form}

  advancedActions={{hide:!id,id:form.id, 
    
    items:[
      {name:t('common.edit-to-add'),onClick:()=>{
          data._closeAllPopUps()
          window.open('/add-doctors?add_from_doctor_request_id='+form.id,'_blank')
      }},
    ]

}}

  topBarContent

  bottomContent={(
    <div className="mt-5">

    
      <div className="flex gap-x-4 flex-wrap gap-y-8 mb-3">
          {form.id && <FileInput _upload={{key:'identification_number_filename',filename:form.identification_number_filename}}  label={t('form.identification-doc')} r={true}/>}
      </div>

      <div className="flex gap-x-4 flex-wrap gap-y-4">
          
          {form.uploaded_files.map(i=>(

              <div className="flex items-center">
                
                <div>
                <input id={i.id} style={{borderBottom:'0'}} value={i.name} placeholder={t('common.document-name')} onChange={(e)=>{
                     setForm({...form,uploaded_files:form.uploaded_files.map(f=>{
                      
                        if(f.id==i.id){
                          return {...f,name:e.target.value}
                        }else{
                          return f
                        }

                     })})
                }}   class={`bg-gray pointer-events-none   text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1`}/>
                
                <FileInput  _upload={{key:i.id,filename:i.filename}}  r={true}/>
               
                </div>
                 

                </div>
          ))}
          
      </div>




    </div>
)}
  

  button={(
    <div className={`mt-[40px]`}>

    
    </div>
  )}
  >


  <FormCard hide={!id} items={[
    {name:'ID',value:form.id},
    {name:t('form.full-name'),value:form.name},
    {name:t('form.main-contact'),value:form?.main_contact_code +" "+form?.contact},
    {name:'Email',value:form.email},
    {name:t('form.medical-specialty'),value:form.specialty}, 
    {name:t('form.address'),value:form.address}, 
    {name:t('common.additional-info'),value:form.additional_info},
    {name:t('common.created_at'),value:form.created_at?.split('T')?.[0] + " "+form.created_at?.split('T')?.[1]?.slice(0,5)}, 
  ]}/>



  </FormLayout>
  </div>

  </DefaultLayout>
      </div> 
  )
}

export default AppointmentInvoice