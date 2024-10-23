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
import Comment from '../../components/modals/comments'
import Loader from '../../components/Loaders/loader'

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



  let initial_form={
    pt_name:'',
    en_name:'',
    image_filename:'',
    description:'',
}


  const [form,setForm]=useState(initial_form)

  console.log({form})

  
  useEffect(()=>{
    let v=true

    if(
       !form.pt_name || !form.image_filename
    ){
      v=false
    }

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

     let response=await data.makeRequest({method:'get',url:`api/specialty-category/`+id,withToken:true, error: ``},0);

    
     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){
      console.log(e)

      return

      if(e.message==404){
         toast.error(t('item-not-found'))
         navigate('/specialty-categories')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('unexpected-error'))
        navigate('/appointments')  
      }
  }
  
})()
  

},[user,pathname])







  async function SubmitForm(){

       setLoading(true)


    try{


      if(id){


        let r=await data.makeRequest({method:'post',url:`api/specialty-category/`+id,withToken:true,data:{
          ...form
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')



      }else{

        let response=await data.makeRequest({method:'post',url:`api/specialty-categories/`,withToken:true,data:{
          ...form
        }, error: ``},0);

        console.log({response})
  
        setForm({...initial_form})
        setMessageType('green')
        setMessage(t('messages.added-successfully'))
        setLoading(false)
        setVerifiedInputs([])
      
    

      }
     

    }catch(e){
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

    
  function handleUploadedFiles(upload){
    setForm({...form,[upload.key]:upload.filename})
  }


  return (
     <DefaultLayout>
         
            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

            {!itemToEditLoaded && id && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}
           

           <FormLayout  title={id ? t('common.edit-category') : t('common.add-category')} verified_inputs={verified_inputs} form={form}
          
                    bottomContent={(
                        <div>

                            <div className="flex gap-x-4 flex-wrap mt-4">
                              
                                <FileInput _upload={{key:'image_filename',filename:form.image_filename}} res={handleUploadedFiles} label={t('form.image')} r={true}/>
                                <div className="w-[500px] flex items-center justify-center bg-gray-300 h-[150px] rounded-[0.3rem]">
                                    <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                                    </svg>
                                </div>
                             </div>
                            
                        </div>
                    )}

                    button={(
                    <div className={`mt-[40px] ${user?.role=="doctor" ? 'hidden':''}`}>
                        <FormLayout.Button onClick={()=>{
                            SubmitForm()
                        }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.send')}/>
                    </div>
                    )}
                    >
        
                    <FormLayout.Input 
                        verified_inputs={verified_inputs} 
                        form={form}
                        r={true}
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'pt_name'])} 
                        label={t('form.name')} 
                        onChange={(e) => setForm({...form, pt_name: e.target.value})} 
                        field={'pt_name'} 
                        value={form.pt_name}
                    />


                    <FormLayout.Input 
                        verified_inputs={verified_inputs} 
                        form={form}
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'en_name'])} 
                        label={t('form.english-name')} 
                        onChange={(e) => setForm({...form, en_name: e.target.value})} 
                        field={'en_name'} 
                        value={form.en_name}
                    />
                     <FormLayout.Input 
                        verified_inputs={verified_inputs} 
                        form={form}
                        textarea={true}
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'description'])} 
                        label={t('form.description')} 
                        onChange={(e) => setForm({...form, description: e.target.value})} 
                        field={'description'} 
                        value={form.description}
                    />


                    
                
             

               
            </FormLayout>

     </DefaultLayout>
  )
}

export default index