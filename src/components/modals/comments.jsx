import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import ChatFile from '../Inputs/chatFile'
import ChatFileMessage from '../Chat/fileMessage'
import ChatMessages from '../Chat/messages'

function Comment({show,setShow,comments,form,setForm}) {


 
  useEffect(() => {

    if(!show) return
    
    const interval = setInterval(() => {
     if(show) update_comments()
    }, 3000);

    return () => clearInterval(interval);
  }, [show]);


const {user} = useAuth()
const data=useData()

const [showChooseFile,setShowChooseFile]=useState('')

 const [commentText,setCommentText]=useState('')

 function add_comment(filename,_comment){

     let comment={
         comment:commentText,
         created_at:new Date().toISOString(),
         generated_id:Math.random().toString(),
         not_sent:true,
         user,
         user_id:user?.id
     }

    if(filename) {
      comment.filename=filename
      comment.comment=""
    }
    if(_comment)  {
      comment.comment=_comment
    }

     setForm({...form,comments:[...form.comments,comment]})
     setCommentText('')

     setTimeout(()=>{
        document.querySelector('#scroll_comment').scrollTop=document.querySelector('#scroll_comment').scrollHeight
     },200)

 }

 function handleUploadeduploaded_files({filename,comment}){
    add_comment(filename,comment)
 }

 function getComments(prev,r){

  const messagesMap = new Map();
  r.comments.forEach(msg => {
      messagesMap.set(msg.generated_id, msg);
  });
  
  (prev.some(i=>i.not_sent) ? prev : []).forEach(msg => {
      if (!messagesMap.has(msg.generated_id)) {
          messagesMap.set(msg.generated_id, msg);
      }
  });

return Array.from(messagesMap.values())
.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

}



 async function update_comments(){

    (async()=>{

        try{
            let r=await data.makeRequest({method:'get',url:`api/appointments/${form.id}/comments`,withToken:true, error: ``},0);
           

              setForm(prev=>({
                  ...prev,
                  comments:getComments(prev.comments,r)
              }))




        }catch(e){
             console.log(e)
         }

    })()


 }



 
 useEffect(()=>{
    if(!show){
        return
    }
    update_comments()
},[show])



 useEffect(()=>{
        (async()=>{

            try{
                comments.filter(i=>i.not_sent).forEach(async c=>{
                   
                     let r=await data.makeRequest({method:'post',url:`api/appointments/${form.id}/comments`,withToken:true,data:{
                        ...c
                     }, error: ``},0);

                })

            }catch(e){
              console.log(e)
             }
        
        })()

 },[comments])



 useEffect(()=>{

  if(!show) return

  let last_message=comments.filter(i=>!i.not_sent)[comments.filter(i=>!i.not_sent).length - 1]

  if(last_message){

    (async()=>{
      try{

         let r=await data.makeRequest({method:'post',url:`api/appointments/${form.id}/mark-comments-as-read`,withToken:true,data:{
          commentId: last_message.id
         }, error: ``},0);

       
      }catch(e){
           console.log(e)
      }
    })()
      
  }

 },[comments,show])


    
  return (

    <div id="authentication-modal" tabindex="-1" aria-hidden="true" class={`bg-[rgba(0,0,0,0.4)] _appointment_messages overflow-y-auto overflow-x-hidden ${show ? '' :'translate-y-10 opacity-0 pointer-events-none'} transition-all delay-75 ease-linear flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
    
    <div class="relative p-4 w-full max-w-md max-h-full">
   
        <div className="w-full border-b px-3 pb-2 flex justify-between items-center bg-white  rounded-t-lg">
             <span>Chat</span>
             <span  onClick={()=>{
              setShow(false)
              data._closeAllPopUps()
             }} className="p-3 cursor-pointer hover:opacity-55"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
             
        </div>
      
        <div id="scroll_comment" class="relative  shadow h-[80vh] bg-white overflow-x-hidden  overflow-y-scroll py-3 px-2">
           
   
    <div className="w-[400px] relative max-md:w-full">

    <ChatFile res={handleUploadeduploaded_files} show={showChooseFile} setShow={setShowChooseFile}/>

    <ChatMessages hide={showChooseFile} messages={comments.map(i=>({...i,costum_name:i.user?.role!="doctor" && user?.role=="patient" ? t('common.dronline-team')  : i.user?.name}))}/>


   {/***File - It is hidden*/}


    </div>
               
    </div>


    <div className={`w-full   ${(user?.role=="admin" || user?.role=="manager") && form.doctor_id ? 'hidden':''} bg-white overflow-hidden rounded-b-lg `}>


    <div className="w-full pl-3 pr-1 py-1  bg-white border border-gray-200 items-center gap-2 inline-flex justify-between">
            <div className="flex items-center gap-2 w-full">
            
            <input  onKeyPress={(e)=>{
                 if (e.key == 'Enter' && !comments.some(i=>i.not_sent)) {
                    if(commentText)  add_comment()
                 }
            }}  onChange={(e)=>{
                 setCommentText(e.target.value)
            }} value={commentText} className={`${showChooseFile  || comments.some(i=>i.not_sent) ?'opacity-0 pointer-events-none':''} grow shrink w-full basis-0 text-black text-xs font-medium leading-4 focus:outline-none`} placeholder={t('common.write-a-comment')}/>
            </div>


            {!comments.some(i=>i.not_sent) && <div onClick={()=>{

               setShowChooseFile(!showChooseFile)

            }}>
            <svg class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                             <g id="Attach 01">
                               <g id="Vector">
                                 <path d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                                 <path d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675" stroke="black" stroke-opacity="0.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                                 <path d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675" stroke="black" stroke-opacity="0.2" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                               </g>
                             </g>
             </svg>
            </div>}
           
            <div className="flex items-center gap-2">
           
            <button onClick={()=>{
              if(commentText && !comments.some(i=>i.not_sent))  add_comment()
            }} className={`items-center  ${showChooseFile || comments.some(i=>i.not_sent) ? ' opacity-0 pointer-events-none w-0':'transition-all ease-in'}   overflow-hidden  flex px-3 py-2 ${commentText && !comments.some(i=>i.not_sent) ? 'bg-honolulu_blue-500':'bg-gray-400'} rounded-full shadow `}>
                
                <h3 className={`text-white  text-xs font-semibold leading-4 px-2`}>{t('common.send')}</h3>
            </button>
            </div>
    </div>


    </div>

    </div>
</div> 

  )
}

export default Comment