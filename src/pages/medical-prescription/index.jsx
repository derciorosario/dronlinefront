import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import BasicSearch from '../../components/Search/basic';
import BasicPagination from '../../components/Pagination/basic';
import MedicalPrescriptionPrint from '../../components/Print/medical_prescription';
import _medications from '../../assets/medications.json'



function App({hideLayout,itemToShow,setItemToShow}) {

 
  const data=useData()
  const {user,setUser} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  
  let required_data=['medical_prescriptions']

  const [filterOptions,setFilterOptions]=useState([])

 
  useEffect(()=>{ 

    if(!user) return
    data._get(required_data,{medical_prescriptions:{appointment_id:itemToShow.appointment.id,name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}})

  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','medical_prescriptions')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','medical_prescriptions')
         setCurrentPage(1)
         data._get(required_data,{medical_prescriptions:{appointment_id:itemToShow.appointment.id,name:search,page:1,...data.getParamsFromFilters(filterOptions)}}) 
    }
 },[data.updateTable])


function globalOnclick(id){
  setItemToShow({
    ...itemToShow,
    action:'update',
    name:'create-medical-prescription',
    update_id:id
   })
}

  const [medicalPrescriptionPrintContent,setMedicalPrescriptionPrintContent]=useState(null)
 
  return (
   
        <>

         <MedicalPrescriptionPrint item={medicalPrescriptionPrintContent} setItem={setMedicalPrescriptionPrintContent}/>
         <DefaultLayout hide={hideLayout} pageContent={{title:t('menu.medical-prescription'),desc:t('titles.previous-medical-prescriptions')}}>
            
           <div className="flex">
              <div className="flex-1">
              <BasicSearch hideSearch={true}  loaded={data._loaded.includes('medical_prescriptions')} search={search} __printAction={()=>{
                  let content = [];
                  (data._medical_prescriptions?.data || []).forEach(i=>{
                    i.medical_prescription_items.forEach(f=>{
                      content.push([
                       {name:t('form.medication'),value:`${t('form.medication-name')}:${f.name ? `${_medications.filter(g=>g.ITEM==f.name)?.[0]?.name}` : f.custom_name}(${f.prescribed_quantity});   ${t('form.dosage')}:${f.dosage};  ${t('form.prescribed-quantity')}:${f.prescribed_quantity}`},
                       {name:t('form.treatment-duration'),value:f.treatment_duration},
                       {name:t('form.pharmaceutical-form'),value:f.pharmaceutical_form}])
                      })
                  })
                  data.setSinglePrintContent({
                      patient: itemToShow.appointment.patient,
                      doctor:itemToShow.appointment.doctor,
                      from:'medical-prescription',
                      appointment:i.appointment,
                      title: t('menu.medical-prescription'),
                      i,
                      content
                  })

               }}  hideFilters={true} total={data._medical_prescriptions?.total} from={'medical_prescriptions'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
               
              <div className="flex w-full relative">
   
               <div className="absolute w-full">
               <BaiscTable canAdd={false} loaded={data._loaded.includes('medical_prescriptions')} header={[
                            <BaiscTable.MainActions hide={user?.role=="patient"} options={{
                             deleteFunction:'default',
                             deleteUrl:'api/delete/medical-prescriptions'}
                            } items={data._medical_prescriptions?.data || []}/>,
                             undefined,
                            'ID',
                             t('form.medication-names'),
                             t('common.expiration-date'),
                           ]
                         }
   
                          body={(data._medical_prescriptions?.data || []).map((i,_i)=>(
                           
                                 <BaiscTable.Tr >
                                   <BaiscTable.Td>
                                     <BaiscTable.Actions hide={user?.role=="patient"} options={{
                                          deleteFunction:'default',
                                          deleteUrl:'api/delete/medical-prescriptions',
                                          id:i.id}
                                     }/>
                                     
                                  
                                   </BaiscTable.Td>
                                    <BaiscTable.Td onClick={()=>{
                                        data.setSinglePrintContent({
                                          patient: itemToShow.appointment.patient,
                                          doctor:itemToShow.appointment.doctor,
                                          title: t('menu.medical-prescription'),
                                          from:'medical-prescription',
                                          i,
                                          appointment:i.appointment,
                                          content: 
                                             i.medical_prescription_items.map(f=>[
                                                {name:t('form.medication'),value:`${t('form.medication-name')}:${f.name ? `${_medications.filter(g=>g.ITEM==f.name)?.[0]?.name}` : f.custom_name}(${f.prescribed_quantity});   ${t('form.dosage')}:${f.dosage};  ${t('form.prescribed-quantity')}:${f.prescribed_quantity}`},
                                                {name:t('form.treatment-duration'),value:f.treatment_duration},
                                                {name:t('form.pharmaceutical-form'),value:f.pharmaceutical_form}
                                             ])
                                        })

                             
                                    }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
                                   </BaiscTable.Td>
                                   <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.id}</BaiscTable.Td>
                                   <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.medical_prescription_items.map(i=>`${i.name ? `${_medications.filter(f=>f.ITEM==i.name)?.[0]?.name}` : i.custom_name} (${i.prescribed_quantity})`).join(', ')}</BaiscTable.Td>
                                   <BaiscTable.Td onClick={()=>globalOnclick(i.id)}>{i.expiration_period} {i.expiration_period ? t('common.days') : ''}</BaiscTable.Td>
                                                                   
                               </BaiscTable.Tr>
                           ))}
   
                         
                 />
   
               <BasicPagination show={data._loaded.includes('medical_prescriptions')} from={'medical_prescriptions'} setCurrentPage={setCurrentPage} total={data._medical_prescriptions?.total}  current={data._medical_prescriptions?.current_page} last={data._medical_prescriptions?.last_page}/>
             
               </div>
   
               
              
   
              </div>
   
   
              </div>
           </div>
          </DefaultLayout>

        </>

  );
}

export default App;
