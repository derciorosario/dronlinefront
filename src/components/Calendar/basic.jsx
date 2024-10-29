import { Scheduler } from "@aldabil/react-scheduler";
import { el, pt } from "date-fns/locale"; // Import Portuguese locale
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { useParams } from 'react-router-dom'
import { useEffect } from "react";
import i18next, { t } from 'i18next'
import Loader from "../Loaders/loader";


const Calendar = ({items}) => {

  const {user} = useAuth()
  const data=useData()
  const {pathname} = useParams()
  const [doctorData,setDoctorData]=useState(null)
  const [events,setEvents]=useState([])

  const customTranslations = {
    noData: "Nenhum dado a exibir",
    navigation: {
      month: "Mês",
      week: "Semana",
      day: "Dia",
      today: "Hoje",
    },
    form: {
      addTitle: "Adicionar Evento",
      editTitle: "Editar Evento",
      confirm: "Confirmar",
      delete: "Apagar",
      cancel: "Cancelar",
    },
    event: {
      title: "Título",
      start: "Início",
      subtitle: "Subtítulo", 
      end: "Fim",
      allDay: "Todo o Dia",
    },
    moreEvents: "Mais eventos",
  };

  const handleEventDelete = (eventId) => {
    console.log("Deletion prevented for event ID:", eventId);
  };

  const handleViewChange = (view, start, end) => {
    const currentMonth = start.toLocaleString('default', { month: 'long' });
    console.log(`Current month being displayed: ${currentMonth}`);
  };


  const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  const [currentDate,setCurrentDate]=useState(new Date())

  const [_dates,setDates]=useState([])




  
 

  
  
  
  
  useEffect(()=>{

    if(!data._loaded.includes('appointments')) return

    if(user?.role=="doctor"){

    if(!doctorData) return
    
    let d=data.getDatesForMonthWithBuffer(currentDate.getMonth() + 1, currentDate.getFullYear())

    let _events=[]

    let _doctorData=JSON.parse(JSON.stringify(doctorData))

    let weekdaysAvailability=[_doctorData.availability.weekday,_doctorData.urgent_availability.weekday]

    let specificDates=[
      Array.isArray(_doctorData.availability.specific_date) ? {} : _doctorData.availability.specific_date,
      Array.isArray(_doctorData.urgent_availability.specific_date) ? {} : _doctorData.urgent_availability.specific_date
    ]

    let unavailable_dates=[]

    if(!Array.isArray(_doctorData.availability.unavailable_specific_date)){
        unavailable_dates=Object.keys(_doctorData.availability.unavailable_specific_date)
    }


    let specific_dates=[]

    specificDates.forEach((a,_a)=>{
       Object.keys(a).forEach(date=>{

         a[date].forEach(hour=>{
            _events.push({
              event_id:Math.random(),
              title:_a==0  ? `${t('common._availability')} ${hour}` :   `${t('common._availability')} (${t('common.urgent')}) ${hour}`  ,
              start: new Date(`${date.replaceAll('-','/')} ${hour}`),
              end: new Date(`${date.replaceAll('-','/')} ${data.timeAfter30Minutes(hour)}`),
              color: _a==0 ? '#1565c0' : 'red',
            })
         })
         
         specific_dates.push(date)

       })
    })
   

    weekdaysAvailability.forEach((a,_a)=>{

      Object.keys(a).forEach((i,_i)=>{
            a[i].forEach(hour=>{
                let index=weeks.findIndex(f=>f==i)
                d.filter(i=>new Date(i).getDay()==index && !specific_dates.includes(i) && !unavailable_dates.includes(i)).forEach(date=>{
                    _events.push({
                      event_id:Math.random(),
                      title:_a==0  ? `${t('common._availability')} ${hour}` :   `${t('common._availability')} (${t('common.urgent')}) ${hour}`  ,
                      start: new Date(`${date.replaceAll('-','/')} ${hour}`),
                      end: new Date(`${date.replaceAll('-','/')} ${data.timeAfter30Minutes(hour)}`),
                      color: _a==0 ? '#1565c0' : 'red',
                  })
                })
            })
      })   
    })

    setEvents([..._events,...(items || [])])
  }else{
    setEvents((items || []))
  }


  },[currentDate,doctorData,data._loaded,data.updateTable])

  const handleDateChange = (date) => {
    const currentMonth = date.toLocaleString("default", { month: "long" });
    console.log(`Currently viewing the month of: ${currentMonth}`);
    setCurrentDate(date)
  };

  
  useEffect(()=>{

    if(!user){
        return
    }

    if(user?.role!="doctor"){
       return
    }
  
    (async()=>{
      try{
       let response=await data.makeRequest({method:'get',url:`api/doctor/`+user.data.id,withToken:true, error: ``},100);
       setDoctorData(response)
      }catch(e){
        console.log({e})
      }
  })()
  
},[user,pathname])



  return (

    <>
             
              <div className={`w-full h-[50vh] ${(doctorData || user?.role!="doctor") ? 'hidden':'flex'} items-center justify-center`}>
                  <div className="flex flex-col items-center justify-center">
                      <Loader/>
                      <span className="flex mt-2">{t('common.loading')}...</span>
                  </div>
              </div>

              <div style={{ width: "100%", height: "100vh", opacity:(!doctorData && user?.role=="doctor") || (!data._loaded.includes('appointments') && user?.role=="patient") ? 0 : 1}}>
                  <Scheduler
                    translations={customTranslations}
                    locale={pt}
                    hourFormat="24"
                    view="month"
                    onSelectedDateChange={handleDateChange}
                    editable={true}
                    onEventDelete={handleEventDelete}
                    events={events.map(i=>({...i, editable: false,deletable: false,}))}
                />
            </div>
    </>
    
  );
  
};

export default Calendar;
