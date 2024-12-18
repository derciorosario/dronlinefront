import i18next, { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import ChatFile from '../Inputs/chatFile'
import ChatMessages from '../Chat/messages'
import LinearIndeterminate from '../Loaders/linear'
import Loader from '../Loaders/loader'
import toast from 'react-hot-toast';
import moment from 'moment';
import 'moment/locale/pt'; // Portuguese locale
import 'moment/locale/en-gb'; // English locale (you can also use 'en' for US English)

function SupportChat({show}) {

 const [loading,setLoading]=useState(true)
 const [messages,setMessages]=useState([])
 const [users,setUsers]=useState([])
 const [usersLoaded,setUserLoaded]=useState(true)
 const selectedUser=useRef(null)
 const [deleting,setDeleting]=useState(false)
 const [seeHistory,setSeeHostory]=useState(false)
 const [startAnewChat,setStartAnewChat]=useState(true)
 const [startDate,setStartDate]=useState('')
 const [endDate,setEndDate]=useState('')
 const [search,setSearch]=useState('')
 const [selectedSubjectId,setSelectedSubjectId]=useState(null)

 moment.locale(i18next.language)

 useEffect(() => {
    const interval = setInterval(() => {
     if(show) {
        update_messages((user?.role=="admin" || user?.role=="manager") ? selectedUser.current : null,seeHistory)
        get_users()
     }
    }, 5000);
    return () => clearInterval(interval);
  }, [show]);


 const {user} = useAuth()
 const data=useData()
 
 
 const [showChooseFile,setShowChooseFile]=useState('')
 const [messageText,setCommentText]=useState('')

 function add_message(_message,filename){

     let message={
         message:messageText,
         not_sent:true,
         user,
         created_at:new Date().toISOString(),
         is_subject:messages.length==0 && (user?.role=="doctor" || user?.role=="patient"),
         generated_id:Math.random().toString(),
         user_id:user.id
     }

    if(filename) {
      message.filename=filename
      message.message=""
    }
    if(_message)  {
      message.message=_message
    }

    
    
     setMessages((prev)=>[...prev,message])

     setCommentText('')

     setTimeout(()=>{
        document.querySelector('#scroll_comment').scrollTop=document.querySelector('#scroll_comment').scrollHeight
     },200)

 }

 function handleUploadeduploaded_files({filename,comment}){ 
    add_message(comment,filename)
 }

 async function end_suport(status) {
    setDeleting(true)

    try{
     
        await data.makeRequest({method:'post',url:`api/delete-user-messages`,withToken:true,data:{
         id:user.id,
         status,
       }, error: ``},0);
       
        setDeleting(false)
        toast.success(t('common.support-ended'))
        setMessages([])
    }catch(e){
        setDeleting(false)
        if(e.message=='Failed to fetch'){
            toast.error(t('common.check-network')) 
        }
        console.log(e)
    }
 } 



 async function update_messages(selected_id){

        try{
            let r=await data.makeRequest({method:'get',url:selectedUser.current ? `api/messages/?search=${search}&&start_date=${startDate}&&end_date=${endDate}&&selected_user_id=${selectedUser.current}&include_hidden=${localStorage.getItem('history')!=null ? 'true':''}` : `api/messages/?search=${search}&&start_date=${startDate}&&end_date=${endDate}&&include_hidden=${localStorage.getItem('history')!=null ? 'true':''}`,withToken:true, error: ``},0);
          
            if (!selected_id || selectedUser.current == selected_id) {

              setMessages((prev) => {
                const messagesMap = new Map();
                r.forEach(msg => {
                    messagesMap.set(msg.generated_id, msg);
                });
                
                 (prev.some(i=>i.not_sent) ? prev : []).forEach(msg => {
                    if (!messagesMap.has(msg.generated_id)) {
                        messagesMap.set(msg.generated_id, msg);
                    }
                });
                return Array.from(messagesMap.values())
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
               });
          
              setLoading(false);
          }

        }catch(e){
            console.log(e)
        }

 }


 async function get_users(){

    if(user?.role=="admin" || user?.role=="manager"){
        try{
            let users=await data.makeRequest({method:'get',url:`api/users-with-messages`,withToken:true, error: ``},0);
            setUsers(users)
            if(users.length)  setUserLoaded(true)
        }catch(e){
            console.log(e)
            
        }
    }

 }



useEffect(()=>{
    if(!show){
        return
    }
    update_messages((user?.role=="admin" || user?.role=="manager") ? selectedUser.current : null,seeHistory)
    get_users()

},[show,selectedUser.current])



 useEffect(()=>{
        (async()=>{
            try{
                messages.filter(i=>i.not_sent).forEach(async c=>{
                     await data.makeRequest({method:'post',url:`api/send-message`,withToken:true,data:{
                        ...c,
                        receiver_id:selectedUser.current
                     }, error: ``},0);
                })
            }catch(e){
               console.log(e)
             }
        })()
 },[messages])


 async function mark_as_read(id){
        try{
            await data.makeRequest({method:'get',url:`api/mask-messages-as-read/`+id,withToken:true, error: ``},0);
        }catch(e){
            console.log(e)
        }
 }


 useEffect(()=>{
     if(!messages.length) return
     let last

     if(user?.role=="patient" || user?.role=="doctor"){
        let _messages=messages.filter(i=>i.read==false)
        last=_messages[_messages.length - 1]
     }else{
        let _messages=messages.filter(i=>i.read==false && (i.user_id==selectedUser.current || i.receiver_id==selectedUser.current))
        last=_messages[_messages.length - 1]
     }

     console.log({last,c:selectedUser.current,messages})

     if(last){
        mark_as_read(last.id)
     }

},[messages,loading])

useEffect(()=>{
        if(seeHistory){
          localStorage.setItem('history','1')
        }else{
          localStorage.removeItem('history')
        }
},[seeHistory])

useEffect(()=>{
  localStorage.removeItem('history')
},[show])



const leftPages=[
   'patient',
   'doctor'
]

const statusPages=[
  'open',
  'done',
  'canceled'
]



const [curretLeftPage,setCurretLeftPage]=useState(leftPages[0])
const [status,setStatus]=useState(statusPages[0])

const [selectedSubjects,setSelectedSubjects]=useState([])

useEffect(()=>{
  let _messages=messages.filter(i=>i.is_subject)
  if(startDate){
    _messages=_messages.filter(i=>new Date(i.created_at.split('T')[0]) >= new Date(startDate))
  }
  if(endDate){
    _messages=_messages.filter(i=>new Date(i.created_at.split('T')[0]) <= new Date(endDate))
  }
  
  setSelectedSubjects(_messages.filter(i=>i.message.toLowerCase().includes(search.toLowerCase())))

},[messages,search,startDate,endDate])


    function getMessagesBetweenSubjects() {

      let subjectId=selectedSubjectId
      let _messages=JSON.parse(JSON.stringify(messages))
     
      const startIndex = _messages.findIndex(msg => msg.id === subjectId && msg.is_subject);
      if (startIndex === -1) {
        return []; // Subject message not found
      }
      const endIndex = _messages.slice(startIndex + 1).findIndex(msg => msg.is_subject);
      const actualEndIndex = endIndex !== -1 ? startIndex + 1 + endIndex : _messages.length;
      return _messages.slice(startIndex, actualEndIndex);

    }


    function getLeftPages(){

        return (
             <>
              {leftPages.map(i=>(
                          <span onClick={()=>{
                              selectedUser.current=null
                              setCurretLeftPage(i)
                              setSelectedSubjectId(null)
                              setSeeHostory(false)
                          }} className={`text-[15px] font-medium flex justify-between cursor-pointer hover:text-honolulu_blue-500 ${curretLeftPage==i && users.filter(i=>i.id==selectedUser.current).length==0  ? 'text-honolulu_blue-500':' text-gray-700'} px-2 flex py-2`}>
                            
                            <label className="cursor-pointer">{t('common.'+i+"s")} ({users.filter(f=>f.role==i).length})</label>

                            {users.filter(f=>f.role==i && f.unread_messages_count).length!= 0 && <div className={`ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center`}>
                                  <span>{users.filter(f=>f.role==i && f.unread_messages_count).length}</span>
                            </div>}
                            
                            </span>
                ))}
             </>
        )

    }

    return (
    <div id="authentication-modal" tabindex="-1" aria-hidden="true" class={`bg-[rgba(0,0,0,0.4)] max-md:bg-white overflow-y-auto _support_messages overflow-x-hidden  ${show ? '' :'translate-y-10 opacity-0 pointer-events-none'} transition-all delay-75 ease-linear flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    
    <div class={`relative max-md:w-full max-md:h-full  ${(user?.role=="admin" || user?.role=="manager") ? 'w-[95%]':'w-[600px]'} max-md:translate-y-2`}>

        <div className="w-full border-b px-3 pb-2 flex justify-between items-center bg-white rounded-t-lg">
             <span>{t('common._support')}</span>
             <span  onClick={()=>{
                  data._closeAllPopUps()
             }} className="p-3 cursor-pointer hover:opacity-55"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
       
        </div>

        {(usersLoaded && (user?.role=="admin" || user?.role=="manager")) && users.length!=0 && <div className="w-full hidden  overflow-x-auto border-b bg-white justify-start flex p-2">
                    {users.map((i,_i)=>(
                        <div onClick={()=>{
                            setLoading(true)
                            selectedUser.current=i.id
                        }} className={`flex mx-1 ${selectedUser.current==i.id ? 'bg-honolulu_blue-400':''} relative cursor-pointer hover:opacity-70 rounded-md p-1 flex-col items-center`}>
                        
                        {i.unread_messages_count!= 0 && <span className="ml-2 bg-honolulu_blue-400 absolute top-2 right-2 text-white rounded-full px-2 flex items-center justify-center">{i.unread_messages_count}</span>}

                        <div className={`w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gray-300`}>
                             <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="25px" fill={'gray'}><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                        </div>
                        <span className={` ${selectedUser.current==i.id ? ' text-white':''}`}>{i.name}</span>
                        <label className={`text-[10px] ${selectedUser.current==i.id ? ' text-white':''} w-[100px] break-words text-center`}>{t('common.'+i.role)}</label>
                      </div>
                    ))}
        </div>}

         {((!usersLoaded || (users.length==0 && usersLoaded))  && (user?.role=="admin" || user?.role=="manager")) && <div className="w-full">
              <LinearIndeterminate/>
         </div>

         }

         <div className={`w-full h-[80vh] max-md:h-auto flex-1  bg-white  left-0 top-0 flex`}>
         
            <div className={`w-[300px]  max-lg:hidden  ${(user?.role=="admin" || user?.role=="manager") ? '':' hidden'}`}>
                   
                   <div className="flex-col flex border-b relative mt-6">
                       
                        <span className="text-[10px] p-[0.1rem] bg-gray-100 rounded-[0.3rem] mr-2 text-gray-500 absolute right-1 -top-4">{t('common.users')}</span>
                        
                        {getLeftPages()}
                   </div>
            </div>

            <div id="scroll_comment" class="relative flex-1 shadow h-[80vh] max-md:h-[80vh] bg-white rounded-b-[0.4rem] overflow-x-hidden  overflow-y-scroll py-3 px-2">
            <div className={`w-full absolute bg-white  h-full z-40 top-0 left-0 ${seeHistory && !selectedSubjectId && !loading && !deleting && (user?.role=="admin" || user?.role=="manager") ? '':'hidden'}`}>
                   
                   <div className="mt-2 px-2 font-medium">{t('common.history')} - <span>{users.filter(i=>i.id==selectedUser.current)[0]?.name}</span></div>

                    <div className="flex items-end max-md:flex-col pb-2 border-b">

                    <div className="flex items-center max-md:w-full">

                    {<button onClick={()=>{
                      setSelectedSubjectId(null)
                      selectedUser.current=null
                      setSeeHostory(false)
                    }} type="button" class="text-white bg-honolulu_blue-400 ml-1 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center">
                                        <div>{t('common.go-back')}</div>
                    </button>}

                    
                    <div className="relative p-2 md:mr-1 md:translate-y-2 w-full max-md:mb-2 max-md:mt-2">
                          
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                              <svg className="text-gray-500 dark:text-gray-400" height={16} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                              </svg>
                          </div>

                          <input value={search} onChange={(e) => {
                               setSearch(e.target.value)
                          }}   id="default-search"  className="block w-full px-2 py-2 ps-7 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50" placeholder={t('common.search')}/> 
                 
                   </div>
                   </div>

                  

                    <div className="flex items-center ml-3 max-md:p-2">

                    <div className="items-center mr-1">
                      <h6 className="text-[0.8rem] font-medium text-gray-900 mr-2">
                          {t('common.start')}
                      </h6>
                      <input onChange={(e)=>setStartDate(e.target.value)} value={startDate} type="date" className="w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
                   </div>
                   <div className="items-center">

                      <h6 className="text-[0.8rem] font-medium text-gray-900 mr-2">
                          {t('common.end')}
                      </h6>
                      <input onChange={(e)=>setEndDate(e.target.value)} value={endDate} type="date" className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
                   </div>


                    </div>

                </div> 
                  <div className="overflow-x-auto relative w-full">
                  <table class={`w-full text-sm text-left rtl:text-right px-1`}>
                   <thead class="text-xs text-gray-700 bg-gray-50">
                       <tr>
                           <th scope="col" class="px-6 py-3">{t('common.subject')}</th>
                           <th scope="col" class="px-6 py-3">Status</th>
                           <th scope="col" class="px-6 py-3">{t('common.date')}</th>
                       </tr>
                   </thead>
                       <tbody className="px-2">
                           {selectedSubjects.map(i=>(
                             <tr className="mb-2 border-b hover:bg-gray-200 cursor-pointer"  onClick={()=>{
                                setSelectedSubjectId(i.id)
                             }}>
                                 <td class="px-6 py-3">
                                    <span className="ml-2 py-2 flex">{i?.message}</span>
                                 </td>
                                 <td class="px-6 py-3">
                                 <span className={`px-2  ${i?.last_ended_status=="done" || !i?.last_ended_status  ? 'bg-green-500': i?.last_ended_status=="canceled" ? 'bg-red-500':'bg-honolulu_blue-500'} py-1 rounded-sm text-white`}>{i?.last_ended_status==null ? t('common.open') : t('common.'+(i.last_ended_status || 'done'))}</span>
                                 </td>
                                 
                                 <td class="px-6 py-3">
                                     <span className="py-2">{i.created_at?.split('T')?.[0]} {i.created_at?.split('T')?.[1]?.slice(0,5)}</span>
                                 </td>

                             </tr>
                           ))}
                       </tbody>
                  </table>
                  </div>
                  {messages.length==0 && <span className="flex justify-center pt-5 text-gray-600">{t('common.no-messages')}</span>}
               </div>



                <div className={`w-full absolute h-full z-10 top-0 left-0 ${users.length!=0 && users.filter(i=>i.id==selectedUser.current).length==0 && (user?.role=="admin" || user?.role=="manager") ? '':'hidden'}`}>
                      <div className="w-full md:hidden flex justify-around border-b border-gray-300">
                           {getLeftPages()}
                      </div>
                      <div className="flex items-center mb-4 gap-2 mt-2 px-2">

                        {statusPages.map((i,_i)=>(
                          <div onClick={()=>{
                              setStatus(i)
                            }} className={`flex ${status==i ? 'bg-gray-300':''} transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1 ${status==i ? 'bg-honolulu_blue-500 text-white':''}`}>
                              <span>({users.filter(f=>f.status==i && f.role==curretLeftPage).length}) {t('common.'+i)} </span>
                            {(users.filter(f=>f.status==i && f.role==curretLeftPage && f.unread_messages_count).length!=0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                                  <span>{users.filter(f=>f.status==i && f.role==curretLeftPage && f.unread_messages_count).length}</span>
                              </div>}
                            </div>
                           ))}

                        </div>

                        <div className="overflow-x-auto relative w-full">
                        <table class={`w-full text-sm text-left rtl:text-right px-1 overflow-x-auto`}>

                        <thead class="text-xs text-gray-700 bg-gray-50">
                          <tr>
                              <th scope="col" class="px-6 py-3">{t('common.client')}</th>
                              <th scope="col" class="px-6 py-3">{t('common.subject')}</th>
                              <th scope="col" class="px-6 py-3">Status</th>
                              <th scope="col" class="px-6 py-3">{t('common.last-message')}</th>
                          </tr>
                        </thead>

                        <tbody className="px-2">
                            {users.filter(i=>i.status==status && i.role==curretLeftPage).map(i=>(
                              <tr className="mb-1 border-b hover:bg-gray-200 cursor-pointer"  onClick={()=>{
                                setLoading(true)
                                selectedUser.current=i.id
                            }}>
                                  <td scope="col" class="px-6 py-3">
                                      <div className="flex items-center py-2 ">
                                          <div className={`w-[40px] h-[40px] flex items-center relative  justify-center rounded-full bg-gray-300`}>

                                              {i.unread_messages_count!=0 && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center absolute -right-2 -top-2 justify-center">
                                                            <span>{i.unread_messages_count}</span>
                                              </div>}

                                              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="25px" fill={'gray'}><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                                          
                                          </div>
                                          <div className="flex flex-col ml-2">
                                              <span>{i.name}</span>
                                              {/**<label className={`text-[10px] text-center`}>{t('common.'+i.role)}</label>*/}
                                          </div>
                                      </div>
                                  </td>
                                  
                                  <td scope="col" class="px-6 py-3">
                                      <span>{i?.last_subject_message?.message}</span>
                                  </td>

                                  <td scope="col" class="px-6 py-3">
                                      <span className={`px-2 ${i.status=="done" ? 'bg-green-500': i.status=="canceled" ? 'bg-red-500':'bg-honolulu_blue-500'} py-1 rounded-sm text-white`}>{t('common.'+i.status)}</span>
                                  </td>
                                  <td scope="col" class="px-6 py-3">
                                      <span>{i.last_message?.date ? i.last_message?.date?.split('T')?.[0] + " " +i.last_message?.date?.split('T')?.[1]?.slice(0,5)  : '-'}</span>
                                  </td>
                              </tr>
                            ))}
                        </tbody>
                        </table>

                        </div>

                   
                   {users.filter(i=>i.status==status && i.role==curretLeftPage).length==0 && <span className="flex justify-center pt-5 text-gray-600">{t('common.no-users')}</span>}
               
                </div>

                {/*** */}

                {((!loading && !deleting) && ((user?.role=="patient" || user?.role=="doctor") || users.filter(i=>i.id==selectedUser.current).length!=0))  && !showChooseFile &&  <div className="flex px-1 py-1 bg-gray-200 justify-between rounded-full mb-5 items-center">
                  
                  
                    {((user?.role=="patient" || user?.role=="doctor") && messages.filter(i=>!i.not_sent).length!=0) && <div className="">
                    
                      <button onClick={()=>{
                       setTimeout(()=>end_suport('done'),100)
                     }} className={`bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-[14px] ${seeHistory ? 'opacity-0 pointer-events-none':''}`}>{t('common.complete')}</button>

                     <button onClick={()=>{
                       setTimeout(()=>end_suport('canceled'),100)
                     }} className={`ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 text-[14px] ${seeHistory ? 'opacity-0 pointer-events-none':''}`}>{t('common.cancel')}</button>

                    </div>
                    }

                    {users.filter(i=>i.id==selectedUser.current).length!=0 && <span className="flex items-center">
                      <div onClick={()=>{
                          setTimeout(()=>{
                          setSelectedSubjectId(null)
                          selectedUser.current=null
                          setSeeHostory(false)
                         },100)
                      }} className="table px-2 bg-gray-300 py-1 text-[13px] rounded-full mr-2 cursor-pointer hover:bg-gray-500">{t('common.go-back')}</div> 
                    <label className="opacity-80"> {users.filter(i=>i.id==selectedUser.current)[0]?.name}</label>  <label className="opacity-50 text-[14px] max-md:hidden max-md:text-[12px]"> -  {users.filter(i=>i.id==selectedUser.current)[0]?.email} </label></span>}

                     <button onClick={()=>{

                         setTimeout(() => {
                           setLoading(true)
                           setSeeHostory(!seeHistory)
                         }, 100);

                      }} className="bg-white p-1  overflow-hidden text-gray-500 rounded-full items-center justify-center flex  text-[14px]">

                       <span className={`px-1 rounded-l-full h-full ${!seeHistory ? 'bg-honolulu_blue-300 text-white':''}`}>{t('common.open')}</span>
                       <span className={` px-1 rounded-r-full h-full ${seeHistory ? 'bg-honolulu_blue-300 text-white':''}`}>{t('common.history')}</span>

                     </button>

                </div>}

              
               {(!loading && !deleting) && <div className={`w-full relative ${(user?.role=="admin" || user?.role=="manager") && !selectedUser.current ? 'hidden':''}  ${(user?.role=="admin" || user?.role=="manager") && seeHistory && !selectedSubjectId ? 'hidden':''}`}>
                   
                    {(seeHistory && selectedSubjectId) && <button onClick={()=>{
                      setTimeout(()=>{
                        setSelectedSubjectId(null)
                      },200)
                    }} type="button" class="text-white bg-honolulu_blue-400 ml-1 mb-2 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2 text-center inline-flex items-center">
                                        <div>{t('common.go-back')}</div>
                    </button>}

                   <ChatFile res={handleUploadeduploaded_files} show={showChooseFile} setShow={setShowChooseFile}/>
                   <ChatMessages hide={showChooseFile} messages={selectedSubjectId ? getMessagesBetweenSubjects() : messages.map(i=>({...i,costum_name:(user?.role=="doctor" || user?.role=="patient") && i.user_id!=user?.id ? t('common.dronline-support') : selectedUser.current==i.user_id ? `${t('common.'+i.user.role)} - `+i.user.name : null, highlight:selectedUser.current==i.user_id}))}/>
               
               </div>}



               {((loading && selectedUser.current) || ((loading || deleting) && (user?.role=="doctor" || user?.role=="patient")))  && <div className={`flex items-center h-full  justify-center`}>
                       <Loader/>{deleting && <span className="text-[0.8rem]">{t('common.ending-support')}...</span>}
               </div>}

               {(users.length==0 && usersLoaded && (user?.role=="admin" || user?.role=="manager"))  && <div className={`flex flex-col items-center h-full  justify-center`}>
                       <span className="text-[14px] text-gray-400">{t('common.no-chat-inited')}</span>
                      {users.length==0 && <p className="text-[14px] text-gray-600">{t('common.waiting-for-messages')}...</p>}
               </div>}

               {(messages.length==0 && !loading && (user?.role=="doctor" || user?.role=="patient"))  && <div className={`flex items-center h-full  justify-center`}>
                       <span className="text-[14px] text-gray-400">{t('common.send-a-message-to-get-support')}</span>
               </div>}

               {((messages.length==0 && (user?.role=="manager" || user?.role=="admin")) && !seeHistory && selectedUser.current)  && <div className={`flex items-center h-full  justify-center`}>
                       <span className="text-[14px] text-gray-400">{t('common.no-messages')}</span>
               </div>}
              
      </div>
          
  </div> 
   
      
       


<div className={`w-full bg-white max-md:absolute bottom-0 ${(seeHistory || ((user?.role=="admin" || user?.role=="manager") && messages.length==0 && !seeHistory) ) ? 'opacity-0 pointer-events-none':''} ${((user?.role=="admin" || user?.role=="manager") && !selectedUser.current) || (loading || deleting) ? ' opacity-0 pointer-events-none':''} bg-white  rounded-b-lg ${user?.role=="admin" ? '_hidden':''}`}>

    <div className="w-full  max-md:-translate-y-3 pl-3 pr-1 py-1 relative  bg-white border border-gray-200 items-center gap-2 inline-flex justify-between">
    
             <div className={`absolute ${(messages.length==0 && (user?.role=="doctor" || user?.role=="patient")) ? '':'hidden'} bg-gray-200 bottom-[100%]  rounded-t-[0.3rem] left-0 w-full`}>
                <span className="flex  px-2 py-1 text-[15px]">{t('common.subject')}</span>
                <div className="px-2">
                  <textarea onChange={(e)=>{
                      setCommentText(e.target.value)
                   }} value={messageText} className="border w-full text-[14px] px-2 rounded-[0.3rem]" placeholder={t('common.write-the-subject')}></textarea>
                </div>
             </div>
            
            <div className={`flex items-center gap-2 w-full ${(messages.length==0 && (user?.role=="doctor" || user?.role=="patient")) ? 'hidden':''}`}>
            
            <input  onKeyPress={(e)=>{
                 if (e.key == 'Enter' && !messages.some(i=>i.not_sent)) {
                    if(messageText)  add_message()
                 }
            }}  onChange={(e)=>{
                 setCommentText(e.target.value)
            }} value={messageText} className={`${showChooseFile ?'opacity-0 pointer-events-none':''} grow shrink w-full basis-0 text-black text-xs font-medium leading-4 focus:outline-none`} placeholder={t('common.message')}/>
            </div>


            <div onClick={()=>{
               setShowChooseFile(!showChooseFile)
            }} className={`${(messages.filter(i=>i.not_sent).length!=0) ? ' opacity-0 pointer-events-none':''} transition-all ease-in ${(messages.length==0 && (user?.role=="doctor" || user?.role=="patient")) ? 'hidden':''}`}>
            <svg class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                             <g id="Attach 01">
                               <g id="Vector">
                                 <path d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                                 <path d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675" stroke="black" stroke-opacity="0.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                                 <path d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675" stroke="black" stroke-opacity="0.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                               </g>
                             </g>
             </svg>
            </div>


            <div className="flex items-center gap-2">
           
            <button onClick={()=>{
              if(messageText)  {
                add_message()
              }
            }} className={`items-center  ${(showChooseFile || messages.filter(i=>i.not_sent).length!=0) ? ' opacity-0 pointer-events-none w-0':'transition-all ease-in'}   overflow-hidden  flex px-3 py-2 ${messageText ? 'bg-honolulu_blue-500':'bg-gray-400'} rounded-full shadow `}>
                <h3 className={`text-white text-xs font-semibold leading-4 px-2`}>{t('common.send')}</h3>
            </button>
            </div>
    </div>


    </div>

    </div>
</div> 

  )
}

export default SupportChat