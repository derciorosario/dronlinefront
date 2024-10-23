import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()

  let required_data=['appointments','specialty_categories']
  const {pathname} = useLocation()

  function getIcon(name,active){
    return (
       <>
         {name=="pending" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm67-105 28-28-75-75v-112h-40v128l87 87Zm-547 65q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v250q-18-13-38-22t-42-16v-212h-80v120H280v-120h-80v560h212q7 22 16 42t22 38H200Zm280-640q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg> }
         {name=="confirmed" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>}
         {name=="done" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
         {name=="paid" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>}
       </>
       
    )
  }
  

  useEffect(()=>{
        
        if(!user) return
        setTimeout(()=>(
          data._get(required_data) 
        ),500)
  },[user,pathname])
  useEffect(()=>{
},[data._appointments])


 const [selectedTab,setSelectedTab]=useState('pending')
 
       
  return (
   
         <DefaultLayout
           
           
         
           pageContent={{page:'appointments',title:t('common.appointments'),desc:t('titles.appointments'),btn:{onClick:user?.role=="patient" ? (e)=>{
          
           if(!user?.data?.date_of_birth){
            data._showPopUp('basic_popup','conclude_patient_info')
           }else{
             navigate('/add-appointments')
           }

         }: null,text:t('menu.add-appointments')}}}>


             <div className="flex items-center mb-4 gap-2">
                 {['pending','confirmed','paid','done'].map((i,_i)=>(
                   <div onClick={()=>setSelectedTab(i)} className={`flex transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1 ${selectedTab==i ? 'bg-honolulu_blue-500 text-white':''}`}>
                    <span>{getIcon(i,selectedTab==i)}</span>
                    <span>{t('common.'+i)}</span>
                   </div>
                 ))}
             </div>
             
            
             <BaiscTable canAdd={user?.role=="patient"} addPath={'/add-appointments'} loaded={data._loaded.includes('appointments')} header={[
                          t('form.consultation-id'),
                          t('form.consultation-date'),
                          t('form.medical-specialty'),
                          t('form.consultation-status'),
                          t('form.consultation-method'),
                          t('form.payment-confirmed'),
                         // t('form.notifications-sent'),
                          t('form.reason-for-consultation'),
                          t('form.additional-observations'),
                          t('form.location-telemedicine'),
                          t('form.estimated-consultation-duration'),
                          t('form.type-of-care'),
                          t('form.uploaded-documents'),
                         /* t('form.patient-id'),
                          t('form.doctor-id'),
                          t('form.prescription-id'),
                          t('form.exam-id'),*/
                        ]
                      }

                       body={data._appointments.filter(i=>i.status==selectedTab).map((i,_i)=>(
                              <BaiscTable.Tr  onClick={()=>{
                                navigate('/appointment/'+i.id)
                              }}>
                                <BaiscTable.Td>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td>{i.consultation_date}</BaiscTable.Td>
                                <BaiscTable.Td>{data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.pt_name}</BaiscTable.Td>
                                <BaiscTable.Td>
                                  <button type="button" class={`text-white  ml-4 ${!i.consultation_status || i.consultation_status=="pending" ?"bg-orange-300": i.consultation_status=="finalized" ? "bg-green-500" : "bg-honolulu_blue-300"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                     {!i.consultation_status ? t('common.pending') :t('common.'+i.consultation_status)}
                                  </button>
                                </BaiscTable.Td>
                                <BaiscTable.Td>{t('common.'+i.consultation_method)}</BaiscTable.Td>
                                <BaiscTable.Td>
                                  <button type="button" class={`text-white cursor-default ml-4 ${i.payment_confirmed ? "bg-honolulu_blue-500": "bg-gray-400"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                     {i.payment_confirmed ? t('common.yes') : t('common.no')}
                                  </button>
                                </BaiscTable.Td>
                                <BaiscTable.Td>{i.reason_for_consultation.slice(0,40) + (i.reason_for_consultation.length > 40 ? '...':'')}</BaiscTable.Td>
                                <BaiscTable.Td>{i.additional_observations ? (i.additional_observations?.slice(0,40) + (i.additional_observations?.length > 40 ? '...':'')) : '-'}</BaiscTable.Td>
                                <BaiscTable.Td>{i.location_telemedicine ? t('common.'+i.location_telemedicine) : '-'}</BaiscTable.Td>
                                <BaiscTable.Td>{!i.estimated_consultation_duration ? '' :i.estimated_consultation_duration=="30-min" ? `30 ${t('common.minutes')}` :  i.estimated_consultation_duration=="1-h" ? `1 ${t('common.hour')}` : t('common.'+i.estimated_consultation_duration)}</BaiscTable.Td>
                                <BaiscTable.Td>{t('common.types_of_care.'+i.type_of_care)}</BaiscTable.Td>
                                <BaiscTable.Td>{'-'}</BaiscTable.Td>
                                {/*<BaiscTable.Td>{'-'}</BaiscTable.Td>
                                <BaiscTable.Td>{'-'}</BaiscTable.Td>
                                <BaiscTable.Td>{'-'}</BaiscTable.Td>
                                <BaiscTable.Td>{'-'}</BaiscTable.Td>*/}

                            </BaiscTable.Tr>
                        ))}

                      
                    />

         </DefaultLayout>
  );
}

export default App;
