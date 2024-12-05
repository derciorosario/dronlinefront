import React from 'react'
import DoctorImg1 from '../../assets/images/doctors/1.png'
import i18next, { t } from 'i18next'
import { useHomeData } from '../../contexts/DataContext'
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useHomeAuth } from '../../contexts/AuthContext'



function DoctorList({max,items,animate}) {


  const [selectedWeekDays,setSelectedWeekDays] = useState({})
  const [selectedDates,setSelectedDates] = useState({})
  const {handleSelectDoctorAvailability,selectedDoctors,setSelectedDoctors} = useHomeData()
  const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const {APP_FRONDEND}=useHomeAuth()


  const data=useHomeData()

  function getAvailableHours(item,type){

  
    let date=selectedDates[item.id] || new Date().toISOString().split('T')[0]


    if(type=="normal"){
        return (item.availability.unavailable_specific_date[date] ? [] : item.availability.specific_date[date] ? item.availability.specific_date[date] : item.urgent_availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.availability.weekday[weeks[new Date().getDay()]] || []) : (item.availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m))
    }else{
        return (item.urgent_availability.unavailable_specific_date[date] ? [] : item.urgent_availability.specific_date[date] ? item.urgent_availability.specific_date[date] : item.availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.urgent_availability.weekday[weeks[new Date().getDay()]] || []) : (item.urgent_availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m))
    }

}


  return (
    <div className="w-full pb-[90px]">
    <div className="flex  mx-auto gap-y-20 gap-x-16 flex-wrap">
    
            
           {items.filter((i,_i)=>_i <= max || !max).map(item=>(
             <div className="flex w-[46%] max-md:w-full gap-2 flex-col max-lg:w-full">
    
              <div>
     
              <div className="flex-1 bg-honolulu_blue-50 rounded-[0.3rem] overflow-hidden">
                  <img style={{opacity:0}} src={item.profile_picture_filename} className="h-[300px] w-full object-cover"/> 
              </div>
     

               <div className="flex gap-3 bg-white py-4 px-1">

                           <div className="flex flex-col items-center w-full">
                               <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">                                                                                        
                                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                               </div>
                               <span className="text-[13px]">{t('common.patients')}</span>
                               <span className="mt-bold">{item.unique_patients_count + item.unique_dependents_count}</span>
                           </div>
     
                           <div className="flex flex-col items-center">
                               <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">                                
                                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
                               </div>
                               <span className="text-[13px]">{t('common.rating')}</span>
                               <span className="mt-bold">{item.average_rating.toString().slice(0,3)}</span>
                           </div>
     
                           <div className="flex flex-col items-center w-full">
                               <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">                                                
                                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                               </div>
                               <span className="text-[13px]">{t('common.years')}</span>
                               <span className="mt-bold">{item.years_of_experience}</span>
                           </div>
     
                           <div onClick={()=>{
                                 if(item.reviews.length)  data._showPopUp('reviews',item)
                            }} className="flex flex-col items-center w-full _reviews">
                               <div className={`flex items-center justify-center w-[40px] ${item.reviews.length==0 ? 'bg-gray-200':'bg-honolulu_blue-400 cursor-pointer hover:bg-honolulu_blue-500'} h-[40px] rounded-full`}>                                            
                                       <svg className={`${item.reviews.length==0 ? ' fill-[#5f6368]':'fill-white'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m363-390 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                               </div>
                               <span className="text-[13px]">{t('common.reviews')}</span>
                               <span className="mt-bold">{item.reviews.length}</span>
                           </div>
               </div>
     
             </div>
     
             <div className="flex flex-col w-full max-xl:w-full">
                     <span className="text-honolulu_blue-300 text-[17px] uppercase mt-bold">{item.name}</span>
                     <span className="text-honolulu_blue-500 mt-bold text-[20px] uppercase">{data._specialty_categories.filter(i=>i.id==item.medical_specialty)[0]?.[i18next.language+"_name"]}</span>
                     <p className="text-justify mt-5 text-gray-500 mb-4">
                       {item[`${i18next.language}_short_biography`]}
                     </p>



                     <div className="flex items-center mb-2 w-full hidden">
                   
                        <span className="text-[0.9rem] font-medium flex w-full mr-3">{t('common.availability')}</span>
                        <select  onChange={(e)=>{
                             setSelectedWeekDays({...selectedWeekDays,[item.id]:e.target.value})
                        }} value={selectedWeekDays[item.id] || weeks[new Date().getDay()]}  class={`bg-gray hidden border border-gray-300  text-gray-900 text-sm rounded-full text-center  block w-[110px] p-2`}>
                            {weeks.map((i,_i)=>(
                                  <option value={i}>{t('common._weeks.'+i.toLowerCase())}</option>
                            ))}
                       </select>  

                       <input onChange={(e)=>{
                               setSelectedDates({...selectedDates,[item.id]:e.target.value})
                               setSelectedWeekDays({...selectedWeekDays,[item.id]:weeks[new Date(e.target.value).getDay()]})
                               setSelectedDoctors({...selectedDoctors,[item.id]:[]})
                       }} value={selectedDates[item.id] || new Date().toISOString().split('T')[0]} type="date" class={`bg-gray border border-gray-300  text-gray-900 text-sm rounded-full text-center w-[130px]  block  p-2`}/>

                      </div>


                      <div className={`flex items-center flex-wrap mb-2 hidden`}>

                        {(!selectedWeekDays[item.id] ? (item.availability.weekday[weeks[new Date().getDay()]] || []) : (item.availability.weekday[selectedWeekDays[item.id]] || [])).map((i,_i)=>(
                            <span onClick={()=>{
                                handleSelectDoctorAvailability(item,i)
                            }} className={`flex px-3 cursor-pointer ${selectedDoctors[item.id]?.includes(i) ? 'border-honolulu_blue-300 bg-honolulu_blue-50 text-honolulu_blue-400':'border-transparent bg-honolulu_blue-50'} border  py-1 mr-2 mb-2 rounded-full`}>{i}</span>
                        ))}


                        {(!selectedWeekDays[item.id] ? (item.urgent_availability.weekday[weeks[new Date().getDay()]] || []) : (item.urgent_availability.weekday[selectedWeekDays[item.id]] || [])).map((i,_i)=>(
                            <span onClick={()=>{
                                handleSelectDoctorAvailability(item,i)
                            }} className={`flex px-3 cursor-pointer ${selectedDoctors[item.id]?.includes(i) ? 'border-orange-400 bg-orange-50 text-orange-400':'border-transparent bg-orange-100'} border  py-1 mr-2 mb-2 rounded-full `}>{i}</span>
                        ))}


                        {(!selectedWeekDays[item.id] ? (item.availability.weekday[weeks[new Date().getDay()]]  || item.urgent_availability.weekday[weeks[new Date().getDay()]] || []) : (item.availability.weekday[selectedWeekDays[item.id]] || item.urgent_availability.weekday[weeks[new Date().getDay()]] || [])).length==0 && <span className="text-[14px] text-gray-500">({t('common.select-another-week-day')})</span>}
                    </div>



                    <div className={`flex items-center flex-wrap mb-2 hidden`}>




                    <div className="mt-4 flex items-center justify-between">
                      {(getAvailableHours(item,'normal').length!=0) && <div className="flex justify-center flex-col items-center">
                          <select  onChange={(e)=>{
                              handleSelectDoctorAvailability(item,e.target.value)
                          }} value={getAvailableHours(item,'normal').includes(selectedDoctors[item.id]?.[0]) ? selectedDoctors[item.id]?.[0] : ''}  class={`bg-gray text-[14px] w-[155px] border ${getAvailableHours(item,'normal').includes(selectedDoctors[item.id]?.[0]) ? 'border-honolulu_blue-400':'border-gray-300'}  text-gray-900 text-sm rounded-full outline-none text-center  block  p-2`}>
                                <option selected disabled value={""}>{t('common.set-timetable')}</option>
                              {getAvailableHours(item,'normal').map((i,_i)=>(
                                  <option value={i}>{i} - {data.timeAfter30Minutes(i)}</option>
                              ))}
                          </select>
                          <span className="text-[12px] text-gray-500">{t('common.normal')}</span>
                      </div>}

                      <div className="mx-2 h-full translate-y-[-10px]">
                        {(getAvailableHours(item,'normal').length!=0 && getAvailableHours(item,'urgent').length!=0) && <span className="text-[11px]">{t('common.or')}</span>}
                      </div>


                      {getAvailableHours(item,'urgent').length!=0 && <div className="flex justify-center flex-col items-center">
                          <select  onChange={(e)=>{
                              handleSelectDoctorAvailability(item,e.target.value)
                          }} value={getAvailableHours(item,'urgent').includes(selectedDoctors[item.id]?.[0]) ? selectedDoctors[item.id]?.[0] : ''}  class={`bg-gray border  ${getAvailableHours(item,'urgent').includes(selectedDoctors[item.id]?.[0]) ? 'border-honolulu_blue-400':'border-gray-300'}  text-gray-900 text-sm rounded-full text-center outline-none  block text-[14px] w-[155px] p-2`}>
                              <option selected disabled value={""}>{t('common.set-timetable')}</option>
                              {getAvailableHours(item,'urgent').map((i,_i)=>(
                                  <option value={i}>{i} - {data.timeAfter30Minutes(i)}</option>
                              ))}
                          </select>
                          <span className="text-[12px] text-gray-500">{t('common.urgent')}</span>
                      </div> }
              </div> 



              {((getAvailableHours(item,'normal').length==0 && getAvailableHours(item,'urgent').length==0)) && <span className="text-[14px] text-gray-500">({t('common.select-another-day')})</span>}

              </div>




                <div className="mt-6 flex items-center">
                <button onClick={()=>{
                    
                    /**if(!selectedDoctors[item.id]?.length){
                        toast(t('common.select-timetable'))
                        return
                    }
                    window.location.href=APP_FRONDEND+`/add-appointments?scheduled_doctor=${item.id}&scheduled_hours=${selectedDoctors[item.id]}&scheduled_date=${selectedDates[item.id] || new Date().toISOString().split('T')[0]}&scheduled_weekday=${weeks[new Date(selectedDates[item.id] || new Date().toISOString().split('T')).getDay()]}`*/

                    data.setSelectedDoctorToSchedule(item)
                    
                }} className="px-5 max-md:w-full py-3 whitespace-nowrap bg-honolulu_blue-300 hover:bg-honolulu_blue-300 text-white table uppercase text-[14px] border-honolulu_blue-300 border rounded-full">{t('common.book')}</button>
                </div>











                   
             </div>
             </div>
           ))}
    
    </div>
    
    </div>
  )
}

export default DoctorList