import { createContext, useContext,useState,useEffect, useRef} from 'react';
import sign from "jwt-encode";
import axios from 'axios'
import qs from 'qs';
import { useAuth } from './AuthContext';

const DataContext = createContext();
export const DataProvider = ({ children }) => {

   
    const [dialogs,setDialogs]=useState({
      
    })
    
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
      notifications:false
    }
  
    const [_openPopUps, _setOpenPopUps] = useState(initial_popups);
  
    function _closeAllPopUps(){
          _setOpenPopUps(initial_popups)
          document.removeEventListener('click', handleOutsideClick)
    }
    function _closeThisPopUp(option){
      _setOpenPopUps({..._openPopUps,[option]:false})
    }

    const handleOutsideClick = (event) => {
     // if(isDeleting) return

      let close=true
      Object.keys(initial_popups).forEach(f=>{
          if(event?.target?.closest(`._${f}`))  {
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


        if (!array) return []
    
        let d=JSON.parse(JSON.stringify(array))
    
        let res=[]
        d.forEach((t,_)=>{
          if(search_from_object(t)) {
              res.push(array.filter(j=>t.id.toString().includes(j.id))[0])
          }
        })
    
        return res

    
    }
   
    const {makeRequest,APP_BASE_URL,SERVER_FILE_STORAGE_PATH,isLoading,setIsLoading} = useAuth()

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
    const [updateTable,setUpdateTable]=useState(null)
    

    let dbs=[

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
      {name:'doctor_requests',update:setDoctorRequests,get:_doctor_requests}

    ]
    

    function handleLoaded(action,item){
      if(action=='add'){
         setLoaded((prev)=>[...prev.filter(i=>i!=item),item])
      }else{
         setLoaded((prev)=>prev.filter(i=>i!=item))
      }
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
            console.log({e})
            _data[items[f]]=[]
          }
      }
      return _data

    }

    let initial_filters={
      search: '',
      email:'',
      name:'',
      page:'',
      scheduled_doctor:'',
      scheduled_hours:'',
      scheduled_weekday:'',
      scheduled_date:'',
      scheduled_type_of_care:''
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
            params[o.param]=o.selected_ids.join(',')
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



    function getScheduledAppointment(){

      if(localStorage.getItem('appointment')){
          try{
                let {scheduled_date,scheduled_hours,scheduled_weekday,scheduled_doctor} = JSON.parse(localStorage.getItem('appointment'))
                localStorage.removeItem('appointment')
                return `/add-appointments?scheduled_doctor=${scheduled_doctor}&scheduled_hours=${scheduled_hours}&scheduled_date=${scheduled_date}&scheduled_weekday=${scheduled_weekday}`
          }catch(e){
                return null
          }

      }

    }


    const [selectedDoctorToSchedule,setSelectedDoctorToSchedule]=useState({})
    const [paymentInfo,setPaymentInfo]=useState({})
    const [singlePrintContent,setSinglePrintContent]=useState(null)
    const [justCreatedDependent,setJustCreatedDependent]=useState(null)

    const value = {
      singlePrintContent,
      setSinglePrintContent,
      isLoading, setIsLoading,
      justCreatedDependent,
      setJustCreatedDependent,
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
      makeRequest,
      _showPopUp,
      setDialogs,
      _sendFilter,
      _updateFilters,
      auth,
      timeAfter30Minutes,
      setAuth,
      APP_BASE_URL,
      SERVER_FILE_STORAGE_PATH,
      _get,
      _loaded,
      _appointments,
      _specialty_categories,
      _patients,
      _dependents,
      _doctors,
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
      _doctor_requests
    };










  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
   return useContext(DataContext);
};