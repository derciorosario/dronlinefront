import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import BasicPagination from '../../components/Pagination/basic';
import BasicSearch from '../../components/Search/basic';
import BasicFilter from '../../components/Filters/basic';
import FormCard from '../../components/Cards/form';



function App() { 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()
  const [loading,setLoading]=useState(false)

  let required_data=['user_activities','users_activity_info']
  const {pathname} = useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')




  const [startDate,setStartDate]=useState('')
  const [endDate,setEndDate]=useState('')
  
  const [filterOptions,setFilterOptions]=useState([
    /*{
      open:false,
      field:'all_managers',
      name:t('common.manager'),
      search:'',
      items:[],
      param:'user_id',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    /*{
      open:false,
      field:'all_doctors',
      name:t('common.doctor'),
      search:'',
      items:[],
      param:'user_id',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    {
      open:false,
      field:'all_patients',
      name:t('common.patient'),
      search:'',
      items:[],
      param:'user_id',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    }*/
  ])

  const [selectedManager,setSelectedManager]=useState(null)

  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove','user_activities')
    data.handleLoaded('remove','users_activity_info')
    data._get(required_data,{user_activities:{user_id:selectedManager?.id || '',name:search,page:currentPage,start_date:startDate,end_date:endDate,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage,updateFilters,endDate,startDate,selectedManager])


 

  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove','user_activities')
         data.handleLoaded('remove','users_activity_info')
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{user_activities:{user_id:selectedManager?.id || '',name:search,page:1,start_date:startDate,end_date:endDate,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable,updateFilters])


 useEffect(()=>{
  if(!user) return
  if(user?.role=="manager" && !user?.data?.permissions?.stats?.includes('read')){
         navigate('/') 
  }
},[user])


function selectManager(u){
  data.handleLoaded('remove','user_activities')
  setSelectedManager(u)
}


function convertSeconds(seconds) {
  if(!seconds){
    seconds=0
  }

  seconds=parseInt(seconds)

  const MINUTE = 60;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY; // Approximate month length
  const YEAR = 12 * MONTH; // Approximate year length

  const years = Math.floor(seconds / YEAR);
  seconds %= YEAR;

  const months = Math.floor(seconds / MONTH);
  seconds %= MONTH;


  const days = Math.floor(seconds / DAY);
  seconds %= DAY;

  const hours = Math.floor(seconds / HOUR);
  seconds %= HOUR;

  const minutes = Math.floor(seconds / MINUTE);
  seconds %= MINUTE;



  if (years) {
      return `${years} ${years === 1 ? t('common.year') : t('common.years')}`;
  } else if (months) {
      return `${months} ${months === 1 ? t('common.month') : t('common.months')}`;
  } else if (days) {
      return `${days} ${days === 1 ? t('common.day') : t('common.days')}`;
  } else if (hours) {
      return `${hours} ${hours === 1 ? t('common.hour') : t('common.hours')}`;
  } else if (minutes) {
      return `${minutes} ${minutes === 1 ? t('common.minute') : t('common.minutes')}`;
  } else {
      return `${seconds} ${seconds === 1 ? t('common.second') : t('common.seconds')}`;
  }
}


function ManagersList(){

    return (
      <div>

        <BaiscTable   canAdd={false}  loaded={data._loaded.includes('users_activity_info') && !loading} header={[
                  'ID',
                  t('common.user'),
                  t('common.role'),
                  t('common.duration'),
                  t('common.last-login-time'),
                  t('common.last-logout-time')
                ]
              }
        
              body={(data._users_activity_info).map((i,_i)=>(
                      <BaiscTable.Tr>
                        <BaiscTable.Td onClick={()=>selectManager(i.user)}>{i.userId}</BaiscTable.Td>
                        <BaiscTable.Td onClick={()=>selectManager(i.user)}>{i.user?.name}</BaiscTable.Td>
                        <BaiscTable.Td onClick={()=>selectManager(i.user)}>{t('common.'+i.role)}</BaiscTable.Td>
                        <BaiscTable.Td onClick={()=>selectManager(i.user)}>{convertSeconds(i.totalDuration)}</BaiscTable.Td>
                        <BaiscTable.Td onClick={()=>selectManager(i.user)}>{i.lastLoginTime?.split(' ')?.[0]?.split('-')?.reverse()?.join('/')} {i.lastLoginTime?.split(' ')?.[1]?.slice(0,5)}</BaiscTable.Td>
                        <BaiscTable.Td onClick={()=>selectManager(i.user)}>{i.lastLogoutTime?.split(' ')?.[0]?.split('-')?.reverse()?.join('/')} {i.lastLogoutTime?.split(' ')?.[1]?.slice(0,5)}</BaiscTable.Td>
                    </BaiscTable.Tr>
                ))}
          />

      </div>
    )


}


return (
   
  <DefaultLayout
    pageContent={{page:'user_activities',title:t('common.duration-logs'),desc:'',btnGoBack:{onClick:()=>{
     
      setSelectedManager(null)

   },hide:!selectedManager || !data._loaded.includes('user_activities')}}}>


    {!selectedManager ? ManagersList() : (

<div className="flex">

<BasicFilter end={endDate} start={startDate} setEnd={setEndDate} setStart={setStartDate} setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>     
 
<div className="flex-1">
    <BasicSearch loaded={data._loaded.includes('user_activities')}  hideSearch={true} search={search} total={data._user_activities?.activities?.total} from={'user_activities'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
   
     
     {data._loaded.includes('user_activities') && <FormCard hide={!selectedManager}  items={[
         {name:t('common.manager'),value:selectedManager?.name},
         {name:t('common.duration'),value:convertSeconds(data._user_activities?.totalDuration)}
     ]}/>}

    <div className="flex w-full relative">

       <div className="absolute w-full">
       <BaiscTable notClickable={true} canAdd={false}  loaded={data._loaded.includes('user_activities') && !loading} header={[
          'ID',
          t('common.user'),
          t('common.role'),
          t('common.duration'),
          t('common.minutes'),
          t('common.login-time'),
          t('common.logout-time')
        ]
      }
 
       body={(data._user_activities?.activities?.data || []).map((i,_i)=>(
              <BaiscTable.Tr>
                 <BaiscTable.Td >{i.id}</BaiscTable.Td>
                 <BaiscTable.Td >{i.user?.name}</BaiscTable.Td>
                 <BaiscTable.Td >{t('common.'+i.role)}</BaiscTable.Td>
                 <BaiscTable.Td >{convertSeconds(i.duration)}</BaiscTable.Td>
                 <BaiscTable.Td >{i.duration ? (i.duration / 60 ).toFixed(2) : 0} min</BaiscTable.Td>
                 <BaiscTable.Td >{i.loginTime?.split(' ')?.[0]?.split('-')?.reverse()?.join('/')} {i.loginTime?.split(' ')?.[1]?.slice(0,5)}</BaiscTable.Td>
                 <BaiscTable.Td >{i.logoutTime?.split(' ')?.[0]?.split('-')?.reverse()?.join('/')} {i.logoutTime?.split(' ')?.[1]?.slice(0,5)}</BaiscTable.Td>
             
            </BaiscTable.Tr>
        ))}
    />
        <BasicPagination show={data._loaded.includes('user_activities')} from={'user_activities'} setCurrentPage={setCurrentPage} total={data._user_activities?.activities?.total}  current={data._user_activities?.activities?.current_page} last={data._user_activities?.activities?.last_page}/>

       </div>
    </div>
</div>
</div>
       )}
    
     
      
   </DefaultLayout>
);
}

export default App;
