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

function addClinicalDiary({ShowOnlyInputs,hideLayout,appointment,itemToShow}) {

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
  const [loading,setLoading]=useState(false);
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
    "main_complaint": "",
    "current_illness_history": "",
    "past_medical_history": "",
    "psychosocial_history": "",
    "family_history": "",
    "gynecological_history": "",
    "physical_exam": "",
    "complementary_exams": "",
    "diagnoses": "",
    "therapeutic_plan": "",
    "prescribed_medications": "",
    "therapeutic_recommendations": "",
    "other_instructions": "",
    uploaded_files:[],
    comments:[]
}

  const [form,setForm]=useState(initial_form)


  
  useEffect(()=>{

    let v=true

    if(
       !form.main_complaint ||
       !form.current_illness_history
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
  
  if(!user || itemToShow.action=="create"){
      return
  }
  
  (async()=>{
    try{
      let response=await data.makeRequest({method:'get',url:`api/clinical-diary/`+itemToShow.update_id,withToken:true, error: ``},0);

     setForm({...form,...response})

     setLoading(false)

     setItemToEditLoaded(true)

    }catch(e){

      if(e.message==404){
          toast.error(t('item-not-found'))
          navigate('/appointments')
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


      if(itemToShow.action=="update"){

        let r=await data.makeRequest({method:'post',url:`api/clinical-diary/`+itemToShow.update_id,withToken:true,data:{
          ...form
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)


      }else{

        let response=await data.makeRequest({method:'post',url:`api/clinical-diary`,withToken:true,data:{
          ...form,
          patient_id:itemToShow.appointment.patient_id,
          doctor_id:itemToShow.appointment.doctor_id,
          appointment_id:itemToShow.appointment.id,
          user_id:user.id
        }, error: ``},0);
  
        setForm({...initial_form})

        setMessageType('green')
        setMessage(t('messages.added-successfully'))
        setLoading(false)
        setVerifiedInputs([])
        data.handleLoaded('remove','clinical_diary')
    }

    
      
     

    }catch(e){
      setMessageType('red')

      console.log({e})
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


  return (
     <DefaultLayout hide={ShowOnlyInputs || hideLayout}>

            <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

           {!itemToEditLoaded && itemToShow.action=="update" && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}
           

           <FormLayout hideInputs={user?.role!="doctor"}  hide={!itemToEditLoaded && itemToShow.action=="update"} hideTitle={ShowOnlyInputs} title={itemToShow.action=="update" ? t('common.update-clinical-diary') : t('menu.add-clinical-diary')} verified_inputs={verified_inputs} form={form}
          
            topBarContent={

                (<button onClick={()=>setShowComment(true)} type="button" class={`text-white ${user?.role=="admin" ? 'hidden':''} bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 ${itemToShow.action!="update" || !itemToEditLoaded ? 'hidden':''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>
                 <span className="ml-2">Chat</span>
                 {(form.comments.length!=0 && id) && <div className="ml-2 bg-white text-honolulu_blue-500 rounded-full px-2 flex items-center justify-center">
                     {form.comments.length}
                 </div>}
              </button>)

            }

            bottomContent={(
                <div className={`mt-5 ${user?.role!="doctor" ? 'hidden':''}`}>
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
               <div className={`mt-[40px] ${user?.role!="doctor" ? 'hidden':''}`}>
                 <FormLayout.Button onClick={()=>{
                     SubmitForm()
                 }} valid={valid} loading={loading} label={itemToShow.action=="update" ? t('common.update') :t('common.send')}/>
               </div>
            )}
            >

          <FormCard hide={itemToShow.action == "create"} items={[
              {name: t('form.consultation-id'), value: form.id},
              {name: t('form.main-complaint'), value: form.main_complaint},
              {name: t('form.current-illness-history'), value: form.current_illness_history},
              {name: t('form.past-medical-history'), value: form.past_medical_history},
              {name: t('form.psychosocial-history'), value: form.psychosocial_history},
              {name: t('form.family-history'), value: form.family_history},
              {name: t('form.gynecological-history'), value: form.gynecological_history},
              {name: t('form.physical-exam'), value: form.physical_exam},
              {name: t('form.complementary-exams'), value: form.complementary_exams},
              {name: t('form.diagnoses'), value: form.diagnoses},
              {name: t('form.therapeutic-plan'), value: form.therapeutic_plan},
              {name: t('form.prescribed-medications'), value: form.prescribed_medications},
              {name: t('form.therapeutic-recommendations'), value: form.therapeutic_recommendations},
              {name: t('form.other-instructions'), value: form.other_instructions},
          ]}/>
                  

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              r={true} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'main_complaint'])}  
              label={t('form.main-complaint')}  
              onChange={(e) => setForm({...form, main_complaint: e.target.value})} 
              field={'main_complaint'}  
              value={form.main_complaint} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              r={true} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'current_illness_history'])}  
              label={t('form.current-illness-history')}  
              onChange={(e) => setForm({...form, current_illness_history: e.target.value})} 
              field={'current_illness_history'}  
              value={form.current_illness_history} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'past_medical_history'])}  
              label={t('form.past-medical-history')}  
              onChange={(e) => setForm({...form, past_medical_history: e.target.value})} 
              field={'past_medical_history'}  
              value={form.past_medical_history} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'psychosocial_history'])}  
              label={t('form.psychosocial-history')}  
              onChange={(e) => setForm({...form, psychosocial_history: e.target.value})} 
              field={'psychosocial_history'}  
              value={form.psychosocial_history} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'family_history'])}  
              label={t('form.family-history')}  
              onChange={(e) => setForm({...form, family_history: e.target.value})} 
              field={'family_history'}  
              value={form.family_history} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'gynecological_history'])}  
              label={t('form.gynecological-history')}  
              onChange={(e) => setForm({...form, gynecological_history: e.target.value})} 
              field={'gynecological_history'}  
              value={form.gynecological_history} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'physical_exam'])}  
              label={t('form.physical-exam')}  
              onChange={(e) => setForm({...form, physical_exam: e.target.value})} 
              field={'physical_exam'}  
              value={form.physical_exam} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'complementary_exams'])}  
              label={t('form.complementary-exams')}  
              onChange={(e) => setForm({...form, complementary_exams: e.target.value})} 
              field={'complementary_exams'}  
              value={form.complementary_exams} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'diagnoses'])}  
              label={t('form.diagnoses')}  
              onChange={(e) => setForm({...form, diagnoses: e.target.value})} 
              field={'diagnoses'}  
              value={form.diagnoses} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'therapeutic_plan'])}  
              label={t('form.therapeutic-plan')}  
              onChange={(e) => setForm({...form, therapeutic_plan: e.target.value})} 
              field={'therapeutic_plan'}  
              value={form.therapeutic_plan} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'prescribed_medications'])}  
              label={t('form.prescribed-medications')}  
              onChange={(e) => setForm({...form, prescribed_medications: e.target.value})} 
              field={'prescribed_medications'}  
              value={form.prescribed_medications} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'therapeutic_recommendations'])}  
              label={t('form.therapeutic-recommendations')}  
              onChange={(e) => setForm({...form, therapeutic_recommendations: e.target.value})} 
              field={'therapeutic_recommendations'}  
              value={form.therapeutic_recommendations} 
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              textarea={true}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'other_instructions'])}  
              label={t('form.other-instructions')}  
              onChange={(e) => setForm({...form, other_instructions: e.target.value})} 
              field={'other_instructions'}  
              value={form.other_instructions} 
            />




            </FormLayout>

     </DefaultLayout>
  )
}

export default addClinicalDiary