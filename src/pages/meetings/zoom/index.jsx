import React, { useEffect, useState } from 'react'
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import "./styles.css";
import { useData } from '../../../contexts/DataContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';
import i18next, { t } from 'i18next';
import DefaultLayout from '../../../layout/DefaultLayout';
import Loader from '../../../components/Loaders/loader';
import OnlineDoctor from '../../../assets/images/online-doctor-vector.jpg'


export default function ZoomMeeting() {

  const data=useData()
  const { id } = useParams()
  const {pathname } = useLocation()
  const {user}=useAuth()
  const navigate = useNavigate()
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [form,setForm]=useState({})
  const [hideConsultationDetails,setHideConsultationDetails]=useState(false)
  const [canParticipantJoin,setCanParticipantJoin]=useState(null)
  const [sessionName,setSessionName]=useState(null)
  const [mainTextDialogTranslated,setMainTextDialogTranslated]=useState(false)
  const [joined,setJoined]=useState(false)
  const formatTime = time => time.split(':').map(t => t.padStart(2, '0')).join(':')
  const [notifyPartipant,setNotifyParticipant]=useState(false)
  const [img1Loaded,setImgLoaded]=useState(false)

  function getLeftTime(){
    const currentTime = new Date(`${data.serverTime.date}T${formatTime(data.serverTime.hour)}:00`);
    const consultationTime = new Date(`${form.consultation_date}T${formatTime(form.scheduled_hours)}:00`);
    let {minutes} = data.getTimeDifference(currentTime,consultationTime)
    return minutes
  }


  
  /**
   *   useEffect(()=>{
          if(data.waitingParticipantInfo?.id==data.lastJoinMeetingID && data.waitingParticipantInfo?.id){
            data.setViewedMeetingNots([...data.viewedMeetingNots,data.waitingParticipantInfo?.id])
          }
        },[data.waitingParticipantInfo,data.lastJoinMeetingID])
   */



  useEffect(() => {
    
      const interval = setInterval(() => {



        if(user?.role=="patient" && sessionName) {
            data.handleZoomMeetings('check',sessionName)
        }
      }, 5000);

      return () => clearInterval(interval);
  }, [user,sessionName,notifyPartipant]);


  async function sendNotification(){

    try{
       
      const r=await data.makeRequest({method:'post',url:`api/notify-participant`,withToken:true,data:{
          appointment_id:form.id,
          receiver_id:user?.role=="patient" ? form.doctor.user_id : form.patient.user_id
        }, error: ``},0);
        console.log({r})

    }catch(e){
       console.log({e})
    }

  }

  useEffect(()=>{
    
    if(notifyPartipant){
      const {minutes} = getLeftTime()
      if(minutes >= 0 && minutes <=30){
        //data.socket.emit('notify-non-present-participants',{appointment:form,user_id:user?.role=="patient" ? form.doctor.user_id : form.patient.user_id})
      }

      sendNotification()
   }

  },[notifyPartipant])



  useEffect(() => {

    if(!joined || mainTextDialogTranslated) return
    
      const interval = setInterval(() => {
        if(document.querySelector('#mat-mdc-dialog-0')){
            translateItems()
            clearInterval(interval)
            setMainTextDialogTranslated(true)
        }
      }, 100);

    return () => clearInterval(interval);
}, [joined]);

  useEffect(()=>{
    data.socket.on('check-zoom-meeting',(res)=>{
      setCanParticipantJoin(res)
    })
  },[])

  useEffect(()=>{
    if(canParticipantJoin==false){
      if(user.role=="patient"){
           setNotifyParticipant(true)
       }
    }
  },[canParticipantJoin])



  useEffect(()=>{

    data.setLastJoinMeetingID(id)

    if(!user){
        return
    }
   
    (async()=>{
      try{

       let response=await data.makeRequest({method:'get',url:`api/appointments/`+id,withToken:true, error: ``},0);
       setForm(response)
       setItemToEditLoaded(true)
       setSessionName(`${`appointment-${response.id}-${response.consultation_date}`}`)
       

      }catch(e){
        if(e.message==404){
           toast.error(t('common.item-not-found'))
           navigate('/appointments')
        }else  if(e.message=='Failed to fetch'){
            toast.error(t('common.check-network'))
            data.setIsLoading(true)
            window.location.reload()
        }else{
          toast.error(t('common.unexpected-error'))
          navigate('/appointments')  
        }
     }
    
  })()
  
  },[user,pathname])

  let sessionContainer = null;
  // set your auth endpoint here 
  // a sample is available here: https://github.com/zoom/videosdk-auth-endpoint-sample
  const authEndpoint = `${data.socket_server}/generate-zoom-signature`; // http://localhost:4000

  const config = {
    videoSDKJWT: "",
    sessionName: "",
    userName: "",
    sessionPasscode: "",
    features: ["video", "audio", "settings", "users", "chat", "share"],
    options: { init: {}, audio: {}, video: {}, share: {} },
    virtualBackground: {
      allowVirtualBackground: true,
      allowVirtualBackgroundUpload: true,
      virtualBackgrounds: ['https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop']
    }
  };


  function translateItems(){

    let itemsToTranslate=[
      {name:`#mat-mdc-dialog-0 .mat-mdc-dialog-title.mdc-dialog__title`,pt:'',en:''},
      {name:`#mat-mdc-dialog-0 .mat-mdc-dialog-content p`,pt:'A activar audio...',en:'Enabling audio...'},
      {name:`#mat-mdc-dialog-6 #mat-mdc-dialog-title-3`,pt:'Usuários',en:'Users'},
    ]

     /*

    let btnLeave=document.querySelectorAll('#mat-menu-panel-1 button')[0]
    let btnEnd=document.querySelectorAll('#mat-menu-panel-1 button')[1]

    if(btnLeave){
      btnLeave.innerHTML=i18next.language=="pt" ? 'Sair' : 'Leave'
    }
    if(btnEnd){
      btnEnd.innerHTML=i18next.language=="pt" ? 'Terminar' : 'End'
    }*/

    itemsToTranslate.forEach(i=>{
        let item=document.querySelector(i.name)
        if(item){
          item.innerText=`${i[i18next.language]}`
        }
    })

    if(document.querySelector('#mat-mdc-dialog-0 .mdc-button__label')){
      document.querySelector('#mat-mdc-dialog-0 .mdc-button__label').click()
    }

   
  }
  
  useEffect(()=>{


   
    translateItems()

    // required Action 

    //Click the button below to enable audio  

    // 

   

  },[i18next.language])
  
  function getVideoSDKJWT() {

    if(user?.role=="patient" && !canParticipantJoin){
     return
    }
    // Assign sessionContainer with a DOM element
    sessionContainer = document.getElementById("sessionContainer");
    // Ensure the element exists before accessing style
    setHideConsultationDetails(true)

    config.sessionName=sessionName 
    config.userName=user.role=="manager" || user.role=="admin" ? t('common.dronline-team') : user?.name
    config.sessionPasscode='dronline' 
    const role = user?.role=="patient" ? 0 : 1;

    // Make a POST request to fetch the JWT
    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionName: config.sessionName, role: role }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.signature) {
          console.log(data.signature);
          config.videoSDKJWT = data.signature;
          joinSession();
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  function joinSession() {

    console.log(config);

    if(user?.role!="patient"){
      data.handleZoomMeetings('start',sessionName)
    }

    if(user?.role=="doctor"){
       setNotifyParticipant(true)
    }

    if (sessionContainer) {
      // Join session using the toolkit
      uitoolkit.joinSession(sessionContainer, config);
      // Handle session closure
      uitoolkit.onSessionClosed(sessionClosed);
    }

    translateItems()
    setJoined(true)
  }
  
  const sessionClosed = () => {

    console.log("session closed");

    if(user?.role!="patient"){
      data.handleZoomMeetings('remove',sessionName)
    }else{
      setCanParticipantJoin(false)
    }

    if (sessionContainer) {
      // Close the session
      uitoolkit.closeSession(sessionContainer);
    }
    // Ensure the element exists before accessing style
    setHideConsultationDetails(false)
    setJoined(false)
  };

  
  return (
    <div className="">  
     
       <DefaultLayout hideSidebar={true} headerLeftContent={(
          <div className={`absolute left-1 top-2 max-md:hidden`}>

          <div className={`flex mb-3 right-2 items-center`}>
             <span onClick={() => {
                navigate('/dashboard')
            }} className="flex items-center px-2 bg-honolulu_blue-500 text-white right-1 top-1 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
              Home
            </span>
        </div>
      </div>
       )}>

       <div id="join-flow">

                {(!itemToEditLoaded || !img1Loaded) && <div className="flex items-center flex-col justify-center h-[60vh]">
                      <Loader/>
                      <span className="text-[18px]">{t('common.loading')}...</span>
                </div>}

                 <div className={`flex  ${(itemToEditLoaded && !hideConsultationDetails && img1Loaded) ? '':'pointer-events-none opacity-0 fixed'} justify-center w-full`}>
                    <div class={`mt-6 w-[800px] bg-white md:flex shadow py-5 px-4 rounded-[0.5rem]`}> 
                        
                        <div className="md:w-[300px] md:mr-3">

                            <div className="flex flex-col items-center">
                                <h1 className="text-black text-[24px]">{t('common.virtual-appointment')}</h1>
                                <p className="text-gray-400">{data._specialty_categories.filter(i=>i.id==form?.medical_specialty)[0]?.[i18next.language+"_name"]}</p>
                            </div>

                            <div className="bg-gray-400">
                              <img className="min-h-[200px]" src={OnlineDoctor} onLoad={()=>{
                                setImgLoaded(true)
                              }}/>
                            </div>

                            <div class="space-y-3 mt-2">
                                <button onClick={getVideoSDKJWT} type="submit" class={`flex  w-full items-center justify-center rounded-[0.3rem] bg-honolulu_blue-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800`}>
                                    {(user?.role=="patient" && !canParticipantJoin) && <Loader w={20} h={20}/>}
                                    {!(user?.role=="patient" && !canParticipantJoin) && <svg className="fill-white mr-2" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M320-400h240q17 0 28.5-11.5T600-440v-80l80 80v-240l-80 80v-80q0-17-11.5-28.5T560-720H320q-17 0-28.5 11.5T280-680v240q0 17 11.5 28.5T320-400ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>}
                                    {user?.role=="patient" ? (canParticipantJoin==null ? t('common.loading')+"..." : canParticipantJoin==false ? t('common.waiting-for-doctor')+"..." : t('common.to_start')) :  t('common.to_start')}
                                </button>
                            </div>
                        </div>

                        <div class="flow-root mt-5 md:flex-1">
                            <div class="-my-3 divide-y divide-gray-200">

                                    {user?.role!="patient" && <dl class="flex items-center justify-between gap-4 py-5">
                                    <dt class="text-base font-normal text-gray-500">{t('form.patient-name')}</dt>
                                    <dd class="text-base font-medium text-gray-900 text-right">{form.is_for_dependent ? form.dependent?.name : form?.user?.name}</dd>
                                    </dl>}

                                    {user?.role=="patient" &&<dl class="flex items-center justify-between gap-4 py-5">
                                    <dt class="text-base font-normal text-gray-500">{t('common.doctor')}</dt>
                                    <dd class="text-base font-medium text-gray-900  text-right">{form.doctor?.name || t('common.dronline-team')}</dd>
                                    </dl>}

                                    <dl class="flex items-center justify-between gap-4 py-5">
                                    <dt class="text-base font-normal text-gray-500">{t('form.consultation-date')}</dt>
                                    <dd class="text-base font-medium text-gray-900  text-right">{`${form.consultation_date} (${t('common._weeks.'+form.scheduled_weekday?.toLowerCase())})`}</dd>
                                    </dl>

                                    <dl class="flex items-center justify-between gap-4 py-5">
                                    <dt class="text-base font-normal text-gray-500">{t('form.consultation-date')}</dt>
                                    <dd class="text-base font-medium text-gray-900  text-right">{`${form.scheduled_hours}`}</dd>
                                    </dl>

                                   <dl class="flex items-center justify-between gap-4 py-5">
                                    <dt class="text-base font-normal text-gray-500">{t('form.type-of-care')}</dt>
                                    <dd class="text-base font-medium text-gray-900  text-right">{t('form.'+form?.type_of_care+"-c")} {form?.type_of_care=="scheduled"  ? `(Normal)` :''}</dd>
                                   </dl>
                      
                                    <dl class="flex items-center justify-between gap-4 py-5">
                                    <dt class="text-base font-normal text-gray-500">{t('form.reason-for-consultation')}</dt>
                                    <dd class="text-base font-medium text-gray-900  text-right">{form.reason_for_consultation}</dd>
                                    </dl>      
                            </div>
                        </div>

                       
                    </div>

                </div>

      </div>


                <div id="zoom-root">
                        <main>
                            <div id="sessionContainer"></div>
                        </main>
                </div>

       </DefaultLayout>
    </div>
  );
  

}
