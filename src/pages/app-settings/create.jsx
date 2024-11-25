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
    setTimeout(()=>(
      data._get(required_data) 
    ),500)

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

                    {/**<FormLayout.Input r={true} verified_inputs={verified_inputs}  form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'irpc'])} label={t('common.irpc-percentage')} onChange={(e)=>setForm({...form,irpc:e.target.value > 100 ? 100 : e.target.value.replace(/[^0-9]/g, '')})} field={'irpc'} value={form.irpc}/> */}
                    </div>

            </FormLayout>

     </DefaultLayout>
  )
}

export default index