import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'

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
         navigate('/payment-management')
      }else  if(e.message=='Failed to fetch'){
         navigate('/payment-management')
         toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/payment-management')  
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
  let v=true
  if(
     !form.iva ||
     !form.doctor_gain_percentage ||
     !form.irpc){
      v=false
    }
    setValid(v)
},[form])





async function SubmitForm(){

  setLoading(true)

  try{

    let new_form={
      iva:parseFloat(form.iva || 0),
      irpc:parseFloat(form.irpc || 0),
      doctor_gain_percentage:parseFloat(form.doctor_gain_percentage)
    }

    if(id){

        await data.makeRequest({method:'post',url:`api/appointment-invoices/`+id,withToken:true,data:{
          ...new_form
        }, error: ``},0);
      
        toast.success(t('messages.updated-successfully'))
        setLoading(false)

    }

  }catch(e){

    if(e.message==500){
      toast.error(t('common.unexpected-error'))
    }else  if(e.message=='Failed to fetch'){
      toast.error(t('common.check-network'))
    }else{
      toast.error(t('common.unexpected-error'))
    }

     setLoading(false) 
  }
}



async function handleItems({status,id}){
  data._closeAllPopUps()
  toast.remove()
  toast.loading(t('common.updating'))      

  setLoading(true)

  try{

   await data.makeRequest({method:'post',url:`api/appointment-invoices/${id}/status`,withToken:true,data:{
     status
   }, error: ``},0);

   toast.remove()
   toast.success(t('messages.updated-successfully'))
   data.setUpdateTable(Math.random())
   setLoading(false)
   

  }catch(e){
     setLoading(false)
     toast.remove()
     if(e.message==500){
       toast.error(t('common.unexpected-error'))
     }else  if(e.message=='Failed to fetch'){
         toast.error(t('common.check-network'))
     }else{
         toast.error(t('common.unexpected-error'))
     }

  }
}






return (

<div>   

 <DefaultLayout hide={ShowOnlyInputs}>

  {!itemToEditLoaded && id && <div className="mt-10">
    <DefaultFormSkeleton/>
  </div>}


  <div>

  <FormLayout  hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={t('common.payment')} verified_inputs={verified_inputs} form={form}

  advancedActions={{hide:!id,id:form.id, items:[
    {hide:form.status=="approved" || !(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.payment_management?.includes('approve')) ),name:t('common.approve'),onClick:()=>{handleItems({status:'approved',id:form.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>)},
    {hide:form.status=="rejected" || !(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.payment_management?.includes('reject')) ),name:t('common.reject'),onClick:()=>{handleItems({status:'rejected',id:form.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)}
  ]}}

  bottomContent={(
    <div></div>
  )}
  

  button={(
   <div className={`mt-[40px] ${(user?.role=="doctor" || user?.role=="patient") ? 'hidden':''} ${(user?.role=="manager" && !user?.data?.permissions?.payment_management?.includes('update') && id) ? 'hidden':''}`}>
                <FormLayout.Button onClick={()=>{
                        SubmitForm()
                }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.send')}/>
    </div>
  )}
  >

  <FormCard hide={!id} items={[
    {name:'ID',value:form.id},
    {name:t('common.title'),value:form.type=="payment" ? t('common.consultation-payment'): t('common.consultation-refund')},
    {name:'Ref',value:`#${form.ref_id}`},
    {name:t('common.status'),value:t('common.'+form.status),color:form.status=="pending" ? '#f97316':form.status=="approved" ? '#0b76ad' : form.status=="rejected" ?  '#dc2626' : '#16a34a'},
    {name:t('form.patient-name'),value:form?.patient?.name},
    {name:t('common.doctor'),value:form.doctor?.name || t('common.dronline-team')},
    {name:t('common.consultation-price'),value:data.formatNumber(data._cn_op(form.price)),color:'#0b76ad'},
    {name:t('common.cancelation-tax'),value:data.formatNumber(data._cn_op(parseFloat(form.taxes || 0).toFixed(2))),color:'#0b76ad',hide:form.type=="payment"},
    {name:form.type=="refund" ? t('common.amount-to-refund') : t('common.amount'),value:data.formatNumber(data._cn_op(form.amount)),color:'#0b76ad'}, 
    {hide:form.type=="refund" || form.amount==0,name:t('common.view-invoice'),value:'',
      link:!form.type=="refund" ? false : '/invoice/'+form.ref_id
    },
    {name:t('form.consultation-id'),value:form.appointment_id}, 
    {name:t('form.insurance_company'),value:form.insurance_company,hide:!form.insurance_company},
    {name:t('form.policy_number'),value:form.policy_number,hide:!form.policy_number},
    {name:t('common.created_at'),value:form.created_at?.split('T')?.[0] + " "+form.created_at?.split('T')?.[1]?.slice(0,5)}, 
  ]}/>


  <FormLayout.Input hide={user?.role=="doctor" || user?.role=="patient"} r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'iva'])} label={t('common.iva-percentage')} onChange={(e)=>setForm({...form,iva:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'iva'} value={form.iva}/>
  <FormLayout.Input hide={user?.role=="doctor" || user?.role=="patient"} r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'irpc'])} label={t('common.irpc-percentage')} onChange={(e)=>setForm({...form,irpc:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'irpc'} value={form.irpc}/>
  <FormLayout.Input hide={user?.role=="doctor" || user?.role=="patient"} r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'doctor_gain_percentage'])} label={t('common.doctor_gain_percentage')} onChange={(e)=>setForm({...form,doctor_gain_percentage:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'doctor_gain_percentage'} value={form.doctor_gain_percentage}/>
                     

  </FormLayout>
  </div>

  </DefaultLayout>
      </div> 
  )
}

export default AppointmentInvoice