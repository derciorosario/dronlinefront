import { t } from 'i18next';
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import MuiCalendar from '../Calendar/mui-calendar';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SelectDoctorAvailability({ item, setItem }) {
  const data = useData();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const navigate = useNavigate()

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    let date=new Date(newDate.$d).toISOString().split('T')[0]
    setSelectedDates({...selectedDates,[item.id]:date})
    setSelectedWeekDays({...selectedWeekDays,[item.id]:weeks[new Date(date).getDay()]})
    setSelectedDoctors({...selectedDoctors,[item.id]:[]})
  };

  const [selectedWeekDays,setSelectedWeekDays] = useState({})
  const [selectedDates,setSelectedDates] = useState({})
  const {handleSelectDoctorAvailability,selectedDoctors,setSelectedDoctors} = useData()
  const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const [typeOfCare,setTypeOfCare]=useState(null)
  const [selectedMonth,setSelectedMonth]=useState(new Date(dayjs().$d).getMonth())

  function getAvailableHours(item,type){

    if(!item?.id){
        return []
    }
    let date=selectedDates[item.id] || new Date().toISOString().split('T')[0]
    if(type=="normal"){
        return (item.availability.unavailable_specific_date[date] ? [] : item.availability.specific_date[date] ? item.availability.specific_date[date] : item.urgent_availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.availability.weekday[weeks[new Date().getDay()]] || []) : (item.availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m))
    }else{
        return (item.urgent_availability.unavailable_specific_date[date] ? [] : item.urgent_availability.specific_date[date] ? item.urgent_availability.specific_date[date] : item.availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.urgent_availability.weekday[weeks[new Date().getDay()]] || []) : (item.urgent_availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m))
    }
  }


  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
   
  useEffect(()=>{

    if(!item?.id) return

    const interval = setInterval(() => {

            let available_days=[]
            //let days=Array.from({ length:31 }, () => 0).map((i,_i)=>_i+1)
           
            let m=document.querySelector('.MuiPickersCalendarHeader-label').textContent.split(' ')[0].toLowerCase()
            let _year=document.querySelector('.MuiPickersCalendarHeader-label').textContent.split(' ')[1]
            let _month=months.findIndex(i=>i==m)
            let selected_month=_month
            
            console.log({_year,_month})
            
            let d=data.getDatesForMonthWithBuffer(_month + 1, _year)
            let weekdaysAvailability=[item.availability.weekday,item.urgent_availability.weekday]

            let unavailable_dates=[]
            if(!Array.isArray(item.availability.unavailable_specific_date)){
                unavailable_dates=Object.keys(item.availability.unavailable_specific_date)
            }


            let unavailable_days=[]
            unavailable_dates.forEach(date=>{
              let day=new Date(date).getDate()
              let month=new Date(date).getMonth()
              if(month==selected_month){
                  unavailable_days.push(day)
              }
            })

            //console.log({unavailable_days,d})

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
                        if(!available_days.includes(day)){
                              btn.style.opacity="0.4"
                              btn.style.pointerEvents="none"
                        }else{
                              btn.style.opacity="1"
                              btn.style.pointerEvents="visible"
                        }
                    }
                })
              },200)
          }catch(e){
            console.log(w)
          }
 
     }, 200);

     return () => clearInterval(interval);

  },[item])

 
  return (
    <div className={`w-full h-[100vh] bg-[rgba(0,0,0,0.2)] ease-in _doctor_list ${!item?.id ? 'opacity-0 pointer-events-none translate-y-[100px]' : ''} ease-in transition-all delay-75 fixed flex items-center justify-center z-[60]`}>
      <div className="w-full overflow-y-auto p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[600px]">
        <div className="flex absolute mb-3 top-1 left-2">
          <span onClick={() => {
            data.setSelectedDoctorToSchedule({});
          }} className="table px-2 bg-gray-200 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
            {t('common.go-back')}
          </span>
        </div>

        <div className="justify-between mb-4 mt-5">
          
                 <h5 className="text-[17px] font-bold mb-5 leading-none text-gray-900 ">
                    {t('common.select-day-and-hour')}
                 </h5>
          <div className="w-full flex">
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
              <div className="flex-1">
                  <h5 className="text-[17px] font-medium leading-none text-gray-900 ">
                    {t('common.hour')}
                  </h5>
                  <div className="flex flex-wrap mt-4">


                  <div className="mt-4 flex flex-col items-center justify-between">
                                    {(getAvailableHours(item,'normal').length!=0) && <div className="flex mb-5 justify-center flex-col items-center">
                                        <select  onChange={(e)=>{
                                            handleSelectDoctorAvailability(item,e.target.value)
                                            setTypeOfCare('normal')
                                        }} value={getAvailableHours(item,'normal').includes(selectedDoctors[item.id]?.[0]) && typeOfCare=="normal" ? selectedDoctors[item.id]?.[0] : ''}  class={`bg-gray text-[14px] w-[155px] border ${getAvailableHours(item,'normal').includes(selectedDoctors[item.id]?.[0]) && typeOfCare=="normal" ? 'border-honolulu_blue-400':'border-gray-300'}  text-gray-900 text-sm rounded-full outline-none text-center  block  p-2`}>
                                            <option selected disabled value={""}>{t('common.set-timetable')}</option>
                                            {getAvailableHours(item,'normal').map((i,_i)=>(
                                                <option value={i}>{i} - {data.timeAfter30Minutes(i)}</option>
                                            ))}
                                        </select>
                                        <span className="text-[12px] text-gray-500 flex items-center gap-x-1">
                                          <span className="w-[10px] flex rounded-[0.1rem] h-[10px] bg-honolulu_blue-300"></span>
                                          {t('common.normal')}
                                        </span>
                                    </div> }


                            

                                    {getAvailableHours(item,'urgent').length!=0 && <div className="flex justify-center flex-col items-center">
                                        <select  onChange={(e)=>{
                                            handleSelectDoctorAvailability(item,e.target.value,'urgent')
                                            setTypeOfCare('urgent')
                                        }} value={getAvailableHours(item,'urgent').includes(selectedDoctors[item.id]?.[0]) && typeOfCare=="urgent" ? selectedDoctors[item.id]?.[0] : ''}  class={`bg-gray border  ${getAvailableHours(item,'urgent').includes(selectedDoctors[item.id]?.[0])  && typeOfCare=="urgent" ? 'border-honolulu_blue-400':'border-gray-300'}  text-gray-900 text-sm rounded-full text-center outline-none  block text-[14px] w-[155px] p-2`}>
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
                    data._closeAllPopUps()
                    data.setPaymentInfo({doctor:item})
                    data.setSelectedDoctorToSchedule({});
                    navigate(`/add-appointments?scheduled_doctor=${item.id}&scheduled_hours=${selectedDoctors[item.id]}&scheduled_date=${selectedDates[item.id] || new Date().toISOString().split('T')[0]}&scheduled_weekday=${weeks[new Date(selectedDates[item.id] || new Date().toISOString().split('T')).getDay()]}`)
                }} class={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white ${selectedDoctors[item.id]?.length ? 'bg-honolulu_blue-400':'bg-gray-500 pointer-events-none'} rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300`}>
                    {t('common.book')}
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
       </a>



      </div>
    </div>
  );
}

export default SelectDoctorAvailability;
