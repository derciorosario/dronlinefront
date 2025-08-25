import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import BasicFilter from '../../components/Filters/basic';
import BasicSearch from '../../components/Search/basic';
import SelectedFilters from '../../components/Filters/selected-filters';
import toast from 'react-hot-toast';
import BasicPagination from '../../components/Pagination/basic';



function App() {
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()

  let required_data=['maria_conversations']
  const {pathname} = useLocation()
  const [loading,setLoading]=useState(false)

  
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  const [filterOptions,setFilterOptions]=useState([
    {
      open:false,
      field:'all_doctors',
      name:t('common.doctor'),
      search:'',
      items:[],
      param:'doctor_user_id',
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
      param:'patient_id',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    
  ])
 
  
  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove','maria_conversations')
    data._get(required_data,{maria_conversations:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])



useEffect(()=>{

    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove','maria_conversations')
         setCurrentPage(1)
         data._get(required_data,{maria_conversations:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }

 },[data.updateTable,updateFilters])


 useEffect(()=>{
  if(!user) return
  if(user?.role=="patient"  || user?.role=="manager" && !user?.data?.permissions?.patient?.includes('read')){
         navigate('/') 
  }
 },[user])


async function handleItems({action,id,status}){
 
  if(action=="status"){

   data._closeAllPopUps()
   toast.remove()
   toast.loading(t('common.updating'))      

   setLoading(true)

   try{

    await data.makeRequest({method:'post',url:`api/ai/conversation/${id}/status`,withToken:true,data:{
      status
    }, error: ``},0);

    toast.remove()
    toast.success(t('messages.updated-successfully'))
    data.setUpdateTable(Math.random())
    setLoading(false)

   }catch(e){
     
      setLoading(false)
      toast.remove()
      if(e.message==500){
        toast.error(t('common.unexpected-error'))
      }else if(e.message=='Failed to fetch'){
          toast.error(t('common.check-network'))
      }else{
          toast.error(t('common.unexpected-error'))
      }

   }

  }
}


  return (
         <DefaultLayout pageContent={{title:t('common.convasation-list')}}>
             <div className="flex">
                <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>    
                <div className="flex-1">

                   <BasicSearch loaded={data._loaded.includes('maria_conversations')} search={search} total={data._maria_conversations?.total} from={'maria_conversations'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                   <SelectedFilters setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>     
                              
                   <div className="flex w-full relative">
                        
                        <div className="absolute w-full">

                          <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-patient'} loaded={data._loaded.includes('maria_conversations')  && !loading} header={[
                          user?.role=="doctor" ? null : <BaiscTable.MainActions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.patient?.includes('delete')))} options={{
                          deleteFunction:'default',
                          deleteUrl:'api/maria-conversations/delete'}
                         } items={(data._maria_conversations?.conversations?.data || [])}/>,
                         'ID',
                          t('form.full-name'),
                          t('common.type'),
                          t('common.created_at'),
                          t('common.last-update'),
                        ]
                      }

                       body={(data._maria_conversations?.conversations?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td hide={user?.role=="doctor"}>

                                  <BaiscTable.Actions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.ai_conversations?.includes('delete')))} options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/maria-conversations/delete',
                                       id:i.id}
                                  }/>

                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/ai/conversation/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/ai/conversation/`+i.id}>{i.user?.name || '-'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/ai/conversation/`+i.id}>{i.patientId ? t('common.patient') : i.doctorId ? t('common.doctor') : i.userId ? t('common.manager') : t('common.guest')}</BaiscTable.Td>
                               
                                <BaiscTable.Td url={`/ai/conversation/`+i.id}>{data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/ai/conversation/`+i.id}>{i.updated_at ? data._c_date(i.updated_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " " +data._c_date(i.updated_at).split('T')[1].slice(0,5) : data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                               
                               
                            </BaiscTable.Tr>
                        ))}

                      
                    />

                   <BasicPagination show={data._loaded.includes('maria_conversations')} from={'maria_conversations'} setCurrentPage={setCurrentPage} total={data._maria_conversations?.conversations?.total}  current={data._maria_conversations?.conversations?.current_page} last={data._maria_conversations?.conversations?.last_page}/>
      


                           </div>
                   </div>


                </div> 

             </div>
            
            

         </DefaultLayout>
  );
}

export default App;
