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

  let required_data=['patients']
  const {pathname} = useLocation()
  const [loading,setLoading]=useState(false)

  
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  const [filterOptions,setFilterOptions]=useState([
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
  ])
 
  
  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove','patients')
    data._get(required_data,{patients:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])



useEffect(()=>{

    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove','patients')
         setCurrentPage(1)
         data._get(required_data,{patients:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
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

    await data.makeRequest({method:'post',url:`api/patient/${id}/status`,withToken:true,data:{
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
   
         <DefaultLayout pageContent={{title:user?.role=="doctor" ? t('common.my-patients') : t('common.patients'),desc:user?.role=="doctor" ? t('common.my-patients') : t('titles.patients'),btn:!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.patient?.includes('create'))) ? null : {onClick:(e)=>{
                 
             navigate('/add-patient')

          },text:t('menu.add-patients')}}}>
           

             <div className="flex">

                <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>    

                <div className="flex-1">

                   <BasicSearch loaded={data._loaded.includes('patients')} search={search} total={data._patients?.total} from={'patients'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                   <SelectedFilters setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>     
                              
                   <div className="flex w-full relative">
                        
                        <div className="absolute w-full">

                          <BaiscTable canAdd={user?.role=="admin"}  addPath={'/add-patient'} loaded={data._loaded.includes('patients')  && !loading} header={[
                          user?.role=="doctor" ? null : <BaiscTable.MainActions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.patient?.includes('delete')))} options={{
                          deleteFunction:'default',
                          deleteUrl:'api/patients/delete'}
                         } items={data._patients?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          'Email',
                          t('form.main-contact'),
                          t('form.gender'),
                          t('form.address'),
                          (user?.role=="admin" || user?.role=="manager") ? 'Status' : null,
                          t('common.created_at'),
                          t('common.last-update'),
                        ]
                      }

                       body={data._patients?.data?.map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td hide={user?.role=="doctor"}>

                                  <BaiscTable.Actions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.patient?.includes('delete')))} options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/patients/delete',
                                       id:i.id}
                                  }/>

                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.main_contact}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.gender ? t('common.'+i.gender) : '-'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{t(i.address)}</BaiscTable.Td>
                                <BaiscTable.Td hide={!(user?.role=="admin" || user?.role=="manager")} url={`/appointment/`+i.id}>
                                        <button type="button" class={`text-white cursor-default ml-4 ${i.status=="active" ? "bg-honolulu_blue-500": "bg-gray-400"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                           {i.status=="active" ? t('common.active') : t('common.inactive')}
                                        </button>
                                </BaiscTable.Td>
                                 <BaiscTable.Td url={`/patient/`+i.id}>{data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                  <BaiscTable.Td url={`/patient/`+i.id}>{i.updated_at ? data._c_date(i.updated_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " " +data._c_date(i.updated_at).split('T')[1].slice(0,5) : data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                               
                                <BaiscTable.AdvancedActions hide={user?.role!="admin"} w={200} id={i.id} items={[
                                        {name:t('common.activate-account'),hide:i.status=="active" || user?.role!="admin",onClick:()=>{handleItems({action:'status',status:'active',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)},
                                        {name:t('common.inactivate-account'),hide:i.status=="inactive" || user?.role!="admin",onClick:()=>{handleItems({action:'status',status:'inactive',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)},
                                ]}/>
                            </BaiscTable.Tr>
                        ))}

                      
                    />

                   <BasicPagination show={data._loaded.includes('patients')} from={'patients'} setCurrentPage={setCurrentPage} total={data._patients?.total}  current={data._patients?.current_page} last={data._patients?.last_page}/>
      


                           </div>
                   </div>


                </div> 

             </div>
            
            

         </DefaultLayout>
  );
}

export default App;
