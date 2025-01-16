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
         {id:Math.random(),name:'',dosage:'',pharmaceutical_form:'',treatment_duration:'',prescribed_quantity:'',dosing_instructions:'',route_of_administration:'',timetable:'',recommendations:''}
    ],
    uploaded_files:[],
    comments:[],
    expiration_period:''
  }



  const [form,setForm]=useState(initial_form)


  
  useEffect(()=>{

    let v=true
    if(
       form.medical_prescription_items.some(i=>(!i.name && !i.custom_name) || !i.prescribed_quantity || !i.treatment_duration || !i.dosage || !i.pharmaceutical_form || !i.treatment_duration  || !i.route_of_administration || !i.dosing_instructions || !i.timetable) 
    ){
      v=false
    }
    setValid(v)

 },[form])


 useEffect(()=>{

  if(itemToShow?.action!="update" && form.id){
    setForm(initial_form)
  }

},[pathname])
 


 useEffect(()=>{
  
  if(!user || itemToShow?.action=="create"){
    return
}
  
  (async()=>{
    try{

     let response=await data.makeRequest({method:'get',url:`api/medical-prescriptions/`+(itemToShow?.update_id || id),withToken:true, error: ``},0);

     setForm({...form,...response})
     setLoading(false)
     setItemToEditLoaded(true)

    }catch(e){

      console.log(e)


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


      if(itemToShow.action=="update"){


        let r=await data.makeRequest({method:'post',url:`api/medical-prescriptions/`+itemToShow.update_id,withToken:true,data:{
          ...form,
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

        await data.makeRequest({method:'post',url:`api/medical-prescriptions`,withToken:true,data:{
          ...form,
          patient_id:itemToShow.appointment.patient_id,
          doctor_id:itemToShow.appointment.doctor_id,
          appointment_id:itemToShow.appointment.id,
          user_id:user?.id,
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

 
  const [cannotEdit,setCannotEdit]=useState(false)


  useEffect(()=>{
      setCannotEdit(((user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"))
  })

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

    <Comment comments={form.comments} form={form} setForm={setForm} from={from} show={showComment} setShow={setShowComment}/>

    {message && <div className="px-[20px] mt-9" id="_register_msg">
      <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
    </div>}

    {!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow)) && <div className="mt-10">
             <DefaultFormSkeleton/>
    </div>}
           

 <FormLayout hideInputs={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}  hide={!itemToEditLoaded && (itemToShow?.action=="update" || (id && !itemToShow))} hideTitle={ShowOnlyInputs} title={user?.role=="patient" && !itemToShow ? t('common.medical-prescription') : (itemToShow?.action=="update" || (id && !itemToShow))  ? t('common.update-medical-prescription') : t('menu.add-medical-prescription')} verified_inputs={verified_inputs} form={form}

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
                    title: t('menu.medical-prescription'),
                    from:'medical-prescription',
                    i:form,
                    appointment:form?.appointment,
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

       
          <div className="block w-full p-5 border rounded-[0.3rem] mt-5">
              {form.medical_prescription_items.map((i,_i)=>(

                  <div className={`w-full flex ${_i != form.medical_prescription_items.length - 1 ? 'border-b pb-7':''} flex-wrap gap-x-4`}>
                    
                    {(_i != form.medical_prescription_items.length - 1 || form.medical_prescription_items.length >= 2) && <div className="w-full pt-3 flex items-center">
                        <span className="mr-4 flex items-center justify-center w-[30px] h-[30px] bg-gray-200 text-[0.9rem] rounded-full">{_i + 1}</span>
                        {!cannotEdit && <span onClick={()=>{
                          setForm({...form,medical_prescription_items:form.medical_prescription_items.filter((_,_f)=>_f!=_i)})
                        }} className="text-[0.9rem] flex items-center cursor-pointer hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"></path></svg>
                        {t('common.delete')}
                        </span>}
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
                            
                            items={_medications.map(i=>({...i,id:i.ITEM,name:`${i.name}`}))}/>

                    </div>
                  </div>

                

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
                      onBlur={() => setVerifiedInputs([...verified_inputs, 'route_of_administration'+i.id])} 
                      label={t('common.route_of_administration')} 
                      onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                        return i.id==f.id ? {...f,route_of_administration:e.target.value} : f
                      })})} 
                      disabled={cannotEdit}
                      ignoreVilidation={true}
                      field={'route_of_administration'+i.id} 
                      value={i.route_of_administration}
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
                      ignoreVilidation={true}s
                      r={true}
                      onBlur={() => setVerifiedInputs([...verified_inputs, 'prescribed_quantity'+i.id])} 
                      label={t('common.quantity-to-dispense')} 
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
                        r={true}
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

                    <div className="w-[300px]">

                    <FormLayout.Input 
                      verified_inputs={verified_inputs} 
                      form={form} 
                      width={'220px'}
                      r={true} 
                      onBlur={() => setVerifiedInputs([...verified_inputs, 'timetable'+i.id])} 
                      label={t('common.timetables')} 
                      onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                        return i.id==f.id ? {...f,timetable:e.target.value} : f
                      })})} 
                      textarea={true}
                      height={'100%'}
                      inputStyle={{height:60}}
                      disabled={cannotEdit}
                      ignoreVilidation={true}
                      field={'timetable'+i.id} 
                      value={i.timetable}
                    />

                    
                    </div>


                    <div className="w-[300px]">
                      <FormLayout.Input 
                        verified_inputs={verified_inputs} 
                        form={form} 
                        disabled={cannotEdit}
                        ignoreVilidation={true}
                        textarea={true}
                        height={'100%'}
                        inputStyle={{height:60}}
                        onBlur={() => setVerifiedInputs([...verified_inputs, 'recommendations'+i.id])} 
                        label={t('common.additional-recommendations')} 
                        onChange={(e) => setForm({...form,medical_prescription_items:form.medical_prescription_items.map(f=>{
                          return i.id==f.id ? {...f,recommendations:e.target.value} : f
                        })})} 
                        field={'recommendations'+i.id} 
                        value={i.recommendations}
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

          <div className="w-full mt-5">
            <FormLayout.Input 
                verified_inputs={verified_inputs} 
                form={form} 
                hide={(user?.role!="doctor" && itemToShow?.appointment?.doctor_id) || user?.role=="patient"}
                onBlur={() => setVerifiedInputs([...verified_inputs, 'expiration_period'])} 
                label={t('common.expiration-date') +  ` (${t('common.days').toLowerCase()})`} 
                placeholder={t('common.number-of-days')}
                onChange={(e) => setForm({...form, expiration_period:e.target.value.startsWith('0') ? form.expiration_period : e.target.value.replace(/[^0-9]/g, '')})} 
                field={'expiration_period'} 
                value={form.expiration_period}
            />
        </div>

        



    </FormLayout>

    </DefaultLayout>
          
      </>
  )
}

export default addAppointments