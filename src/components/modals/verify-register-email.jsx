import { t } from 'i18next'
import React from 'react'
import ButtonLoader from '../Loaders/button'
import Messages from '../../pages/messages'
import { useData } from '../../contexts/DataContext'
import _var from '../../assets/vaiables.json'

function VerifyRegisterEmail({form,show,success,setShow,loading,SubmitForm,setForm,message,setMessage,resendCode}) {
 const data=useData()
 
 return (
<div id="authentication-modal" tabindex="-1" aria-hidden="true" class={`bg-[rgba(0,0,0,0.4)] overflow-y-auto overflow-x-hidden ${show ? '' :'translate-y-10 opacity-0 pointer-events-none'} transition-all delay-150 ease-linear flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    <div class="relative p-4 w-full max-w-md max-h-full">
      
        <div class="relative bg-white rounded-lg shadow">
           
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900">
                    {data.auth.type!="google" ? t('common.confim-your-email') : t('common.your-contact')}
                </h3>
                {!loading && <button onClick={()=>setShow(false)} type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>}
            </div>
           
            <div class="p-4 md:p-5">
                <div class="space-y-4" action="#">
                    {(data.auth.type!="google" && !success) && <div>
                         <p className="text-gray-600">{t('common.email-sent')} <span className="text-honolulu_blue-500">{form.email}.</span> 
                         
                         {!loading && <button onClick={()=>{
                            setShow(false)
                            document.querySelector('#email').focus()
                         }} className="text-[0.8rem] underline border text-honolulu_blue-500 px-1 py-[2px] rounded-[0.3rem]">{t('common.change-email')}</button>}
                         
                         </p>
                  
                    </div>}

                    {(data.auth.type=="google" && !success) && <div>
                         <p className="text-gray-600">{t('common.add-your-contact')}</p> 
                    </div>}

                     <Messages type={'red'} setMessage={setMessage} message={message}/>

                    <div>
                            {data.auth.type=="google" ? (
                                <div>
                                <label for="_contact" class="block mb-2 text-sm font-medium text-gray-900">{t('form.contact')}</label>
                               
                                <div className="flex items-center">
                                    <select  onChange={(e)=>setForm({...form,contact_code:e.target.value})} value={form.contact_code} class={`bg-gray w-[90px] mr-1 border border-gray-300  text-gray-900 text-sm rounded-[0.4rem] focus:ring-blue-500 focus:border-blue-500 block p-2.5`}>
                                    {_var.contry_codes.map(i=>(
                                        <option selected={form.contact_code==i.code ? true : false}  value={i.code}>+{i.code}</option>
                                    ))}
                                    </select> 
                                    <input value={form.main_contact} onChange={(e)=>setForm({...form,main_contact:e.target.value.replace(/[^0-9]/g, '')})} type="text" name="_contact" id="_contact" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                               
                                </div>
                      
                               
                                </div>
                            ) : (

                                <div>
                                <label for="code" class="block mb-2 text-sm font-medium text-gray-900">{t('common.verification-code')}</label>
                                <input value={form.code} onChange={(e)=>setForm({...form,code:e.target.value.replace(/[^0-9]/g, '')})} type="text" name="code" id="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                              
                              </div>

                            )}
                    </div>
                   
                    <button onClick={SubmitForm} type="submit" class={`text-white ${loading ? 'pointer-events-none':''}  ${(form.code && data.auth.type!="google") || (data.auth.type=="google" && form.main_contact) ? 'bg-blue-700 hover:bg-blue-800':'bg-gray-400  pointer-events-none'} flex items-center justify-center focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center`}>
                       {loading && <ButtonLoader/>}
                      <span>{loading ? t('common.loading') +"..." : t('common.register')}</span>
                    </button>


                    {(!loading  && data.auth.type!="google") && <div class="text-sm font-medium text-gray-500 text-center">
                        <a onClick={resendCode} href="#" class="text-blue-700   hover:underline">{t('common.resend-code')}</a>
                    </div>}
                </div>
            </div>
        </div>
    </div>
</div> 

  )
}

export default VerifyRegisterEmail