import React from 'react'
import FormLayout from '../../../layout/DefaultFormLayout'
import { t } from 'i18next'
import { useAuth } from '../../../contexts/AuthContext'
import PatientForm from '../../../components/Patient/form'

function PersonalPage({verified_inputs,form,setVerifiedInputs,setForm}) {

    const {user} = useAuth()

    

    return (
        
        <PatientForm  form_name={'patient'} cannot_edit={user?.role=="doctor"}  itemsToHide={['password','medical-specialty','order-number']} form={form} setForm={setForm} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>

    )
}

export default PersonalPage