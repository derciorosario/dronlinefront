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



function App({hideLayout,itemToShow,setItemToShow}) {

 
  const data=useData()
  const {user} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  
  let required_data=['clinical_diary']

  const [filterOptions,setFilterOptions]=useState([])
 
  
  useEffect(()=>{ 

    if(!user) return
    data._get(required_data,{clinical_diary:{appointment_id:itemToShow.appointment.id,name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}})

  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','clinical_diary')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','clinical_diary')
         setCurrentPage(1)
         data._get(required_data,{clinical_diary:{appointment_id:itemToShow.appointment.id,name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable])


function globalOnclick(id){
  setItemToShow({
    ...itemToShow,
    action:'update',
    name:'create-clinical-diary',
    update_id:id
   })
}
 
  return (
   
         <DefaultLayout hide={hideLayout} pageContent={{title:t('menu.clinical-diary'),desc:t('titles.clinical-diary'),btn:{onClick:(e)=>{
                 
          navigate('/add-doctors')

         },text:t('menu.add-doctors')}}}>
           
            
        <div className="flex">

           <div className="flex-1">
          
           <BasicSearch hideFilters={true} total={data._clinical_diary?.total} from={'clinical_diary'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
           <div className="flex w-full relative">

            <div className="absolute w-full">
            <BaiscTable canAdd={false} loaded={data._loaded.includes('clinical_diary')} header={[
                         <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/delete/clinical-diary'}
                         } items={data._clinical_diary?.data || []}/>,
                         'ID',
                          t('form.main-complaint'),
                          t('form.current-illness-history'),
                          t('form.past-medical-history'),
                          t('form.psychosocial-history'),
                          t('form.family-history'),
                          t('form.gynecological-history'),
                          t('form.physical-exam'),
                          t('form.complementary-exams'),
                          t('form.diagnoses'),
                          t('form.therapeutic-plan'),
                          t('form.prescribed-medications'),
                          t('form.therapeutic-recommendations'),
                          t('form.other-instructions')
                        ]
                      }

                      

                       body={(data._clinical_diary?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr >
                                <BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/delete/clinical-diary',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.main_complaint}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.current_illness_history}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.past_medical_history}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.psychosocial_history}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.family_history}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.gynecological_history}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.physical_exam}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.complementary_exams}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.diagnoses}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.therapeutic_plan}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.prescribed_medications}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.therapeutic_recommendations}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.other_instructions}</BaiscTable.Td>
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
