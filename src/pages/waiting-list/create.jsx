import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'

function Create({ShowOnlyInputs}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const data = useData()

  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const {user}=useAuth()
  const [loading,setLoading]=useState(id ? true : false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
       

  
  let required_data=[]

  useEffect(()=>{   
        if(!user) return
        setTimeout(()=>(
          data._get(required_data) 
        ),500)
  },[user,pathname])


  useEffect(()=>{
    if(!user) return
    setTimeout(()=>(
      data._get(required_data) 
    ),500)
},[user,pathname])



  let initial_form={
    most_important_benefit:[],
    biggest_healthcare_challenge:[]
  }


  const [form,setForm]=useState(initial_form)



 useEffect(()=>{
  if(!id && form.id){
    setForm(initial_form)
  }
},[pathname])


useEffect(()=>{
  let v=true
  if(
     !form.content_pt ||
     !form.title_pt ||
     !form.content_en ||
     !form.title_en ||
     !form.type){
      v=false
    }
    setValid(v)
},[form])




 useEffect(()=>{

  if(!user || !id){
      setForm(initial_form)
      return
  }

  (async()=>{

    try{

     let response=await data.makeRequest({method:'get',url:`api/waiting-list/`+id,withToken:true, error: ``},0);
     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){

      console.log(e)
   
      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/faq')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/faq')
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
  if(user?.role=="patient" || (user?.role=="manager" && !user?.data?.permissions?.app_settings?.includes('create') && !id)){
         navigate('/') 
  }
},[user])

useEffect(()=>{
  if(!user) return
  if(user?.role=="patient" || (user?.role=="manager" && !user?.data?.permissions?.app_settings?.includes('update') && id)){
         navigate('/') 
  }
},[user])

return (

<div>   

 <DefaultLayout disableUpdateButton={true} hide={ShowOnlyInputs} pageContent={{onClick:(e)=>{
      navigate('/add-faq')
     },text:t('common.add-faq')}}>

  {!itemToEditLoaded && id && <div className="mt-10">
    <DefaultFormSkeleton/>
  </div>}

  <div>

  <FormLayout  hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={t('common.waiting-list')} verified_inputs={verified_inputs} form={form}

  topBarContent

  bottomContent={(
    <div></div>
  )}
  

  button={(
     <></>
  )}
  >

                     <FormCard  items={[
                            {name:t('form.name'),value:form.name},
                            {name:'Email',value:form.email},
                            {name:t('form.contact'),value:form.contact},
                            {name:t('wl.province-or-city'),value:t('wl.'+form.province)},
                            {name:t('wl.used_telemedicine_before'),value:form.used_telemedicine_before ? t('common.'+form.used_telemedicine_before) : '-'},
                            {name:t('wl.medical_visits_per_year'),value:form.medical_visits_per_year ? t('wl.'+form.medical_visits_per_year?.replaceAll('_','-')) : '-'},
                            {name:t('wl.most_frequent_consultation'),value:form.most_frequent_consultation_input ? form.most_frequent_consultation_input :  form.most_frequent_consultation  ?  t('wl.'+form.most_frequent_consultation) : '-'},
                            {name:t('wl.willing_to_pay_online_consultation'),value:form.willing_to_pay_online_consultation  ?  t('wl.'+form.willing_to_pay_online_consultation) : ''},
                            {name:t('wl.preferred_payment_method'),value:form.preferred_payment_method_input ? form.preferred_payment_method_input : form.preferred_payment_method  ?  t('wl.'+form.preferred_payment_method) : '-'},
                            {name:t('wl.biggest_healthcare_challenge'),value:form.biggest_healthcare_challenge.filter(i=>i!="other" || !form.biggest_healthcare_challenge_input).map(i=>t('wl.'+i)).join(', ') + (form.biggest_healthcare_challenge_input ? `${form.biggest_healthcare_challenge.filter(i=>i!="other" || !form.biggest_healthcare_challenge_input).length ? ', ':''} ${form.biggest_healthcare_challenge_input}`:`${!form.biggest_healthcare_challenge.filter(i=>i!="other" || !form.biggest_healthcare_challenge_input).length ? '-':''}`)},
                            {name:t('wl.most_important_benefit'),value: form.most_important_benefit.filter(i=>i!="other" || !form.most_important_benefit_input).map(i=>t('wl.'+i)).join(', ') + (form.most_important_benefit_input ? `${form.most_important_benefit.filter(i=>i!="other" || !form.most_important_benefit_input).length ? ', ':''} ${form.most_important_benefit_input}`:`${!form.most_important_benefit.filter(i=>i!="other" || !form.most_important_benefit_input).length ? '-':''}`)},
                            {name:t('wl.join_whatsapp_group'),value:form.join_whatsapp_group_input ? form.join_whatsapp_group_input : form.join_whatsapp_group  ?  t('common.'+form.join_whatsapp_group) : '-'},
                            {name:t('wl.most_useful_feature'),value:form.most_useful_feature_input ? form.most_useful_feature_input : form.most_useful_feature  ?  t('wl.'+form.most_useful_feature) : '-'},
                            {name:t('wl.open_feedback'),value:form.open_feedback || '-'},
                         
                            
                     ]}/>        

 
  </FormLayout>
  </div>

  </DefaultLayout>
      </div> 
  )
}

export default Create