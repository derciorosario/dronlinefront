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

  const [loadedData,setLoadedData]=useState({})

  useEffect(()=>{
        
    if(!user) return
    data._get(required_data) 
    

},[user,pathname])

let initial_form={
  do_not_define_urgent_hours:false
}

  const [form,setForm]=useState(initial_form)

  const [urgentHourMessages,setUrgentHourMessage]=useState()

  useEffect(()=>{

    setUrgentHourMessage(form.urgent_consultation_end_hour && (form.urgent_consultation_end_hour==form.urgent_consultation_start_hour) ?
     t('common.hours-cannot-be-the-same') : '')

  },[form])



  useEffect(()=>{
    
    let v=true

    if(
       ((!form.urgent_consultation_limit_duration_hours && !form.urgent_consultation_limit_duration_minutes)) ||
       ((!form.urgent_consultation_end_hour || !form.urgent_consultation_start_hour) && !form.do_not_define_urgent_hours) ||
       urgentHourMessages
    ){
      v=false
    }

    console.log({form})
    setValid(v)
 },[form,urgentHourMessages])




useEffect(()=>{
  if(!user){
      return
  }
  (async()=>{

    try{
     let response=await data.makeRequest({method:'get',url:`api/userdata/`,withToken:true, error: ``},0);
     setForm(JSON.parse(response.app_settings[0].value))
     setLoadedData(response.app_settings[0])
     setLoading(false)
     setItemToEditLoaded(true)
    
    }catch(e){
        console.log({e})
        toast.error(t('common.unexpected-error'))
        navigate('/')  
    }
})()

},[user])


async function updateSystemSettings() {
  setLoading(true)
  try{

    let r=await data.makeRequest({method:'post',url:`api/settings/`+loadedData.id,withToken:true,data:{...loadedData,value:JSON.stringify({...form,iva:form.iva || 0})}, error: ``},0);
    setLoading(false)
    toast.success(t('messages.updated-successfully'))

  }catch(e){

    setLoading(false)
    console.log({e})
    
    if(e.message==500){
      toast.error(t('common.unexpected-error'))
    }else  if(e.message=='Failed to fetch'){
      toast.error(t('common.check-network'))
    }else{
      toast.error(t('common.unexpected-error'))
    }

  }

}


  useEffect(()=>{
    if(!user) return
    if(user?.role=="manager" && !user?.data?.permissions?.app_settings?.includes('create') && !id){
          navigate('/') 
    }
  },[user])




  let hours = [
    '0:00', '0:30',
    '1:00', '1:30',
    '2:00', '2:30',
    '3:00', '3:30',
    '4:00', '4:30',
    '5:00', '5:30',
    '6:00', '6:30',
    '7:00', '7:30',
    '8:00', '8:30',
    '9:00', '9:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30',
    '19:00', '19:30',
    '20:00', '20:30',
    '21:00', '21:30',
    '22:00', '22:30',
    '23:00', '23:30'
];  


