import React from 'react'
import ChatFileMessage from './fileMessage'
import { useAuth } from '../../contexts/AuthContext'
import { t } from 'i18next'

function ChatMessages({messages,hide}) {
  const {user} = useAuth()

  console.log({messages})

  return (
     <>
     {messages.map((i,_i)=>(

  <>
    {i.filename ? <ChatFileMessage comment={i} hide={hide}/> : (
         <>
      {user?.id==i.user_id ? <div className={`flex gap-2.5 justify-end  mx-5 ${hide ? 'hidden':''}`}>
    <div className="">
    <div className="grid mb-2">
      <h5 className="text-right text-gray-900 text-sm font-semibold leading-snug pb-1">{t('common.you')}</h5>
      <div className="px-3 py-2 bg-honolulu_blue-500 rounded">
         <h2 className="text-white text-sm font-normal leading-snug">{i.comment}</h2>
      </div>
      <div className="justify-start items-center inline-flex">
      {!i.not_sent && <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">{i.created_at.split('T')[0]}</h3>}
      {i.not_sent && <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" height="17px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
          <span className="text-[0.7rem] ml-1">{t('common.sending')}...</span>
          </div>}
      </div>
      </div>
      </div>
          <div className="border hidden bg-gray-200 rounded-full w-[40px] h-[40px] flex items-center justify-center">{user?.name?.charAt()?.toLocaleUpperCase()}</div>
      </div> : 
    <div  className="grid">
    <div className="flex gap-2.5 mb-4">
      <div className="border bg-gray-200 rounded-full w-[40px] h-[40px] flex items-center justify-center">A</div>
      <div className="grid">
        <h5 className="text-gray-900 text-sm font-semibold leading-snug pb-1">{i.user?.name}</h5>
        <div className="w-max grid">
          <div className="px-3.5 py-2 bg-gray-100 rounded justify-start  items-center gap-3 inline-flex">
            <h5 className="text-gray-900 text-sm font-normal leading-snug">{i.comment}</h5>
          </div>
          <div className="justify-end items-center inline-flex mb-2.5">
            <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">{i.created_at.split('T')[0]}</h6>
          </div>
        </div>
       
      </div>
    </div>
    </div>}
         </>
    )}
</>

))}
     </>
  )
}

export default ChatMessages