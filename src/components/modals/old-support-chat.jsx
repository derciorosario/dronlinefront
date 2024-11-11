import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import ChatFile from '../Inputs/chatFile'
import ChatFileMessage from '../Chat/fileMessage'
import ChatMessages from '../Chat/messages'
import ChatUser from '../Messages/chatUser'
import LinearIndeterminate from '../Loaders/linear'
import Loader from '../Loaders/loader'
import toast from 'react-hot-toast';

function SupportChat({show}) {

 const [loading,setLoading]=useState(true)
 const [messages,setMessages]=useState([])
 const [users,setUsers]=useState([])
 const [usersLoaded,setUserLoaded]=useState(true)
 const selectedUser=useRef(null)
 const [deleting,setDeleting]=useState(false)
 const [seeHistory,setSeeHostory]=useState(false)


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

    console.log({_message,filename})

     let message={
         message:messageText,
         not_sent:true,
         user,
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

     setMessages([...messages,message])
     setCommentText('')

     setTimeout(()=>{
        document.querySelector('#scroll_comment').scrollTop=document.querySelector('#scroll_comment').scrollHeight
     },200)

 }

 function handleUploadeduploaded_files({filename,comment}){ 
    add_message(comment,filename)
 }

 async function end_suport() {
    setDeleting(true)
    try{
        await data.makeRequest({method:'get',url:`api/delete-user-messages/${user.id}`,withToken:true, error: ``},0);
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
            console.log(localStorage.getItem('history'))
            let r=await data.makeRequest({method:'get',url:selectedUser.current ? `api/messages/?selected_user_id=${selectedUser.current}&include_hidden=${localStorage.getItem('history')!=null ? 'true':''}` : `api/messages/?include_hidden=${localStorage.getItem('history')!=null ? 'true':''}`,withToken:true, error: ``},0);
            let sent_ids=r.map(i=>i.generated_id)
            if(!selected_id || (selectedUser.current == selected_id)){
                setMessages(prev=>[...prev.filter(i=>i.not_sent && sent_ids.includes(i.generated_id)),...r].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))
                setLoading(false)
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
     let last=messages.filter(i=>!i.not_sent)[messages.filter(i=>!i.not_sent).length - 1]
     if(!last?.read && last?.id){
        mark_as_read(last?.id)
     }
},[messages])

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









    
  return (

    <div id="authentication-modal" tabindex="-1" aria-hidden="true" class={`bg-[rgba(0,0,0,0.4)] overflow-y-auto _support_messages overflow-x-hidden ${show ? '' :'translate-y-10 opacity-0 pointer-events-none'} transition-all delay-75 ease-linear flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    
    <div class="relative p-4 w-full max-w-md max-h-full">

        <div className="w-full border-b px-3 pb-2 flex justify-between items-center bg-white  rounded-t-lg">
             <span>{t('common._support')}</span>
             <span  onClick={()=>{
                  data._closeAllPopUps()
             }} className="p-3 cursor-pointer hover:opacity-55"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
        </div>

        {(usersLoaded && (user?.role=="admin" || user?.role=="manager")) && users.length!=0 && <div className="w-full  overflow-x-auto border-b bg-white justify-start flex p-2">
                    {users.map((i,_i)=>(
                        <div onClick={()=>{
                            setLoading(true)
                            selectedUser.current=i.id
                        }} className={`flex mx-1 ${selectedUser.current==i.id ? 'bg-honolulu_blue-400':''} relative cursor-pointer hover:opacity-70 rounded-md p-1 flex-col items-center`}>
                        
                        {i.unread_messages_count!= 0 && <span className="ml-2 bg-honolulu_blue-400 absolute top-2 right-2 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center">{i.unread_messages_count}</span>}

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

         <div className={`w-full h-[60vh]  bg-white   left-0 top-0 hidden`}></div> 
   
      
         <div id="scroll_comment" class="relative shadow h-[60vh] bg-white rounded-b-[0.4rem] overflow-x-hidden  overflow-y-scroll py-3 px-2">
                
                 {((!loading && !deleting) && ((user?.role=="patient" || user?.role=="doctor") || users.filter(i=>i.id==selectedUser.current).length!=0))  &&  <div className="flex px-1 py-1 bg-gray-200 justify-between rounded-full mb-5 items-center">
                   
                     {((user?.role=="patient" || user?.role=="doctor") && messages.filter(i=>!i.not_sent).length!=0) && <button onClick={()=>{
                        setTimeout(()=>end_suport(),100)
                      }} className={`bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-[14px] ${seeHistory ? 'opacity-0 pointer-events-none':''}`}>{t('common.end-support')}</button>
                     }

                     {users.filter(i=>i.id==selectedUser.current).length!=0 && <span><label className="opacity-80">{users.filter(i=>i.id==selectedUser.current)[0]?.name}</label> - <label className="opacity-50 text-[14px]">{users.filter(i=>i.id==selectedUser.current)[0]?.email} </label></span>}

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

                {(!loading && !deleting) && <div className={`w-[400px] relative ${(user?.role=="admin" || user?.role=="manager") && !selectedUser.current ? 'hidden':''}`}>
                    <ChatFile  res={handleUploadeduploaded_files} show={showChooseFile} setShow={setShowChooseFile}/>
                    <ChatMessages endContent={(
                       <div className="flex items-center justify-center">
                         <span className="bg-honolulu_blue-400 text-[14px] my-5 text-white rounded-full px-2 py-1">{t('common.support-ended')}</span>
                        </div>
                    )} hide={showChooseFile} messages={messages.map(i=>({...i,costum_name:(user?.role=="doctor" || user?.role=="patient") && i.user_id!=user?.id ? t('common.dronline-support'): selectedUser.current==i.user_id ? `${t('common.'+i.user.role)} - `+i.user.name : null,highlight:selectedUser.current==i.user_id}))}/>
                </div>}

                {((loading && selectedUser.current) || ((loading || deleting) && (user?.role=="doctor" || user?.role=="patient")))  && <div className={`flex items-center h-full  justify-center`}>
                        <Loader/>{deleting && <span className="text-[0.8rem]">{t('common.ending-support')}...</span>}
                </div>}

                {(users.length==0 && usersLoaded && (user?.role=="admin" || user?.role=="manager"))  && <div className={`flex flex-col items-center h-full  justify-center`}>
                        <span className="text-[14px] text-gray-400">{t('common.no-chat-inited')}</span>
                       {users.length==0 && <p className="text-[14px] text-gray-600">{t('common.waiting-for-messages')}...</p>}
                </div>}

                {(messages.length==0 && (user?.role=="doctor" || user?.role=="patient"))  && <div className={`flex items-center h-full  justify-center`}>
                        <span className="text-[14px] text-gray-400">{t('common.send-a-message-to-get-support')}</span>
                </div>}

                {((messages.length==0 && (user?.role=="manager" || user?.role=="admin")) && !seeHistory && selectedUser.current)  && <div className={`flex items-center h-full  justify-center`}>
                        <span className="text-[14px] text-gray-400">{t('common.no-messages')}</span>
                </div>}
               
       </div>


<div className={`w-full ${(seeHistory || ((user?.role=="admin" || user?.role=="manager") && messages.length==0 && !seeHistory) ) ? 'opacity-0 pointer-events-none':''} ${((user?.role=="admin" || user?.role=="manager") && !selectedUser.current) || (loading || deleting) ? ' opacity-0 pointer-events-none':''} bg-white overflow-hidden rounded-b-lg ${user?.role=="admin" ? '_hidden':''}`}>

    <div className="w-full pl-3 pr-1 py-1  bg-white border border-gray-200 items-center gap-2 inline-flex justify-between">
            <div className="flex items-center gap-2 w-full">
            
            <input  onKeyPress={(e)=>{
                 if (e.key == 'Enter') {
                    if(messageText)  add_message()
                 }
            }}  onChange={(e)=>{
                 setCommentText(e.target.value)
            }} value={messageText} className={`${showChooseFile ?'opacity-0 pointer-events-none':''} grow shrink w-full basis-0 text-black text-xs font-medium leading-4 focus:outline-none`} placeholder={t('common.write-a-message')}/>
            </div>


            <div onClick={()=>{

               setShowChooseFile(!showChooseFile)

            }} className={`${(messages.filter(i=>i.not_sent).length!=0) ? ' opacity-0 pointer-events-none':''} transition-all ease-in`}>
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