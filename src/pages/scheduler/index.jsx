import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import i18next, { t } from 'i18next'
import Calendar from '../../components/Calendar/basic'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useParams } from 'react-router-dom'


function index() {

  const [items,setItems]=useState([])
  const data=useData()
  const {user} = useAuth()
  let required_data=['specialty_categories','upcoming_appointments']
  const {pathname} = useLocation()
  const { id } = useParams()


  useEffect(()=>{
      if(!user) return
      data.handleLoaded('remove',['upcoming_appointments'])
      data._get(required_data,{upcoming_appointments:{doctor_id:id}}) 
      data._get(required_data)
  },[user,pathname])

  
  useEffect(()=>{
      setItems(data._upcoming_appointments?.map(i=>({
            event_id:Math.random(),
            title:`C. ${data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.[i18next.language+"_name"]} ${i.scheduled_hours} - ${t('common.'+i.status)}`,
            start: new Date(`${i.consultation_date.replaceAll('-','/')} ${i.scheduled_hours}`),
            end: new Date(`${i.consultation_date.replaceAll('-','/')} ${data.timeAfter30Minutes(i.scheduled_hours)}`),
            color: i.status=="pending" ? 'orange':i.status=="approved" ? 'green' : i.status=="canceled" ? 'red' : 'blue',
      })))
},[data._upcoming_appointments,data._specialty_categories,data.updateTable])
  
      return (
            <DefaultLayout  refreshOnUpdate={true} pageContent={{title:t('menu.scheduler'),desc:t('titles.scheduler')}}>
                  <div className="max-w-[900px] items-start gap-x-7 mt-5 w-full">
                        <Calendar items={items}/>
                  </div>
            </DefaultLayout>
      )

}

export default index