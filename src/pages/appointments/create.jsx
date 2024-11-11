import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import { useData } from '../../contexts/DataContext'
import AdditionalMessage from '../messages/additional'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import FormCard from '../../components/Cards/form'
import Comment from '../../components/modals/comments'
import Loader from '../../components/Loaders/loader'
import AppointmentItems from '../../components/Cards/appointmentItems'
import SearchInput from '../../components/Inputs/search'
import { format } from 'date-fns'

function addAppointments({ShowOnlyInputs}) {

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
  const [showComment,setShowComment]=useState(false)
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [MessageBtnSee,setMessageBtnSee]=useState(null)
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDoctor,setSelectedDoctor]=useState({status:'not_selected',hours:[],weekday:null})
          

  
  let required_data=['doctors','specialty_categories','dependents']
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
    "consultation_id": "",
    "patient_id": "",
    "doctor_id": "",
    "consultation_date": "",
    "medical_specialty": "",
    "consultation_status": "",
    "consultation_method": "meet",
    "payment_confirmed": "",
    "notifications_sent": "",
    "reason_for_consultation": "",
    "location_telemedicine": "",
    "additional_observations": "",
    "prescription_id": "",
    "exam_id": "",
    "uploaded_documents": "",
    "estimated_consultation_duration": "",
    "type_of_care": "",
    "scheduled_doctor":"",
    "scheduled_hours":"",
    "scheduled_weekday":"",
    "scheduled_date":"",
    is_for_dependent:null,
    dependent:{},
    dependent_id:null,
    medical_prescriptions:[],
    documents:[],
    comments:[],
    clinical_diaries:[],
    exams:[]
}


  const [form,setForm]=useState(initial_form)

  
  useEffect(()=>{
    let v=true
    if(
       (selectedDoctor.status!="selected" && form.type_of_care!="requested") ||
       !form.reason_for_consultation ||
       !form.type_of_care ||
       form.is_for_dependent==null ||
       (form.is_for_dependent && !form.dependent_id) ||
       ((!form.scheduled_hours || !form.consultation_date) && form.type_of_care=="requested")
    ){
      v=false
    }
    setValid(v)
    console.log({form})
 },[form])


 useEffect(()=>{
  if(!id && form.id){
    setForm(initial_form)
    setSelectedDoctor({...selectedDoctor,status:'not_selected'})
  }
},[pathname])
 
