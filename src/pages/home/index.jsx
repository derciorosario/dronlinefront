import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';
import DashboardCard from '../../components/Cards/dashboardCard';
import AdminDashboard from './admin-dashboad';
import DoctorDashboard from './doctor-dashboard';
import PatientDashboard from './patient-dashboard';



function App() {
  const data=useData()
  const { t, i18n } = useTranslation();
  const {user} = useAuth()

  const navigate = useNavigate()

  const [endDate,setEndDate]=useState('')
  const [startDate,setStartDate]=useState('')

 
  return (

          <DefaultLayout showDates={true}  setStartDate={setStartDate} startDate={startDate} endDate={endDate} setEndDate={setEndDate} pageContent={{title:t('common.welcome'),btn:{onClick:user?.role=="patient" ? (e)=>{
                if(!user?.data?.date_of_birth){
                  data._showPopUp('basic_popup','conclude_patient_info')
                }else{
                  navigate('/add-appointments')
                }
          } : null,text:t('menu.add-appointments')}}}>
            

          <div className="mb-10">
                {user?.role=="patient" && <PatientDashboard setStartDate={setStartDate} startDate={startDate} endDate={endDate} setEndDate={setEndDate}/>}
                {(user?.role=="admin" || user?.role=="manager") && <AdminDashboard setStartDate={setStartDate} startDate={startDate} endDate={endDate} setEndDate={setEndDate}/>}
                {user?.role=="doctor" && <DoctorDashboard setStartDate={setStartDate} startDate={startDate} endDate={endDate} setEndDate={setEndDate}/>}
          </div>

         </DefaultLayout>
  );
}

export default App;
