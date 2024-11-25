import React from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../Loaders/loader';
import _var from '../../assets/vaiables.json'
import { useEffect } from 'react';
import { useHomeData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import FileInput from '../../components/Inputs/file'

export default function WorkWithUsForm({}) {
  const { t, i18n } = useTranslation();
  const [loading,setLoading]=useState(false)
  const data=useHomeData()

  let initial_form={
    main_contact_code:'258',
    name:'',
    email:'',
    additional_info:'',
    specialty:'',
    address:'',
    contact:'',
    identification_number_filename:'',
    uploaded_files:[]
  }
  const [form,setForm]=useState(initial_form)

  async function SubmitForm(){
    setLoading(true)
    try{

        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
            toast.error(t('common.invalid-email'))
            setLoading(false)
            return
        }

        await data.makeRequest({method:'post',url:`api/doctor-requests`,data:{
         ...form
        }, error: ``},0)
       
        setLoading(false)
        setForm(initial_form)
        toast.success(t('common.data-sent'))
        data._closeAllPopUps()
        setTimeout(()=>data._showPopUp('doctor_reuqest_sent'),200)

    }catch(e){
      
      if(e.message==500){
        toast.error(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
        toast.error(t('common.check-network'))
      }

      setLoading(false)

    }
  }

  
  const [valid,setValid]=useState(false)


  useEffect(()=>{
    let v=true

    if(
       !form.name ||
       !form.email ||
       !form.main_contact_code ||
       !form.specialty ||
       !form.address ||
       !form.contact ||
       !form.identification_number_filename ||
       !form.uploaded_files.filter(i=>i.name && i.filename).length
    ){
      v=false
    }
    setValid(v)

 },[form])

 function handleUploadedFiles(upload){
    setForm({...form,[upload.key]:upload.filename})
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
            
        <div style={{zIndex:999}} id="crud-modal" tabindex="-1" aria-hidden="true" class={`overflow-y-auto _doctor_reuqest_form  bg-[rgba(0,0,0,0.7)] flex ease-in delay-100 transition-all ${!data._openPopUps.doctor_reuqest_form ? 'opacity-0 pointer-events-none translate-y-[50px]':''} overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
            <div class="relative p-4 w-full max-w-[600px] max-h-full">
                <div class="relative bg-white rounded-lg shadow">

                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 class="text-lg font-semibold text-gray-900">
                          {t('common.insert-medical-and-personal-info')}
                        </h3>

                        
                    </div>
                  
                   <div className="p-4 mt-2">
                     <p className="text-gray-600 text-[0.9rem]">{t('common.fill-the-form-below-with-your-personal-and-medical-info')}.</p>
                   </div>

                    <div class="p-4 md:p-5">
                        <div class="grid gap-4 mb-4 grid-cols-2">
                            <div class="col-span-2">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">{t('form.full-name')} <span className="text-red-500">*</span></label>
                                <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""/>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label for="price" class="block mb-2 text-sm font-medium text-gray-900 ">{t('form.contact')} <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <select  onChange={(e)=>setForm({...form,main_contact_code:e.target.value})} value={form.main_contact_code} class={`bg-gray w-[90px] mr-1 border border-gray-300  text-gray-900 text-sm rounded-[0.4rem] focus:ring-blue-500 focus:border-blue-500 block p-3`}>
                                        {_var.contry_codes.map(i=>(
                                            <option selected={form.main_contact_code==i.code ? true : false}  value={i.code}>+{i.code}</option>
                                        ))}
                                    </select> 
                                    <input onChange={(e)=>setForm({...form,contact:e.target.value})} value={form.contact} name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                                </div>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label for="price" class="block mb-2 text-sm font-medium text-gray-900 ">Email <span className="text-red-500">*</span></label>
                                <input onChange={(e)=>setForm({...form,email:e.target.value})} value={form.email} name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                            </div>
                            
                            <div class="col-span-2 sm:col-span-1">
                                <label for="price" class="block mb-2 text-sm font-medium text-gray-900 ">{t('form.address')} <span className="text-red-500">*</span></label>
                                <input onChange={(e)=>setForm({...form,address:e.target.value})} value={form.address} name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <label for="price" class="block mb-2 text-sm font-medium text-gray-900 ">{t('common.specialty')} <span className="text-red-500">*</span></label>
                                <input onChange={(e)=>setForm({...form,specialty:e.target.value})} value={form.specialty} name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  required=""/>
                            </div>
                            <div class="col-span-2">
                                <label for="description" class="block mb-2 text-sm font-medium text-gray-900">{t('form.additional-info')} <span className="opacity-50">({t('common.optional')})</span> </label>
                                <textarea value={form.additional_info} onChange={(e)=>setForm({...form,additional_info:e.target.value})} id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"></textarea>                    
                            </div>
                        </div>


                        <div className="mt-5">
                   
                
                
                  <span className="flex mb-5 items-center hidden">{t('common.documents')}  <label className="text-[0.9rem] ml-2">({t('messages.add-atleast-one-document')})</label> <span className="text-red-500">*</span></span>
                  <div className="flex gap-x-4 flex-wrap gap-y-8">
                     <FileInput _upload={{key:'identification_number_filename',filename:form.identification_number_filename}} res={handleUploadedFiles} label={t('form.identification-document')} r={true}/>
                   
                  </div>

                  <span className="flex mb-5 items-center mt-8 w-full">

                      {t('common.certificate-e-diplomas')} <span className="text-red-500">*</span>
                    
                      <button onClick={()=>{
                          let id=Math.random().toString().replace('.','')
                          setForm({...form,uploaded_files:[{
                            name:'',filename:'',id
                          },...form.uploaded_files]})
                          setTimeout(() => {
                             document.getElementById(id).focus()
                          }, 200);
                      }} type="button" class="text-white ml-4 bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        {t('common.add-document')}
                      </button>
                  
                  </span>


                  <div className="flex gap-x-4 flex-wrap gap-y-4 w-[300px]">

                      {form.uploaded_files.map(i=>(
                            <div className="flex items-center w-full">
                            <div>
                            <input id={i.id} style={{borderBottom:'0'}} value={i.name} placeholder={t('common.document-name')} onChange={(e)=>{
                                 setForm({...form,uploaded_files:form.uploaded_files.map(f=>{
                                    if(f.id==i.id){
                                      return {...f,name:e.target.value}
                                    }else{
                                      return f
                                    }
                                 })})
                            }}   class={`bg-gray border  border-gray-300  text-gray-900 text-sm rounded-t-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-[300px] px-2.5 py-1`}/>
                              <FileInput  _upload={{key:i.id,filename:i.filename}} res={handleUploadeduploaded_files} r={true}/>
                            </div>
                              
                            <span onClick={()=>{
                                setForm({...form,uploaded_files:form.uploaded_files.filter(f=>f.id!=i.id)})
                              }} className="ml-2 cursor-pointer hover:opacity-65">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                </span>
                            </div>
                            
                      ))}
                      
                  </div>
                </div>
                        <button onClick={SubmitForm}  class={`text-white mt-5 ${(loading || !valid) ? 'pointer-events-none':''} inline-flex items-center  ${valid ? 'bg-honolulu_blue-400':'bg-gray-400'}   focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                            {loading && <Loader w={20} h={20}/>}  {loading ? t('common.sending') : t('common.send')}
                        </button>

                    </div>
                </div>


                <div onClick={()=>{
                    data._closeAllPopUps()
                }} className="w-[30px] cursor-pointer h-[30px] absolute right-5 top-5 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>


            </div>
        </div> 

  )
}
