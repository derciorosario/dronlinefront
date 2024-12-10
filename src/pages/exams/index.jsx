import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import BasicSearch from '../../components/Search/basic';
import BasicPagination from '../../components/Pagination/basic';
import SinglePrint from '../../components/Print/single';



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

       <>
        
     
        <DefaultLayout hide={hideLayout} pageContent={{title:t('menu.exams'),desc:t('titles.exams')}}>   
            
        <div className="flex">

           <div className="flex-1">
          
           <BasicSearch printAction={()=>{

              data.setSinglePrintContent({
                  patient: itemToShow.appointment.patient,
                  doctor:itemToShow.appointment.doctor,
                  title: t('menu.exams'),
                  content: (data._exams?.data || []).map(f=>{
                    return [
                      {name:t('form.clinical-information'),value:f.clinical_information},
                      {name:t('form.requested-exams'),value:f.requested_exams},
                      {name:t('form.results-report'),value:f.results_report},
                      {name:t('form.requested-on'),value:f.requested_at}
                    ]
                  })
              })

           }} hideFilters={true} total={data._exams?.total} from={'exams'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
            <div className="flex w-full relative">

            <div className="absolute w-full">

            <BaiscTable canAdd={false} loaded={data._loaded.includes('exams')} header={[
                       
                       <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/delete/exams'}
                         } items={data._exams?.data || []}/>,
                         '.',
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
                                <BaiscTable.Td onClick={()=>{

                                    data.setSinglePrintContent({
                                      patient: itemToShow.appointment.patient,
                                      doctor:itemToShow.appointment.doctor,
                                      title: t('menu.exam'),

                                      content: [
                                         [{name:t('form.clinical-information'),value:i.clinical_information},
                                          {name:t('form.requested-exams'),value:i.requested_exams},
                                          {name:t('form.results-report'),value:i.results_report},
                                          {name:t('form.requested-on'),value:i.requested_at}
                                        ]
                                      ]

                                    })

                                 }}>

                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
                               
                                </BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.requested_at}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.clinical_information}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.requested_exams}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.results_report}</BaiscTable.Td>
                            </BaiscTable.Tr>
                        ))}

                      
              />

             <BasicPagination show={data._loaded.includes('exams')} from={'exams'} setCurrentPage={setCurrentPage} total={data._exams?.total}  current={data._exams?.current_page} last={data._exams?.last_page}/>
          

            </div>

           </div>


           </div>
        </div>
       </DefaultLayout>
       </>
   
  );
}

export default App;
