import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import FileInput from '../../components/Inputs/file'
import { useData } from '../../contexts/DataContext'
import AdditionalMessage from '../messages/additional'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'
import MARIAMessages from '../../components/Chatbot/ai-messages'

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
   messages:[]
}

  const [form,setForm]=useState(initial_form)

  console.log({form})


 useEffect(()=>{

  if(!id && form.id){
    setForm(initial_form)
  }

},[pathname])
 

 useEffect(()=>{

    
  
  if(!user || !id){
    setForm(initial_form)
      return
  }
  
  (async()=>{
    try{

     let response=await data.makeRequest({method:'get',url:`api/maria-conversation/`+id,withToken:true, error: ``},0);

    
     setForm({...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){
      console.log(e)

      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/specialty-categories')
      }else  if(e.message=='Failed to fetch'){
        navigate('/specialty-categories')
        toast.error(t('common.check-network'))
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/appointments')  
      }
  }
  
})()
  

},[user,pathname])






function getMessageContent(content){
    try{
       content=JSON.parse(content)
    }catch(e){

    }
    if(content?.type){
         return {...content,data:content}
    }else{
         return {}
    }
   
}


    
 

  useEffect(()=>{
    if(!user) return
    if(user?.role=="patient"){
           navigate('/') 
    }
  },[user])



  return (
     <DefaultLayout disableUpdateButton={true}>
         
            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

            {!itemToEditLoaded && id && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}
           

           <FormLayout  hide={!itemToEditLoaded && id} title={t('common.maria-messages')} verified_inputs={verified_inputs} form={form}
          
                    bottomContent={(
                        <div>

                            
                            
                        </div>
                    )}

                  
                    >

             <FormCard items={[
              {name:'ID',value:form.id},
              {name:t('form.full-name'),value:form.user?.name || '-'},
              {name:t('common.type'),value:form.patientId ? t('common.patient') : form.doctorId ? t('common.doctor') : form.userId ? t('common.manager') : t('common.guest')},
              {name:t('common.created_at'),value:data._c_date(form.created_at)?.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(form?.created_at)?.split('T')?.[1].slice(0,5)}
            ]}/>

            <h3 className="mt-5"></h3>
            <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4 scroll-smooth">
            <MARIAMessages messages={form.messages.filter((i,_i)=>_i >= 1 && i.content).map(i=>({
                    ...i,
                    sender:i.role=="user" ? 'user' : "bot",
                    status:'sent',
                    text:i.content,
                    ...getMessageContent(i.content),
                    time:i.created_at.split('T')[1].slice(0,5),
                    timestamp:i.created_at
                }))}/>
            </div>
           
                       

                    
                
             

               
            </FormLayout>

     </DefaultLayout>
  )
}

export default index