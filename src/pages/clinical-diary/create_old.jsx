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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import PreLoader from '../../components/Loaders/preloader'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'
import Comment from '../../components/modals/comments'
import SearchInput from '../../components/Inputs/search'

function addClinicalDiary({ShowOnlyInputs,hideLayout}) {

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
  const [loading,setLoading]=useState(id ? true : false);
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
    "clinical_observations": "",
    "therapeutic_prescriptions": "",
    "diet": "",
    "clinical_diary_id":"",
    uploaded_files:[],
    comments:[]
}

  const [form,setForm]=useState(initial_form)


  
  useEffect(()=>{

    let v=true

    if(
       !form.diet ||
       !form.therapeutic_prescriptions ||
       !form.clinical_observations 
    ){
      v=false
    }

    setValid(v)
    console.log({form})
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
      let response=await data.makeRequest({method:'get',url:`api/appointments/`+id,withToken:true, error: ``},0);

     setForm({...form,...response})

     setLoading(false)

     setItemToEditLoaded(true)

    }catch(e){

      console.log(error)

      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/appointments')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/appointments')  
      }

     
  }
  
})()

},[user,pathname])



 



  async function SubmitForm(){
       setLoading(true)

    try{


      if(id){


        let r=await data.makeRequest({method:'post',url:`api/appointments/`+id,withToken:true,data:{
          ...form
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')


      }else{

        let response=await data.makeRequest({method:'post',url:`api/appointments`,withToken:true,data:{
          ...form
        }, error: ``},0);
  
        setForm({...initial_form})
        setMessageType('green')
        setMessage(t('messages.added-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')
        setVerifiedInputs([])
        setMessageBtnSee({onClick:()=>{
                navigate('/appointment/'+response.id)
                setItemToEditLoaded(false)
                setMessage('')
                if(document.querySelector('#center-content')) {
                  document.querySelector('#center-content').scrollTop=0
                }
        }})

        data.handleLoaded('remove','appointments')
         

      }
     

    }catch(e){
      setMessageType('red')
      data._scrollToSection('_register_msg')
      if(e.message==401){
        setMessage(t('common.email-exists'))
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

  
  function handleUploadeduploaded_files(upload){

    setForm({...form,uploaded_files:form.uploaded_files.map(i=>{
        if(i.id==upload.key){
          return {...i,filename:upload.filename}
        }else{
         return i
        }
    })})

  }


  function setPatientId(id){
    setForm({...form,patient_id:id})
  }

  return (
     <DefaultLayout hide={ShowOnlyInputs || hideLayout}>

      

            <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

           {!itemToEditLoaded && id && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}
           

           <FormLayout hideInputs={user?.role=="admin"}  hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={id ? t('common.update-clinical-diary') : t('menu.add-clinical-diary')} verified_inputs={verified_inputs} form={form}
          
            topBarContent={
                (<button onClick={()=>setShowComment(true)} type="button" class={`text-white ${user?.role=="admin" ? 'hidden':''} bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 ${!id || !itemToEditLoaded ? 'hidden':''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>
                 <span className="ml-2">{t('common.comments')}</span>
                 {(form.comments.length!=0 && id) && <div className="ml-2 bg-white text-honolulu_blue-500 rounded-full px-2 flex items-center justify-center">
                     {form.comments.length}
                 </div>}
              </button>)
            }

            bottomContent={(
                <div className="mt-5">
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
               <div className={`mt-[40px] ${user?.role=="admin" ? 'hidden':''}`}>
                 <FormLayout.Button onClick={()=>{
                     SubmitForm()
                 }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.send')}/>
               </div>
            )}
            >

            <FormCard hide={!id} items={[
                {name:t('form.consultation-id'),value:id ? form.id : '-'},
             ]}/>
 
                  {/*<SearchInput r={true} label={t('form.patient-name')} loaded={data._loaded.includes('patients')} res={setPatientId} items={data._patients} />*/}



                  <FormLayout.Input 
                    verified_inputs={verified_inputs} 
                    form={form} 
                    r={true} 
                    onBlur={() => setVerifiedInputs([...verified_inputs, 'clinical_diary_id'])} 
                    label={t('ID')} 
                    onChange={(e) => setForm({...form, clinical_diary_id: e.target.value})} 
                    field={'clinical_diary_id'} 
                    value={form.nid}
                  />

               

                  <FormLayout.Input 
                  verified_inputs={verified_inputs} 
                  form={form} 
                  r={true} 
                  textarea={true}
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'diet'])} 
                  label={t('form.diet')} 
                  onChange={(e) => setForm({...form, diet: e.target.value})} 
                  field={'diet'} 
                  value={form.diet}
                />

                <FormLayout.Input 
                  verified_inputs={verified_inputs} 
                  form={form} 
                  r={true} 
                  textarea={true}
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'therapeutic-prescriptions'])} 
                  label={t('form.therapeutic-prescriptions')} 
                  onChange={(e) => setForm({...form, therapeutic_prescriptions: e.target.value})} 
                  field={'therapeutic_prescriptions'} 
                  value={form.therapeutic_prescriptions}
                />

               <FormLayout.Input 
                  verified_inputs={verified_inputs} 
                  form={form} 
                  r={true} 
                  textarea={true}
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'clinical-observations'])} 
                  label={t('form.clinical-observations')} 
                  onChange={(e) => setForm({...form, clinical_observations: e.target.value})} 
                  field={'clinical_observations'} 
                  value={form.clinical_observations}
                />
              



            </FormLayout>

     </DefaultLayout>
  )
}

export default addClinicalDiary