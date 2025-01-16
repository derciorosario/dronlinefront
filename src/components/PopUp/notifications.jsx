import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import { t } from 'i18next'
import { useAuth } from '../../contexts/AuthContext'
import BasicPagination from '../Pagination/basic'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loaders/loader'

export default function Notifications({show}) {

  const navigate=useNavigate()

  const data=useData()
  const {user}=useAuth()

  let required_data=['notifications']
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [_notifications,setNotifications]=useState([])
  const [updateNots,setUpdateNots]=useState(null)
  const [nots,setNots]=useState([])

  
  useEffect(()=>{ 
    if(!user || !show) return
    data._get(required_data,{notifications:{page:currentPage}}) 
  },[user,currentPage,updateFilters,updateNots,show])

  
  async function mark_as_read(id){
    try{
        await data.makeRequest({method:'get',url:`api/notifications/mark-as-read-up-to/`+id,withToken:true, error: ``},0);
    }catch(e){
        console.log(e)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
        setUpdateNots(Math.random())
    }, 10000)
    return () => clearInterval(interval);
  }, []);


  useEffect(()=>{
    if(!data._notifications?.data?.length) return
    let first=data._notifications?.data[0]
    if(first?.id){
       mark_as_read(first?.id)
    }
  
    setNots((data._notifications?.data || []))
},[data._notifications])





  useEffect(()=>{
    data.handleLoaded('remove','notifications')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','notifications')
         setCurrentPage(1)
         data._get(required_data,{notifications:{page:1}}) 

    }
 },[data.updateTable])



function getTitle(type){

    if(type=="participant-is-waiting"){
      return user?.role=="doctor" ? t('common.patient-joined-meeting') : t('common.doctor-joined-meeting') 
    }
    return t('notification-titles.'+type)

}

