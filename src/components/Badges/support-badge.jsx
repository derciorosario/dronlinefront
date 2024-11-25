import React from 'react'
import { t } from 'i18next'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'
import { useData } from '../../contexts/DataContext'

export default function SupportBadge() {
  
  const statusPages=[
      'open',
      'done',
      'canceled'
  ]

  const {user} = useAuth()

  const [expand,setExpand]=useState(false)

  const [users,setUsers]=useState([])
  const data=useData()

  const [badgesCount,setBagesCount]=useState({
    open:0,
    done:0,
    canceled:0
  })

  async function get_users(){
    if(user?.role=="admin" || user?.role=="manager"){
        try{
            let users=await data.makeRequest({method:'get',url:`api/users-with-messages`,withToken:true, error: ``},0);
            setUsers(users)
        }catch(e){
            console.log(e)
            
        }
    }
  }

 useEffect(()=>{

  setBagesCount({
    open:users.filter(i=>i.status=="open").map(i=>i.unread_messages_count).reduce((acc, curr) => acc + curr, 0),
    done:users.filter(i=>i.status=="done").map(i=>i.unread_messages_count).reduce((acc, curr) => acc + curr, 0),
    canceled:users.filter(i=>i.status=="canceled").map(i=>i.unread_messages_count).reduce((acc, curr) => acc + curr, 0)
  })

 },[users])


 useEffect(()=>{

       data.setUnreadSupportMessages(badgesCount.canceled+badgesCount.done+badgesCount.open)

 },[badgesCount])

 useEffect(() => {
    const interval = setInterval(() => {
        get_users()
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{zIndex:999}} 
    onClick={()=>{
        if(!expand) {
          setExpand(true)
        }
    }} className="border fixed bottom-1 right-3 rounded-[0.3rem] _support_messages p-2 mb-5 flex items-center bg-white shadow">
      {expand && <div>

          <div className={`flex items-center ${data._openPopUps.support_messages ? 'opacity-0 pointer-events-none':''} cursor-pointer hover:opacity-75`} onClick={()=>setTimeout(()=>data._showPopUp('support_messages'),200)}>
            <svg className="fill-honolulu_blue-400" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z"/></svg>
            <span className="text-[0.9rem] underline text-honolulu_blue-400">{t('common._support')}</span>
          </div>

          <div className="flex items-center">
          {statusPages.map((i,_i)=>(
                          <div onClick={()=>{
                            
                          }} className={`flex transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1`}>
                            <span className="text-[12px]">{t('common.'+i)}</span>
                            <div className={`ml-2  ${badgesCount[i]==0 ? 'bg-gray-400':'bg-honolulu_blue-400'} text-white rounded-full px-2 flex items-center justify-center`}>
                                <span className="text-[12px]">{badgesCount[i]}</span>
                            </div>
                          </div>
                        ))}
          </div>
      </div>}

      <div onClick={()=>{

          if(expand) {
            setExpand(false)
          }

      }} className="px-2 cursor-pointer hover:opacity-80 relative">
           
           <svg className="fill-honolulu_blue-500" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M476-280q21 0 35.5-14.5T526-330q0-21-14.5-35.5T476-380q-21 0-35.5 14.5T426-330q0 21 14.5 35.5T476-280Zm-36-154h74q0-17 1.5-29t6.5-23q5-11 12.5-20.5T556-530q35-35 49.5-58.5T620-642q0-53-36-85.5T487-760q-55 0-93.5 27T340-658l66 26q7-27 28-43.5t49-16.5q27 0 45 14.5t18 38.5q0 17-11 36t-37 42q-17 14-27.5 27.5T453-505q-7 15-10 31.5t-3 39.5Zm40 394L360-160H200q-33 0-56.5-23.5T120-240v-560q0-33 23.5-56.5T200-880h560q33 0 56.5 23.5T840-800v560q0 33-23.5 56.5T760-160H600L480-40ZM200-240h192l88 88 88-88h192v-560H200v560Zm280-280Z"/></svg>
          
           {(badgesCount.canceled+badgesCount.done+badgesCount.open!=0 && !expand) && <div className="ml-2 bg-honolulu_blue-400 absolute -right-3 -top-3 text-white rounded-full px-2 flex items-center justify-center">
                                <span className="text-[12px]">{badgesCount.canceled+badgesCount.done+badgesCount.open}</span>
           </div>}

      </div>
   </div>
  )
}
