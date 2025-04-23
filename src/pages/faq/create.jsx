import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'

function CreateFaq({ShowOnlyInputs}) {

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
    created_at:'',
    content_en:'',
    content_pt:'',
    type:'general',
    title_pt:'',
    title_en:''
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

     let response=await data.makeRequest({method:'get',url:`api/faq/`+id,withToken:true, error: ``},0);
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




async function SubmitForm(){

  setLoading(true)

  try{

    if(id){
        await data.makeRequest({method:'post',url:`api/faq/`+id,withToken:true,data:{
          ...form
        }, error: ``},0);
      
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
    }else{
      await data.makeRequest({method:'post',url:`api/faq`,withToken:true,data:{
        ...form
      }, error: ``},0)

      setForm({...initial_form})
      toast.success(t('messages.added-successfully'))
      setLoading(false)
      setVerifiedInputs([])
      data.handleLoaded('remove','faqs')
    }

  }catch(e){

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

useEffect(()=>{

    if(!user) return
    if((user?.role=="patient" || user?.role=="doctor") || (user?.role=="manager" && !user?.data?.permissions?.app_settings?.includes('create') && !id)){
          navigate('/') 
    }

},[user])

useEffect(()=>{
    if(!user) return
    if((user?.role=="patient" || user?.role=="doctor") || (user?.role=="manager" && !user?.data?.permissions?.app_settings?.includes('update') && id)){
          navigate('/') 
    }
},[user])


return (
<div>   

 <DefaultLayout disableUpdateButton={true} hide={ShowOnlyInputs} pageContent={{btn:!((user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.app_settings?.includes('create'))) && id) ? null : {onClick:(e)=>{
      navigate('/add-faq')
     },text:t('common.add-faq')}}}>

  {!itemToEditLoaded && id && <div className="mt-10">
    <DefaultFormSkeleton/>
  </div>}

  <div>

  <FormLayout  hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={'FAQ'} verified_inputs={verified_inputs} form={form}

  topBarContent

  bottomContent={(
    <div></div>
  )}
  

  button={(
    <div className={`mt-[40px] ${(user?.role=="manager" && !user?.data?.permissions?.app_settings?.includes('update') && id) ? 'hidden':''}`}>
             <FormLayout.Button onClick={()=>{
                     SubmitForm()
                 }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.send')}/>
    </div>
  )}
  >

  <FormLayout.Input verified_inputs={verified_inputs} form={form} selectOptions={

                  [
                    { "name": t('common.general'), "value": "general" },
                    { "name": t('common.consultations'), "value": "consultations" },
                   // { "name": t('common.about-us'), "value": "about-us" },
                    { "name": t('common._support'), "value": "support" },
                    { "name": t('common.our-services'), "value": "our-services" } 
                  ]

  } r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'type'])} label={t('common.section')} onChange={(e)=>setForm({...form,type:e.target.value})} field={'type'} value={form.type}/>
                  

 <FormLayout.Input 
    verified_inputs={verified_inputs} 
    form={form} 
    r={true} 
    textarea={true}
    onBlur={() => setVerifiedInputs([...verified_inputs, 'title_pt'])} 
    label={t('common.title') +" (pt)"} 
    onChange={(e) => setForm({...form, title_pt: e.target.value})} 
    field={'title'} 
    value={form.title_pt}
  />

  <FormLayout.Input 
    verified_inputs={verified_inputs} 
    form={form} 
    r={true} 
    textarea={true}
    onBlur={() => setVerifiedInputs([...verified_inputs, 'title_en'])} 
    label={t('common.title') +" (en)"} 
    onChange={(e) => setForm({...form, title_en: e.target.value})} 
    field={'title'} 
    value={form.title_en}
  />


  <FormLayout.Input 
    verified_inputs={verified_inputs} 
    form={form} 
    r={true} 
    textarea={true}
    onBlur={() => setVerifiedInputs([...verified_inputs, 'content_pt'])} 
    label={t('common.content') + " (pt)"} 
    onChange={(e) => setForm({...form, content_pt: e.target.value})} 
    field={'content_pt'} 
    value={form.content_pt}
  />


  <FormLayout.Input 
    verified_inputs={verified_inputs} 
    form={form} 
    r={true} 
    textarea={true}
    onBlur={() => setVerifiedInputs([...verified_inputs, 'content_en'])} 
    label={t('common.content') + " (en)"} 
    onChange={(e) => setForm({...form, content_en: e.target.value})} 
    field={'content_en'} 
    value={form.content_en}
  />
 
  </FormLayout>
  </div>

  </DefaultLayout>
      </div> 
  )
}

export default CreateFaq