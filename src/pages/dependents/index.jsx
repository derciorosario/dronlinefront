import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import BasicFilter from '../../components/Filters/basic';
import BasicSearch from '../../components/Search/basic';



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()

  let required_data=['dependents']
  const {pathname} = useLocation()

  
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  const [filterOptions,setFilterOptions]=useState([
    {
      open:false,
      field:'relationship',
      name:t('form.relationship'),
      t_name:'relationship',
      search:'',
      items:[
        { "name": t('common.child'), "id": "child" },
        { "name": t('common.spouse'), "id": "spouse" },
        { "name": t('common.parent'), "id": "parent" },
        { "name": t('common.sibling'), "id": "sibling" },
        { "name": t('common.grandparent'), "id": "grandparent" },
        { "name": t('common.grandchild'), "id": "grandchild" },
        { "name": t('common.uncle'), "id": "uncle" },
        { "name": t('common.aunt'), "id": "aunt" },
        { "name": t('common.nephew'), "id": "nephew" },
        { "name": t('common.niece'), "id": "niece" },
        { "name": t('common.cousin'), "id": "cousin" },
         {name:t('common.another'),value:'other'}
      ],
      param:'relationship',
      fetchable:false,
      loaded:true,
      selected_ids:[],
      default_ids:[]
    }
  ])
 
  
  useEffect(()=>{ 
    if(!user || user?.role=="doctor" || updateFilters || data.updateTable) return
    data.handleLoaded('remove','dependents')
    data._get(required_data,{dependents:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage])


  useEffect(()=>{
    if(data.updateTable || updateFilters){
         data.setUpdateTable(null)
         setUpdateFilters(null)
         data.handleLoaded('remove','dependents')
         setCurrentPage(1)
         data._get(required_data,{dependents:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable,updateFilters])

  useEffect(()=>{
   if(!user) return
   if(user?.role!="patient"){
          navigate('/') 
   }
 },[user])
 


  return (
         <DefaultLayout pageContent={{title:user?.role=="doctor" ? t('common.my-dependents') : t('common.dependents'),desc:user?.role=="doctor" ? t('common.my-dependents') : t('titles.dependents'),btn:user?.role=="patient" ? { onClick:(e)=>{   
             navigate('/add-dependent')
          },text:t('menu.add-dependents')}:{}}}>
             <div className="flex">
                <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>    
                <div className="flex-1">

                   <BasicSearch loaded={data._loaded.includes('dependents')} search={search} total={data._dependents?.total} from={'dependents'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                   
                   <div className="flex w-full relative">
                        
                        <div className="absolute w-full">


                           <BaiscTable canAdd={user?.role=="patient"}  addPath={'/add-dependent'} loaded={data._loaded.includes('dependents')} header={[
                          user?.role=="doctor" ? null : <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/dependents/delete'}
                         } items={data._dependents?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          t('form.relationship'),
                          'Email',
                          t('form.main-contact'),
                          t('form.gender'),
                          t('form.address'),
                          t('common.created_at'),
                          t('common.last-update'),
                        ]
                      }

                       body={data._dependents?.data?.map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td hide={user?.role=="doctor"}>

                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/dependents/delete',
                                       id:i.id}
                                  }/>

                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{t('common.'+i.relationship)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{i.main_contact}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{i.gender ? t('common.'+i.gender) : '-'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{t(i.address)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/dependent/`+i.id}>{i.updated_at ? data._c_date(i.updated_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " " +data._c_date(i.updated_at).split('T')[1].slice(0,5) : data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                                        
                            </BaiscTable.Tr>
                        ))}

                      
                    />


                           </div>
                   </div>


                </div> 

             </div>
            
            

         </DefaultLayout>
  );
}

export default App;
