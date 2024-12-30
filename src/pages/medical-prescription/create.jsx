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
import _medication_names from '../../assets/medication-names.json'
import _medications from '../../assets/medications.json'

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
    medical_prescription_items:[
      {id:Math.random(),name:'',dosage:'',pharmaceutical_form:'',treatment_duration:'',prescribed_quantity:'',dosing_instructions:''}
    ],
    uploaded_files:[],
    comments:[]
  }



  const [form,setForm]=useState(initial_form)


  
  useEffect(()=>{

    let v=true

    if(
       form.medical_prescription_items.some(i=>(!i.name && !i.custom_name) || !i.prescribed_quantity || !i.treatment_duration || !i.dosage || !i.pharmaceutical_form) 
    ){
      v=false
    }

    setValid(v)
    console.log({form})

 },[form])


 useEffect(()=>{

  if(itemToShow.action!="update" && form.id){
    setForm(initial_form)
  }

},[pathname])
 


 useEffect(()=>{
  
  if(!user || itemToShow.action!="update"){
      return
  }
  
  (async()=>{
    try{

     let response=await data.makeRequest({method:'get',url:`api/medical-prescriptions/`+itemToShow.update_id,withToken:true, error: ``},0);

     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){

      console.log(e)


      if(e.message==404){
         toast.error(t('common.item-not-found'))
      }else  if(e.message=='Failed to fetch'){
         toast.error(t('common.check-network'))
      }else{
         toast.error(t('common.unexpected-error'))
        
      }
      
      setItemToShow({
        ...itemToShow,
        name:itemToShow.name.replace('create','all')
      }) 
      

     
  }
  
})()

},[user,pathname])



  async function SubmitForm(){
       setLoading(true)

    try{


      if(itemToShow.action=="update"){


        let r=await data.makeRequest({method:'post',url:`api/medical-prescriptions/`+itemToShow.update_id,withToken:true,data:{
          ...form,
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')


      }else{

        await data.makeRequest({method:'post',url:`api/medical-prescriptions`,withToken:true,data:{
          ...form,
          patient_id:itemToShow.appointment.patient_id,
          doctor_id:itemToShow.appointment.doctor_id,
          appointment_id:itemToShow.appointment.id,
          user_id:user?.id,
        }, error: ``},0);
  
        setForm({...initial_form})
        toast.success(t('messages.added-successfully'))
        setLoading(false)
        setVerifiedInputs([])
        data._scrollToSection('center-content')
        setVerifiedInputs([])
        data.handleLoaded('remove','medical_prescriptions')
      }
     

    }catch(e){
      
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



  function setPatientId(id){
    setForm({...form,patient_id:id})
  }

  //console.log({form})

  const [chosenPatient,setChosenPatient]=useState({})

  const [cannotEdit,setCannotEdit]=useState(false)


  useEffect(()=>{
      setCannotEdit(((user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"))
  })


  
  return (
     <DefaultLayout hide={ShowOnlyInputs || hideLayout}>

            <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

            {!itemToEditLoaded && itemToShow.action=="update" && <div className="mt-10">
                <DefaultFormSkeleton/>
            </div>}

            <FormLayout hideInputs={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}  hide={!itemToEditLoaded && itemToShow.action=="update"} hideTitle={ShowOnlyInputs} title={id ? t('common.update-medical-prescription') : t('menu.add-medical-prescription')} verified_inputs={verified_inputs} form={form}
          
            topBarContent={
                (<button onClick={()=>setShowComment(true)} type="button" class={`text-white hidden ${user?.role=="admin" ? 'hidden':''} bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 ${!id || !itemToEditLoaded ? 'hidden':''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>
                 <span className="ml-2">Chat</span>
                 {(form.comments.length!=0 && itemToShow.action=="update") && <div className="ml-2 bg-white text-honolulu_blue-500 rounded-full px-2 flex items-center justify-center">
                     {form.comments.length}
                 </div>}
              </button>)
            }


            button={(
               <div className={`mt-[40px] ${(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient" ? 'hidden':''}`}>
                 <FormLayout.Button onClick={()=>{
                     SubmitForm()
                 }} valid={valid} loading={loading} label={itemToShow.action=="update" ? t('common.update') :t('common.send')}/>
               </div>
            )}
            >

                  <FormCard hide={true}  items={[
                      {name:t('form.age'),value: new Date().getFullYear() - new Date(chosenPatient.date_of_birth).getFullYear() },
                      {name:t('form.gender'),value:chosenPatient.gender ? t('common.'+chosenPatient.gender)  : '-'},
                  ]}/>
 
                  <div className="block w-full p-5 border rounded-[0.3rem] mt-5">
                      {form.medical_prescription_items.map((i,_i)=>(

                          <div className={`w-full flex ${_i != form.medical_prescription_items.length - 1 ? 'border-b pb-7':''} flex-wrap gap-x-4`}>
                            
                            {(_i != form.medical_prescription_items.length - 1 || form.medical_prescription_items.length >= 2) && <div className="w-full pt-3 flex items-center">
                               <span className="mr-4 flex items-center justify-center w-[30px] h-[30px] bg-gray-200 text-[0.9rem] rounded-full">{_i + 1}</span>
                               <span onClick={()=>{
                                 setForm({...form,medical_prescription_items:form.medical_prescription_items.filter((_,_f)=>_f!=_i)})
                               }} className="text-[0.9rem] flex items-center cursor-pointer hover:underline">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"></path></svg>
                                {t('common.delete')}
                                </span>
                            </div>}

                           <div className="w-full">

                           <div className={`w-[360px] ${cannotEdit ? 'opacity-40 pointer-events-none':''}`}>
                                  <SearchInput canAdd={false} r={true} placeholder={t('form.medication-name')} id={i.name}  label={t('form.medication-name')} loaded={true}
                                   res={(id) => {
                                       setTimeout(()=>{
                                        setForm(prev=>({...prev,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                          return i.id==f.id ? {...f,name:id,custom_name:null} : f
                                         })}))
                                       },200)
                                   }}
                                   disabled={cannotEdit}

                                   defaultInput={i.custom_name}

                                   inputRes={(input) => setForm(prev=>({...prev,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                    return i.id==f.id ? {...f,custom_name:input,name:null} : f
                                   })}))}             
                                   
                                   items={_medications.map(i=>({...i,id:i.ITEM,name:`${i.name} (${i.active_substance})`}))}/>

                            </div>
                          </div>

                            <FormLayout.Input 
                              verified_inputs={verified_inputs} 
                              form={form} 
                              r={true} 
                              hide={true}
                              ignoreVilidation={true}
                              width={'220px'}
                              onBlur={() => setVerifiedInputs([...verified_inputs, 'medication-name'+i.id])} 
                              label={t('form.medication-name')} 
                              onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                 return i.id==f.id ? {...f,name:e.target.value} : f
                              })})} 
                              disabled={cannotEdit}
                              custom_invalid_validation={verified_inputs.includes('medication-name'+i.id) && !i.medication_name}
                              field={'medication-name'+i.id} 
                              value={i.name}
                            />

                            <FormLayout.Input 
                              verified_inputs={verified_inputs} 
                              form={form} 
                              width={'220px'}
                              r={true} 
                              onBlur={() => setVerifiedInputs([...verified_inputs, 'dosage'+i.id])} 
                              label={t('form.dosage')} 
                              onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                return i.id==f.id ? {...f,dosage:e.target.value} : f
                              })})} 
                              disabled={cannotEdit}
                              ignoreVilidation={true}
                              field={'dosage'+i.id} 
                              value={i.dosage}
                            />

                            <FormLayout.Input 
                              verified_inputs={verified_inputs} 
                              form={form}
                              width={'220px'} 
                              r={true} 
                              onBlur={() => setVerifiedInputs([...verified_inputs, 'pharmaceutical-form'+i.id])} 
                              label={t('form.pharmaceutical-form')} 
                              onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                return i.id==f.id ? {...f,pharmaceutical_form:e.target.value} : f
                              })})}
                              ignoreVilidation={true}
                              disabled={cannotEdit}
                              field={'pharmaceutical-form'+i.id} 
                              value={i.pharmaceutical_form}
                            />

                            <FormLayout.Input 
                              verified_inputs={verified_inputs} 
                              form={form} 
                              width={'220px'}
                              ignoreVilidation={true}
                              r={true} 
                              disabled={cannotEdit}
                              onBlur={() => setVerifiedInputs([...verified_inputs, 'treatment-duration'+i.id])} 
                              label={t('form.treatment-duration')} 
                              onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                return i.id==f.id ? {...f,treatment_duration:e.target.value} : f
                              })})} 
                              field={'treatment-duration'+i.id} 
                              value={i.treatment_duration}
                            />
                             <FormLayout.Input 
                              verified_inputs={verified_inputs} 
                              form={form} 
                              width={'220px'}
                              ignoreVilidation={true}
                              r={true}
                              onBlur={() => setVerifiedInputs([...verified_inputs, 'prescribed_quantity'+i.id])} 
                              label={t('form.quantity')} 
                              onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                return i.id==f.id ? {...f,prescribed_quantity:e.target.value.replace(/[^0-9]/g, '')} : f
                              })})} 
                              disabled={cannotEdit}
                              field={'prescribed_quantity'+i.id} 
                              value={i.prescribed_quantity}
                            />
                            
                            <div className="w-[300px]">
                              <FormLayout.Input 
                                verified_inputs={verified_inputs} 
                                form={form} 
                                disabled={cannotEdit}
                                ignoreVilidation={true}
                                textarea={true}
                                height={'100%'}
                                inputStyle={{height:60}}
                                onBlur={() => setVerifiedInputs([...verified_inputs, 'dosing-instructions'+i.id])} 
                                label={t('form.dosing-instructions')} 
                                onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                                  return i.id==f.id ? {...f,dosing_instructions:e.target.value} : f
                                })})} 
                                field={'dosing-instructions'+i.id} 
                                value={i.dosing_instructions}
                              />
                            </div>

                       
                          </div>
                      ))}
                  </div>

                  <div className="w-full mt-5">
                     {!cannotEdit && <button onClick={()=>{
                          setForm({...form,medical_prescription_items:[...form.medical_prescription_items,{...initial_form.medical_prescription_items[0],id:Math.random()}]})
                      }} type="button" class="text-white ml-4 bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        {t('common.add-form')}
                      </button>}

                  </div>

               



            </FormLayout>

     </DefaultLayout>
  )
}

export default addAppointments