import { createContext, useContext,useState,useEffect, useRef} from 'react';
import { useAuth } from './AuthContext';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

let env="pro"
import io from 'socket.io-client';
import { t } from 'i18next';
const socket_server=env=="pro" ? 'https://socket.dronlinemz.com' : env == "test" ? "https://testsocket.dronlinemz.com" : 'http://localhost:3001'
const socket = io(socket_server)

let log_id=Math.random().toString()
const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [dialogs,setDialogs]=useState({})
    const [isDeleting,setIsDeleting]=useState(false)

    let initial_popups={
      basic_popup:false,
      doctor_list:false,
      delete:false,
      confim_message:false,
      header_user_dropdown:false,
      filters:false,
      add_dependent:false,
      table_options:false,
      notifications:false,
      support_messages:false,
      feedback:false,
      reviews:false,
      cancel_appointment:false,
      mobile_menu:false,
      lang:false,
      appointment_messages:false,
      select_exams:false,
    }

    let not_closing_popups=[
      'support_messages'
    ]
  
    const [_openPopUps, _setOpenPopUps] = useState(initial_popups);
  
    function _closeAllPopUps(){
          _setOpenPopUps(initial_popups)
          document.removeEventListener('click', handleOutsideClick)
    }
    function _closeThisPopUp(option){
      _setOpenPopUps({..._openPopUps,[option]:false})
    }

    const handleOutsideClick = (event) => {
   
      let close=true
      Object.keys(initial_popups).forEach(f=>{
          if(event?.target?.closest(`._${f}`))  {
            close=false
          }
      })


      Object.keys(initial_popups).forEach(k=>{
          if(not_closing_popups.includes(k) && _openPopUps[k]){
             close=false
          }
      })
  
      if(close){
        document.removeEventListener('click', handleOutsideClick); 
        _closeAllPopUps()
      }
    };

 
    const  _showPopUp = (option,value) => {
        setTimeout(()=>document.addEventListener('click', handleOutsideClick),200)
        _setOpenPopUps({...initial_popups,[option]:value || true})
    }

    function _search(search,array){
        function search_from_object(object,text){
             text=search
             let add=false
             Object.keys(object).forEach(k=>{
                object[k] = JSON.stringify(object[k])
                if(object[k].toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))){
                      add=true
                }
             })
             return add
        }

        if (!array){ 
          return []
        }
    
        let d=JSON.parse(JSON.stringify(array))
    
        let res=[]

        d.forEach((t,_)=>{
          if(search_from_object(t)) {
              res.push(array.filter(j=>t.id.toString().includes(j.id))[0])
          }
        })
    
        return res
    }
   
    const {makeRequest,APP_BASE_URL,SERVER_FILE_STORAGE_PATH,isLoading,setIsLoading,user,serverTime,setServerTime,APP_FRONDEND} = useAuth()

    const [auth,setAuth]=useState({
      email:'',
      name:'',
      type:null
    })

    const [_loaded,setLoaded]=useState([])
    const [_patients,setPatients]=useState([])
    const [_appointments,setAppointments]=useState([])
    const [_specialty_categories,setSpecialtyCategories]=useState([])
    const [_doctors,setDoctors]=useState([])
    const [_clinical_diary,setClinicalDiary]=useState([])
    const [_exams,setExams]=useState([])
    const [_years_of_experience,setYearsOfExperience]=useState([])
    const [_medical_prescriptions,setMedicalPrescriptions]=useState([])
    const [_dependents,setDependents]=useState([])
    const [_appointment_invoices,setAppointmentInvoices]=useState([])
    const [_doctor_requests,setDoctorRequests]=useState([])
    const [_managers,setManagers]=useState([])
    const [_app_feedback,setAppFeedBack]=useState([])
    const [_appointment_feedback,setAppointmentFeedBack]=useState([])
    const [_faqs,setFaqs]=useState([])
    const [_logs,setLogs]=useState([])
    const [_all_users,setAllUsers]=useState([])
    const [_all_managers,setAllManagers]=useState([])
    const [_all_patients,setAllPatients]=useState([])
    const [_all_doctors,setAllDoctors]=useState([])
    const [_all_pendents,setAllPendents]=useState([])
    const [_user_activities,setUserActivities]=useState([])
    const [_notifications,setNotifications]=useState([])
    const [_users_activity_info,setUsersActivityInfo]=useState([])
    const [_cancellation_taxes,setCancellationTaxes]=useState([])
    const [_settings,setSettings]=useState([])
    const [_upcoming_appointments,setUpcomingAppointments]=useState([])
    const [_admin_dashboard,setAdminDashboard]=useState([])
    const [_doctor_dashboard,setDoctorDashboard]=useState([])
    const [_patient_dashboard,setPatientDashboard]=useState([])
    const [_medical_certificates,setMedicalCertificates]=useState([])
    const [_waiting_list,setWaitingList]=useState([])
    const [updateTable,setUpdateTable]=useState(null)
    

    let dbs=[
      {name:'waiting_list',update:setWaitingList,get:_waiting_list},
      {name:'settings',update:setSettings,get:_settings},
      {name:'appointments',update:setAppointments,get:_appointments},
      {name:'doctors',update:setDoctors,get:_doctors},
      {name:'patients',update:setPatients,get:_patients},
      {name:'clinical_diary',update:setClinicalDiary,get:_clinical_diary},
      {name:'exams',update:setExams,get:_exams},
      {name:'specialty_categories',update:setSpecialtyCategories,get:_specialty_categories},
      {name:'years_of_experience',update:setYearsOfExperience,get:_years_of_experience},
      {name:'medical_prescriptions',update:setMedicalPrescriptions,get:_medical_prescriptions},
      {name:'dependents',update:setDependents,get:_dependents},
      {name:'appointment_invoices',update:setAppointmentInvoices,get:_appointment_invoices},
      {name:'doctor_requests',update:setDoctorRequests,get:_doctor_requests},
      {name:'managers',update:setManagers,get:_managers},
      {name:'faqs',update:setFaqs,get:_faqs},
      {name:'app_feedback',update:setAppFeedBack,get:_app_feedback},
      {name:'appointment_feedback',update:setAppointmentFeedBack,get:_appointment_feedback},
      {name:'logs',update:setLogs,get:_logs},
      {name:'all_users',update:setAllUsers,get:_all_users},
      {name:'all_managers',update:setAllManagers,get:_all_managers},
      {name:'all_doctors',update:setAllDoctors,get:_all_doctors},
      {name:'all_patients',update:setAllPatients,get:_all_patients},
      {name:'user_activities',update:setUserActivities,get:_user_activities},
      {name:'notifications',update:setNotifications,get:_notifications},
      {name:'users_activity_info',update:setUsersActivityInfo,get:_users_activity_info},
      {name:'cancellation_taxes',update:setCancellationTaxes,get:_cancellation_taxes},
      {name:'upcoming_appointments',update:setUpcomingAppointments,get:_upcoming_appointments},
      {name:'admin_dashboard',update:setAdminDashboard,get:_admin_dashboard},
      {name:'doctor_dashboard',update:setDoctorDashboard,get:_doctor_dashboard},
      {name:'patient_dashboard',update:setPatientDashboard,get:_patient_dashboard},
      {name:'medical_certificates',update:setMedicalCertificates,_get:_medical_certificates}

    ]
    

    function handleLoaded(action,item){
      if(Array.isArray(item) && action=="remove"){
        setLoaded((prev)=>prev.filter(i=>!item.includes(i)))
        return
      }

      if(action=='add'){
         setLoaded((prev)=>[...prev.filter(i=>i!=item),item])
      }else{
         setLoaded((prev)=>prev.filter(i=>i!=item))
      }
    }   


     function _cn(number){
      return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(typeof "string" ? parseFloat(number) : number).replaceAll('.',' ')
     }
   
     function _cn_n(string){
        string=string.toString()
        if (string.startsWith('0')) {
          string = string.replace('0', '');
        }
        return string.replace(/[^0-9]/g, '')
     }


    async function _get(from,params){
      let items=typeof from == "string" ? [from] : from
  
      let _data={}
  
      for (let f = 0; f < items.length; f++) {
        let selected=dbs.filter(i=>i.name==items[f])[0]
          try{
            let response=await makeRequest({params:params?.[items[f]],method:'get',url:`api/${items[f].replaceAll('_','-')}`,withToken:true, error: ``},100);
            handleLoaded('add',items[f])
            selected.update(response) 
            _data[items[f]]=response
          }catch(e){
            console.log(items[f])
            console.log({e})
            _data[items[f]]=[]
          }
      }
      return _data
    }

    const [online,setOnline]=useState(false)
    const [updatingServerInfo,setUpdatingServerInfo] = useState(null);

    const timeRef = useRef(null)

    useEffect(() => {

      if(!timeRef.current) return
      
      const intervalId = setInterval(() => {

        if(localStorage.getItem('changing_doctor_calendar')){
          return
        }
        
        try{
          timeRef.current = new Date(timeRef.current.getTime() + 3000);

          setServerTime({
            week_day: timeRef.current.getDay(),
            month: timeRef.current.getMonth() + 1,
            date: timeRef.current.toISOString().split('T')[0],
            hour: timeRef.current.toTimeString().slice(0, 5),
            day: timeRef.current.getDate().toString().padStart(2, '0'),
          });
  
        }catch(e){
           console.log({e})
        }

      }, 3000);
  
      return () => clearInterval(intervalId);

    }, [updatingServerInfo]);
   

    useEffect(()=>{

      socket.on('info',({time})=>{
        if(localStorage.getItem('changing_doctor_calendar')){
          return
        }
         setServerTime(time)
         timeRef.current=new Date(`${time.date}T${time.hour}:00`)
         setUpdatingServerInfo(Math.random())
      })
        
      socket.emit('info')
      socket.on('disconnect', (data) => {
        setOnline(false)
      });

      socket.on('connect', (data) => {
        setOnline(true)
        if(user)  socket.emit('add-connected-user',{user})
      });

    },[])

    useEffect(()=>{
        if(!user) return
        socket.emit('add-connected-user',{user})
    },[user])

     function handleZoomMeetings(action,sessionName){
           if(action=="start"){
              socket.emit('start-zoom-meeting',{sessionName})
           }else if(action=="remove"){
              socket.emit('remove-zoom-meeting',{sessionName})
           }else if(action=="check"){
              socket.emit('check-zoom-meeting',{sessionName})
           } 
    }
   
    useEffect(() => {

      //if(!user || user?.role=="admin" || user?.role=="patient" || user?.role=="doctor") return
      if(!user || user?.role=="admin") return

      const interval = setInterval(() => {
          socket.emit('log-user',{
            id:user?.id,
            email:user?.email,
            log_id,
            role:user?.role
          })
      }, 5000)

      return () => clearInterval(interval);
    }, [user]);

    let initial_filters={
      search: '',
      email:'',
      name:'',
      page:'',
      scheduled_doctor:'',
      scheduled_hours:'',
      scheduled_weekday:'',
      scheduled_date:'',
      scheduled_type_of_care:'',
      canceled_appointment_id:'',
      type_of_care:'',
      add_info:'',
      adding_appointment:'',
      add_from_doctor_request_id:'',
      reason_for_consultation:'',
      additional_observations:''
    }
    
    const [_filters, setFilters] = useState(initial_filters);

    function _sendFilter(searchParams){


        let params_names=Object.keys(_filters)

        let options={}

        params_names.forEach(p=>{

          if(typeof _filters[p]=="object"){
             options[p]=searchParams.get(p) ? searchParams.get(p).split(',') : []
          }else{
             options[p]=searchParams.get(p) || ''
          }

        })

        setFilters(options);
        return options
        
       
    }


    const _updateFilters = async (newFilters,setSearchParams) => {

      let params_names=Object.keys(_filters)
     
      const updatedFilters = { ..._filters, ...newFilters };

      const queryParams = {};

      params_names.forEach(p=>{
          if(p=="end_date" || p=="start_date"){
            if(typeof updatedFilters[p] == "object"){
               queryParams[p] = updatedFilters[p].toISOString().split('T')[0]
            }
          }else if(typeof _filters[p]=="object"){
              if(updatedFilters[p].length > 0) {
                 queryParams[p] = updatedFilters[p].join(',');
              }
          }else{
              if(updatedFilters[p])  {
                queryParams[p] = updatedFilters[p];
              }
              
          }
      })

      setSearchParams(queryParams);

      return
    };


   
    const _scrollToSection = (to,behavior) => {
        const Section = document.getElementById(to);
        if (Section) {
          Section.scrollIntoView({ behavior: behavior || 'smooth'});
        }else{
          setTimeout(()=>_scrollToSection(to),1000)
        }

    }

    const [_selectedTableItems,setSelectedTableItems]=useState([])

    const [itemsToDelete,setItemsToDelete]=useState({
      items:[],
      url:null,
      deleteFunction:'default'
    })

    function add_remove_table_item(id){
        if(_selectedTableItems.includes(id)){
           setSelectedTableItems(_selectedTableItems.filter(i=>i!=id))
        }else{
           setSelectedTableItems([..._selectedTableItems,id])
        }
    }
  
    const [selectedDoctors, setSelectedDoctors] = useState({});

    function handleSelectDoctorAvailability(item,hour){

       let _items=JSON.parse(JSON.stringify(selectedDoctors))

       if(!_items[item.id]){
           _items={..._items,[item.id]:[]}
       }

       if(_items[item.id].includes(hour)){
        _items[item.id]=_items[item.id].filter(i=>i!=hour)
       }else{
        _items[item.id]=[hour]
       }

       setSelectedDoctors(_items) 

    }

    const [showFilters,setShowFilters]=useState(false)

    function getParamsFromFilters(options){
         let params={}
         options.forEach(o=>{
            if(params[o.param]){
              if(o.selected_ids.length)  {
                params[o.param]=params[o.param]+","+o.selected_ids.join(',')
              }
            }else{
              params[o.param]=o.selected_ids.join(',')
            }
            
         })

         return params
    }


    
    function timeAfter30Minutes(timeString) {
      let [hours, minutes] = timeString.split(':').map(Number);
    
      let time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);
    
      time.setMinutes(time.getMinutes() + 30);
    
      let updatedHours = time.getHours();
      let updatedMinutes = time.getMinutes();
    
      updatedMinutes = updatedMinutes < 10 ? '0' + updatedMinutes : updatedMinutes;
    
      return `${updatedHours}:${updatedMinutes}`;
    }


    function getDatesForMonthWithBuffer(month, year) {
    
      if (month < 1 || month > 12) {
        throw new Error("Invalid month. Month must be between 1 and 12.");
      }
    
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
    
      const dates = [];
    
      const previousMonthLastDay = new Date(year, month - 1, 0);
      const previousMonthStartDay = previousMonthLastDay.getDate() - 4;
    
      for (let day = previousMonthStartDay; day <= previousMonthLastDay.getDate(); day++) {
        dates.push(new Date(year, month - 2, day).toISOString().split('T')[0]);
      }
    
      for (let day = 1; day <= lastDay.getDate(); day++) {
        dates.push(new Date(year, month - 1, day).toISOString().split('T')[0]);
      }
    
      for (let day = 1; day <= 5; day++) {
        dates.push(new Date(year, month, day).toISOString().split('T')[0]);
      }
    
      //setDates(dates)
      return dates
  
    }

    const downloadPDF = (id,name) => {

      const element = document.getElementById(id);
      const options = {
        margin: 1,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
  
      html2pdf().from(element).set(options).save();

    };



    function getScheduledAppointment(){
      if(localStorage.getItem('appointment')){
          try{
                let {scheduled_date,scheduled_hours,scheduled_weekday,scheduled_doctor,type_of_care} = JSON.parse(localStorage.getItem('appointment'))
                localStorage.removeItem('appointment')
                return `/add-appointments?scheduled_doctor=${scheduled_doctor}&scheduled_hours=${scheduled_hours}&scheduled_date=${scheduled_date}&scheduled_weekday=${scheduled_weekday}&type_of_care=${type_of_care}`
          }catch(e){
                return null
          }
      }
    }

   




    const [downloadProgress,setDownloadProgress] = useState(0) 

    const handleDownload = (filename) => {
      console.log({filename})
      setDownloadProgress(1)
      const xhr = new XMLHttpRequest();
      
      let url=filename.includes('storage/uploads') ? `${APP_BASE_URL}/api/download/${filename.split('/')[filename.split('/').length - 1]}` :  filename.includes('http://') || filename.includes('https://') ? filename : `${APP_BASE_URL}/api/download/${filename}`

      console.log({url})
      xhr.open('GET', url, true);
      
      xhr.responseType = 'blob'; 
      
      // Track download progress
      xhr.onprogress = (event) => {
          if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              console.log(`Download Progress: ${percentComplete.toFixed(2)}%`);
              // Update your progress state if needed
              setDownloadProgress(percentComplete.toFixed(2)); // assuming setDownloadProgress is a state setter
          }
      };
  
      // Handle download completion
      xhr.onload = () => {
          if (xhr.status === 200) {
              const blob = xhr.response;
              const downloadUrl = window.URL.createObjectURL(blob);
  
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = filename; // Name of the file for download
              document.body.appendChild(link);
              link.click();
  
              // Clean up
              link.remove();
              window.URL.revokeObjectURL(downloadUrl);
              setDownloadProgress(0); // Reset progress
          } else {
              console.error('Download failed:', xhr.statusText);
              toast.error(t('common.error-downloading'));
              setDownloadProgress(0)
          }
      };
  
      // Handle errors
      xhr.onerror = () => {
          console.error('Error downloading file:', xhr.statusText);
          toast.error(t('common.error-downloading'));
          setDownloadProgress(0)
          
      };
  
      // Start the request
      xhr.send();
    };
  

   
   let cancelation_reasons = [

    "reason-personal-change",
    "reason-health-issues",
    "reason-emergency",
    "reason-solved",
    "reason-reschedule",
    "reason-tech-issues",
    "reason-financial",
    "reason-preference",
    "reason-dissatisfaction",
    "other"

];


  function getDoctorAmountEarned(i,_collected){

    let percentage=i.use_app_gain_percentage ? JSON.parse(user?.app_settings?.[0]?.value)?.gain_percentage : i.gain_percentage
    percentage=parseInt(percentage || 0)
    
    let collected=_collected || parseFloat(i.total_invoice_amount ? i.total_invoice_amount : 0)

    return collected * (percentage / 100)
    
  }
  function getDoctorIRPC(i,_collected){

    let irpc=JSON.parse(user?.app_settings?.[0]?.value)?.irpc || 0
    let collected=_collected || getDoctorAmountEarned(i,_collected || 0)

    if(!irpc) {
      return collected
    }else{
      return collected * (irpc / 100)
    }
    
  }



    const [selectedDoctorToSchedule,setSelectedDoctorToSchedule]=useState({})
    const [paymentInfo,setPaymentInfo]=useState({})
    const [singlePrintContent,setSinglePrintContent]=useState(null)
    const [justCreatedDependent,setJustCreatedDependent]=useState(null)

    const [appointmentcancelationData,setAppointmentcancelationData]=useState({})


    function _cn_op(string,allow_negative) {


      

      string=string?.toString()?.replaceAll(',','') || ''
      if(string.startsWith('.')){
          return string.slice(1,string.length).replaceAll(' ','')
      }
  
       //for now (not allow comma)
       string=string.replace(',', '')
  
       
      const isNegative = string.startsWith('-');
      if (isNegative) {
          string = string.slice(1); 
      }
  
      if (string.length > 1 && string.replace('-','').startsWith('0') && (string.replace('-','').indexOf('.')!=1 && string.replace('-','').indexOf(',')!=1)) {
          string = string.replace('0', '');
      }
  
      function cleanString(str, separator) {
          const parts = str.split(separator);
          if (parts.length > 2 || str.startsWith(separator)) {
              return str.slice(0, -1); 
          }
          return parts[0].replace(/[^0-9]/g, '') + (parts[1] !== undefined ? separator + parts[1].replace(/[^0-9]/g, '') : '');
      }
  
      function removeZeros(string){
          
          if(string){
              if(string.split('').some(i=>i!="0")==false && string.length > 1){
                string="0"
               }
          }
          return string
      }
  
     
      const hasDot = string.includes('.');
      const hasComma = string.includes(',');
      if (hasDot && hasComma) {
         if (isNegative && allow_negative) {
           string = '-' + string;
         }
         return removeZeros(string.slice(0, -1));
      }
      let cleanedString;
      if (hasDot) {
          cleanedString = cleanString(string, '.');
      } else if (hasComma) {
          cleanedString = cleanString(string, ',');
      } else {
          cleanedString = string.replace(/[^0-9]/g, '');
      }
  
      if (isNegative && allow_negative) {
          cleanedString = '-' + cleanedString;
      }
  
      
  
      return removeZeros(cleanedString) ;
  }

  function formatNumber(num) {
    num=num.toString()
    let cleanNum = num.toString().replace(/[^0-9.]/g, '');
    let [integerPart, decimalPart] = cleanNum.split('.');
    let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let res=decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart.toString()
    return num.endsWith('.') ? res+'.' : res ;
 }

 function _fn(num) {
    return _fn(_cn_op(num))
}

 function _cc(string){
  string=string.toString()
  if (string.startsWith('0')) {
    string = string.replace('0', '');
  }
  return string.replace(/[^0-9.]/g, '')
}

