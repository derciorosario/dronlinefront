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
    disease:'',
    date_of_leave:'',
    details:'',
    activity:'',
    expiration_period:'',
    uploaded_files:[],
    comments:[]
}

const [form,setForm]=useState(initial_form)
  
  useEffect(()=>{
    let v=true
    if(
       !form.date_of_leave ||
       !form.activity
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

       if(form.uploaded_files.some(i=>i.filename && !i.name)){
        toast.error(t('common.add-document-name'))
        setLoading(false)
        return
       }

    try{


      if(itemToShow?.action=="update" || (id && !itemToShow)){


        let r=await data.makeRequest({method:'post',url:`api/medical-certificate/`+(itemToShow?.update_id || id),withToken:true,data:{
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

        await data.makeRequest({method:'post',url:`api/medical-certificate`,withToken:true,data:{
          ...form,
          patient_id:itemToShow.appointment.patient_id,
          doctor_id:itemToShow.appointment.doctor_id,
          appointment_id:itemToShow.appointment.id,
          user_id:user.id,
          uploaded_files:form.uploaded_files.filter(i=>i.filename)
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
        form={form} setForm={setForm}
      />

      <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

      {message && <div className="px-[20px] mt-9" id="_register_msg">
          <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
      </div>}

      {!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow)) && <div className="mt-10">
        <DefaultFormSkeleton/>
      </div>}

      <FormLayout hideInputs={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}  hide={!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow))} hideTitle={ShowOnlyInputs} title={user?.role=="patient" && !itemToShow ? t('common.medical-certificate') : (itemToShow?.action=="update" || (id && !itemToShow)) ? t('common.update-medical-certificate') : t('common.add-medical-certificate')} verified_inputs={verified_inputs} form={form}
      
      bottomContent={(
        <div className="w-full">

           <div className={`mt-5 ${user?.role=="patient" && form.uploaded_files.length==0 ? 'hidden':''}`}>
            <span className="flex mb-5 items-center">
                {t('common.documents')} <label className="text-gray-400 text-[0.9rem] ml-2">({t('common.optional')} )</label>
                {user?.role!="patient" && <button onClick={()=>{
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
                </button>}
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
                      }}   class={`bg-gray ${user?.role=="patient" ? ' pointer-events-none':'border'}  border-gray-300  text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1`}/>
                      <FileInput cannotRemove={user?.role=="patient"} cannotUpload={user?.role=="patient"}  _upload={{key:i.id,filename:i.filename}} res={handleUploadeduploaded_files} r={true}/>
                      </div>
                        
                      {user?.role!="patient" && <span onClick={()=>{
                          setForm({...form,uploaded_files:form.uploaded_files.filter(f=>f.id!=i.id)})
                        }} className="ml-2 cursor-pointer hover:opacity-65"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
                    }

                      </div>
                ))}
                
            </div> 
          </div>
          </div>
      )}

      advancedActions={{hide:!form.id,id:form.id, items:[
        {hide:form.status=="approved" || !(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.medical_certificates?.includes('approve')) ),name:t('common.approve'),onClick:()=>{handleItems({status:'approved',id:form.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>)},
        {hide:form.status=="rejected" || !(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.medical_certificates?.includes('reject')) ),name:t('common.reject'),onClick:()=>{handleItems({status:'rejected',id:form.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)}
      ]}}

      topBarContent={
          (<div className="flex items-center">
                          {(id && !itemToShow)  && <div onClick={()=>{
                                  navigate('/appointment/'+form.appointment_id)            
                          }} className="text-white border border-honolulu_blue-200 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 cursor-pointer hover:opacity-85 active:opacity-65 mr-4">
                                      <span className="text-honolulu_blue-500 font-medium mr-1">{t('common.see-consultation')}</span>
                            </div>}
                          
                          {(id && !itemToShow && user?.role=="patient") &&  <button onClick={()=>{
                               
                               data.setSinglePrintContent({
                                  patient: form?.patient,
                                  doctor:form?.doctor,
                                  title: t('menu.medical-certificate'),
                                  from:'medical-certificate',
                                  i:form,
                                  appointment:form?.appointment,
                                  content: [
                                    [
                                     {...form,disease:form.disease,date_of_leave:form.date_of_leave,medical_specialty:data._specialty_categories.filter(f=>f.id==form.appointment.medical_specialty)[0]?.[`${i18next.language}_name`]},
                                    ]
                                  ]
                                })

                          }} type="button" class={`text-white  bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 ${!id || !itemToEditLoaded ? 'hidden':''}`}>
                              <svg  className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
                              <span className="ml-2">{t('invoice.print')}</span>
                          </button>}
                        
                        </div>)
      }

   

      button={(
        <div className={`mt-[40px] ${(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient" ? 'hidden':''}   ${(user?.role=="manager" && !user?.data?.permissions?.medical_certificates?.includes('update') && id) ? 'hidden':''}`}> 
          {((!user?.data?.signature_filename || !user?.data?.stamp_filename) && (itemToShow?.action=="update" || (id && !itemToShow))) && <div className="w-full mb-6">
                            <button onClick={()=>{
                                setShowSignatureDialog(true)
                            }} className="flex items-center">
                                <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={'#5f6368'}><path d="M563-491q73-54 114-118.5T718-738q0-32-10.5-47T679-800q-47 0-83 79.5T560-541q0 14 .5 26.5T563-491ZM120-120v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80ZM136-280l-56-56 64-64-64-64 56-56 64 64 64-64 56 56-64 64 64 64-56 56-64-64-64 64Zm482-40q-30 0-55-11.5T520-369q-25 14-51.5 25T414-322l-28-75q28-10 53.5-21.5T489-443q-5-22-7.5-48t-2.5-56q0-144 57-238.5T679-880q52 0 85 38.5T797-734q0 86-54.5 170T591-413q7 7 14.5 10.5T621-399q26 0 60.5-33t62.5-87l73 34q-7 17-11 41t1 42q10-5 23.5-17t27.5-30l63 49q-26 36-60 58t-63 22q-21 0-37.5-12.5T733-371q-28 25-57 38t-58 13Z"/></svg>
                                <span className="text-honolulu_blue-300 underline cursor-pointer">{t('common.update-signature-and-stamp')}</span> 
                            </button>
            </div>}

          <FormLayout.Button onClick={()=>{
              if((!user?.data?.signature_filename || !user?.data?.stamp_filename) && (!form.signature_filename || !form.stamp_filename)){
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
          {name:t('common.date_of_leave'),value:form.date_of_leave},
          {name:t('common.disease'),value:form.disease},
          {name:t('form.medical-specialty'),value:data._specialty_categories.filter(i=>i.id==form.appointment?.medical_specialty)[0]?.[`${i18next.language}_name`]},
           {name:t('common.created_at'),value:`${form.created_at?.split('T')?.[0]} ${form.created_at?.split('T')?.[1]?.slice(0,5)}`},
      ]}/>

      <FormCard  hide={user?.role=="patient" || !form.id} items={[
          {name:'ID',value:form.id},
          {name:t('common.doctor'),hide:user?.role=="doctor",value:form.doctor?.name || itemToShow?.appointment?.doctor?.name || t('common.dronline-team')},
          {name:t('common.patient'),value:form.patient?.name || itemToShow?.appointment?.patient?.name}, 
          {name:t('common.created_at'),value:`${form.created_at?.split('T')?.[0]} ${form.created_at?.split('T')?.[1]?.slice(0,5)}`},
          {name:t('common.status'),value:t('common.'+form.status),color:form.status=="pending" ? '#f97316':form.status=="approved" ? '#0b76ad' : form.status=="rejected" ?  '#dc2626' : '#16a34a'},
          {name:t('form.medical-specialty'),value:data._specialty_categories.filter(i=>i.id==form.appointment?.medical_specialty)[0]?.[`${i18next.language}_name`]},
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



      <FormLayout.Input  verified_inputs={verified_inputs} form={form} selectOptions={
                    [
                      { "name": t('common.labor'), "value": "labor" },
                      { "name": t('common.student-related'), "value": "student-related" },
                      { "name": t('common.labor-and-student-related'), "value": "labor-and-student-related"},
                      { "name": t('common.no-activity'), "value": "no-activity" },
                    ]
      } r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'activity'])} label={t('common.activities-to-do')} onChange={(e)=>setForm({...form,activity:e.target.value})} field={'relationship'} value={form.activity}/>
                    

      </FormLayout>

      </DefaultLayout>
       </>
  )
}

export default addAppointments