import React from 'react'
import FormLayout from '../../../layout/DefaultFormLayout'
import { t } from 'i18next'
import { useAuth } from '../../../contexts/AuthContext'
import PatientForm from '../../../components/Patient/form'
import FileInput from '../../../components/Inputs/file'

function PersonalPage({verified_inputs,form,setVerifiedInputs,setForm,formStep,handleUploadedFiles}) {

    const {user} = useAuth()

    return (
        
       <div>
            <PatientForm  formStep={formStep} form_name={user?.role} cannot_edit={user?.role=="doctor"}  itemsToHide={ user?.role=="patient" ?  ['password','medical-specialty','order-number','email','years_of_expireince'] : ['password','email']} form={form} setForm={setForm} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>
           {formStep==1 && <div className="flex gap-x-4 flex-wrap gap-y-8 mt-5">
              {form.identification_document=="identification_number" &&  <FileInput  _upload={{key:'identification_number_filename',filename:form.identification_number_filename}} res={handleUploadedFiles} label={t('form.identification-number')} r={true}/>}
              {form.identification_document=="birth_certificate" &&  <FileInput _upload={{key:'birth_certificate_filename',filename:form.birth_certificate_filename}} res={handleUploadedFiles} label={t('form.birth-certificate')} r={true}/>}
              {form.identification_document=="passport_number" &&  <FileInput _upload={{key:'passport_number_filename',filename:form.passport_number_filename}} res={handleUploadedFiles} label={t('form.passport-number')} r={true}/>}
             </div>}
            
       </div>
    )
}

export default PersonalPage