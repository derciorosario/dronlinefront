import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import Messages from '../messages/index'
import i18next, { t } from 'i18next'
import FileInput from '../../components/Inputs/file'
import PatientForm from '../../components/Patient/form'
import { useData } from '../../contexts/DataContext'
import AdditionalMessage from '../messages/additional'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import PreLoader from '../../components/Loaders/preloader'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'
import Comment from '../../components/modals/comments'
import SearchInput from '../../components/Inputs/search'

function addAppointments({ShowOnlyInputs,hideLayout,itemToShow,setItemToShow}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const fileInputRef_1 = React.useRef(null);
  const fileInputRef_2 = React.useRef(null);
  const data = useData()
  let from="appointments"

  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const {user}=useAuth()
  const [loading,setLoading]=useState(itemToShow?.action=="update" || (id && !itemToShow) ? true : false);
  const [showComment,setShowComment]=useState(false)
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [MessageBtnSee,setMessageBtnSee]=useState(null)

  let required_data=['doctors','patients']

  useEffect(()=>{
        
    if(!user) return
    setTimeout(()=>(
      data._get(required_data) 
    ),500)

},[user,pathname])

let initial_form={
    disease:'',
    date_of_leave:'',
    details:'',
    uploaded_files:[],
    comments:[]
}

const [form,setForm]=useState(initial_form)
  
  useEffect(()=>{

    let v=true

    if(
       !form.disease ||
       !form.date_of_leave
    ){
      v=false
    }

    setValid(v)
    console.log({form})
 },[form])


 useEffect(()=>{

  if(itemToShow?.action=="create" && form.id){
    setForm(initial_form)
  }

},[pathname])
 


 useEffect(()=>{
  
  if(!user || itemToShow?.action=="create"){
      return
  }
  
  (async()=>{
    try{
      let response=await data.makeRequest({method:'get',url:`api/medical-certificate/`+(itemToShow?.update_id || id),withToken:true, error: ``},0);

     setForm({...form,...response})

     setLoading(false)

     setItemToEditLoaded(true)

    }catch(e){


      toast.remove()


      if(itemToShow){
        if(e.message==404){
          toast.error(t('common.item-not-found'))
        }else if(e.message==500){
          toast.error(t('common.unexpected-error'))
        }else  if(e.message=='Failed to fetch'){
          toast.error(t('common.check-network'))
        }else{
          toast.error(t('common.unexpected-error'))
        }
  
        setItemToShow({
          ...itemToShow,
          name:itemToShow.name.replace('create','all')
        }) 
        
      }else{
        
        if(e.message==404){
          toast.error(t('common.item-not-found'))
          navigate('/medical-certificates')
        }else if(e.message==500){
          toast.error(t('common.unexpected-error'))
          navigate('/medical-certificates')
        }else  if(e.message=='Failed to fetch'){
          toast.error(t('common.check-network'))
          navigate('/medical-certificates')
        }else{
          toast.error(t('common.unexpected-error'))
          navigate('/medical-certificates')
        }

      }

      console.log(e)

      

     
  }
  
})()

},[user,pathname])



 



  async function SubmitForm(){

       setLoading(true)

    try{


      if(itemToShow?.action=="update" || (id && !itemToShow)){


        let r=await data.makeRequest({method:'post',url:`api/medical-certificate/`+(itemToShow?.update_id || id),withToken:true,data:{
          ...form
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')


      }else{

        let response=await data.makeRequest({method:'post',url:`api/medical-certificate`,withToken:true,data:{
          ...form,
          patient_id:itemToShow.appointment.patient_id,
          doctor_id:itemToShow.appointment.doctor_id,
          appointment_id:itemToShow.appointment.id,
          user_id:user.id
        }, error: ``},0);

      
  
        setForm({...initial_form})
        setMessageType('green')
        toast.success(t('messages.added-successfully'))
        setLoading(false)
       
        setVerifiedInputs([])
     
        data.handleLoaded('remove','exams')
         

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

    data.setUpdateTable(Math.random())
    
  }

  
  function handleUploadeduploaded_files(upload){

    setForm({...form,uploaded_files:form.uploaded_files.map(i=>{
        if(i.id==upload.key){
          return {...i,filename:upload.filename}
        }else{
         return i
        }
    })})

  }


  async function handleItems({status,id}){
    data._closeAllPopUps()
    toast.remove()
    toast.loading(t('common.updating'))      
  
    setLoading(true)
  
    try{
  
     await data.makeRequest({method:'post',url:`api/medical-certificates/${form.id}/status`,withToken:true,data:{
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
     <DefaultLayout hide={ShowOnlyInputs || hideLayout}>

            <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

            {message && <div className="px-[20px] mt-9" id="_register_msg">
                <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
            </div>}

            {!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow)) && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}

           <FormLayout hideInputs={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}  hide={!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow))} hideTitle={ShowOnlyInputs} title={(itemToShow?.action=="update" || (id && !itemToShow)) ? t('common.update-medical-certificate') : t('common.add-medical-certificate')} verified_inputs={verified_inputs} form={form}

            advancedActions={{hide:!form.id,id:form.id, items:[
              {hide:form.status=="approved" || !(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.medical_certificates?.includes('approve')) ),name:t('common.approve'),onClick:()=>{handleItems({status:'approved',id:form.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>)},
              {hide:form.status=="rejected" || !(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.medical_certificates?.includes('reject')) ),name:t('common.reject'),onClick:()=>{handleItems({status:'rejected',id:form.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)}
            ] }}
          
            topBarContent={
                (<button onClick={()=>setShowComment(true)} type="button" class={`text-white hidden ${user?.role=="admin" ? 'hidden':''} bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 ${!id || !itemToEditLoaded ? 'hidden':''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>
                 <span className="ml-2">Chat</span>
                 {(form.comments.length!=0 && id) && <div className="ml-2 bg-white text-honolulu_blue-500 rounded-full px-2 flex items-center justify-center">
                     {form.comments.length}
                 </div>}
              </button>)
            }

            bottomContent={(
              <div className={`mt-5 hidden ${user?.role!="doctor" ? 'hidden':''}`}>
                  <span className="flex mb-5 items-center">

                      {t('common.documents')} 
                    
                      <button onClick={()=>{
                          let id=Math.random().toString().replace('.','')
                          setForm({...form,uploaded_files:[{
                            name:'',src:'',id
                          },...form.uploaded_files]})
                          setTimeout(() => {
                             document.getElementById(id).focus()
                          }, 200);
                      }} type="button" class="text-white ml-4 bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        {t('common.add-document')}
                      </button>
                  
                  </span>
                  <div className="flex gap-x-4 flex-wrap gap-y-4 hidden">
                      
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
                                  }}   class={`bg-gray border border-gray-300  text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1`}/>
                                  
                                  <FileInput  _upload={{key:i.id,filename:i.filename}} res={handleUploadeduploaded_files} r={true}/>

                            </div>
                              
                            <span onClick={()=>{
                                setForm({...form,uploaded_files:form.uploaded_files.filter(f=>f.id!=i.id)})
                              }} className="ml-2 cursor-pointer hover:opacity-65"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
                           

                            </div>
                      ))}
                      
                  </div>
                </div>
            )}

            button={(
               <div className={`mt-[40px] ${(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient" ? 'hidden':''}   ${(user?.role=="manager" && !user?.data?.permissions?.medical_certificates?.includes('update') && id) ? 'hidden':''}`}>
                 <FormLayout.Button onClick={()=>{
                     SubmitForm()
                 }} valid={valid} loading={loading} label={(itemToShow?.action=="update" || (id && !itemToShow)) ? t('common.update') :t('common.send')}/>
               </div>
            )}
            >



                    <FormCard  hide={(itemToShow?.action!="update" && !id) || !((user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient")} items={[
                        {name:'ID',value:form.id},
                        {name:t('common.date_of_leave'),value:form.date_of_leave},
                        {name:t('common.disease'),value:form.disease},
                        {name:t('form.medical-specialty'),value:data._specialty_categories.filter(i=>i.id==form.appointment?.medical_specialty)[0]?.[`${i18next.language}_name`]},
                        {name:t('common.details'),value:form.details},
                    ]}/>
 
                 
                   <FormLayout.Input 
                    verified_inputs={verified_inputs} 
                    form={form} 
                    r={true} 
                    hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                    type={'date'}
                    onBlur={() => setVerifiedInputs([...verified_inputs, 'date_of_leave'])} 
                    label={t('common.date_of_leave')} 
                    onChange={(e) => setForm({...form, date_of_leave: e.target.value})} 
                    field={'date_of_leave'} 
                    value={form.date_of_leave}
                  />

               <FormLayout.Input 
                  verified_inputs={verified_inputs} 
                  form={form} 
                  hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'disease'])} 
                  label={t('common.disease')} 
                  onChange={(e) => setForm({...form, disease: e.target.value})} 
                  field={'disease'} 
                  value={form.disease}
                />
                 

               <FormLayout.Input 
                  verified_inputs={verified_inputs} 
                  form={form} 
                  hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                  textarea={true}
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'details'])} 
                  label={t('common.details')} 
                  onChange={(e) => setForm({...form, details: e.target.value})} 
                  field={'details'} 
                  value={form.details}
                />
              



            </FormLayout>

     </DefaultLayout>
  )
}

export default addAppointments