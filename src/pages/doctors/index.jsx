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
    data._get(required_data,{doctors:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','doctors')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','doctors')
         setCurrentPage(1)
         data._get(required_data,{doctors:{name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 

    }
 },[data.updateTable])



 
  return (
   
         <DefaultLayout pageContent={{title:t('common.doctors'),desc:t('titles.doctors'),btn:{onClick:(e)=>{
                 
          navigate('/add-doctors')

         },text:t('menu.add-doctors')}}}>
           
            
        <div className="flex">

           <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>     
          
           <div className="flex-1">
          
           <BasicSearch total={data._doctors?.total} from={'doctors'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
           <div className="flex w-full relative">

            <div className="absolute w-full">
            <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-doctors'} loaded={data._loaded.includes('doctors')} header={[
                         <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/doctors/delete'}
                         } items={data._doctors?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          t('form.medical-specialty'),
                          'Email',
                          t('form.main-contact'),
                          t('form.gender'),
                          t('form.address'),
                          t('common.created_at'),
                          t('common.last-update'),
                        ]
                      }

                       body={(data._doctors?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/doctors/delete',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.pt_name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.main_contact}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{t('common.'+i.gender)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{t(i.address)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0] + " " +i.updated_at.split('T')[1].slice(0,5) : i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                               
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
