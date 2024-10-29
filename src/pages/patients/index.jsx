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

  let required_data=['patients']
  const {pathname} = useLocation()

  
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
    if(!user) return
    data._get(required_data,{patients:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','patients')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','patients')
         setCurrentPage(1)
         data._get(required_data,{patients:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 

    }
 },[data.updateTable])

  return (
   
         <DefaultLayout pageContent={{title:user?.role=="doctor" ? t('common.my-patients') : t('common.patients'),desc:user?.role=="doctor" ? t('common.my-patients') : t('titles.patients'),btn:{onClick:(e)=>{
                 
             navigate('/add-patient')

          },text:t('menu.add-patients')}}}>
           

             <div className="flex">

                <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>    

                <div className="flex-1">

                   <BasicSearch total={data._patients?.total} from={'patients'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                   
                   <div className="flex w-full relative">
                        
                        <div className="absolute w-full">


                           <BaiscTable canAdd={user?.role=="admin"}  addPath={'/add-patient'} loaded={data._loaded.includes('patients')} header={[
                          user?.role=="doctor" ? null : <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/patients/delete'}
                         } items={data._patients?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          'Email',
                          t('form.main-contact'),
                          t('form.gender'),
                          t('form.address'),
                          t('common.created_at'),
                          t('common.last-update'),
                        ]
                      }

                       body={data._patients?.data?.map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td hide={user?.role=="doctor"}>

                                  <BaiscTable.Actions options={{
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
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0] + " " +i.updated_at.split('T')[1].slice(0,5) : i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                               
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
