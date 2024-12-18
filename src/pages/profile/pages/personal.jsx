import React from 'react'
import FormLayout from '../../../layout/DefaultFormLayout'
import { t } from 'i18next'
import { useAuth } from '../../../contexts/AuthContext'
import PatientForm from '../../../components/Patient/form'
import FileInput from '../../../components/Inputs/file'

function PersonalPage({verified_inputs,form,setVerifiedInputs,setForm,formStep,handleUploadedFiles}) {

    const {user} = useAuth()

    return (
        
       <div className="flex flex-wrap gap-x-2 w-full">
           {user?.role=="doctor" && <div className="flex items-center w-full">
            <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="ml-1">{t('common.cannot-edit-information')}</span>
           </div>}
           <PatientForm  formStep={formStep} form_name={user?.role} cannot_edit={user?.role=="doctor"}  itemsToHide={ user?.role=="patient" ?  ['password','medical-specialty','order-number','email','years_of_expireince'] : ['password','email','insurance_company','policy_number']} form={form} setForm={setForm} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>
           {formStep==1 && <div className="flex gap-x-4 flex-wrap gap-y-8 mt-5">
              {form.identification_document=="identification_number" &&  <FileInput  _upload={{key:'identification_number_filename',filename:form.identification_number_filename}} res={handleUploadedFiles} label={t('form.identification-number')} r={true}/>}
              {form.identification_document=="birth_certificate" &&  <FileInput _upload={{key:'birth_certificate_filename',filename:form.birth_certificate_filename}} res={handleUploadedFiles} label={t('form.birth-certificate')} r={true}/>}
              {form.identification_document=="passport_number" &&  <FileInput _upload={{key:'passport_number_filename',filename:form.passport_number_filename}} res={handleUploadedFiles} label={t('form.passport-number')} r={true}/>}
             </div>}

        
            
       </div>
    )
}

export default PersonalPage