import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import MuiCalendar from '../../components/Calendar/mui-calendar'
import PopOver from '../../components/PopOver'
import toast from 'react-hot-toast'
import FormLayout from '../../layout/DefaultFormLayout'
import AdditionalMessage from '../messages/additional'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loaders/loader'
import dayjs from 'dayjs';

function index() {
   
    const [selected,setSelected]=useState([])
    const [loading,setLoading]=useState(false);
    const [message,setMessage]=useState('')
    const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
    const [messageType,setMessageType]=useState('red')
    const data=useData()
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [specificList,setSpecificList]=useState([])
    const [doctorInfo,setDoctorInfo]=useState({})
    const navigate=useNavigate()
    const {pathname} = useParams()

    const { id } = useParams()

    const {user} = useAuth()

    const [dateView,setDateView]=useState('week')

    const [selectUrgentHours,setSelectUrgentHours]=useState(false)

    const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

    const [days,setDays]=useState({
        Monday:[],
        Tuesday:[],
        Wednesday:[],
        Thursday:[],
        Friday:[],
        Saturday:[],
        Sunday:[],
    })

    const [urgent_days,setUrgentDays]=useState({
        Monday:[],
        Tuesday:[],
        Wednesday:[],
        Thursday:[],
        Friday:[],
        Saturday:[],
        Sunday:[],
    })

    const [availableSpecific,setAvailableSpecific]=useState({})
    const [urgentAvailableSpecific,setUrgentAvailableSpecific]=useState({})


    const [selectedWeek,setSelelectedWeek]=useState(weeks[new Date().getDay()])

    let hours = [
            '0:00', '0:30',
            '1:00', '1:30',
            '2:00', '2:30',
            '3:00', '3:30',
            '4:00', '4:30',
            '5:00', '5:30',
            '6:00', '6:30',
            '7:00', '7:30',
            '8:00', '8:30',
            '9:00', '9:30',
            '10:00', '10:30',
            '11:00', '11:30',
            '12:00', '12:30',
            '13:00', '13:30',
            '14:00', '14:30',
            '15:00', '15:30',
            '16:00', '16:30',
            '17:00', '17:30',
            '18:00', '18:30',
            '19:00', '19:30',
            '20:00', '20:30',
            '21:00', '21:30',
            '22:00', '22:30',
            '23:00', '23:30'
     ];  

     
     const [valid,setValid]=useState(false)

    
      const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
      };

      useEffect(()=>{
        setSelelectedWeek(weeks[new Date(selectedDate?.$d).getDay()])
        handleSpecificDate()
      },[selectedDate])


      function handleSpecificDate(){
             if(!itemToEditLoaded) return
             let date=new Date(selectedDate?.$d).toISOString().split('T')[0]
             let urgent_weekday_data=urgent_days[weeks[new Date(selectedDate.$d).getDay()]]
             if(!urgentAvailableSpecific[date] && !specificList.includes(date)){
                    setUrgentAvailableSpecific({...urgentAvailableSpecific,[date]:urgent_weekday_data})
             }else if(!urgentAvailableSpecific[date] && specificList.includes(date)){
                    setUrgentAvailableSpecific({...urgentAvailableSpecific,[date]:[]})
             }

             let weekday_data=days[weeks[new Date(selectedDate.$d).getDay()]]
             if(!availableSpecific[date] && !specificList.includes(date)){
                setAvailableSpecific({...availableSpecific,[date]:weekday_data})
             }else if(!availableSpecific[date] && specificList.includes(date)){
                setAvailableSpecific({...availableSpecific,[date]:[]})   
             }
      }

      useEffect(()=>{
        if(dateView=="calendar"){
            handleSpecificDate()
        }
     },[dateView,specificList])

    useEffect(()=>{

       /* let has_items_selected=false
        weeks.forEach(d=>{
            if(days[d].length || urgent_days[d].length ) {
                has_items_selected=true
            }
        })
        setValid(has_items_selected)*/

        setValid(true)

    },[days])



    useEffect(()=>{
         if(!user) return
         if(user?.role=="manager" && !user?.data?.permissions?.doctor_availability?.includes('update')){
                navigate('/') 
         }
    },[user])




    useEffect(()=>{

        if(!user){
            return
        }
      
      
        (async()=>{
          try{

            let response=await data.makeRequest({method:'get',url:`api/doctor/`+(id || user.data.id),withToken:true, error: ``},100);
          
            let _data={}

            setDoctorInfo({name:response.name})

            weeks.forEach(d=>{
                _data[d]=[]
            })

            setDays({..._data,...response.availability.weekday})
            setUrgentDays({..._data,...response.urgent_availability.weekday})
            setItemToEditLoaded(true)

            setAvailableSpecific(Array.isArray(response.availability.specific_date) ? {} : response.availability.specific_date)
            setUrgentAvailableSpecific(Array.isArray(response.urgent_availability.specific_date) ? {} : response.urgent_availability.specific_date)

            if(!Array.isArray(response.availability.specific_date)){
                setSpecificList(prev=>[...prev,...Object.keys(response.availability.specific_date)])
            }

            if(!Array.isArray(response.urgent_availability.specific_date)){
                setSpecificList(prev=>[...prev,...Object.keys(response.urgent_availability.specific_date)])
            }

            if(!Array.isArray(response.availability.unavailable_specific_date)){
             
                setSpecificList(Object.keys(response.availability.unavailable_specific_date))
                let unavailable_specific_date={}
                Object.keys(response.availability.unavailable_specific_date).forEach(date=>{
                    unavailable_specific_date[date]=[]
                })
                setUrgentAvailableSpecific(unavailable_specific_date)
                setAvailableSpecific(unavailable_specific_date)   
            }

          }catch(e){
            console.log({e})
          }
      })()
      
},[user,pathname])






    async function SubmitForm(){

        setLoading(true)
    
        try{   
     
            let unavailable_specific_date={}

            specificList.forEach(i=>{
               if(!availableSpecific[i].length && !urgentAvailableSpecific[i].length){
                        unavailable_specific_date[i]=['all']
               }
            })
             
            let normal_specific_date={}
            let urgent_specific_date={}
            Object.keys(availableSpecific).forEach(d=>{
                 if(specificList.includes(d)){
                      normal_specific_date[d]=availableSpecific[d]
                 }
            })

            Object.keys(urgentAvailableSpecific).forEach(d=>{
                if(specificList.includes(d)){
                     urgent_specific_date[d]=urgentAvailableSpecific[d]
                }
            })

            let r=await data.makeRequest({method:'post',url:`api/doctor-schedule/${id || user.data.id}/set`,withToken:true,data:{
              
                days:{
                    "weekday":days,
                    "specific_date":normal_specific_date,
                    "unavailable":unavailable_specific_date
                },
                urgent_days:{
                    "weekday":urgent_days,
                    "specific_date":urgent_specific_date,
                    "unavailable":unavailable_specific_date
                }

            }, error: ``},0);

            setMessage(t('messages.updated-successfully'))
            setLoading(false)
            setMessageType('green')


            

        }catch(e){
            console.log({e})
    
            setMessageType('red')
        
            if(e.message==409){
                setMessage(t('common.email-used'))
            }else if(e.message==400){
                setMessage(t('common.invalid-data'))
            }else if(e.message==500){
                setMessage(t('common.unexpected-error'))
            }else  if(e.message=='Failed to fetch'){
                setMessage(t('common.check-network'))
            }else{
                setMessage(t('common.unexpected-error'))
            }
            setLoading(false)
        }
      }

    

  return (
    
        <DefaultLayout disableUpdateButton={true} pageContent={!itemToEditLoaded ? {} : {title:t('menu.consultation-availability'),desc:id ? t('common.availability') +" - "+doctorInfo.name :  t('titles.consultation-availability')}}>
               

            <AdditionalMessage  float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
          

              <div className={`w-full h-[60vh] ${!itemToEditLoaded ? 'flex':'hidden'} items-center justify-center`}>
                <div className="flex flex-col items-center justify-center">
                     <Loader/>
                     <span className="flex mt-2">{t('common.loading')}...</span>
                </div>
              </div>
             

               <div className={`${!itemToEditLoaded ? 'hidden':''} mb-10`}>

               <div className="flex max-w-[900px] items-start gap-x-7 mt-5">
                      <div className="">
                        <span className="text-[18px] mb-4 flex font-medium hidden">{t('common.date')}</span>
                        <span className="text-[18px] mb-4 flex font-medium hidden">{t('common.week-view')}</span>
                        
                        <span className="mb-4 flex hidden">{t('common.date')}: <span className="text-gray-500 ml-2">{t('common._weeks.'+selectedWeek.toLowerCase())} {new Date(selectedDate?.$d).toISOString().split('T')[0]}</span></span>

                        <div class="max-w-sm mx-auto mb-2">
                            <select onChange={(e)=>{
                                setDateView(e.target.value)
                            }} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option value="week" selected>{t('common.week-view')}</option>
                                <option value="calendar">{t('common.calendar-view')}</option>
                            </select>
                        </div>


                        {dateView=="calendar" && <div className="border rounded-[0.3rem]">
                           <MuiCalendar selectedDate={selectedDate} handleDateChange={handleDateChange} setSelectedDate={setSelectedDate}/>
                        </div>}
                         

                        {dateView=="week" && <div className="flex flex-wrap gap-2 mt-3 w-[300px]">
                            {weeks.map((i,_i)=>(
                               <div onClick={()=>setSelelectedWeek(i)} className={`border overflow-hidden relative cursor-pointer hover:border-honolulu_blue-400 ${i==selectedWeek ? 'bg-honolulu_blue-400 text-white':''} rounded-[0.3rem] text-center px-2 py-4 w-[48%]`}>

                                 <span>{t('common._weeks.'+i.toLowerCase())}</span>
                                 {(days[i].length!=0 || urgent_days[i].length!=0) && <div className="w-full absolute bottom-0 left-0 h-[2px] bg-honolulu_blue-300"></div>}

                               </div>
                            ))} 
                        </div>}


                      </div>

                      <div>

                         <div className="flex mb-4">

                           <span className="text-[18px]  flex font-medium">{t('common.available-hours')}</span>

                           <div className="table" onClick={()=>setTimeout(()=>setSelectUrgentHours(!selectUrgentHours),100)}>
                            <label  class="inline-flex items-center cursor-pointer ml-10">
                                <input type="checkbox" value="" class="sr-only peer" checked={Boolean(selectUrgentHours)}/>
                                <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-200 peer-checked:bg-orange-400  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all "></div>
                                <span class="ms-3 text-sm font-medium text-gray-900">{t('common.set-urgent-hours')}</span>
                            </label>
                           </div>

                         </div>


                         <div className="mb-[10px] flex flex-wrap gap-2">
                                <button onClick={()=>{

                                    let _weeks={}
                                    weeks.forEach(d=>{
                                        _weeks[d]=days[selectedWeek]
                                    })
                                    setDays(_weeks)


                                    let _urgent_weeks={}
                                    weeks.forEach(d=>{
                                        _urgent_weeks[d]=urgent_days[selectedWeek]
                                    })
                                    setUrgentDays(_urgent_weeks)

                                 toast(t('messages.applied-successfully'))
                                }} type="button" class={`text-white ${(!days[selectedWeek].length  && !urgent_days[selectedWeek].length || dateView == "calendar")  ?  'hidden':''} bg-honolulu_blue-400 underline focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center inline-flex items-center me-2`}> 
                                    <span className="">{t('common.set-this-scheduler-to-all')}</span> 
                                   
                                </button>

                                    <button onClick={()=>{
                                         let date=new Date(selectedDate?.$d).toISOString().split('T')[0]
                                         setSpecificList([...specificList,date])
                                    }} type="button" class={`text-white ${(specificList.includes(new Date(selectedDate?.$d).toISOString().split('T')[0]) || dateView != "calendar" )  ?  'hidden':''} bg-orange-400 underline focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center inline-flex items-center me-2`}> 
                                    <span className="">{t('common.set-specific-date')}</span>
                                    </button>


                                    <button onClick={()=>{
                                         let date=new Date(selectedDate?.$d).toISOString().split('T')[0]
                                         setSpecificList(specificList.filter(i=>i!=date))
                                    }} type="button" class={`text-white ${(!specificList.includes(new Date(selectedDate?.$d).toISOString().split('T')[0]) || dateView != "calendar")  ?  'hidden':''} bg-honolulu_blue-500 underline focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center inline-flex items-center me-2`}> 
                                    <span className="">{t('common.set-normal-date')} ({t('common._weeks.'+weeks[new Date(selectedDate?.$d).getDay()].toLowerCase())})</span>
                                    </button>


                                <button onClick={()=>{
                                   if(dateView=="calendar"){
                                     let date=new Date(selectedDate?.$d).toISOString().split('T')[0]
                                     setAvailableSpecific({...availableSpecific,[date]:[]})
                                     setUrgentAvailableSpecific({...urgentAvailableSpecific,[date]:[]})
                                     return
                                   }
                                   setDays({...days,[selectedWeek]:[]})
                                   setUrgentDays({...urgent_days,[selectedWeek]:[]})
                                }} type="button" class={` ${(!days[selectedWeek].length  && !urgent_days[selectedWeek].length) || (!specificList.includes(new Date(selectedDate?.$d).toISOString().split('T')[0]) && dateView=="calendar") ?  'hidden':''} border-[rgba(0,0,0,0.4)] border text-gray-500  focus:outline-none font-medium rounded-full text-sm px-5 py-1 text-center inline-flex items-center me-2`}> 
                                    <span className="ml-1">{t('common.clear')}</span>
                                </button>
                                
                           </div>

                        <div className="flex items-center gap-2 flex-1 flex-wrap">
                               {hours.map(f=>{

                                let date=new Date(selectedDate?.$d).toISOString().split('T')[0]
                                 
                                 return (
                                    (
                                        <div onClick={()=>{


                                          if(specificList.includes(date) && dateView=="calendar"){

                                            if(selectUrgentHours){
                                               if(urgentAvailableSpecific[date].includes(f)){
                                                  setUrgentAvailableSpecific({...urgentAvailableSpecific,[date]:urgentAvailableSpecific[date].filter(i=>i!=f)})
                                               }else{
                                                  setUrgentAvailableSpecific({...urgentAvailableSpecific,[date]:[...urgentAvailableSpecific[date],f]})
                                                  //setAvailableSpecific({...availableSpecific,[date]:availableSpecific[date].filter(i=>i!=f)})
                                               }
                                            }else{
                                                if(availableSpecific[date].includes(f)){
                                                    setAvailableSpecific({...availableSpecific,[date]:availableSpecific[date].filter(i=>i!=f)})
                                                 }else{
                                                    setAvailableSpecific({...availableSpecific,[date]:[...availableSpecific[date],f]})
                                                    //setUrgentAvailableSpecific({...urgentAvailableSpecific,[date]:urgentAvailableSpecific[date].filter(i=>i!=f)})
                                                 }
                                            }
                                            return
                                          }

   
                                          if(!selectUrgentHours){
                                               if(days[selectedWeek].includes(f)){
                                                   setDays({...days,[selectedWeek]:days[selectedWeek].filter(i=>i!=f)})
                                               }else{
                                                   setDays({...days,[selectedWeek]:[...days[selectedWeek],f]})
                                                   //setUrgentDays({...urgent_days,[selectedWeek]:urgent_days[selectedWeek].filter(i=>i!=f)})
                                               }
                                          }else{
                                               if(urgent_days[selectedWeek].includes(f)){
                                                   setUrgentDays({...urgent_days,[selectedWeek]:urgent_days[selectedWeek].filter(i=>i!=f)})
                                               }else{
                                                   //setDays({...days,[selectedWeek]:days[selectedWeek].filter(i=>i!=f)})
                                                   setUrgentDays({...urgent_days,[selectedWeek]:[...urgent_days[selectedWeek],f]})
                                               }
                                          }
   
                                        }} className={`relative overflow-hidden ${!specificList.includes(date) && dateView=="calendar" ? 'opacity-40 pointer-events-none':''} inline-flex min-w-[100px] justify-center px-3 bg-gray-200 border-transparent py-1  border rounded-full text-[14px] cursor-pointer`}>
                                                <label className="relative cursor-pointer z-10">{f}</label>
                                                <span className={`absolute cursor-pointer rounded-l-full left-0 top-0 border ${dateView!="calendar" ? (days[selectedWeek].includes(f) ? 'border-honolulu_blue-300 bg-honolulu_blue-50  text-honolulu_blue-400' :' border-transparent') : (availableSpecific[date]?.includes(f) ? 'border-honolulu_blue-300 bg-honolulu_blue-50 text-honolulu_blue-400':'border-transparent')} h-[100%] w-[50%]`}></span>
                                                <span className={`absolute cursor-pointer rounded-r-full right-0 top-0 border ${dateView!="calendar" ? (urgent_days[selectedWeek].includes(f) ? ' border-orange-400 bg-orange-50  text-orange-400' :'border-transparent') : (urgentAvailableSpecific[date]?.includes(f) ? ' border-orange-400 bg-orange-50  text-orange-400':'border-transparent')} h-[100%] w-[50%]`}></span>
                                        </div>
                                   )
                                 )
                               })}



                          </div>


                       

                      </div>

                      
                     
                </div>

                <div className="mt-[40px] flex items-center">
                         <FormLayout.Button onClick={SubmitForm} valid={valid} loading={loading} label={loading ? t('common.loading') :  t('common.set-scheduler')}/>
                        
                </div>

               </div>



              
        </DefaultLayout>
  )
}

export default index