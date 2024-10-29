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
                         '.',
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
                                <BaiscTable.Td onClick={()=>{
                                    data.setSinglePrintContent({
                                      patient: itemToShow.appointment.user,
                                      title: t('menu.clinical-diary'),
                                      content: [
                                          {name: t('form.main-complaint'), value: i.main_complaint},
                                          {name: t('form.current-illness-history'), value: i.current_illness_history},
                                          {name: t('form.past-medical-history'), value: i.past_medical_history},
                                          {name: t('form.psychosocial-history'), value: i.psychosocial_history},
                                          {name: t('form.family-history'), value: i.family_history},
                                          {name: t('form.gynecological-history'), value: i.gynecological_history},
                                          {name: t('form.physical-exam'), value: i.physical_exam},
                                          {name: t('form.complementary-exams'), value: i.complementary_exams},
                                          {name: t('form.diagnoses'), value: i.diagnoses},
                                          {name: t('form.therapeutic-plan'), value: i.therapeutic_plan},
                                          {name: t('form.prescribed-medications'), value: i.prescribed_medications},
                                          {name: t('form.therapeutic-recommendations'), value: i.therapeutic_recommendations},
                                          {name: t('form.other-instructions'), value: i.other_instructions},
                                      ]
                                    })
                                 }}>

                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
                               
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