console.log({vvvvvvvvv:form.urgent_consultation_end_hour})


  return (
     <DefaultLayout>
         
            {message && <div className="px-[20px] mt-9" id="_register_msg">
              <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
           </div>}

            {!itemToEditLoaded && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}
           

           <FormLayout  hide={!itemToEditLoaded} title={t('common.update-settings')} verified_inputs={verified_inputs} form={form}
          
                    button={(

                      <div className={`mt-[40px] ${(user?.role=="manager" && !user?.data?.permissions?.specialty_categories?.includes('update') && id) ? 'hidden':''}`}>
                          <FormLayout.Button onClick={()=>{
                              updateSystemSettings()
                          }} valid={valid} loading={loading} label={id ? t('common.update') :t('common.send')}/>
                      </div>

                    )}
                    >


                   <div className="flex flex-wrap w-full gap-2">
                  
                       <FormLayout.Input  verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'name'])} label={t('form.name')} onChange={(e)=>setForm({...form,name:e.target.value})} field={'name'} value={form.name}/>
                       <FormLayout.Input  verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'email'])} label={'Email'} onChange={(e)=>setForm({...form,email:e.target.value})} field={'email'} value={form.email}/>
                       <FormLayout.Input  verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'nuit'])} label={'nuit'} onChange={(e)=>setForm({...form,nuit:e.target.value})} field={'nuit'} value={form.nuit}/>
                       <FormLayout.Input  verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'main_contact'])} label={t('form.main-contact')} onChange={(e)=>setForm({...form,main_contact:e.target.value.replace(/[^0-9]/g, '')})} field={'main_contact'} value={form.main_contact}/>
                       <FormLayout.Input  verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'address'])} label={t('common.address')} onChange={(e)=>setForm({...form,address:e.target.value})} field={'address'} value={form.address}/>

                   </div>

                   <div className="mt-10 mb-7">
                       <span className="flex">{t('common.urgent_consultation_limit')}</span>
                       <div className="w-full flex items-start">
                        
                       <FormLayout.Input 

                        verified_inputs={verified_inputs} 
                        form={form}
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'urgent_consultation_limit_duration_hours'])} 
                        label={t('common.hours')}
                        r={true} 
                        hideErrorMsg={true}
                        onChange={(e)=>setForm({...form,urgent_consultation_limit_duration_hours:e.target.value.replace(/[^0-9]/g, '')})}
                        field={'urgent_consultation_limit_duration_hours'} 
                        value={form.urgent_consultation_limit_duration_hours}
                        style={{marginRight:10}}

                        />


                        <FormLayout.Input
                              verified_inputs={verified_inputs} 
                              form={form}
                              onBlur={() => setVerifiedInputs([...verified_inputs, 'urgent_consultation_limit_duration_minutes'])} 
                              label={t('common.minutes')}
                              r={true} 
                              hideErrorMsg={true}
                              onChange={(e)=>setForm({...form,urgent_consultation_limit_duration_minutes:e.target.value.replace(/[^0-9]/g, '')})}
                              field={'urgent_consultation_limit_duration_minutes'} 
                              value={form.urgent_consultation_limit_duration_minutes}
                              style={{marginRight:10}}

                        />


                         
                                {/*** <FormLayout.Input hide={true} verified_inputs={verified_inputs} form={form} selectOptions={
                          [
                            {name:t('common.hour'),value:'hour'},
                            {name:t('common.minute'),value:'minute'},
                          ]
                        } onBlur={()=>setVerifiedInputs([...verified_inputs,'urgent_consultation_limit_period'])} label={t('common.urgent_consultation_limit_period')} onChange={(e)=>setForm({...form,urgent_consultation_limit:{...form.urgent_consultation_limit,period:e.target.value}})} field={'urgent_consultation_limit'} value={form.urgent_consultation_limit?.period}/>
                          */}
                        </div>
                   </div>
                  
                   



                    <div className="w-full mt-6 hidden">
                       <div className="flex items-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"></path></svg>
                          <span className="flex">{t('common.urgent-hours')}</span>
                        </div>
                        <div className="">
                            {hours.map(i=>(
                              <div className={`relative m-2  inline-flex min-w-[100px] justify-center px-3 bg-gray-200 border-transparent py-1  border rounded-full text-[14px] cursor-pointer`}>
                                 <label className="relative cursor-pointer z-10">{i}</label>
                               </div>
                            ))}
                        </div>
                    </div>


                    <div className="w-full mt-10">
                        <span className="flex">{t('common.define-urgent-hours')}</span>

                        <div className="w-full flex items-center">
                          <FormLayout.Input
                                verified_inputs={verified_inputs} 
                                form={form}
                                onBlur={() => setVerifiedInputs([...verified_inputs, 'urgent_consultation_start_hour'])} 
                                label={t('common.start-date')}
                                r={true} 
                                type={'time'}
                                hideErrorMsg={true}
                                disabled={form.do_not_define_urgent_hours}
                                onChange={(e)=>setForm({...form,urgent_consultation_start_hour:e.target.value})}
                                field={'urgent_consultation_start_hour'} 
                                value={form.urgent_consultation_start_hour}
                                style={{marginRight:10}}

                          />
                            
                          <FormLayout.Input
                                verified_inputs={verified_inputs} 
                                form={form}
                                onBlur={() => setVerifiedInputs([...verified_inputs, 'urgent_consultation_end_hour'])} 
                                label={t('common.end-date')}
                                r={true} 
                                disabled={form.do_not_define_urgent_hours}
                                type={'time'}
                                hideErrorMsg={true}
                                onChange={(e)=>setForm({...form,urgent_consultation_end_hour:e.target.value})}
                                field={'urgent_consultation_end_hour'} 
                                value={form.urgent_consultation_end_hour}
                                style={{marginRight:10}}

                          />
                        </div>
                        {urgentHourMessages && <span className="flex my-2 text-red-400">{urgentHourMessages}</span>}
                        <div className="flex items-center mt-2">
                           <label>
                            <input onClick={()=>{

                             
                              setForm({...form,
                                do_not_define_urgent_hours:!Boolean(form.do_not_define_urgent_hours),
                                urgent_consultation_end_hour:form.do_not_define_urgent_hours ? form.urgent_consultation_end_hour : '',
                                urgent_consultation_start_hour:form.do_not_define_urgent_hours ? form.urgent_consultation_start_hour : ''
                              })
                              
                            }} checked={form.do_not_define_urgent_hours} type="checkbox" className="mr-2"/>
                            <span>{t('common.do-not-define-urgent-hours')}</span>
                           </label>
                        </div>
                    </div>


                    <div>
                    
                    <FormLayout.Input r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'iva'])} label={t('common.iva-percentage')} onChange={(e)=>setForm({...form,iva:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'iva'} value={form.iva}/>
                    <div>
                      <FormLayout.Input r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'gain_percentage'])} label={t('common.gain_percentage')} onChange={(e)=>setForm({...form,gain_percentage:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'gain_percentage'} value={form.gain_percentage}/>
                      

                     {form.gain_percentage && <button onClick={()=>{
                         localStorage.setItem('gain_percentage',form.gain_percentage)
                         data._showPopUp('basic_popup','define-same-gain-perentage-for-all')
                        }} _ type="button" class="text-white mt-2 bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center">
                          {t('common.define-same-gain-perentage-for-all',{gain:`${form.gain_percentage}%`})}
                    </button>}

                    </div>
                     </div>

                     <div className="flex gap-x-4 flex-wrap mt-4 w-full">
                              <FileInput _upload={{key:'stamp_filename',filename:form?.stamp_filename}} res={({filename})=>{
                                   setForm({...form,stamp_filename:filename})
                              }} label={t('common.stamp')} r={true}/>
                             <div className="w-full">
                                 <div className="w-[300px] flex items-center justify-center bg-gray-300 h-[100px] rounded-[0.3rem]">
                                        {!form?.stamp_filename &&  <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                                        </svg>}
                                        {form?.stamp_filename && <img className="object-cover border w-auto h-full" src={form?.stamp_filename}/>}
                                  
                                  </div>
                             </div>
                  </div>

            </FormLayout>

     </DefaultLayout>
  )
}

export default index