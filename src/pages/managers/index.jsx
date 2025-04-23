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



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  
  let required_data=['managers']

  const [filterOptions,setFilterOptions]=useState([])
 
  
  useEffect(()=>{ 
    if(!user || updateFilters || data.updateTable) return
    data.handleLoaded('remove','managers')
    data._get(required_data,{managers:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])



  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove','managers')
         setCurrentPage(1)
         data._get(required_data,{managers:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 

    }
 },[data.updateTable,updateFilters])


useEffect(()=>{
  if(!user) return
  if(user?.role!="admin"){
         navigate('/') 
  }
},[user])

 
  return (
   
         <DefaultLayout pageContent={{title:t('menu.managers'),desc:'',btn:{onClick:(e)=>{ 
          navigate('/add-managers')
         },text:t('menu.add-managers')}}}>
           
            
        <div className="flex">

          
           <div className="flex-1">
          
           <BasicSearch loaded={data._loaded.includes('managers')} hideFilters={true} search={search} total={data._managers?.total} from={'managers'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
           <div className="flex w-full relative">

            <div className="absolute w-full">
            <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-managers'} loaded={data._loaded.includes('managers')} header={[
                         <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/managers/delete'}
                         } items={data._managers?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          'Email',
                          t('common.created_at'),
                          t('common.last-update'),
                        ]
                      }

                       body={(data._managers?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/managers/delete',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/manager/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/manager/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/manager/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/manager/`+i.id}>{data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/manager/`+i.id}>{i.updated_at ? data._c_date(i.updated_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " " +data._c_date(i.updated_at).split('T')[1].slice(0,5) : data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                                                   
                            </BaiscTable.Tr>
                        ))}

                      
              />

             <BasicPagination show={data._loaded.includes('managers')} from={'managers'} setCurrentPage={setCurrentPage} total={data._managers?.total}  current={data._managers?.current_page} last={data._managers?.last_page}/>
          
            </div>

           </div>


           </div>
        </div>
       </DefaultLayout>

  );
}

export default App;
