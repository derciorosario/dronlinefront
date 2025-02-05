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
import SelectExams from '../../components/modals/select-exams'
import AddStampAndSignature from '../../components/PopUp/add-stamp-and-signature'
import SinglePrint from '../../components/Print/single'

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
  const {user,setUser}=useAuth()
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
    "clinical_information": "",
    "requested_exams": "",
    "results_report":"",
    "requested_at":"",
    uploaded_files:[],
    comments:[],
    exam_items:[]
}

const [form,setForm]=useState(initial_form)
  
  useEffect(()=>{

    let v=true

    if(
       !form.requested_at ||
       !form.exam_items.length ||
       !form.clinical_information  
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
      let response=await data.makeRequest({method:'get',url:`api/exam/`+(itemToShow?.update_id || id),withToken:true, error: ``},0);

     setForm({...form,...response})

     setLoading(false)

     setItemToEditLoaded(true)

    }catch(e){


      if(e.message==404){
       toast.error(t('common.item-not-found'))
       if(!itemToShow) navigate('/dashboard')
      }else if(e.message==500){
        toast.error(t('common.unexpected-error'))
        if(!itemToShow) navigate('/dashboard')
      }else  if(e.message=='Failed to fetch'){
        toast.error(t('common.check-network'))
        if(!itemToShow)  navigate('/dashboard')
      }else{
        toast.error(t('common.unexpected-error'))
        if(!itemToShow)  navigate('/dashboard')
      }

      if(itemToShow){
        setItemToShow({
          ...itemToShow,
          name:itemToShow.name.replace('create','all')
        })
      }

  }
  
})()

},[user,pathname])



 



  async function SubmitForm(){
       setLoading(true)

    try{


      if(form.uploaded_files.some(i=>i.filename && !i.name)){
            toast.error(t('common.add-document-name'))
            setLoading(false)
            return
      }


      if(itemToShow?.action=="update" || (id && !itemToShow)){

        let r=await data.makeRequest({method:'post',url:`api/exam/`+(itemToShow?.update_id || id),withToken:true,data:{
          ...form,
          uploaded_files:form.uploaded_files.filter(i=>i.filename)
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')

        if(form.save_signatures_in_profile){
          setUser({...user,
            data:{...user.data,
                    signature_filename:form.signature_filename,
                    stamp_filename:form.stamp_filename
            }
          })
        }


      }else{

        await data.makeRequest({method:'post',url:`api/exam`,withToken:true,data:{
          ...form,
          uploaded_files:form.uploaded_files.filter(i=>i.filename),
          patient_id:itemToShow.appointment.patient_id,
          doctor_id:itemToShow.appointment.doctor_id,
          appointment_id:itemToShow.appointment.id,
          user_id:user?.id
        }, error: ``},0);


        if(form.save_signatures_in_profile){
          setUser({...user,
            data:{...user.data,
                    signature_filename:form.signature_filename,
                    stamp_filename:form.stamp_filename
            }
          })
        }

  
        setForm({...initial_form})
        setMessageType('green')
        toast.success(t('messages.added-successfully'))
        setLoading(false)
       
        setVerifiedInputs([])
     
        data.handleLoaded('remove','exams')
         

      }
     

    }catch(e){

      console.log({e})

      if(e.message==404){
        toast.error(t('common.item-not-found'))
      }else if(e.message==500){
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

  const [showExamsDialog,setShowExamsDialog]=useState(false)
  const [showSignatureDialog,setShowSignatureDialog]=useState(false)
  

  return (

       <>

        {!itemToShow && <div className=" absolute left-0 top-0 w-full">
                      <SinglePrint item={data.singlePrintContent} setItem={data.setSinglePrintContent}/>
       </div>}
              
      <DefaultLayout hide={ShowOnlyInputs || hideLayout}>

            <AddStampAndSignature
            itemToShow={itemToShow}
            SubmitForm={SubmitForm}
            show={showSignatureDialog} setShow={setShowSignatureDialog}
            loading={loading} setLoading={true}
            form={form} setForm={setForm}/>
      
           <SelectExams show={showExamsDialog} setShow={setShowExamsDialog} form={form} setForm={setForm}/>

           <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

           {message && <div className="px-[20px] mt-9" id="_register_msg">
             <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
          </div>}

           {!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow)) && <div className="mt-10">
             <DefaultFormSkeleton/>
           </div>}
           
          

          <FormLayout  hideInputs={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}  hide={!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow))} hideTitle={ShowOnlyInputs} title={user?.role=="patient" && !itemToShow ? t('common.exam') : (itemToShow?.action=="update" || (id && !itemToShow)) ? t('common.update-exams') : t('common.add-exam')} verified_inputs={verified_inputs} form={form}
         
           topBarContent={
               (<div className="flex items-center">
               
            

                  {(id && !itemToShow) && <div onClick={()=>{
                         navigate('/appointment/'+form.appointment_id)            
                 }} className="text-white border border-honolulu_blue-200 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 cursor-pointer hover:opacity-85 active:opacity-65 mr-4">
                              <span className="text-honolulu_blue-500 font-medium mr-1">{t('common.see-consultation')}</span>
                    </div>}
                  
                  {(id && !itemToShow && user?.role=="patient")  && <button onClick={()=>{


                        data.setSinglePrintContent({
                          patient: form?.patient,
                          doctor:form?.doctor,
                          title: t('menu.exam-request'),
                          from:'exam-request',
                          i:form,
                          appointment:form?.appointment,
                        })

                    
                  }} type="button" class={`text-white  bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 ${!id || !itemToEditLoaded ? 'hidden':''}`}>
                      <svg  className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
                      <span className="ml-2">{t('invoice.print')}</span>
                  </button>}
              
               </div>)
           }

           bottomContent={(
             <div className={`mt-5`}>
                 <span className="flex mb-5 items-center">
                     {t('common.documents')} <label className="text-gray-400 text-[0.9rem] ml-2">({t('common.optional')} )</label> 
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

                         <div key={i.id} className="flex items-center">
                           
                           <div>
                           <input id={i.id} style={{borderBottom:'0'}} value={i.name} placeholder={t('common.document-name')} onChange={(e)=>{
                                setForm({...form,uploaded_files:form.uploaded_files.map(f=>{
                                   if(f.id==i.id){
                                     return {...f,name:e.target.value}
                                   }else{
                                     return f
                                   }
                                })})
                           }}   class={`bg-gray border  border-gray-300  text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1`}/>
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

              <div className={`mt-[40px] ${(user?.role!="doctor" && user?.role!="patient" && itemToShow?.appointment?.doctor_id)  ? 'hidden':''}`}>
                 {((!user?.data?.signature_filename || !user?.data?.stamp_filename) && (itemToShow?.action=="update" || (id && !itemToShow)) && user?.role!="patient") && <div className="w-full mb-6">
                   <button onClick={()=>{
                      setShowSignatureDialog(true)
                   }} className="flex items-center">
                      <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={'#5f6368'}><path d="M563-491q73-54 114-118.5T718-738q0-32-10.5-47T679-800q-47 0-83 79.5T560-541q0 14 .5 26.5T563-491ZM120-120v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80ZM136-280l-56-56 64-64-64-64 56-56 64 64 64-64 56 56-64 64 64 64-56 56-64-64-64 64Zm482-40q-30 0-55-11.5T520-369q-25 14-51.5 25T414-322l-28-75q28-10 53.5-21.5T489-443q-5-22-7.5-48t-2.5-56q0-144 57-238.5T679-880q52 0 85 38.5T797-734q0 86-54.5 170T591-413q7 7 14.5 10.5T621-399q26 0 60.5-33t62.5-87l73 34q-7 17-11 41t1 42q10-5 23.5-17t27.5-30l63 49q-26 36-60 58t-63 22q-21 0-37.5-12.5T733-371q-28 25-57 38t-58 13Z"/></svg>
                      <span className="text-honolulu_blue-300 underline cursor-pointer">{t('common.update-signature-and-stamp')}</span> 
                   </button>
                </div>}
                <FormLayout.Button onClick={()=>{

                    if(user?.role!="patient" && (!user?.data?.signature_filename || !user?.data?.stamp_filename) && (!form.signature_filename || !form.stamp_filename)){
                      setShowSignatureDialog(true)
                    }else{
                      SubmitForm()
                    }
                   
                }} valid={valid} loading={loading} label={(itemToShow?.action=="update" || (id && !itemToShow)) ? t('common.update') :t('common.send')}/>
              </div>

           )}
           >

           <FormCard  hide={(itemToShow?.action!="update" && !id) || !((user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient")} items={[
               {name:'ID',value:form.id},
               {name:t('form.requested-on'),value:form.requested_at},
               {name:t('form.requested-exams'),value:form.exam_items.map(i=>`${i.name} ${i.is_urgent ? `(${t('common.urgent')})` : ''}`).join(', ')},
               {name:t('form.clinical-information'),value:form.clinical_information},
               {name:t('form.results-report'),value:form.results_report},
            ]}/>

                 <FormLayout.Input 
                   verified_inputs={verified_inputs} 
                   form={form} 
                   r={true} 
                   hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                   type={'date'}
                   onBlur={() => setVerifiedInputs([...verified_inputs, 'requested-on'])} 
                   label={t('form.requested-on')} 
                   onChange={(e) => setForm({...form, requested_at: e.target.value})} 
                   field={'requested_at'} 
                   value={form.requested_at}
                 />

                 <FormLayout.Input 
                 verified_inputs={verified_inputs} 
                 form={form} 
                 r={true} 
                 hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                 textarea={true}
                 onBlur={() => setVerifiedInputs([...verified_inputs, 'clinical_information'])} 
                 label={t('form.clinical-information')} 
                 onChange={(e) => setForm({...form, clinical_information: e.target.value})} 
                 field={'clinical_information'} 
                 value={form.clinical_information}
               />


               <div className={`w-full mt-4 ${((user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient") ? 'hidden':''}`}>
                  <div className="flex items-center mb-1">
                     <label  class="flex items-center mb-2 text-sm  text-gray-900">{t('form.requested-exams')} <span className="text-red-500">*</span></label>
                     <span onClick={()=>{
                        setShowExamsDialog(true)
                     }} className="bg-honolulu_blue-400 cursor-pointer ml-10 text-white px-2 py-[2px] rounded-full text-[0.9rem]">{t('common.select-from-list')}</span>
                  </div>
                  <div className="flex flex-col w-[400px] mb-1">

                     <input placeholder={t('common.write-exam-name')} value={form.new_editing_exam_item} onChange={(e)=>{
                         setForm({...form,new_editing_exam_item:e.target.value})
                     }} class={`bg-gray border border-gray-300  text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block  p-2`}/>
                     <button onClick={()=>{
                          
                          if(!(form.exam_items.some(g=>g.name.toLowerCase()==form.new_editing_exam_item.toLowerCase()))){
                            setForm({...form,new_editing_exam_item:'',exam_items:[...form.exam_items,{name:form.new_editing_exam_item,is_urgent:false}]})
                          }else{
                            setForm({...form,new_editing_exam_item:''})
                          }
                   }} type="button" class={`text-white mb-1 w-full ${form.new_editing_exam_item ? 'bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4' : 'bg-gray-300 pointer-events-none'} focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-b-[0.3rem] text-sm px-5 py-1 text-center inline-flex justify-center items-center`}>
                       <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                    </button>
                  </div>

                  <div className="flex items-center">

                     <div class={`bg-gray border flex  flex-wrap border-gray-300 text-gray-900 text-sm  rounded-[0.3rem]  w-[400px] max-md:w-auto max-md:flex-1 px-1.5 py-1`}>
                         {form.exam_items.length==0 && <span className="py-1">{t('common.none-added')}</span>}
                         {form.exam_items.map(i=>(
                             <div className="bg-gray-200 rounded-[0.3rem] my-[1px] px-2 py-1 inline-flex items-center mr-1">
                              <span className="text-[14px]">{i.name}</span>
                              
                                <div  onClick={() => {
                                   setForm({...form,exam_items:form.exam_items.filter(g=>g.name!=i.name)})
                                }}
                                
                                className={` ml-1 cursor-pointer rounded-[0.3rem] hover:opacity-40  flex items-center justify-center`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                </div>
                            </div>
                         ))}
                     </div>

                   </div>
               </div>

              

              <div className={`w-full mt-5 ${((user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient") ? 'hidden':''}`}>

                  <label class="flex items-center mb-2 text-sm  text-gray-900">{t('common.mark-urgent-exams')} <span className="text-gray-500 ml-1">{`(${t('common.optional')})`.toLowerCase()}</span></label>
                  <ul class="space-y-2 text-sm" aria-labelledby="dropdownDefault">
                    {form.exam_items.map((f,_f)=>(
                        <li onClick={()=>{
                           
              
                            setForm({...form,exam_items:form.exam_items.map(g=>{
                                   if(f.name==g.name){
                                      return {...g,is_urgent:!g.is_urgent}
                                   }else{
                                      return g
                                   }
                            })})
                        }} class="flex items-center cursor-pointer">
                            <input  checked={f.is_urgent} type="checkbox" value=""
                            class="w-4 h-4 bg-gray-100 cursor-pointer border-gray-300 rounded text-primary-600 focus:ring-primary-500  focus:ring-2" />

                            <label  class="ml-2 text-sm font-medium text-gray-900">
                                {f.name}
                            </label>
                      </li>
                    ))}
                  </ul>
                       
                  {form.exam_items.length==0 && <span className="text-gray-600 text-[0.9rem] italic">{t('common.select-exams-to-define-urgent-exams')}</span>}

              </div>

              <FormLayout.Input 
                 verified_inputs={verified_inputs} 
                 form={form} 
                 hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                 textarea={true}
                 onBlur={() => setVerifiedInputs([...verified_inputs, 'results_report'])} 
                 label={t('form.results-report')} 
                 onChange={(e) => setForm({...form, results_report: e.target.value})} 
                 field={'results_report'} 
                 value={form.results_report}
               />


               
           </FormLayout>

    </DefaultLayout>
       
       </>
  )
}

export default addAppointments