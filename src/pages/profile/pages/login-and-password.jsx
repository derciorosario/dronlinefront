import React from 'react'
import FormLayout from '../../../layout/DefaultFormLayout'
import { t } from 'i18next'
import { useAuth } from '../../../contexts/AuthContext'
import { useData } from '../../../contexts/DataContext'

function LoginPage({verified_inputs,form,setVerifiedInputs,setForm}) {
    
    const {user} = useAuth()
    const data=useData()

    return (

        <>
                    <FormLayout.Input hide={user?.register_method=="google" && user?.changed_password==false} verified_inputs={verified_inputs} form={form} r={true} type={'password'} onBlur={()=>setVerifiedInputs([...verified_inputs,'last_password'])} label={t('form.last-password')} onChange={(e)=>setForm({...form,last_password:e.target.value})} field={'last_password'} value={form.last_password}/>
                    <FormLayout.Input placeholder={t('messages.password-min-8')} verified_inputs={verified_inputs} form={form} r={true} type={'password'}  onBlur={()=>setVerifiedInputs([...verified_inputs,'new_password'])}  label={t('form.new-password')} onChange={(e)=>setForm({...form,new_password:e.target.value})} field={'password'} value={form.new_password}/>
                <FormLayout.Input placeholder={t('messages.password-min-8')} verified_inputs={verified_inputs} type={'password'} form={form} onBlur={()=>setVerifiedInputs([...verified_inputs,'confirm_password'])} label={t('form.confirm-new-password')} onChange={(e)=>setForm({...form,confirm_password:e.target.value})} field={'confirm_password'} value={form.confirm_password}/>    
                    {!(user?.register_method=="google" && user?.changed_password==false) && <div class="text-sm font-medium text-gray-500 w-full mt-5">
                        <a onClick={()=>{
                             data.setIsLoading(true)
                             window.location.href="/login?recover-password=true"
                        }} href="#" class="text-honolulu_blue-400   hover:underline">{t('common.recover-password')}</a>
                    </div>  }  
      
        </>

    )
}

export default LoginPage