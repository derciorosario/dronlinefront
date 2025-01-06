import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import BasicFilter from '../../components/Filters/basic';
import BasicSearch from '../../components/Search/basic';
import BasicPagination from '../../components/Pagination/basic';
import i18next from 'i18next';
import SelectedFilters from '../../components/Filters/selected-filters';



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  const [dateFilters,setDateFilter]=useState([
    {field:'invoice',start:'',end:'',start_name:t('common.start_payment_date'),end_name:t('common.end_payment_date')}
  ])
  
  let required_data=['doctors','specialty_categories']

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
    }
  ])
 
  
  useEffect(()=>{ 
    if(!user) return
    data._get(required_data,{doctors:{name:search,page:currentPage,
    invoice_start_date:dateFilters.filter(i=>i.field=="invoice")[0].start,
    invoice_end_date:dateFilters.filter(i=>i.field=="invoice")[0].end,
    ...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage,updateFilters,dateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','doctors')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','doctors')
         setCurrentPage(1)
         data._get(required_data,{doctors:{name:search,page:1,
           invoice_start_date:dateFilters.filter(i=>i.field=="invoice")[0].start,
           invoice_end_date:dateFilters.filter(i=>i.field=="invoice")[0].end,
          ...data.getParamsFromFilters(filterOptions)}}) 

    }
 },[data.updateTable])



 function handleItems({action,id}){
   if(action=="see-availabilty"){
      navigate('/consultation-availability/'+id)
   }

   if(action=="see-scheduler"){
      navigate('/scheduler/'+id)
   }
 }

 useEffect(()=>{
  if(!user) return
  if(user?.role=="manager" && !user?.data?.permissions?.doctor?.includes('read')){
         navigate('/') 
  }
},[user])


 

function getDoctorAmountEarned(i){

  let percentage=i.use_app_gain_percentage ? JSON.parse(user?.app_settings?.[0]?.value)?.gain_percentage : i.gain_percentage
  percentage=parseInt(percentage || 0)
  
  let collected=parseFloat((i.total_payment_amount || 0) - (i.total_refund_amount || 0))

  return collected * (percentage / 100)
  
}

 
 
  return (
   
         <DefaultLayout pageContent={{title:t('common.doctors'),desc:t('titles.doctors'),btn:!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('create'))) ? null : {onClick:(e)=>{
          navigate('/add-doctors')
         },text:t('menu.add-doctors')}}}>
           
            
        <div className="flex">
           <BasicFilter dateFilters={dateFilters} setDateFilter={setDateFilter} setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
           <div className="flex-1">
          
           <BasicSearch total={data._doctors?.total} from={'doctors'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
           <SelectedFilters setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>                 
           <div className="flex w-full relative">

            <div className="absolute w-full">
            <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-doctors'} loaded={data._loaded.includes('doctors')} header={[
                         <BaiscTable.MainActions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('delete')))} options={{
                          deleteFunction:'default',
                          deleteUrl:'api/doctors/delete'}
                         } items={data._doctors?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          t('form.medical-specialty'),
                          'Email',
                          t('form.main-contact'),
                          t('common.gain_percentage'),
                          t('common.total_amount_collected'),
                          t('common.amount_earned'),
                         // `IRPC (${JSON.parse(user?.app_settings?.[0]?.value)?.irpc || 0}%)`,
                          t('form.gender'),
                          t('form.address'),
                          t('common.created_at'),
                          t('common.last-update'),
                          (user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor_availability?.includes('update'))) ? '.' : ''
                        ]
                      }

                       body={(data._doctors?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td>
                                  <BaiscTable.Actions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('delete')))} options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/doctors/delete',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.[`${i18next.language}_name`]}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.main_contact}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{(i.use_app_gain_percentage ? JSON.parse(user?.app_settings?.[0]?.value)?.gain_percentage : i.gain_percentage) || 0}{'%'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{(i.total_payment_amount || 0) - (i.total_refund_amount || 0)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{getDoctorAmountEarned(i)}</BaiscTable.Td>
                                {/** <BaiscTable.Td url={`/doctor/`+i.id}>{data.getDoctorIRPC(i)}</BaiscTable.Td> */}
                                <BaiscTable.Td url={`/doctor/`+i.id}>{t('common.'+i.gender)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{t(i.address)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0] + " " +i.updated_at.split('T')[1].slice(0,5) : i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.AdvancedActions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor_availability?.includes('update')))} w={200} id={i.id} items={[
                                    {name:t('common.availability'),onClick:()=>{handleItems({action:'see-availabilty',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>)},
                                    {name:t('menu.scheduler'),onClick:()=>{handleItems({action:'see-scheduler',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>)},
                                ]}/>
                                

                            </BaiscTable.Tr>
                        ))}

                      
          />
       <BasicPagination show={data._loaded.includes('doctors')} from={'doctors'} setCurrentPage={setCurrentPage} total={data._doctors?.total}  current={data._doctors?.current_page} last={data._doctors?.last_page}/>
      
            </div>

            
           

           </div>


           </div>
        </div>
       </DefaultLayout>

  );
}

export default App;
