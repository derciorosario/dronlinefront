import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import FileInput from '../Inputs/file'
import FormLayout from '../../layout/DefaultFormLayout'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'


function AddStampAndSignature({form,setForm,loading,show,setShow,itemToShow}) {
  const data=useData()
  const {user} = useAuth()
  const { id } = useParams()

  useEffect(()=>{
      if(!user) return
  },[user])

  async function handleUploadedFiles(upload){
      setForm({...form,[upload.key]:upload.filename})
  }




  return (

  <div  className={`w-full  left-0 top-0 h-[100vh] bg-[rgba(0,0,0,0.4)] ease-in  add_stamp_and_signature ${show ? '':'opacity-0 pointer-events-none translate-y-[100px]'} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>   
          <div class="w-full h-[90vh] max-md:h-[100vh] overflow-y-auto  p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[550px]">
                    
           <div class="flex items-center justify-between mb-4">
            
            <h5 class="text-xl max-sm:text-[14px] font-bold leading-none text-gray-900 flex items-center">
                 {t('common.add-signature-and-stamp')}
            </h5>

            <div onClick={()=>{
              setShow(false)
            }} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div> 

          </div>
  <div>

  <div>
    <span className="text-[0.9rem] text-gray-600">{t('common.signature-and-stamp-needed-for-docs')}</span>
  </div>

  <div className="w-full">
          <div className="gap-x-4 flex-wrap mt-4">
              {(itemToShow?.action=="create" || form.id) && <FileInput r={true} onlyImages={true} _upload={{key:'signature_filename',filename:form.signature_filename}} res={handleUploadedFiles} label={t('common.signature')}/>}
              <div className="w-[300px] flex items-center justify-center bg-gray-300 h-[100px] rounded-[0.3rem]">
                  {!form.signature_filename && <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                  </svg>}
                  {form.signature_filename && <img className="object-cover border w-auto h-full" src={form.signature_filename}/>}
              </div>
         </div>
         <div className="gap-x-4 flex-wrap mt-4">
                {(itemToShow?.action=="create" || form.id)  && <FileInput r={true} onlyImages={true} _upload={{key:'stamp_filename',filename:form.stamp_filename}} res={handleUploadedFiles} label={t('common.stamp')}/>}
                
                 {/***{(!user?.data?.stamp_filename && !form.stamp_filename) && <span onClick={()=>{
                    setForm(prev=>({...prev,
                      stamp_filename:user?.data.stamp_filename
                    }))
                }} className="text-[0.9rem] underline text-honolulu_blue-400 cursor-pointer">{t('common.get-from-profile')}</span>} */}
              <div className="w-[300px] flex items-center justify-center bg-gray-300 h-[100px] rounded-[0.3rem]">
                  {!form.stamp_filename && <svg class="w-8 h-8 stroke-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" stroke="stroke-current" stroke-width="1.6" stroke-linecap="round"></path>
                  </svg>}
                  {form.stamp_filename && <img className="object-cover border w-auto h-full" src={form.stamp_filename}/>}
              </div>
        </div>
</div>


       <div>
                <div className="flex items-center mt-2">
                                   <label>

                                      <input onClick={()=>{
                                            setForm({...form,save_signatures_in_profile:!form.save_signatures_in_profile})
                                      }} checked={form.save_signatures_in_profile} type="checkbox" className="mr-1"/>
                                      <span>{t('common.want-to-save-signs-for-all-docs')}</span>

                                   </label>
               </div>
       </div>

                       
       <div className="mt-5">
              <FormLayout.Button onClick={()=>{
                  setShow(false)
              }} valid={form.signature_filename && form.stamp_filename} loading={loading} label={t('common.continue')}/>
        </div> 



          </div>


           </div>
     </div>
           
  )
}

export default AddStampAndSignature