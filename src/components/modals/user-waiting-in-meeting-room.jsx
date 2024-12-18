import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import i18next, { t } from 'i18next'
import { useData } from '../../contexts/DataContext'
import { useLocation } from 'react-router-dom'

export default function UserWaitingInTheRoom() {

    const {user} = useAuth()
    const {pathname} = useLocation()
  
    const data=useData()
    
    useEffect(()=>{
         localStorage.setItem('viewedAppointments',JSON.stringify(data.viewedMeetingNots.slice(-10).filter(i=>i)))
    },[data.viewedMeetingNots])

    useEffect(()=>{
            data.socket.on('notify-non-present-participants',({appointment})=>{
                let viewed=JSON.parse(localStorage.getItem('viewedAppointments'))
                if(!viewed.map(i=>i.toString()).includes(appointment.id.toString())){
                    data.setWaitingParticipantInfo(appointment)
                }
            })
            data.socket.on('remove-notify-non-present-participants',({appointment})=>{
                data.setWaitingParticipantInfo(null)
                if(data.waitingParticipantInfo?.id==appointment.id) data.setViewedMeetingNots([...data.viewedMeetingNots,data.waitingParticipantInfo?.id])
            }) 

    },[])

   

    useEffect(()=>{
        if(!user) return
        data.socket.emit('remove-notify-non-present-participants',{user_id:user?.id})
   },[user])


    
    



    useEffect(()=>{

         if(!pathname?.includes('meeting/zoom/appointment')){
              if(data.lastJoinMeetingID){
                  data.socket.emit('remove-notify-non-present-participants')
                  data.setLastJoinMeetingID(null)
              }
        }
    },[pathname])

    function viewNot(){
        data.setWaitingParticipantInfo(null)
        data.setViewedMeetingNots([...data.viewedMeetingNots,data.waitingParticipantInfo?.id])
    } 

 
    return (

    <div className={`fixed table delay-75 ease-in  -translate-x-[50%] left-[50%] ${data.waitingParticipantInfo && (data.lastJoinMeetingID!=data.waitingParticipantInfo?.id)  ? 'top-2':'-top-[300px]'} min-w-[200px] z-50 rounded-[0.4rem] shadow-lg bg-white border-t-4 border-t-honolulu_blue-400`}>
           <div className="border p-4">
           <div className="flex items-center justify-between mb-3">
                <span className="border-b flex">
                    {user?.role=="doctor" ? t('common.patient-waiting') : t('common.doctor-waiting')}
                </span>
                
                <div onClick={() => {
                     viewNot()
                }}

                className="w-[25px] ml-4 cursor-pointer h-[25px]   rounded-full bg-gray-300 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                </div>
           </div>

           <div className="mb-2 text-gray-400">
                <span>{data._specialty_categories.filter(i=>i.id==data.waitingParticipantInfo?.medical_specialty)[0]?.[i18next.language+"_name"]}</span> - <span>{data.waitingParticipantInfo?.consultation_date} {data.waitingParticipantInfo?.scheduled_hours}</span>
           </div>

           { <div className={`flex right-2 items-center`}>
                    <span onClick={() => {
                        viewNot()
                        window.open(`${data.APP_FRONDEND}/meeting/zoom/appointment/`+data.waitingParticipantInfo?.id, '_blank')
                    }} className="flex items-center px-2 bg-honolulu_blue-500 text-white right-1 top-1 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
                    
                    {t('common.to_start')}
                    
                    </span>
           </div>}
           </div>
    </div>

  )
}
