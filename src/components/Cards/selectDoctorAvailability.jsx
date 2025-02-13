import { t } from 'i18next';
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import MuiCalendar from '../Calendar/mui-calendar';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from '../Loaders/loader';
import { useAuth } from '../../contexts/AuthContext';
import { useHomeData } from '../../landingpage/contexts/DataContext';

function SelectDoctorAvailability({ item }) {
  const data = useData();
  const homeData = useHomeData()
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const navigate = useNavigate()
  const {user} = useAuth()
  const {pathname} = useLocation()

  const [settings,setSettings]=useState(null)

  const [afterAppointments,setAfterAppointments]=useState([])
  const [afterAppointmentsLoaded,setAfterAppointmentsLoaded]=useState([])

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    let date=new Date(newDate.$d).toISOString().split('T')[0]
    setSelectedDates({...selectedDates,[item?.id]:date})
    setSelectedWeekDays({...selectedWeekDays,[item?.id]:weeks[new Date(date).getDay()]})
    setSelectedDoctors({...selectedDoctors,[item?.id]:[]})
  };

  const [selectedWeekDays,setSelectedWeekDays] = useState({})
  const [selectedDates,setSelectedDates] = useState({})
  const {handleSelectDoctorAvailability,selectedDoctors,setSelectedDoctors} = useData()
  const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const [typeOfCare,setTypeOfCare]=useState(null)
  const [selectedMonth,setSelectedMonth]=useState(new Date(dayjs().$d).getMonth())
  const [closeToUrgentHours,seTcloseToUrgentHours]=useState([])
  const [urgentLimits,setUrgentLimits]=useState({minutes:0,hours:0})

 
  const formatTime = time => time.split(':').map(t => t.padStart(2, '0')).join(':')

  function getAvailableHours(item,type){
    
      if(!item?.id){
          return []
      }
      
      let date=selectedDates[item?.id] || new Date().toISOString().split('T')[0]
      if(type=="normal"){
          return (item?.availability?.unavailable_specific_date?.[date] ? [] : item?.availability?.specific_date?.[date] ? item?.availability.specific_date?.[date] : item?.urgent_availability?.specific_date?.[date] ? [] : !selectedWeekDays?.[item?.id] ? (item?.availability?.weekday?.[weeks?.[new Date().getDay()]] || []) : (item?.availability?.weekday?.[selectedWeekDays?.[item?.id]] || []))?.filter(i=>(date > data.serverTime?.date) ||  formatTime(i) > formatTime(data.serverTime?.hour)).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m)).filter(i=>!afterAppointments.some(a=>a.scheduled_date==date && a.scheduled_hours==i && a.id!=data.appointmentcancelationData?.consultation?.id))
      }else{
          return (item?.urgent_availability?.unavailable_specific_date?.[date] ? [] : item?.urgent_availability?.specific_date?.[date] ? item?.urgent_availability.specific_date?.[date] : item?.availability.specific_date[date] ? [] : !selectedWeekDays[item?.id] ? (item?.urgent_availability?.weekday?.[weeks?.[new Date().getDay()]] || []) : (item?.urgent_availability?.weekday?.[selectedWeekDays?.[item?.id]] || []))?.filter(i=>(date > data.serverTime?.date) ||  formatTime(i) > formatTime(data.serverTime?.hour)).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m)).filter(i=>!afterAppointments.some(a=>a.scheduled_date==date && a.scheduled_hours==i && a.id!=data.appointmentcancelationData?.consultation?.id))
      }

  }


  useEffect(() => {

    const observer = new MutationObserver(() => {
      const buttons = document.querySelectorAll('.MuiPickersArrowSwitcher-button');
      buttons.forEach((button) => {
        button.addEventListener('click', handleButtonNextMonthClick);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect(); 
    };
  }, []);


  const handleButtonNextMonthClick = () => {

     localStorage.setItem('changing_doctor_calendar',true)

     setTimeout(()=>{
        let firstActiveBtn=null
        document.querySelectorAll('.MuiPickersDay-root').forEach(btn=>{
          let day=parseInt(btn.textContent || null)
          if(!firstActiveBtn){
              if(!isNaN(day) && btn.style.pointerEvents=="visible" || btn.className.includes('Mui-selected')) {
                  firstActiveBtn=btn
              }
          }
        })

        firstActiveBtn.click()

        localStorage.removeItem('changing_doctor_calendar')

     },500)
   };

  useEffect(()=>{
    if(!settings) return

    let {urgent_consultation_limit_duration_hours,urgent_consultation_limit_duration_minutes} = settings

    setUrgentLimits({minutes:urgent_consultation_limit_duration_minutes,hours:urgent_consultation_limit_duration_hours})

  },[selectedDoctors,settings])


  function isUrgentByLimit(hour){


        if(!settings) return
        let {urgent_consultation_limit_duration_hours,urgent_consultation_limit_duration_minutes} = settings
        let selected_hour=hour
        let selected_date=selectedDates?.[item?.id] || data.serverTime?.date

       console.log({selected_hour})

        if(selected_date){
          if(new Date(selected_date).getDay()==0 || new Date(selected_date).getDay()==6){
            return true
          }
        }

        if(selected_date && selected_hour && data.serverTime?.date){

          const currentTime = new Date(`${data.serverTime?.date}T${formatTime(data.serverTime?.hour)}:00`);
          const consultationTime = new Date(`${selected_date}T${formatTime(selected_hour)}:00`);
          let {minutes} = data.getTimeDifference(currentTime,consultationTime)
          let minutes_limit=(parseInt(urgent_consultation_limit_duration_hours) * 60) + parseInt(urgent_consultation_limit_duration_minutes);
      
          return minutes < minutes_limit

        }

  }

  



 


  async function getSettings(){
      try{
        let response=await data.makeRequest({method:'get',url:`api/settings`,withToken:true, error: ``},0);
        return response[0].value
      }catch(e){
        return null
      }
  }



  async function getAppointmentsAfterDates(){

    setSettings(await getSettings())
    
    try{
      let r=await data.makeRequest({method:'post',url:`api/after-date-appointments`,withToken:true,data:{
       doctor_id:item?.id
      }, error: ``},0);

      if(localStorage.getItem('changing_doctor_calendar')){
        return
      }


      setAfterAppointments(r)
      setAfterAppointmentsLoaded(true)

   }catch(e){
       console.log({e})
   }

  }


  
  useEffect(() => {
      if(!item?.id){
        setAfterAppointments([])
        setAfterAppointmentsLoaded(false)
      }
  }, [item]);

  useEffect(() => {
    if(!item?.id) return

    getAppointmentsAfterDates()

    const interval = setInterval(() => {
        getAppointmentsAfterDates()
    }, 5000)

    return () => clearInterval(interval);
  }, [item]);



  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

 
  useEffect(()=>{

    if(!item?.id) return

    const interval = setInterval(() => {

            let available_days=[]
         
            let m=document.querySelector('.MuiPickersCalendarHeader-label').textContent.split(' ')[0].toLowerCase()
            let _year=document.querySelector('.MuiPickersCalendarHeader-label').textContent.split(' ')[1]
            let _month=months.findIndex(i=>i==m)
            let selected_month=_month
            let current_day=new Date().getDate()
            let current_month=new Date().getMonth()
            
            let d=data.getDatesForMonthWithBuffer(_month + 1, _year)
            let weekdaysAvailability=[item?.availability.weekday,item?.urgent_availability.weekday]

            let unavailable_dates=[]
            if(!Array.isArray(item?.availability.unavailable_specific_date)){
                unavailable_dates=Object.keys(item?.availability.unavailable_specific_date)
            }


            let unavailable_days=[]
            unavailable_dates.forEach(date=>{
              let day=new Date(date).getDate()
              let month=new Date(date).getMonth()
              if(month==selected_month){
                  unavailable_days.push(day)
              }
            })

           
            weekdaysAvailability.forEach((a,_a)=>{
              Object.keys(a).forEach((i,_i)=>{
                let index=weeks.findIndex(f=>f==i)
                d.filter(z=> new Date(z).getDay()==index && !unavailable_days.includes(new Date(z).getDate())).forEach(date=>{
                    let day=new Date(date).getDate()
                    let month=new Date(date).getMonth()
                    if(month==selected_month && !available_days.includes(day)){
                      available_days.push(day)
                    }    
                })
              })  
          })  


          try{

              setTimeout(()=>{
 
                  document.querySelectorAll('.MuiPickersDay-root').forEach(btn=>{
                    let day=parseInt(btn.textContent || null)
                    if(day){
                        if(!available_days.includes(day) || (day < current_day && _month==current_month)){
                              btn.style.opacity="0.2"
                              btn.style.pointerEvents="none"
                        }else{
                              btn.style.opacity="1"
                              btn.style.pointerEvents="visible"
                        }
                    }
                 })



              },200)

          }catch(e){
            console.log(e)
          }
 
     }, 200);

     return () => clearInterval(interval);

  },[item])

  return (
    <div className={`w-full h-[100vh] bg-[rgba(0,0,0,0.4)] ease-in pb-5  _doctor_list ${!item?.id ? 'opacity-0 pointer-events-none translate-y-[100px]' : 'z-[60]'} ease-in transition-all delay-75 fixed flex items-center justify-center`}>
      <div className="w-full  p-4  relative bg-white  max-h-[90vh] translate-y-3 max-md:max-h-[80vh] border overflow-y-auto border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[600px] max-md:max-w-[95%]">
        <div className="flex absolute mb-3 top-1 left-2">
          <span onClick={() => {

            data.setSelectedDoctorToSchedule({});
            homeData.setSelectedDoctorToSchedule({});

          }} className="table px-2 bg-gray-200 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
             {t('common.go-back')}
          </span>
        </div>

        <div className="justify-between mb-4 mt-10">
          
                 <h5 className="text-[17px] font-bold mb-5 leading-none text-gray-900 ">
                    {t('common.select-day-and-hour')}
                 </h5>

                 {(urgentLimits.minutes!=0 || urgentLimits.hours!=0) && <div className="flex items-center mb-5">
                    <svg class="flex-shrink-0 inline w-4 h-4 opacity-60" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="ml-2 text-[13px] text-orange-500">{(urgentLimits.minutes && urgentLimits.hours) ? t('messages.urgent-consultation-limit-with-hours-and-minutes',{minutes:urgentLimits.minutes,hours:urgentLimits.hours}) : urgentLimits.minutes ? t('messages.urgent-consultation-limit-with-minutes',{minutes:urgentLimits.minutes}) : t('messages.urgent-consultation-limit-with-hours',{hours:urgentLimits.hours})}</span>
                 </div>}

                  {(new Date(selectedDates?.[item?.id] || data.serverTime?.date).getDay()==0 || new Date(selectedDates?.[item?.id] || data.serverTime?.date).getDay()==6) && <div className="flex items-center mb-5">
                    <svg class="flex-shrink-0 inline w-4 h-4 opacity-60" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="ml-2 text-[13px] text-orange-500">{t('common.normal-consultation-are-urgent-on-the-weekends')}</span>
                 </div>}
                 
          <div className="w-full flex max-md:flex-col">
              <div>
                 <h5 className="text-[17px] font-medium leading-none text-gray-900 ">
                    {t('common.date')}
                 </h5>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MuiCalendar
                      selectedDate={selectedDate}
                      handleDateChange={handleDateChange}
                      setSelectedDate={setSelectedDate}
                      minDate={dayjs()}
                  />
                </LocalizationProvider>

              </div>
              <div className="flex-1 max-md:mb-5">

                  <h5 className="text-[17px] font-medium leading-none text-gray-900 ">
                    {t('common.hour')}
                  </h5>

                  <div className={`${afterAppointmentsLoaded ? 'hidden':'flex'} justify-center pt-10 items-center w-full`}>
                        <Loader/>
                  </div>

                  <div className={`flex flex-wrap mt-4 ${!afterAppointmentsLoaded ? 'hidden':''}`}>
                  <div className="mt-4 flex flex-col items-center justify-between">
                                   
                                    {(getAvailableHours(item,'normal').length!=0) && <div className="flex mb-5 justify-center flex-col items-center">
                                        <select  onChange={(e)=>{
                                            handleSelectDoctorAvailability(item,e.target.value)
                                            setTypeOfCare('normal')
                                        }} value={getAvailableHours(item,'normal').includes(selectedDoctors[item?.id]?.[0]) && typeOfCare=="normal" ? selectedDoctors[item?.id]?.[0] : ''}  class={`bg-gray text-[14px] w-[155px] border ${getAvailableHours(item,'normal').includes(selectedDoctors[item?.id]?.[0]) && typeOfCare=="normal" ? 'border-honolulu_blue-400':'border-gray-300'}  text-gray-900 text-sm rounded-full outline-none text-center  block  p-2`}>
                                            <option selected disabled value={""}>{t('common.set-timetable')}</option>
                                            {getAvailableHours(item,'normal').map((i,_i)=>(
                                                <option value={i}>{i} - {data.timeAfter30Minutes(i)} {(isUrgentByLimit(i) || data.isSetAsUrgentHour(i,settings || false)) ? `(${t('common.urgent').toLowerCase()})`:''}</option>
                                            ))}
                                        </select>
                                        <span className="text-[12px] text-gray-500 flex items-center gap-x-1">
                                          <span className="w-[10px] flex rounded-[0.1rem] h-[10px] bg-honolulu_blue-300"></span>
                                          {t('common.normal')}
                                        </span>
                                    </div>}     

                                    {getAvailableHours(item,'urgent').length!=0 && <div className="flex justify-center flex-col items-center">
                                        <select  onChange={(e)=>{
                                            handleSelectDoctorAvailability(item,e.target.value,'urgent')
                                            setTypeOfCare('urgent')
                                        }} value={getAvailableHours(item,'urgent').includes(selectedDoctors[item?.id]?.[0]) && typeOfCare=="urgent" ? selectedDoctors[item?.id]?.[0] : ''}  class={`bg-gray border  ${getAvailableHours(item,'urgent').includes(selectedDoctors[item?.id]?.[0])  && typeOfCare=="urgent" ? 'border-honolulu_blue-400':'border-gray-300'}  text-gray-900 text-sm rounded-full text-center outline-none  block text-[14px] w-[155px] p-2`}>
                                            <option selected disabled value={""}>{t('common.set-timetable')}</option>
                                            {getAvailableHours(item,'urgent').map((i,_i)=>(
                                                <option value={i}>{i} - {data.timeAfter30Minutes(i)}</option>
                                            ))}
                                        </select>
                                        <span className="text-[12px] text-gray-500 flex items-center gap-x-1">
                                          <span className="w-[10px] flex rounded-[0.1rem] h-[10px] bg-orange-200"></span>
                                          {t('common.urgent')}
                                        </span>
                                    </div> }

                                    {((getAvailableHours(item,'normal').length==0 && getAvailableHours(item,'urgent').length==0)) && <span className="text-[14px] text-gray-500">({t('common.no-availability-for-this-date')})</span>}
                            </div> 

                  </div>
              </div>
          </div>


          <div

            onClick={() => {

              data.setSelectedDoctorToSchedule({});
              homeData.setSelectedDoctorToSchedule({});
              homeData._closeAllPopUps()
              data._closeAllPopUps()

            }}

            className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </div>
        </div>

       
       
               <a href="#" onClick={()=>{

                   if((pathname.includes('/doctors-list') || pathname=="/") && user?.role!="patient"){
                      
                      homeData.setIsLoading(true)
                      window.location.href=(`/login?nextpage=add-appointments&scheduled_doctor=${item?.id}&type_of_care=${typeOfCare}&scheduled_hours=${selectedDoctors[item?.id]}&scheduled_date=${selectedDates[item?.id] || new Date().toISOString().split('T')[0]}&scheduled_weekday=${weeks[new Date(selectedDates[item?.id] || new Date().toISOString().split('T')[0]).getDay()]}`)
                      return
                    }

                    data._closeAllPopUps()
                    homeData._closeAllPopUps()
                    data.setPaymentInfo({doctor:item})
                    data.setSelectedDoctorToSchedule({});
                    homeData.setSelectedDoctorToSchedule({})
                    navigate(`/add-appointments?scheduled_doctor=${item?.id}&type_of_care=${typeOfCare}&scheduled_hours=${selectedDoctors[item?.id]}&scheduled_date=${selectedDates[item?.id] || new Date().toISOString().split('T')[0]}&scheduled_weekday=${weeks[new Date(selectedDates[item?.id] || new Date().toISOString().split('T')[0]).getDay()]}&canceled_appointment_id=${data.appointmentcancelationData?.consultation?.id || ''}`)
                    data.setAppointmentcancelationData({})
                }} class={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white ${selectedDoctors[item?.id]?.length ? 'bg-honolulu_blue-400':'bg-gray-500 pointer-events-none'} rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300`}>
                    {t('common.book')}
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
       </a>


       <div className="h-[75px] sm:hidden">{/*** for iphone browser bar */}</div>
       
      </div>
    </div>
  );
}

export default SelectDoctorAvailability;
