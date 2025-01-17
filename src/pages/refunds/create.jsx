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
       

  
  let required_data=['doctors','specialty_categories','dependents']
  useEffect(()=>{   
        if(!user) return
        setTimeout(()=>{
          data._get(required_data) 
        },500)
  },[user,pathname])


  useEffect(()=>{
    if(!user) return
    setTimeout(()=>{
      data._get(required_data) 
    },500)
},[user,pathname])



  let initial_form={
    created_at:''
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

     let response=await data.makeRequest({method:'get',url:`api/appointment-invoice/`+id,withToken:true, error: ``},0);

     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){
      console.log(e)

   
      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/appointment-invoices')
      }else  if(e.message=='Failed to fetch'){
         navigate('/appointment-invoices')
         toast.error(t('common.check-network'))
      }else{
         toast.error(t('common.unexpected-error'))
         navigate('/appointment-invoices')  
      }
  }
  
})()

},[user,pathname,itemToEditLoaded])


useEffect(()=>{
  if(data.updateTable){
      setItemToEditLoaded(false)
  }
},[data.updateTable])








return (

<div>   

 <DefaultLayout hide={ShowOnlyInputs}>



  {!itemToEditLoaded && id && <div className="mt-10">
    <DefaultFormSkeleton/>
  </div>}


  <div>

  <FormLayout  hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={t('common.payment')} verified_inputs={verified_inputs} form={form}

  topBarContent

  bottomContent={(
    <div></div>
  )}
  

  button={(
    <div className={`mt-[40px]`}>

    
    </div>
  )}
  >


  <FormCard hide={!id} items={[
    {name:'ID',value:form.id},
    {name:'Ref',value:form.ref_id},
    {name:t('common.status'),value:t('common.'+form.status)},
    {name:t('form.patient-name'),value:form?.patient?.name},
    {name:t('common.doctor'),value:form.doctor?.name},
    {name:t('common.amount'),value:form.amount}, 
    {name:t('form.consultation-id'),value:form.appointment_id}, 
    {name:t('common.created_at'),value:form.created_at?.split('T')?.[0] + " "+form.created_at?.split('T')?.[1]?.slice(0,5)}, 
  ]}/>



  </FormLayout>
  </div>

  </DefaultLayout>
      </div> 
  )
}

export default AppointmentInvoice