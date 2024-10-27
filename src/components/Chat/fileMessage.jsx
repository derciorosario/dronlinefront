import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { t } from 'i18next'

function ChatFileMessage({comment,hide}) {

  const {user} = useAuth()


   
const checkFileType = (filename) => {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const docExts = ['pdf', 'doc', 'docx', 'txt','xls', 'xlsx'];
    if(imageExts.includes(filename.split('.')[filename.split('.').length - 1])){
       return 'i'
    }else{
       return 'd'
    }
 };

  return (

<div class={`flex ${comment.user_id == user?.id ? 'justify-end':' justify-start'} mb-6 gap-2.5 ${hide ? 'hidden':''}`}>
   {comment.user_id != user?.id && <div className="border bg-gray-200 rounded-full w-[40px] h-[40px] flex items-center justify-center">{comment.user?.name?.charAt()?.toUpperCase()}</div>}
   <div class="flex flex-col gap-1">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
         <span class="text-sm font-semibold text-gray-900">{comment.user_id == user?.id ? t('common.you') : comment.user?.name}</span>
       
      </div>
      <div class={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${ comment.user_id != user?.id ? 'bg-gray-100':'bg-honolulu_blue-50'} rounded-e-xl rounded-es-xl`}>
         <div class={`flex items-start ${ comment.user_id != user?.id ? 'bg-gray-50':'bg-honolulu_blue-100'}  rounded-xl p-2`}>
            <div class="me-2">
               <span class="flex items-center gap-2 text-sm font-medium text-gray-900  pb-2">
                 {checkFileType(comment.filename)=="d" ? 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg> 
                    :  
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>
                    }
                  {comment.comment}
               </span>
               <span class="flex text-xs font-normal text-gray-500 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="self-center" width="3" height="4" viewBox="0 0 3 4" fill="none">
                     <circle cx="1.5" cy="2" r="1.5" fill="#6B7280"/>
                  </svg>
                  {comment.filename.split('.')[comment.filename.split('.').length - 1].toUpperCase()}
               </span>
            </div>
            <div class="inline-flex self-center items-center">
               <button class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50" type="button">
                  <svg class="w-4 h-4 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                     <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                  </svg>
               </button>
            </div>
         </div>
      </div>
      <span class="text-sm font-normal text-gray-500">{comment.not_sent ? t('common.sending') : comment.created_at.split('T')[0]}</span>
   </div>
   
   
   
</div>

  )

}

export default ChatFileMessage