const [dependents,setDependents]=useState([])
const [dependensLoaded,setDependesLoaded]=useState([])


 useEffect(()=>{
  if(!user || !id){
      return
  }
  (async()=>{

    try{
     let response=await data.makeRequest({method:'get',url:`api/appointments/`+id,withToken:true, error: ``},0);

     setForm({...form,...response})
     setLoading(false)
     setSelectedDoctor({...selectedDoctor,status:'selected'})
     setItemToEditLoaded(true)
     if(response.is_for_dependent){
        setDependents([...dependents.filter(i=>i.id!=response.dependent_id),response.dependent])
     }

    }catch(e){
      console.log(e)
      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/appointments')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('unexpected-error'))
        navigate('/appointments')  
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
  (async()=>{
    try{


      let res=data._sendFilter(searchParams)
      if(res.scheduled_type_of_care=="requested"){
        setForm({...form,type_of_care:'requested'})
        return
      }

      if(res.scheduled_doctor && res.scheduled_hours && res.scheduled_weekday && res.scheduled_date){
          setSelectedDoctor({status:'loading',hours:[]})
          let response=await data.makeRequest({method:'get',url:`api/doctor/`+res.scheduled_doctor,withToken:true, error: ``},0);
         
          let is_urgent=response.urgent_availability.weekday[res.scheduled_weekday]?.includes(res.scheduled_hours.split(',')[0])
          let new_form={...form,
            name:response.name,
            is_urgent,
            medical_specialty:response.medical_specialty,
            consultation_date:res.scheduled_date,
            doctor_id:response.id,
            patient_id:user.data?.id || null,
            scheduled_date:res.scheduled_date,
            scheduled_doctor:res.scheduled_doctor,
            scheduled_hours:res.scheduled_hours,
            scheduled_weekday:res.scheduled_weekday,
            type_of_care:is_urgent ? 'urgent': (form.type_of_care || 'scheduled')
          }

          if(res.canceled_appointment_id){
            new_form.canceled_appointment_id=res.canceled_appointment_id
          }

          let available_hours=getAvailableHours(response,new_form.type_of_care,res.scheduled_date,{[response.id]:res.scheduled_weekday},res.canceled_appointment_id)

          setSelectedDoctor({status:'selected'})
          setForm(new_form)
          if(!available_hours.includes(res.scheduled_hours)){
            data._showPopUp('basic_popup','appointment-no-longer-available')
            setSelectedDoctor({status:'not_selected'})
          }else{
            setSelectedDoctor({status:'selected'})
            setForm(new_form)
          }
         

      }

     
    }catch(e){

      if(e.message==404){
        toast.error(t('common.doctor-not-found'))
        setForm(initial_form)
        setSelectedDoctor({...selectedDoctor,status:'not_selected'})
      }else  if(e.message=='Failed to fetch'){
        toast.error(t('common.doctor-not-found-try'))
      }else{
        toast.error(t('common.doctor-not-found-try'))
      }
      console.log({e})

  }
})()
},[pathname,search])



function getAvailableHours(item,type,date,selectedWeekDays,canceled_appointment_id=null){

 
  if(data.serverTime){
     if(new Date(data.serverTime.date) > new Date()){
      return []
     }
  }
  
  
  if(type=="scheduled"){
      return (item.availability.unavailable_specific_date[date] ? [] : item.availability.specific_date[date] ? item.availability.specific_date[date] : item.urgent_availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.availability.weekday[weeks[new Date().getDay()]] || []) : (item.availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m)).filter(i=>!item.on_appointments.some(a=>a.scheduled_date==date && a.scheduled_hours==i && a.id!=canceled_appointment_id))
  }else{
      return (item.urgent_availability.unavailable_specific_date[date] ? [] : item.urgent_availability.specific_date[date] ? item.urgent_availability.specific_date[date] : item.availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.urgent_availability.weekday[weeks[new Date().getDay()]] || []) : (item.urgent_availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m)).filter(i=>item.on_appointments.some(a=>a.scheduled_date==date && a.scheduled_hours==i && a.id!=canceled_appointment_id))
  }
}





function checkDoctorAvailability(res,item){

          let available_days=[]
          let _year=new Date(res.scheduled_date).getFullYear()
          let _month=new Date(res.scheduled_date).getMonth()
          let selected_month=_month

          let d=data.getDatesForMonthWithBuffer(_month + 1, _year)
          let weekdaysAvailability=[item.availability.weekday,item.urgent_availability.weekday]

          let unavailable_dates=[]
          if(!Array.isArray(item.availability.unavailable_specific_date)){
              unavailable_dates=Object.keys(item.availability.unavailable_specific_date)
          }


          weekdaysAvailability.forEach((a,_a)=>{
            Object.keys(a).forEach((i,_i)=>{
              let index=weeks.findIndex(f=>f==i)
              d.filter(z=> new Date(z).getDay()==index && !unavailable_days.includes(new Date(z).getDate())).forEach(date=>{
                  let day=new Date(date).getDate()
                  let month=new Date(date).getMonth()
                  if(month==selected_month && !available_days.includes(day)){
                    available_days.push(day)
                  }    
              })
            })  
          })

}








  async function SubmitForm(){

    setLoading(true)

    try{


      if(id){
        let r=await data.makeRequest({method:'post',url:`api/appointments/`+id,withToken:true,data:{
          ...form,
          dependent_id:form.is_for_dependent ? form.dependent_id : null
        
        }, error: ``},0);
  
        setForm({...form,r})
        toast.success(t('messages.updated-successfully'))
        setLoading(false)
        data._scrollToSection('center-content')

      }else{

        let response=await data.makeRequest({method:'post',url:`api/appointments`,withToken:true,data:{
          ...form,
          scheduled_date:form.type_of_care=="requested" ? form.consultation_date : form.scheduled_date,
          dependent_id:form.is_for_dependent ? form.dependent_id : null,
        }, error: ``},0);

        localStorage.removeItem('saved_appointment_url')
  
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
        
        if(form.type_of_care=="urgent"){
          data._showPopUp('basic_popup','contact-us-if-delay')
        }

        setSelectedDoctor({...selectedDoctor,status:'not_selected'})
        data.handleLoaded('remove','appointments')
        let new_params={scheduled_date:'',scheduled_doctor:'',scheduled_hours:'',scheduled_weekday:''}
        data._updateFilters(new_params,setSearchParams)
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


  useEffect(()=>{

             if(data.paymentInfo.done){
                  setForm({...initial_form})
                  setMessageType('green')
                  setMessage(t('messages.added-successfully'))
                  setLoading(false)
                  data._scrollToSection('center-content')
                  setVerifiedInputs([])

                  if(!data.paymentInfo.is_proof){
                    
                    setMessageBtnSee({onClick:()=>{
                      navigate('/appointment/'+data.paymentInfo.appointment.id)
                      setItemToEditLoaded(false)
                      setMessage('')
                      if(document.querySelector('#center-content')) {
                        document.querySelector('#center-content').scrollTop=0
                      }
                      }})
                      
                      if(form.type_of_care=="urgent"){
                        data._showPopUp('basic_popup','contact-us-if-delay')
                      }
                  }
                 
                  setSelectedDoctor({...selectedDoctor,status:'not_selected'})
                  data.handleLoaded('remove','appointments')
                  let new_params={scheduled_date:'',scheduled_doctor:'',scheduled_hours:'',scheduled_weekday:''}
                  data._updateFilters(new_params,setSearchParams)
                  data.setPaymentInfo({...data.paymentInfo,done:false,type_of_care:null})
             }
 },[data.paymentInfo])

 const [itemToShow,setItemToShow]=useState(null)

 function setDependentId(id){
      setForm({...form,dependent_id:id})
 }

 useEffect(()=>{
    if(data.justCreatedDependent){
        console.log([...dependents,data.justCreatedDependent])
        setDependents([...dependents,data.justCreatedDependent])
        setForm({...form,dependent_id:JSON.parse(JSON.stringify(data.justCreatedDependent.id))})
        data.setJustCreatedDependent(null)
        toast.success(t('messages.added-successfully'))
    }
 },[data.justCreatedDependent])


 useEffect(()=>{
    (async()=>{
      try{
        let _dependents=await data.makeRequest({method:'get',url:`api/all-patient-dependens`,withToken:true, error: ``},0);
        setDependents(_dependents)
        setDependesLoaded(true)
      }catch(e){
        console.log({e})
      }
    })()
 },[])


 useEffect(()=>{


    if(user?.role!="patient" && !id){
           navigate('/')
    }


    if(!user || user?.role!="patient"){
      return
    }

    if(!user?.data?.date_of_birth){
       data._showPopUp('basic_popup','conclude_patient_info')
    }else if(localStorage.getItem('saved_appointment_url') && !id){
       data._showPopUp('basic_popup','you-have-saved-appointment')
    }

    

 },[user])




return (

<div>   

  <AppointmentItems setItemToShow={setItemToShow} show={Boolean(itemToShow)} itemToShow={itemToShow}/> 
  <DefaultLayout hide={ShowOnlyInputs}>

  <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

  {message && <div className="px-[20px] mt-9" id="_register_msg">
    <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
  </div>}

  {!itemToEditLoaded && id && <div className="mt-10">
    <DefaultFormSkeleton/>
  </div>}

  <div className={`${(!user?.data?.date_of_birth && user?.role=="patient") ? 'opacity-65 pointer-events-none':''} `}>

  <FormLayout hideInputs={user?.role=="doctor"} hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={id ? t('common.updated-added-appointment') : t('menu.add-appointments')} verified_inputs={verified_inputs} form={form}

  topBarContent={
      (<div>
          {(id) && <div>

            <button onClick={()=>setItemToShow({
               name:'all-clinical-diary',
               appointment:form
            })} type="button" class={`text-gray-600 border focus:ring-4 focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2`}> 
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M680-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480q-17 0-28.5 11.5T640-440q0 17 11.5 28.5T680-400ZM440-40v-116q0-21 10-39.5t28-29.5q32-19 67.5-31.5T618-275l62 75 62-75q37 6 72 18.5t67 31.5q18 11 28.5 29.5T920-156v116H440Zm79-80h123l-54-66q-18 5-35 13t-34 17v36Zm199 0h122v-36q-16-10-33-17.5T772-186l-54 66Zm-76 0Zm76 0Zm-518 0q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v200q-16-20-35-38t-45-24v-138H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm80-480h280q26-20 57-30t63-10v-40H280v80Zm0 160h200q0-21 4.5-41t12.5-39H280v80Zm0 160h138q11-9 23.5-16t25.5-13v-51H280v80Zm-80 80v-560 137-17 440Zm480-240Z"/></svg>
              <span className="ml-2">{t('menu.clinical-diary')}</span>
              {(form.clinical_diaries.length!=0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                 {form.clinical_diaries.length}
              </div>}
            </button>

            <button onClick={()=>setItemToShow({
               name:'all-medical-prescription',
               appointment:form
            })} type="button" class={`text-gray-600 border focus:ring-4 focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2`}>         
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="m678-134 46-46-64-64-46 46q-14 14-14 32t14 32q14 14 32 14t32-14Zm102-102 46-46q14-14 14-32t-14-32q-14-14-32-14t-32 14l-46 46 64 64ZM735-77q-37 37-89 37t-89-37q-37-37-37-89t37-89l148-148q37-37 89-37t89 37q37 37 37 89t-37 89L735-77ZM200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v245q-20-5-40-5t-40 3v-243H200v560h243q-3 20-3 40t5 40H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM280-600v-80h400v80H280Zm0 160v-80h400v34q-8 5-15.5 11.5T649-460l-20 20H280Zm0 160v-80h269l-49 49q-8 8-14.5 15.5T474-280H280Z"/></svg>
              <span className="ml-2">{t('menu.medical-prescription')}</span>
              {(form.medical_prescriptions.length!=0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                 {form.medical_prescriptions.length}
              </div>}
            </button>

            <button onClick={()=>setItemToShow({
               name:'all-exams',
               appointment:form
            })} type="button" class={`text-gray-600 border focus:ring-4 focus:outline-none font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2`}>     
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M320-600q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm0 160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0 160q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm0-560v160-160 560-560Z"/></svg>
              <span className="ml-2">{t('menu.exams')}</span>
              {(form.exams.length!=0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                 {form.exams.length}
              </div>}
            </button>
            
          </div>}
        
      </div>)
  }

  bottomContent={(
    <div></div>
  )}
  

  button={(
    <div className={`mt-[40px] ${user?.role=="doctor" ? 'hidden':''}`}>

     {(user?.data?.date_of_birth)  && <FormLayout.Button onClick={()=>{
         if(id){
            SubmitForm()
         }else{
            data.setPaymentInfo(({...data.paymentInfo,step:1,...form,user_id:user?.id}))
         }
         
      }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.proceed-with-payment')}/>
   }
    </div>
  )}
  >


 <div className={`flex justify-between w-full`}>
    <div className="flex flex-wrap"></div>

    <div className="mt-4">
            {!(form.status!="pending" && form.status!="cancelled") && <div className={`flex _feedback items-center gap-x-2  ${user?.role=="admin" || user?.role=="manager" ? 'hidden':''}  ${!id || !itemToEditLoaded ? 'hidden':''}`}>
             
                <button onClick={()=>setShowComment(true)} type="button" class={`text-white bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 `}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg>
                  <span className="ml-2">Chat</span>
                  {(form.comments.length!=0 && id) && <div className="ml-2 bg-white text-honolulu_blue-500 rounded-full px-2 flex items-center justify-center">
                      {form.comments.length}
                  </div>}
              </button>

              <button onClick={()=>{
                  data._showPopUp('feedback',{...form})
              }} class={`text-white bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4  ${user?.role=="doctor" ? 'hidden':''}  focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-1 text-center inline-flex items-center me-2 `}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
                    <span className="ml-2 hidden">{t('common.reviews')}</span>
              </button>
              </div>}
        </div>
      
 </div>

  <FormCard hide={!id} items={[

    {name:t('form.consultation-id'),value:id ? form.id : '-'},
    {name:t('form.consultation-status'),value:!form.consultation_status ? t('common.pending') : t('form.'+form.consultation_status)},
    {name:t('form.patient-name'),value:form.is_for_dependent ? form.dependent?.name : form?.user?.name,hide:user?.role=="patient",
      link:!form.is_for_dependent ? false : (form.is_for_dependent ? '/dependent/'+form.dependent?.id : '/patient/'+form.patient?.id),hide:user?.role=="patient"
    },
    {name:t('form.consultation-date'),value:form.consultation_date,hide:user?.role=="patient"},
    {name:t('form.estimated-consultation-duration'),value:form.estimated_consultation_duration,hide:true},
    {name:t('form.type-of-care'),value:t(`form.${form.type_of_care}-c`),hide:user?.role=="patient"},
    {name:t('form.consultation-method'),value:t('common.'+form.consultation_method),hide:user?.role=="patient"},
    {name:t('form.reason-for-consultation'),value:form.reason_for_consultation,hide:user?.role=="patient"},
    {name:t('form.additional-observations'),value:form.additional_observations,hide:user?.role=="patient"}  

  ]}/>


 <div className={`w-[360px] _add_dependent ${user?.role!="patient"? 'hidden':''}`}>
       <label  class="block text-sm  mb-2 mt-7 text-gray-900">
        {t('common.how-is-the-consultation-for')}<span className="text-red-500">*</span>
        {form.is_for_dependent==true && <span onClick={()=>{
            setForm({...form,is_for_dependent:false})
        }} className="text-[14px] ml-7 cursor-pointer underline text-honolulu_blue-400">{t('common.set-for-me')}</span>}
      </label>
       
       {form.is_for_dependent==true && <SearchInput btnAddRes={()=>{
          data._showPopUp('add_dependent')
       }} r={true} placeholder={t('common.family-name')} id={form.dependent_id}  label={''} loaded={dependensLoaded} res={setDependentId} items={dependents.map(i=>({...i,name:`${i.name} (${t('common.'+i.relationship)})`}))}/> }

       {form.is_for_dependent!=true && <div className="flex items-center gap-x-4 mt-3 mb-2">
                                <label onClick={()=>setForm({...form,is_for_dependent:false})} className="flex items-center cursor-pointer hover:opacity-70">
                                    <input type="radio" name={'dependent'} checked={form.is_for_dependent==false}  className="mr-1 cursor-pointer"/>
                                    <span>{t('common.for-me')}</span>
                                </label>

                                <label onClick={()=>setForm({...form,is_for_dependent:true})} className="flex items-center cursor-pointer hover:opacity-70">
                                    <input type="radio" name={'dependent'} checked={form.is_for_dependent==true} className="mr-1 cursor-pointer"/>
                                    <span className="cursor-pointer">{t('common.for-a-family-member')}</span>
                                </label>
         </div>}
    </div>  


    <FormLayout.Input verified_inputs={verified_inputs}

     selectOptions={
        [
          { name: t('form.urgent-care'), value: 'urgent' },
          { name: t('form.scheduled-consultation'), value: 'scheduled' },
          { name: t('form.request-for-home-care-team'), value: 'requested'},
        ]
      }
      popOver={[
        {title:t('form.urgent-care'),text:t('form.urgent-care-info')},
        {title:t('form.scheduled-consultation'),text:t('form.scheduled-consultation-info')},
        {title:t('form.request-for-home-care-team'),text:t('form.request-for-home-care-team-info')}
      ]}

      form={form} r={true}
      hide={user?.role!="patient"}
      onBlur={()=>setVerifiedInputs([...verified_inputs,'type_of_care'])}
      label={t('form.type-of-care')}
      onChange={(e)=>setForm({...form,type_of_care:e.target.value})}
      field={'type_of_care'}
      disabled={Boolean(id)}
      value={form.type_of_care}/>

      <FormLayout.Input 
        verified_inputs={verified_inputs} 
        form={form} 
        hide={true}

        selectOptions={
          [
            {name:'30 '+t('common.minutes'),value:'30-min'},
            {name:'1 '+t('common.hour'),value:'1-h'},
            {name:t('common.more-than-1h'),value:'1-h+'},
          ]
        }

        r={true} 
        onBlur={() => setVerifiedInputs([...verified_inputs, 'estimated-consultation-duration'])} 
        label={t('form.estimated-consultation-duration')} 
        onChange={(e) => setForm({...form, estimated_consultation_duration: e.target.value})} 
        field={'estimated_consultation_duration'} 
        value={form.estimated_consultation_duration}
      />

      <div className={`flex ${id ? 'opacity-60 pointer-events-none':''} mt-7 ${user?.role!="patient" || form.type_of_care=="requested" || (!form.type_of_care && selectedDoctor.status!="loading") ? 'hidden':''} justify-end flex-col  _doctor_list`}>
        
        <label class="mb-2 text-sm  text-gray-900">{t('common.doctor')}</label>

        <div onClick={()=>{
          if(selectedDoctor.status!="loading") {

              data.setUpdateTable(Math.random())
              data._showPopUp('doctor_list')

          }
        }} class={`bg-gray w-[400px] ${(selectedDoctor.status=="loading" || id) ? ' pointer-events-none':''} hover:bg-gray-100 cursor-pointer  h-[43px] border-gray-300  active:opacity-75  text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 border items-center flex justify-between p-2.5`}>    
        
            {selectedDoctor.status=="not_selected" && <>

                <div className="flex items-center">
                
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q14-36 44-58t68-22q38 0 68 22t44 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-200h400v-10q-42-35-93-52.5T480-280q-56 0-107 17.5T280-210v10Zm200-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z"/></svg>
                <span className="ml-2">{t('common.select-doctor')}</span>

                </div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
      
            </>}

            {selectedDoctor.status=="loading" && <div className="flex items-center">
                <Loader/><span>{t('common.loading')}...</span>
            </div>}

            {selectedDoctor.status=="selected" && <>
              <div className="">
                <span>{form.name} <label className="text-[13px] text-gray-500">({data._specialty_categories.filter(f=>f.id==form.medical_specialty)[0]?.pt_name})</label></span>
                <div className="flex items-center">
                    <span className="text-[13px]">{form.consultation_date} ({t('common._weeks.'+form.scheduled_weekday?.toLowerCase())})</span>
                    <span className="mx-2">-</span>
                    {form.scheduled_hours.split(',').map((i,_i)=>(
                      <span className="mr-1">{i}{_i!=form.scheduled_hours.split(',').length - 1 ? ',':''}</span>
                    ))}
                    <span className="mx-2">-</span>
                    <span  className="text-[13px]">{form.is_urgent ? t('common.urgent') : 'Normal'}</span>
                </div>
            </div>
            {!id && <span onClick={()=>{
                data._showPopUp('doctor_list')
                data.setSelectedDoctors({})
              }} className="text-honolulu_blue-400 hover:opacity-60 underline cursor-pointer">{t('common.change')}</span>
            }
            </>}
          
        </div>
        
      </div>

      

         
    <FormLayout.Input 
        verified_inputs={verified_inputs} 
        form={form} 
        r={true} 
        type={'date'}
        onBlur={() => setVerifiedInputs([...verified_inputs, 'consultation-date'])} 
        label={t('form.consultation-date')} 
        onChange={(e) => setForm({...form, consultation_date: e.target.value})} 
        field={'consultation_date'} 
        hide={form.type_of_care!="requested"}
        value={form.consultation_date}
      />

      <FormLayout.Input 
        verified_inputs={verified_inputs} 
        form={form} 
        r={true} 
        type={'time'}
        hide={form.type_of_care!="requested"}
        onBlur={() => setVerifiedInputs([...verified_inputs, 'consultation-hour'])} 
        label={t('form.consultation-hour')} 
        onChange={(e) => setForm({...form, scheduled_hours: e.target.value})} 
        field={'consultation_date'} 
        value={form.scheduled_hours}
      />


      
    <FormLayout.Input 
        verified_inputs={verified_inputs} 
        form={form} 
        r={true} 
        textarea={true}
        hide={user?.role!="patient"}
        onBlur={() => setVerifiedInputs([...verified_inputs, 'reason-for-consultation'])} 
        label={t('form.reason-for-consultation')} 
        onChange={(e) => setForm({...form, reason_for_consultation: e.target.value})} 
        field={'reason_for_consultation'} 
        value={form.reason_for_consultation}
      />

      <FormLayout.Input 
        verified_inputs={verified_inputs} 
        form={form}
        textarea={true}
        hide={user?.role!="patient"}
        onBlur={() => setVerifiedInputs([...verified_inputs, 'additional-observations'])} 
        label={t('form.additional-observations')} 
        onChange={(e) => setForm({...form, additional_observations: e.target.value})} 
        field={'additional_observations'} 
        value={form.additional_observations}
      />


  </FormLayout>
  </div>

  </DefaultLayout>
      </div> 
  )
}

export default addAppointments