function getMessageContent(i){
  
  //upcoming-consultation
  let link=(i.type=="new-clinical-diary" || i.type=="clinical-diary-updated") ? '/clinical-diary/'+i.data.details?.id :  (i.type=="new-medical-prescription" || i.type=="medical-prescription-updated") ? '/medical-prescription/'+i.data.details?.id : (i.type=="new-exam" || i.type=="exam-updated") ? '/exam/'+i.data.details?.id  : (i.type=="new-medical-certificate" || i.type=="medical-certificate-status" || i.type=="medical-certificate-updated") ? '/medical-certificate/'+i.data.details?.id : (i.type=="participant-is-waiting") ? `/meeting/zoom/appointment/`+i.data.details?.id  : (i.type=="upcoming-consultation"  || i.type=="consultation-status" || i.type=="new-consultation-added" || i.type=="new-consultation-request" || i.type=="consultation-message")  ?  '/appointment/'+i.data.details?.id :  (i.type=="medical-certificate-status") ? '/medical-certificate/'+i.data.details?.id :  (i.type=="invoice-status" || i.type=="new-mpesa-payment" || i.type=="new-paypal-payment" || i.type=="new-pending-invoice" || i.type=="refund-request" || i.type=="refund-approved" || i.type=="refund-rejected") ? '/payment-management/'+i.data.details?.id : ''
  let btnLinkText=(i.type=="participant-is-waiting") ?  t('common.to_start') : t('common.see')

  return (
    <>
      <div class="ms-3 text-sm font-normal">
      <div class="text-sm font-semibold text-gray-900">{getTitle(i.type)}</div>
      <div class="text-sm font-normal">
        {(i.type=="participant-is-waiting") ? '': i.type=="consultation-message" || i.type=="support-message" ? `${t('common.message')}: ${i.data.message}` : t('notification-messages.'+i.type)}
        {(i.type=="upcoming-consultation") && <span>{i.data.details?.scheduled_date} {i.data.details?.scheduled_hours}</span>}
        {(i.type=="consultation-status" || i.type=="invoice-status" || i.type=="medical-certificate-status") && <span className={`font-medium ${i.data?.status=="rejected" || i.data?.status=="canceled" ? 'text-red-500':i.data?.status=="completed" || i.data?.status=="done"  ? "text-green-500" : i.data?.status =="pending" ? "text-orange-400":"text-honolulu_blue-400"} `}> {t('common.'+i.data?.status)}</span>}
        {(i.type=="new-mpesa-payment" || i.type=="new-paypal-payment")  &&  <span> #{i.data.details?.patient_id}</span>}
        {(i.type=="consultation-status" || i.type=="new-consultation-added" || i.type=="new-consultation-request" || i.type=="participant-is-waiting") && <p>{t('common.consultation-timetable')}:   {i.data.details?.scheduled_date} {i.data.details?.scheduled_hours}</p>}
        {(i.type=="invoice-status" || i.type=="new-pending-invoice" || i.type=="refund-request") && <p>{t('common.reference')}:   #{i.data.details?.ref_id}</p>}
        {(i.type=="new-medical-certificate" || i.type=="medical-certificate-updated" || i.type=="new-exam" || i.type=="exam-updated" || i.type=="new-medical-prescription" || i.type=="medical-prescription-updated" || i.type=="new-clinical-diary" || i.type=="clinical-diary-updated") && <span>{i.data.details?.appointment?.reason_for_consultation}</span>}
        {(i.type=="medical-certificate-status") && <p>{t('notification-messages.new-medical-certificate')} {i.data.details?.appointment?.reason_for_consultation}</p>}
      </div> 
      {(i.type=="new-medical-certificate" || i.type=="medical-certificate-status" || i.type=="medical-certificate-updated" || i.type=="new-medical-prescription" || i.type=="medical-prescription-updated" || i.type=="new-clinical-diary" || i.type=="clinical-diary-updated" || i.type=="new-exam" || i.type=="exam-updated" || i.type=="participant-is-waiting" || i.type=="upcoming-consultation" || i.type=="consultation-status" || i.type=="medical-certificate-status" || i.type=="invoice-status" || i.type=="new-mpesa-payment" || i.type=="new-paypal-payment" || i.type=="new-consultation-added" || i.type=="new-consultation-request" || i.type=="new-pending-invoice" || i.type=="refund-request" || i.type=="refund-approved" || i.type=="refund-rejected" || i.type=="consultation-message" || i.type=="support-message" || i.type=="new-medical-certificate") && <div className="flex items-center flex-wrap">
           <div className="w-full">
              <button onClick={()=>{

                    if(i.type=="support-message"){
                      data._closeAllPopUps()
                      data._showPopUp('support_messages')
                      return
                    }
                    navigate(link)
                    setTimeout(()=>{
                        data._closeAllPopUps()
                    },100)
                    
              }} type="button" class="text-white bg-honolulu_blue-400 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-full mb-2 mt-1 text-sm px-3 py-1 text-center inline-flex items-center me-2">
                                            <div>{btnLinkText}</div>
                </button>
          </div>
      </div>}




      
      <span class="text-xs font-medium text-blue-600">{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</span>   
      </div>
    </>
  )

}

return (

<div style={{zIndex:999}} className={`fixed _notifications ${!show ? 'opacity-0 pointer-events-none':''} transition-all  ease-in left-0 top-0 w-full h-[100vh] flex items-center bg-[rgba(0,0,0,0.6)] justify-end`}>
<div className="w-full h-full  flex-1" onClick={()=>{
  data._closeAllPopUps()
}}>

</div>
<div className={`w-[400px] max-lg:w-full flex flex-col border ${!show ? 'translate-x-[100%]' : ''} transition-all ease-in delay-75 rounded-md h-[100vh] bg-white relative`}>

       <div className="w-full p-3 border-b">

            <div class="flex items-center mb-3">
                <span class="mb-1 text-sm font-semibold text-gray-900">{t('common.notifications')}</span>
                <button onClick={()=>data._closeAllPopUps()} type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" data-dismiss-target="#toast-notification" aria-label="Close">
                    <span class="sr-only">Close</span>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>


       </div>

       <div className="w-full flex-1 overflow-y-auto">

           {((data._notifications?.data || []).length==0 && data._loaded.includes('notifications'))  && <div className="w-full h-[40vh] flex items-center justify-center">
               <span className="text-gray-400">{t('common.no-notifications')}</span>
           </div>}


           {!data._loaded.includes('notifications') && <div className="flex flex-col items-center justify-center py-5">
                     <Loader/>
                     <span className="flex mt-2">{t('common.loading')}...</span>
           </div>}


            {data._loaded.includes('notifications')  && <>
            {nots.map((i,_i)=>(
                <div  class="w-full p-4 text-gray-900 bg-white rounded-lg shadow" role="alert">
           
                <div class="flex items-center relative">

                   {!i.read_at && <span className="flex absolute top-0 right-0 h-full w-[2px] bg-gray-400 rounded-[0.4rem]"></span>}
                  
                    <div class="relative inline-block shrink-0 hidden">
                        <img class="w-12 h-12 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese Leos image"/>
                        <span class="absolute bottom-0 right-0 inline-flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
                            <svg class="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18" fill="currentColor">
                                <path d="M18 4H16V9C16 10.0609 15.5786 11.0783 14.8284 11.8284C14.0783 12.5786 13.0609 13 12 13H9L6.846 14.615C7.17993 14.8628 7.58418 14.9977 8 15H11.667L15.4 17.8C15.5731 17.9298 15.7836 18 16 18C16.2652 18 16.5196 17.8946 16.7071 17.7071C16.8946 17.5196 17 17.2652 17 17V15H18C18.5304 15 19.0391 14.7893 19.4142 14.4142C19.7893 14.0391 20 13.5304 20 13V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4Z" fill="currentColor"/>
                                <path d="M12 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V9C0 9.53043 0.210714 10.0391 0.585786 10.4142C0.960859 10.7893 1.46957 11 2 11H3V13C3 13.1857 3.05171 13.3678 3.14935 13.5257C3.24698 13.6837 3.38668 13.8114 3.55279 13.8944C3.71889 13.9775 3.90484 14.0126 4.08981 13.996C4.27477 13.9793 4.45143 13.9114 4.6 13.8L8.333 11H12C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0Z" fill="currentColor"/>
                                </svg>
                            <span class="sr-only">Message icon</span>
                        </span>
                    </div>

                    {getMessageContent(i)}

                   
                </div>
              </div>

            ))}
            </>  }


       </div>

       <div>
          <BasicPagination show={data._loaded.includes('notifications')} from={'notifications'} setCurrentPage={setCurrentPage} total={data._notifications?.total}  current={data._notifications?.current_page} last={data._notifications?.last_page}/>
       </div>
     </div>


    </div>


  )
}
