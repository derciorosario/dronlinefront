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

function App() { 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()
  const [loading,setLoading]=useState(false)

  let required_data=['waiting_list']
  const {pathname} = useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')
  const [endDate,setEndDate]=useState('')
  const [startDate,setStartDate]=useState('')
    

  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove','waiting_list')
    data._get(required_data,{waiting_list:{name:search,page:currentPage,start_date:startDate,end_date:endDate,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove','waiting_list')
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{waiting_list:{name:search,page:1,start_date:startDate,end_date:endDate,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable, updateFilters])



useEffect(()=>{
  if(!user) return
  if(user?.role=="manager" && !user?.data?.permissions?.waiting_list?.includes('read')){
         navigate('/') 
  }
},[user])


 const [filterOptions,setFilterOptions]=useState(
    data.waitingListOptions.map(option => ({
      open: false,
      field: option.name,
      name: t(`wl.${option.name}`),
      search: '',
      items: option.items.map(item => ({
        name: t(`wl.${item}`),
        id: item
      })),
      param: option.name,
      fetchable: false,
      loaded: true,
      selected_ids: [],
      default_ids: []
    }))
 )
 


 return (
   
  <DefaultLayout

    showDates={true}  setStartDate={setStartDate} startDate={startDate} endDate={endDate} setEndDate={setEndDate}

    pageContent={{page:'waiting_list',title:t('common.waiting-list'),desc:''}}>
      
      <div className="flex">

         <BasicFilter  setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>          

         <div className="flex-1">
             
             <BasicSearch loaded={data._loaded.includes('waiting_list') && !loading}  search={search}  total={data._waiting_list?.list?.total} from={'waiting_list'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
             <div className="flex w-full relative">
                <div className="absolute w-full">
                <BaiscTable canAdd={false}  loaded={data._loaded.includes('waiting_list') && !loading} header={[
                   <BaiscTable.MainActions options={{
                      deleteFunction:'default',
                      deleteUrl:'api/waiting-list/delete'}
                   } items={data._waiting_list?.list?.data || []}/>,
                   'ID',
                   t('form.name'),
                   t('form.contact'),
                   'Email',
                   t('wl.province-or-city'),
                   'Feedback',
                   t('common.created_at'),
                 ]
               }

                body={(data._waiting_list.list?.data || []).map((i,_i)=>(
                       
                       <BaiscTable.Tr>
                        <BaiscTable.Td>
                          <BaiscTable.Actions  options={{
                                deleteFunction:'default',
                                deleteUrl:'api/waiting-list/delete',
                                id:i.id}
                          }/>
                        </BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{i.id}</BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{i.name}</BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{i.contact}</BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{i.email}</BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{t('wl.'+i.province)}</BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{data.text_l(i.open_feedback) || '-'}</BaiscTable.Td>
                        <BaiscTable.Td url={`/waiting-list/`+i.id}>{data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                                         
                     </BaiscTable.Tr>
                 ))}
             />
             
                <BasicPagination show={data._loaded.includes('waiting_list')} from={'waiting_list'} setCurrentPage={setCurrentPage} total={data._waiting_list?.list?.total}  current={data._waiting_list?.list?.current_page} last={data._waiting_list?.list?.last_page}/>
  
                </div>
             </div>
         </div>
      </div>
      
   </DefaultLayout>
);
}

export default App;
