import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useHomeData } from '../../contexts/DataContext'
import Logo from '../../assets/images/light-logo-2.png'
import DefaultLayout from '../../layout/DefaultLayout'

export default function index() {
  const [isCodeOk,setIsCodeOk]=useState(false)
  const { id } = useParams()
  const data=useHomeData()
  const [info,setInfo]=useState({})


  

  useEffect(()=>{
           try{

          
            let [code,created_by,created_for,from,date]=data.decodeBase64Multiple(id)?.split('---')

            console.log({a:data.decodeBase64Multiple(id)?.split('---')})

                if(!code || !from || !created_by || !created_for || !date){
                    setIsCodeOk(false)
                }else{
                    setIsCodeOk(true)
                    setInfo({code,created_by,created_for,from,date})
                }
             
            }catch(e){
                console.log(e)
                setIsCodeOk(false)
            }
  },[id])

  return (
     <DefaultLayout>
      <div className="w-full flex-col flex h-[100vh] items-center justify-center bg-honolulu_blue-500">
              <div className="rounded bg-white py-5 px-4 flex items-center justify-center flex-col min-w-[340px] max-sm:min-w-0 max-sm:px-5 max-sm:text-[0.9rem]">
                    <span className="text-gray-500 text-[0.9rem] mb-3 flex">{t('common.code-verification')}</span>
                    
                    {isCodeOk &&  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height={60} fill="green"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>}
                    {!isCodeOk &&  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height={60} fill="red"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>}
                   
                    <span>{isCodeOk ? t('common.validated') : t('common.code-is-invalid')}</span>

                     {isCodeOk && (
                          <>

                            <div className="w-full flex mt-3 justify-center">
                               <span className="mr-2">{t('common.'+info?.from)}</span>
                            </div>

                           
                            <div className="w-full flex mt-3 justify-center">
                                <div className="flex items-center">
                                    <span className="text-gray-500">Doc. Ref: </span>
                                    <span className="mr-2 font-medium">{info?.code}</span>
                                </div>
                            </div>
                            

                            <div className="w-full flex mt-3 justify-center">
                                <div className="flex items-center">
                                    <span className="text-gray-500">{t('common._created_by')}: </span>
                                    <span className="mr-2 font-medium">Dr.(a) {info.created_by}</span>
                                </div>
                            </div>

                            <div className="w-full flex mt-3 justify-center">
                                <div className="flex items-center">
                                    <span className="text-gray-500">{t('common._created_for')}: </span>
                                    <span className="mr-2 font-medium">{info.created_for}</span>
                                </div>
                            </div>

                            <span className="w-full flex mt-2 text-gray-500 text-[0.7rem] justify-center">{t('common.created_at')}: {info?.date?.split('T')?.[0]?.split('-')?.reverse()?.join('/')} {info.date?.split('T')?.[1]?.slice(0,5)}</span>
                          </>
                    )}

              </div>

              <div className="w-full flex justify-center mt-5">
                  <img width={120} src={Logo}/>
              </div>


    </div>
     </DefaultLayout>
  )
}
