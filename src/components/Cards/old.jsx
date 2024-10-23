import { t } from 'i18next'
import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'
import MuiCalendar from '../Calendar/mui-calendar'
import dayjs from 'dayjs';

function SelectDoctorAvailability({item,setItem}) {

    const data=useData()
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };
   
    return (

        <div  className={`w-full  h-[100vh] bg-[rgba(0,0,0,0.2)] ease-in _doctor_list ${!item ? 'opacity-0 pointer-events-none translate-y-[100px]':''} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>   
            
               <div class="w-full  overflow-y-auto  p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[600px]">    
               <div className="flex absolute mb-3 top-1 left-2">
                     
                      <span onClick={()=>{
                            
                       }} className="table px-1 bg-gray-200 py-1 rounded-full cursor-pointer hover:bg-gray-300">{t('common.go-back')}</span>
            
               </div>
   
             <div class="justify-between mb-4 mt-5">
   
             <h5 class="text-[20px] font-bold leading-none text-gray-900 ">{t('common.select-day-and-hour')}</h5>
   
             <div className="w-full  flex items-center">
                     <div>
                        <MuiCalendar selectedDate={selectedDate} handleDateChange={handleDateChange} setSelectedDate={setSelectedDate}/>
                     </div>
                 
             </div>
   
               <div onClick={()=>{
                  data.setSelectedDoctorToSchedule(null)
               }} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
               </div>         
   
             </div>
              </div>
        </div>       
     )




}

export default SelectDoctorAvailability