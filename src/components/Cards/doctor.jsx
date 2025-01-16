import i18next, { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext';

function DoctorCard({item={}}) {
  const data=useData()
  const {user} = useAuth()
  let required_data=['specialty_categories']

  useEffect(()=>{
    if(!user) return
    setTimeout(()=>(
      data._get(required_data) 
    ),500)
  },[user])




  return (

        <div  class="md:max-w-sm max-md:w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <div  className="h-[300px] bg-gray-100">
                <img  class={`rounded-t-lg object-cover w-full h-full object-top ${!item.profile_picture_filename ? 'opacity-0':''}`} src={item.profile_picture_filename} alt="" />
            </div>

            <div class="p-5">
                <div className="flex items-center mb-4 justify-between">
                    <a href="#">
                        <h5 class=" text-2xl font-bold tracking-tight text-gray-900">{item.name}</h5>
                        <span className="text-[0.9rem] flex">{data._specialty_categories.filter(i=>i.id==item.medical_specialty)[0]?.[`${i18next.language}_name`]}</span>
                    </a>
                    <div className="flex items-center">
                           <div className="py-[2px] px-[3px] mr-1 bg-honolulu_blue-400 rounded-[0.3rem] flex items-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16px" viewBox="0 0 24 24" fill="#fff"><g><path d="M0 0h24v24H0V0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/></g><g><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></g></svg>
                                 <label className="text-white text-[0.9rem]">{item.average_rating.toString().slice(0,3)}</label>
                           </div> 
                           <label>({item.reviews?.filter(i=>i.rating).length})</label>
                    </div>
                </div>

                <p class="mb-3 font-normal text-gray-700">{item[`${i18next.language}_short_biography`]}</p>
                
                <div className="flex gap-3 bg-white py-2 px-1 border-t mb-6">

                           <div className="flex flex-col items-center w-full">
                               <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">                                                                                        
                                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                               </div>
                               <span className="text-[12px] flex justify-center flex-wrap">{t('common.patients')}<label className="ml-1">({item.unique_patients_count + item.unique_dependents_count})</label></span>
                           </div>
     
                           <div className="flex flex-col items-center">
                               <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">                                
                                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
                               </div>
                               <span className="text-[13px] flex justify-center flex-wrap">{t('common.rating')} <label className="ml-1">({item.average_rating.toString().slice(0,3)})</label></span>
                           </div>
     
                           <div className="flex flex-col items-center w-full">
                               <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">                                                
                                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
                               </div>
                               <span className="text-[13px] flex justify-center flex-wrap">{t('common.years')} <label className="ml-1">({item.years_of_experience})</label></span>
                           </div>
     
                           <div onClick={()=>{
                                 if(item.reviews?.length)  data._showPopUp('reviews',item)
                            }} className="flex flex-col items-center w-full _reviews">
                               <div className={`flex items-center justify-center w-[40px] h-[40px] ${item.reviews.length==0 ? 'bg-gray-200':'bg-honolulu_blue-400 cursor-pointer hover:bg-honolulu_blue-500'}  rounded-full`}>                                            
                                       <svg className={`${item.reviews.length==0 ? ' fill-[#5f6368]':'fill-white'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m363-390 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                               </div>
                               <span className="text-[13px] flex justify-center flex-wrap">{t('common.reviews')} <label className="ml-1">({item.reviews?.length})</label></span>
                           </div>
                    </div>
            

                 {user?.role=="patient" && <a onClick={()=>{
                     data.setSelectedDoctorToSchedule(item)
                }} class={`inline-flex items-center cursor-pointer px-3 py-2 text-sm font-medium text-center text-white bg-honolulu_blue-400 hover:bg-honolulu_blue-500 rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300`}>
                    {t('common.book')}
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>}


            </div>
        </div>

  )
}

export default DoctorCard