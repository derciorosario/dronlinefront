import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';
import DoctorCard from '../../components/Cards/doctor';
import CardSkeleton from '../../components/Skeleton/cards';
import BasicFilter from '../../components/Filters/basic';
import BasicSearch from '../../components/Search/basic';
import BasicPagination from '../../components/Pagination/basic';



function App({showOnlyList}) {

  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()

  let required_data=['doctors'];
  const {pathname} = useLocation()
  const [search,setSearch]=useState('')

  const [filterOptions,setFilterOptions]=useState([
    {
      open:false,
      field:'specialty_categories',
      name:t('common.specialty'),
      t_name:'specialists',
      search:'',
      items:[],
      param:'medical_specialty',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    {
      open:false,
      field:'gender',
      name:t('form.gender'),
      t_name:'gender',
      search:'',
      items:[
        {name:t('common.female'),id:'female'},
        {name:t('common.male'),id:'male'}
      ],
      param:'gender',
      fetchable:false,
      loaded:true,
      selected_ids:[],
      default_ids:[]
    },
    {
      open:false,
      field:'years_of_experience',
      name:t('common.years_of_experience'),
      t_name:'years_of_experience',
      search:'',
      items:[],
      param:'years_of_experience',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
  ])
 


  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  
  useEffect(()=>{ 
        if(!user || data.updateTable || updateFilters) return
        data.handleLoaded('remove','doctors')
        data._get(required_data,{doctors:{status:(user?.role=="admin" || user?.role=="manager") ? '' : 'active',name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])


useEffect(()=>{
    data.setSelectedDoctors({})
},[pathname])


 useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         setCurrentPage(1)
         data.handleLoaded('remove','doctors')
         data._get(required_data,{doctors:{status:(user?.role=="admin" || user?.role=="manager") ? '' : 'active',name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable,updateFilters])


 function pageContet(){

    return   (
      <>
            <div className="flex">
                <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
                <div className="flex-1">
                  <BasicSearch loaded={data._loaded.includes('doctors')} total={data._doctors?.total} search={search} from={'doctors'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                  <div className={`flex flex-wrap gap-2 ease-in transition ${!data._loaded.includes('doctors') ? 'hidden':''}`}>
                        {data._doctors?.data?.map(i=>(
                          <DoctorCard item={i}/>
                        ))}
                  </div>
                  {!data._loaded.includes('doctors') && <CardSkeleton replicate={3}/>}
                </div>
             </div>
             
             <BasicPagination show={data._loaded.includes('doctors')} from={'doctors'} setCurrentPage={setCurrentPage} total={data._doctors?.total}  current={data._doctors?.current_page} last={data._doctors?.last_page}/>
          
      </>
    )
 }


 if(showOnlyList){
  return (
    <>
     {pageContet()}
    </>
 )
 }


  return (
   
         <DefaultLayout  pageContent={{page:'specialists',title:t('common.specialists'),desc:t('titles.specialists'),btn:{onClick:user?.role=="patient" ? (e)=>{
              
             if(!user?.data?.date_of_birth){
                data._showPopUp('basic_popup','conclude_patient_info')
              }else{
                navigate('/add-appointments')
              }
              
         } : null,text:t('menu.add-appointments')}}}>

           {pageContet()}

         </DefaultLayout>
  );
}

export default App;
