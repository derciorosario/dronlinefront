import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import BasicPagination from '../../components/Pagination/basic';



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()
  const [loading,setLoading]=useState(false)

  let required_data=['appointments','specialty_categories']
  const {pathname} = useLocation()

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')


  function getIcon(name,active){
    return (
       <>
         {name=="canceled" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill={active ? '#fff':'#5f6368'}><path d="m388-212-56-56 92-92-92-92 56-56 92 92 92-92 56 56-92 92 92 92-56 56-92-92-92 92ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg> }
         {name=="pending" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm67-105 28-28-75-75v-112h-40v128l87 87Zm-547 65q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v250q-18-13-38-22t-42-16v-212h-80v120H280v-120h-80v560h212q7 22 16 42t22 38H200Zm280-640q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg> }
         {name=="confirmed" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>}
         {name=="completed" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
         {name=="paid" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>}
         {name=="in-progress" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-64-24-123t-69-104L480-480v-320q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>}
       </>
    )
  }
  
  async function handleItems({status,id}){
       data._closeAllPopUps()

       toast.remove()

       toast.loading(t('common.updating'))      

       setLoading(true)

       try{

        await data.makeRequest({method:'post',url:`api/appointments/${id}/status`,withToken:true,data:{
          status
        }, error: ``},0);

        toast.remove()
        toast.success(t('messages.updated-successfully'))
        data.setUpdateTable(Math.random())
        

       }catch(e){
          setLoading(false)
          toast.remove()
          if(e.message==500){
            toast.error(t('common.unexpected-error'))
          }else  if(e.message=='Failed to fetch'){
              setMessage(t('common.check-network'))
          }else{
              setMessage(t('common.unexpected-error'))
          }

       }
  }

  
  useEffect(()=>{ 
    if(!user) return
    data._get(required_data,{appointments:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','appointments')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','appointments')
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{appointments:{name:search,page:1}}) 

    }
 },[data.updateTable])

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
                 {['pending','paid','in-progress','completed','canceled'].map((i,_i)=>(
                   <div onClick={()=>setSelectedTab(i)} className={`flex transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1 ${selectedTab==i ? 'bg-honolulu_blue-500 text-white':''}`}>
                     <span>{getIcon(i,selectedTab==i)}</span>
                     <span>{t('common.'+i)}</span>
                     {((data._appointments?.data || []).filter(f=>f.status==i).length!=0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center">
                         <span>{(data._appointments?.data || []).filter(f=>f.status==i).length}</span>
                     </div>}

                   </div>
                 ))}
             </div>
             

             <BaiscTable canAdd={user?.role=="patient"} addPath={'/add-appointments'} loaded={data._loaded.includes('appointments') && !loading} header={[
                        <BaiscTable.MainActions options={{
                            deleteFunction:'default',
                            deleteUrl:'api/delete/appointments'}
                        } items={data._appointments?.data || []}/>,
                          t('form.consultation-id'),
                          t('common.this-is-for'),
                          t('form.consultation-status'),
                          t('form.consultation-date'),
                          t('form.consultation-hour'),
                          t('form.medical-specialty'),
                          t('form.type-of-care'),
                          t('form.consultation-method'),
                          t('form.payment-confirmed'),
                          t('form.reason-for-consultation'),
                          t('form.additional-observations'),
                          t('common.created_at'),
                          t('common.last-update'),
                          '.'
                         
                        ]
                      }

                       body={(data._appointments?.data || []).filter(i=>i.status==selectedTab).map((i,_i)=>(
                              <BaiscTable.Tr>
                                <BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/delete/appointments',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.is_for_dependent ? `${i.dependent?.name} (${t('common.'+i.dependent?.relationship)})`:t('common.for-me')}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>
                                  <button type="button" class={`text-white  ml-4 ${!i.status || i.status=="pending" ?"bg-orange-300": i.status=="canceled" ? ' bg-red-500' : i.status=="completed" ? "bg-green-500" : "bg-honolulu_blue-300"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                     {!i.status ? t('common.pending') : i.status=="paid" ? t('common.waiting-for-consultation') : t('common.'+i.status)}
                                  </button>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.consultation_date}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.scheduled_hours}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.pt_name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{t('common.types_of_care.'+i.type_of_care)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{t('common.'+i.consultation_method)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>
                                  <button type="button" class={`text-white cursor-default ml-4 ${i.payment_confirmed ? "bg-honolulu_blue-500": "bg-gray-400"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                     {i.payment_confirmed ? t('common.yes') : t('common.no')}
                                  </button>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.reason_for_consultation.slice(0,40) + (i.reason_for_consultation.length > 40 ? '...':'')}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.additional_observations ? (i.additional_observations?.slice(0,40) + (i.additional_observations?.length > 40 ? '...':'')) : '-'}</BaiscTable.Td>
                               
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/appointment/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0] + " " +i.updated_at.split('T')[1].slice(0,5) : i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.AdvancedActions hide={user?.role!="doctor"} id={i.id} items={[
                                    {hide:i.status=="canceled",name:t('common.cancel'),onClick:()=>{handleItems({status:'canceled',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m388-212-56-56 92-92-92-92 56-56 92 92 92-92 56 56-92 92 92 92-56 56-92-92-92 92ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>)},
                                    {hide:i.status=="completed" || !i.confirmed,name:t('common.complete'),onClick:()=>{handleItems({status:'completed',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" fill="#5f6368"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>)},
                                    {hide:i.status=="rescheduled" || !i.confirmed,name:t('common.reschedule'),onClick:()=>{handleItems({status:'rescheduled',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v240h-80v-80H200v400h280v80H200ZM760 0q-73 0-127.5-45.5T564-160h62q13 44 49.5 72T760-60q58 0 99-41t41-99q0-58-41-99t-99-41q-29 0-54 10.5T662-300h58v60H560v-160h60v57q27-26 63-41.5t77-15.5q83 0 141.5 58.5T960-200q0 83-58.5 141.5T760 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z"/></svg>)}
                                ]}/>
                            </BaiscTable.Tr>
                        ))}

                      
                    />


              <BasicPagination show={data._loaded.includes('appointments')} from={'appointments'} setCurrentPage={setCurrentPage} total={data._appointments?.total}  current={data._appointments?.current_page} last={data._appointments?.last_page}/>
    

         </DefaultLayout>
  );
}

export default App;
