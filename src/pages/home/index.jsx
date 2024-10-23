import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';



function App() {

 
  const data=useData()
  const { t, i18n } = useTranslation();
  const {user} = useAuth()

  const navigate = useNavigate()

 
  return (
   
         <DefaultLayout pageContent={{title:t('common.welcome'),btn:{onClick:user?.role=="patient" ? (e)=>{
             // if(!user?.date_of_birth){
               // data._showPopUp('basic_popup','conclude_patient_info')
              //}else{
                navigate('/add-appointments')
              //}
         } : null,text:t('menu.add-appointments')}}}>
          
         </DefaultLayout>
  );
}

export default App;
