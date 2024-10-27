import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import i18next, { t } from 'i18next'
import Calendar from '../../components/Calendar/basic'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'


function index() {

  const [items,setItems]=useState([])
  const data=useData()
  const {user} = useAuth()
  let required_data=['appointments','specialty_categories']
  const {pathname} = useLocation()


  
    useEffect(()=>{

            if(!user) return

              data._get(required_data) 
  },[user,pathname])


  
  useEffect(()=>{

      setItems(data._appointments.data?.map(i=>({
            event_id:Math.random(),
            title:`C. ${data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.pt_name} ${i.scheduled_hours}`,
            start: new Date(`${i.consultation_date.replaceAll('-','/')} ${i.scheduled_hours}`),
            end: new Date(`${i.consultation_date.replaceAll('-','/')} ${data.timeAfter30Minutes(i.scheduled_hours)}`),
            color: i.status=="pending" ? 'orange':'blue',
      })))




},[data._appointments,data._specialty_categories])
  






  

  return (
    
        <DefaultLayout pageContent={{title:t('menu.scheduler'),desc:t('titles.scheduler')}}>
                <div className="max-w-[900px] items-start gap-x-7 mt-5 w-full">
                      <Calendar items={items}/>
                </div>
        </DefaultLayout>
  )


}

export default index