function _cn(number){
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(typeof "string" ? parseFloat(number) : number)
}
function getTimeDifference(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  //const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffInMs / (1000 * 60));
  return { minutes: totalMinutes };
}



async function setGainPerentageForAll(){
    setIsLoading(true)
    
    try{
      
      await makeRequest({method:'get',url:`api/set-gain-percentage-for-all/`+localStorage.getItem('gain_percentage'),withToken:true, error: ``},0);
      _closeAllPopUps()
      toast.success(t('messages.updated-successfully'))

    }catch(e){
      console.log(e)
      if(e.message=='Failed to fetch'){
        toast.error(t('common.check-network'))
     }else{
        toast.error(t('common.unexpected-error'))
     } 
    }
    setIsLoading(false)
}


function isSetAsUrgentHour(hour,AppSettings){

  if(!hour) {
    return 0
  }
  let isUrgent

  if(AppSettings?.do_not_define_urgent_hours || AppSettings==null) return

  let start=AppSettings.urgent_consultation_start_hour
  let end=AppSettings.urgent_consultation_end_hour

  if(!end || !start) {
    return 0
  }

  function toMinutes(time) {
      console.log({time})
      let [h, m] = time.split(':').map(Number);
      return h * 60 + m;
  }

  let hourMinutes = toMinutes(hour);
  let startMinutes = toMinutes(start);
  let endMinutes = toMinutes(end);

  if (startMinutes <= endMinutes) {
      isUrgent= hourMinutes >= startMinutes && hourMinutes <= endMinutes
  } else {
      isUrgent= hourMinutes >= startMinutes || hourMinutes <= endMinutes;
  }

  return isUrgent

}


  function hasConsultationTimePassed(i) {
      
    const formatTime = time => time.split(':').map(t => t.padStart(2, '0')).join(':')
      if(serverTime){
        const currentTime = new Date(`${serverTime?.date}T${formatTime(serverTime?.hour)}:00`);
        const consultationTime = new Date(`${i.scheduled_date}T${formatTime(i.scheduled_hours)}:00`);
        if(currentTime > consultationTime){
          return true
        }
      } 
    }

    const [unreadSupportMessages,setUnreadSupportMessages]=useState(0)
    const [isMobile,setIsMobile]=useState(window.innerWidth <= 768)
    const [waitingParticipantInfo,setWaitingParticipantInfo]=useState(null)
    const [viewedMeetingNots,setViewedMeetingNots]=useState(localStorage.getItem('viewedAppointments') ? JSON.parse(localStorage.getItem('viewedAppointments')) : [])
    const [lastJoinMeetingID,setLastJoinMeetingID]=useState(null)



    function encodeBase64Multiple(url, times=1) {
      let encoded = url;
      for (let i = 0; i < times; i++) {
          encoded = btoa(encoded);
      }
      return encoded;
    }
 
    function decodeBase64Multiple(encoded, times=1) {
      let decoded = encoded;
      for (let i = 0; i < times; i++) {
          decoded = atob(decoded);
      }
      return decoded;
    }

    function getDocumentLetterCodeFrom(from){
         if(from=="medical-prescription"){
            return 'PM'
         }
         if(from=="medical-certificate"){
            return 'AM'
         }
         if(from=="exam-request"){
          return 'PE'
         }
         if(from=="clinical-diary"){
          return 'DC'
         }
         return ''
    }
    

    useEffect(()=>{
      setSelectedTableItems([])
    },[updateTable])


    function text_l(text,max=50){
        if(text?.length > max){
           text=text.slice(0,max)+"..."
        }
        return text
    }

    const daysBetween=(date1,date2)=>{
      const milliseconds1 = date1.getTime();
      const milliseconds2 = date2.getTime();
      const diff = milliseconds2 - milliseconds1;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return days;
    }

    const waitingListOptions = [
      {
        name: "used_telemedicine_before",
        items: ["yes", "no"]
      },
      {
        name: "medical_visits_per_year",
        items: ["1_3_times", "4_6_times", "more_than_6"]
      },
     
      {
        name: "willing_to_pay_online_consultation",
        items: ["less_than_1000", "between_1000_1500", "between_1500_2000", "above_2000"]
      },
      {
        name: "preferred_payment_method",
        items: ["mpesa", "bank_card", "other"]
      },
      {
        name: "biggest_healthcare_challenge",
        items: ["long_queues", "lack_of_specialists", "high_costs", "other"]
      },
      {
        name: "most_important_benefit",
        items: ["fast_service", "affordable_consultations", "specialist_access", "other"]
      },
      {
        name: "join_whatsapp_group",
        items: ["yes", "no", "maybe"]
      },
      {
        name: "most_useful_feature",
        items: ["video_call_consultation", "chat_24_7", "online_prescription", "other"]
      },
      {
          name: "most_frequent_consultation",
          items: [
            "general_practitioner", "specialist", "other","allergy_immunology", "anesthesiology", "cardiology", "dermatology",
            "endocrinology", "gastroenterology", "geriatrics", "gynecology",
            "hematology", "infectious_diseases", "neurology", "nephrology",
            "oncology", "ophthalmology", "orthopedics", "otolaryngology",
            "pathology", "pediatrics", "plastic_surgery", "psychiatry",
            "pulmonology", "radiology", "rheumatology", "sports_medicine",
            "urology", "vascular_surgery"
          ]
        }
    ];


    const handleCopyClick = (text) => {

      navigator.clipboard.writeText(text).then(() => {
         toast.success(t('common.text-copied'));
      }).catch(err => {
         alert('Failed to copy text: ', err);
      })

   }

    const [imageSrc,setImageSrc]=useState(null)
    const [croppedImage, setCroppedImage] = useState(null);
    const [uploadFromCrop, setUploadFromCrop] = useState(false);

    function _c_date(date){

          if(!date) return 
          if(typeof date == "string"){
             return new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).toISOString()
          }else{
             return  new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString()
          }

    }

    function getFakeConsultationCount(min=5,max=30){

      function seededRandom(seed) {
        return function () {
          seed |= 0; seed = seed + 0x6D2B79F5 | 0;
          let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }
      
      const arrayLength = 100;
      const seed = 12345; 
      
      const rand = seededRandom(seed);
      const arr = Array.from({ length: arrayLength }, () => {
        return Math.floor(rand() * (max - min + 1)) + min;
      });
    
      return arr
    }
   
    const value = {
      getFakeConsultationCount,
      _c_date,
      uploadFromCrop,
      setUploadFromCrop,
      imageSrc,
      setImageSrc,
      croppedImage, 
      setCroppedImage,
      handleCopyClick,
      waitingListOptions,
      _waiting_list,
      daysBetween,
      text_l,
      getDocumentLetterCodeFrom,
      encodeBase64Multiple,
      decodeBase64Multiple,
      env,
      lastJoinMeetingID,
      setLastJoinMeetingID,
      viewedMeetingNots,
      setViewedMeetingNots,
      waitingParticipantInfo,
      setWaitingParticipantInfo,
      socket,
      APP_FRONDEND,
      socket_server,
      handleZoomMeetings,
      isMobile,setIsMobile,
      hasConsultationTimePassed,
      getDoctorAmountEarned,
      getDoctorIRPC,
      isSetAsUrgentHour,
      unreadSupportMessages,
      setUnreadSupportMessages,
      getTimeDifference,
      _cn_op,
      _cn,
      _cc,
      _fn,
      _upcoming_appointments,
      formatNumber,
      appointmentcancelationData,
      setAppointmentcancelationData,
      singlePrintContent,
      getDatesForMonthWithBuffer,
      setSinglePrintContent,
      isLoading, setIsLoading,
      justCreatedDependent,
      setJustCreatedDependent,
      _all_users,
      _notifications,
      paymentInfo,setPaymentInfo,
      selectedDoctorToSchedule,
      setSelectedDoctorToSchedule,
      showFilters,
      setShowFilters,
      getScheduledAppointment,
      handleSelectDoctorAvailability,
      selectedDoctors,
      setSelectedDoctors,
      _scrollToSection,
      _all_doctors,
      _all_managers,
      _all_patients,
      _all_pendents,
      makeRequest,
      _showPopUp,
      setDialogs,
      _sendFilter,
      _users_activity_info,
      _faqs,
      _updateFilters,
      auth,
      downloadPDF,
      _logs,
      _cn_n,
      timeAfter30Minutes,
      setAuth,
      APP_BASE_URL,
      SERVER_FILE_STORAGE_PATH,
      _get,
      _loaded,
      _app_feedback,
      _admin_dashboard,
      _patient_dashboard,
      _doctor_dashboard,
      _settings,
      _appointment_feedback,
      _appointments,
      _specialty_categories,
      _patients,
      _managers,
      _dependents,
      _doctors,
      _user_activities,
      _clinical_diary,
      _closeAllPopUps,
      _setOpenPopUps,
      _openPopUps,
      _search,
      _selectedTableItems,
      setSelectedTableItems,
      add_remove_table_item,
      itemsToDelete,
      setItemsToDelete,
      isDeleting,
      setIsDeleting,
      updateTable,
      setUpdateTable,
      handleLoaded,
      _closeThisPopUp,
      getParamsFromFilters,
      _medical_prescriptions,
      _exams,
      _years_of_experience,
      setDependents,
      _appointment_invoices,
      _doctor_requests,
      serverTime,
      handleDownload,
      setDownloadProgress,
      downloadProgress,
      cancelation_reasons,
      _cancellation_taxes,
      setGainPerentageForAll,
      _medical_certificates
    };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
   return useContext(DataContext);
};