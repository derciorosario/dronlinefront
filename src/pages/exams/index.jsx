import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import BasicSearch from '../../components/Search/basic';
import BasicPagination from '../../components/Pagination/basic';



function App({hideLayout,itemToShow,setItemToShow}) {

 
  const data=useData()
  const {user} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  
  let required_data=['exams']

  const [filterOptions,setFilterOptions]=useState([])
 
  
  useEffect(()=>{ 

    if(!user) return
    data._get(required_data,{exams:{appointment_id:itemToShow.appointment.id,name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}})

  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','exams')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','exams')
         setCurrentPage(1)
         data._get(required_data,{exams:{appointment_id:itemToShow.appointment.id,name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable])


function globalOnclick(id){
  setItemToShow({
    ...itemToShow,
    action:'update',
    name:'create-exams',
    update_id:id
   })
}
 
  return (
   
         <DefaultLayout hide={hideLayout} pageContent={{title:t('menu.exams'),desc:t('titles.exams')}}>
           
            
        <div className="flex">

           <div className="flex-1">
          
           <BasicSearch hideFilters={true} total={data._clinical_diary?.total} from={'exams'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
           <div className="flex w-full relative">

            <div className="absolute w-full">
            <BaiscTable canAdd={false} loaded={data._loaded.includes('exams')} header={[
                         <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/delete/exams'}
                         } items={data._exams?.data || []}/>,
                         'ID',
                          t('form.requested-on'),
                          t('form.clinical-information'),
                          t('form.requested-exams'),
                          t('form.results-report')
                        ]
                      }


                       body={(data._exams?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr >
                                <BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/delete/exams',
                                       id:i.id}
                                  }/>
                               
                                </BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.requested_at}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.clinical_information}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.requested_exams}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.results_report}</BaiscTable.Td>
                            </BaiscTable.Tr>
                        ))}

                      
              />

<BasicPagination show={data._loaded.includes('clinical_diary')} from={'clinical_diary'} setCurrentPage={setCurrentPage} total={data._clinical_diary?.total}  current={data._clinical_diary?.current_page} last={data._clinical_diary?.last_page}/>
          

            </div>

            
           

           </div>


           </div>
        </div>
       </DefaultLayout>

  );
}

export default App;
