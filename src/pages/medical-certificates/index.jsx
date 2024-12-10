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
import i18next from 'i18next';



function App({hideLayout,itemToShow,setItemToShow}) {

 
  const data=useData()
  const {user} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  
  let required_data=['medical_certificates']

  const [filterOptions,setFilterOptions]=useState([])
 
  
  useEffect(()=>{ 

    if(!user) return
    data._get(required_data,{medical_certificates:{appointment_id:itemToShow.appointment.id,name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}})

  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','medical_certificates')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','medical_certificates')
         setCurrentPage(1)
         data._get(required_data,{medical_certificates:{appointment_id:itemToShow.appointment.id,name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable])


function globalOnclick(id){
  setItemToShow({
    ...itemToShow,
    action:'update',
    name:'create-medical-certificate',
    update_id:id
   })
}


  return (

       <>
        
     
        <DefaultLayout hide={hideLayout} pageContent={{title:t('menu.medical-certificate'),desc:t('titles.medical-certificates')}}>   
            
        <div className="flex">

           <div className="flex-1">
          
           <BasicSearch  hideFilters={true} total={data._medical_certificates?.total} from={'medical_certificates'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
            
            <div className="flex w-full relative">

            <div className="absolute w-full">

            <BaiscTable canAdd={false} loaded={data._loaded.includes('medical_certificates')} header={[
                       
                       <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/delete/medical-certificates'}
                         } items={data._medical_certificates?.data || []}/>,
                         '.',
                         'ID',
                          t('common.disease'),
                          t('common.date_of_leave'),
                          t('common.details'),
                          t('form.medical-specialty')
                        ]
                      }


                       body={(data._medical_certificates?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr >
                                <BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/delete/medical-certificates',
                                       id:i.id}
                                  }/>
                               
                                </BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>{

              
                                    data.setSinglePrintContent({
                                      patient: itemToShow.appointment.patient,
                                      doctor:itemToShow.appointment.doctor,
                                      appointment:itemToShow.appointment,
                                      title: t('menu.medical-certificate'),
                                      from:'medical-certificates',
                                      content: [
                                         [
                                          {...i,disease:i.disease,date_of_leave:i.date_of_leave,medical_specialty:data._specialty_categories.filter(f=>f.id==itemToShow.appointment.medical_specialty)[0]?.[`${i18next.language}_name`]},
                                        ]
                                      ]

                                    })

                                 }}>

                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
                               
                                </BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.disease}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.date_of_leave}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.details}</BaiscTable.Td>
                                <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{data._specialty_categories.filter(i=>i.id==itemToShow.appointment.medical_specialty)[0]?.[`${i18next.language}_name`]}</BaiscTable.Td>
                            </BaiscTable.Tr>
                        ))}

                      
              />

             <BasicPagination show={data._loaded.includes('medical_certificates')} from={'medical_certificates'} setCurrentPage={setCurrentPage} total={data._medical_certificates?.total}  current={data._medical_certificates?.current_page} last={data._medical_certificates?.last_page}/>
          

            </div>

           </div>


           </div>
        </div>
       </DefaultLayout>
       </>
   
  );
}

export default App;
