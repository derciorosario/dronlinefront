import { t } from 'i18next'
import React from 'react'
import ButtonLoader from '../Loaders/button'
import Messages from '../../pages/messages'
import { useData } from '../../contexts/DataContext'
import _var from '../../assets/vaiables.json'

function RecoverPasswordModal({form,show,status,setShow,loading,SubmitForm,setForm,message,setMessage,resendCode,setStatus}) {
 const data=useData()
 
 return (
<div id="authentication-modal" tabindex="-1" aria-hidden="true" class={`bg-[rgba(0,0,0,0.4)] overflow-y-auto overflow-x-hidden ${show ? '' :'translate-y-10 opacity-0 pointer-events-none'} transition-all delay-150 ease-linear flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    <div class="relative p-4 w-full max-w-md max-h-full">
      
        <div class="relative bg-white rounded-lg shadow">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900">{t('common.recover-password')}</h3>
                {!loading && <button onClick={()=>{
                    setShow(false)
                    setMessage('')
                }} type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>}
            </div>
           
            <div class="p-4 md:p-5">
                <div class="space-y-4" action="#">
                    {(status=="code_sent") && <div>
                         <p className="text-gray-600">{t('common.email-sent')} <span className="text-honolulu_blue-500">{form.email}.</span> 
                         
                         {!loading && <button onClick={()=>{
                            setStatus('code_not_sent')
                            document.querySelector('#email').focus()
                         }} className="text-[0.8rem] underline border text-honolulu_blue-500 px-1 py-[2px] rounded-[0.3rem]">{t('common.change-email')}</button>}
                         
                         </p>
                  
                    </div>}

                    
                     {status=="code_not_sent" && <p className="text-gray-600">{t('messages.recover-password-msg')}</p> }
                    

                       <Messages type={'red'} setMessage={setMessage} message={message}/>

                        <div>

                                    {status=="code_not_sent" && <div>
                                    <label for="email_" class="block mb-2 text-sm font-medium">Email</label>
                                    <input onChange={(e)=>setForm({...form,email:e.target.value})} type="email" id="email_" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder=""/>
                                    </div>}

                                    {status=="code_sent" && <div>
                                        <label for="code" class="block mb-2 text-sm font-medium text-gray-900">{t('common.verification-code')}</label>
                                        <input value={form.code} onChange={(e)=>setForm({...form,code:e.target.value.replace(/[^0-9]/g, '')})} type="text" name="code" id="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                                    </div>}
                                
                        </div>
                   
                    <button onClick={SubmitForm} type="submit" class={`text-white ${loading ? 'pointer-events-none':''}  ${((!form.email && status=="code_not_sent") || (!form.code && status=="code_sent")) ? ' bg-gray-400  pointer-events-none':'bg-blue-700 hover:bg-blue-800'} flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}>
                       {loading && <ButtonLoader/>}
                      <span>{loading ? t('common.loading') +"..." : t('common.send')}</span>
                    </button>


                    {(status=="code_sent" && !loading) && <div class="text-sm font-medium text-gray-500 text-center">
                        <a onClick={resendCode} href="#" class="text-honolulu_blue-500   hover:underline">{t('common.resend-code')}</a>
                    </div>}
                </div>
            </div>
        </div>
    </div>
</div> 

  )
}

export default RecoverPasswordModal