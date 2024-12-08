import { t } from 'i18next'
import React, { useState } from 'react'
import ButtonLoader from '../Loaders/button'
import Messages from '../../pages/messages'
import { useData } from '../../contexts/DataContext'
import _var from '../../assets/vaiables.json'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function ChangePasswordModal({status}) {
 const data=useData()
 const {user,setUser} = useAuth()
 const navigate=useNavigate()


 const [loading,setLoading]=useState(false)
 const [form,setForm]=useState({})
 const [message,setMessage]=useState('')
 const {pathname} = useLocation()



 async function SubmitForm(){

     setLoading(true)

     try{

       if(form.confirm_password != form.new_password){
         setMessage(t('messages.password-mismatch'))
         setLoading(false)
         return
       }
     
       if(form.new_password.length <= 7){
         setMessage(t('messages.password-min-8'))
         setLoading(false)
         return
       }

       setMessage('')

       let r=await data.makeRequest({method:'post',url:`api/change-password`,withToken:true,data:{
         new_password:form.new_password,
         last_password:form.last_password,
       }, error: ``},0);

       setUser({...user,changed_password:true})
       data.setUpdateTable(Math.random())


       setLoading(false)
       toast.success(t('messages.updated-successfully'))
       
       
     }catch(e){
       setLoading(false)

       console.log({e})

       if(e.message==409){
         setMessage(t('common.last-password-incorrect'))
       }else if(e.message==500){
         setMessage(t('common.unexpected-error'))
       }else  if(e.message=='Failed to fetch'){
         setMessage(t('common.check-network'))
       }else{
         setMessage(t('common.unexpected-error'))
       }

     }

 }

 
 return (
<div id="authentication-modal" tabindex="-1" aria-hidden="true" class={`bg-[rgba(0,0,0,0.7)] overflow-y-auto overflow-x-hidden ${!user?.changed_password && !pathname?.includes('login') && user && user?.register_method!="google" ? '' :'translate-y-10 opacity-0 pointer-events-none'} transition-all delay-150 ease-linear flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    <div class="relative p-4 w-full max-w-[500px] max-h-full">
      
        <div class="relative bg-white rounded-lg shadow">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900">{t('common.start')}</h3>
                
            </div>
           
            <div class="p-4 md:p-5">
                <div class="space-y-4" action="#">
                    {(status=="code_sent") && <div>
                         <p className="text-gray-600">{t('common.email-sent')} <span className="text-honolulu_blue-500">{form.email}.</span> 
                         
                         {!loading && <button onClick={()=>{
                            document.querySelector('#email').focus()
                         }} className="text-[0.8rem] underline border text-honolulu_blue-500 px-1 py-[2px] rounded-[0.3rem]">{t('common.change-email')}</button>}
                         
                         </p>
                  
                    </div>}

                    <h2>{t('messages.redefine-initial-password',{name:user?.name})}</h2>
                    <p className="text-gray-600">{t('messages.set-initial-password')}</p> 
                    
                    <Messages type={'red'} setMessage={setMessage} message={message}/>

                    <div>
                            
                             <div className="mb-4">
                              <label for="last_password" class="block mb-2 text-sm font-medium">{t('form.last-password')}</label>
                              <input value={form.last_password} onChange={(e)=>setForm({...form,last_password:e.target.value})} type="password" id="last_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
                             </div>
                             <div className="mb-4">
                              <label for="last_password" class="block mb-2 text-sm font-medium">{t('form.new-password')}</label>
                              <input value={form.new_password} placeholder={t('messages.password-min-8')} onChange={(e)=>setForm({...form,new_password:e.target.value})} type="password" id="last_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                             </div>
                             <div className="mb-4">
                              <label for="last_password" class="block mb-2 text-sm font-medium">{t('form.new-password')}</label>
                              <input value={form.confirm_password} placeholder={t('messages.password-min-8')} onChange={(e)=>setForm({...form,confirm_password:e.target.value})} type="password" id="last_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                             </div>
                            
                    </div>
                   
                    <button onClick={SubmitForm} type="submit" class={`text-white ${loading ? 'pointer-events-none':''}  ${(!form.last_password || !form.new_password || !form.confirm_password) ? ' bg-gray-400  pointer-events-none':'bg-blue-700 hover:bg-blue-800'} flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}>
                       {loading && <ButtonLoader/>}
                      <span>{loading ? t('common.loading') +"..." : t('common.send')}</span>
                    </button>


                     <div class="text-sm font-medium text-gray-500 text-center">
                        <a onClick={()=>{
                             data.setIsLoading(true)
                             window.location.href="/login?recover-password=true"
                        }} href="#" class="text-blue-700   hover:underline">{t('common.recover-password')}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 

  )
}

export default ChangePasswordModal