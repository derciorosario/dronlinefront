import { createContext, useContext,useState,useEffect, useRef} from 'react';
import sign from "jwt-encode";
import axios from 'axios'
import qs from 'qs';
import { useHomeAuth } from './AuthContext';
import { t } from 'i18next';
import i18next from 'i18next';

const HomeDataContext = createContext();

export const HomeDataProvider = ({ children }) => {


    const [isLoading, setIsLoading] = useState(true);
    const [dialogs,setDialogs]=useState({})

    const [isDeleting,setIsDeleting]=useState(false)

    let initial_popups={
      global_search:false,
      show_specialist_list:false,
      show_doctors_list:false,
      sidebar:false,
      feedback:false,
      lang:false,
      basic_popup:false,
      doctor_reuqest_sent:false,
      doctor_reuqest_form:false,
      reviews:false
    }

    useEffect(()=>{
            setIsLoading(false)
    },[])

    
    const [_openPopUps, _setOpenPopUps] = useState(initial_popups);
  
    function _closeAllPopUps(){
          _setOpenPopUps(initial_popups)
          document.removeEventListener('click', handleOutsideClick)
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
              res.push(array.filter(j=>(t.id || t.name).toString().includes((j.id || j.name)))[0])
          }
        })
    
        return res

     }

     const [scrollY, setScrollY] = useState(0)
   
     const handleScroll = () => {
        setScrollY(window.scrollY)
     };
   
     useEffect(() => {
      handleScroll()
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
   
    const {makeRequest,APP_BASE_URL,SERVER_FILE_STORAGE_PATH} = useHomeAuth()

    const [auth,setAuth]=useState({
      email:'',
      name:'',
      type:null
    })

    const [_loaded,setLoaded]=useState([])
    const [_patients,setPatients]=useState([])
    const [_appointments,setAppointments]=useState([])
    const [_doctors,setDoctors]=useState([])
    const [_clinical_diary,setClinicalDiary]=useState([])
    const [updateTable,setUpdateTable]=useState(null)
    const [_medical_specialities,setMedicalSpecialities]=useState([])
    const [_specialty_categories,setSpecialtyCategories]=useState([])
    const [_all_faqs,setAllFaqs]=useState([])
    const [_settings,setSettings]=useState([])
    

    let dbs=[
      {name:'appointments',update:setAppointments,get:_appointments},
      {name:'doctors',update:setDoctors,get:_doctors},
      {name:'patients',update:setPatients,get:_patients},
      {name:'clinical_diary',update:setClinicalDiary,get:_clinical_diary},
      {name:'medical_specialities',update:setMedicalSpecialities,get:_medical_specialities},
      {name:'specialty_categories',update:setSpecialtyCategories,get:_specialty_categories},
      {name:'settings',update:setSettings,get:_settings},
      {name:'all_faqs',update:setAllFaqs,get:_all_faqs},
    ]

    const [specialty,setSpecialty]=useState([])
    
    let medical_specialities=[]

    let required_data=['specialty_categories','medical_specialities']

    useEffect(()=>{
     
      setTimeout(()=>(
        _get(required_data) 
      ),500)

    },[])


    useEffect(()=>{
     
     setSpecialty(_specialty_categories.filter(i=>_medical_specialities.some(id=>id==i.id)).map(i=>({name:i[i18next.language+"_name"],id:i.id})))

    },[_medical_specialities,_specialty_categories])


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
      page:''
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

  const [selectedDoctorToSchedule,setSelectedDoctorToSchedule]=useState({})


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

    
    const value = {
      showFilters,
      setShowFilters,
      handleSelectDoctorAvailability,
      selectedDoctors,
      setSelectedDoctors,
      _scrollToSection,
      timeAfter30Minutes,
      makeRequest,
      getDatesForMonthWithBuffer,
      _showPopUp,
      setDialogs,
      _sendFilter,
      _updateFilters,
      auth,
      setAuth,
      APP_BASE_URL,
      SERVER_FILE_STORAGE_PATH,
      _get,
      _loaded,
      _all_faqs,
      _appointments,
      _patients,
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
      specialty,
      scrollY,
      medical_specialities,
      setMedicalSpecialities,
      _specialty_categories,
      getParamsFromFilters,
      selectedDoctorToSchedule,
      setSelectedDoctorToSchedule,
      isLoading, setIsLoading,
      _settings

    };


  return <HomeDataContext.Provider value={value}>{children}</HomeDataContext.Provider>;
};

export const useHomeData = () => {
   return useContext(HomeDataContext);
};