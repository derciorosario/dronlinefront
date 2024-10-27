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

  let required_data=['appointment_invoices']
  const {pathname} = useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  function getIcon(name,active){
    return (
       <>
         {name=="rejected" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M240-800v200-200 640-9.5 9.5-640Zm0 720q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v174q-19-7-39-10.5t-41-3.5v-120H520v-200H240v640h254q8 23 20 43t28 37H240Zm396-20-56-56 84-84-84-84 56-56 84 84 84-84 56 56-83 84 83 84-56 56-84-83-84 83Z"/></svg> }
         {name=="pending" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M610-210q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm110 0q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm110 0q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm-630 90q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z"/></svg> }
         {name=="approved" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
       </>
    )
  }
  
  async function handleItems({status,id}){
       data._closeAllPopUps()
       toast.remove()
       toast.loading(t('common.updating'))      

       setLoading(true)

       try{

        await data.makeRequest({method:'post',url:`api/appointment-invoices/${id}/status`,withToken:true,data:{
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
              toast.error(t('common.check-network'))
          }else{
              toast.error(t('common.unexpected-error'))
          }

       }
  }


  useEffect(()=>{ 
    if(!user) return
    data._get(required_data,{appointment_invoices:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage,updateFilters])

  useEffect(()=>{
    data.handleLoaded('remove','appointment_invoices')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','appointment_invoices')
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{appointment_invoices:{name:search,page:1}}) 

    }
 },[data.updateTable])
 const [selectedTab,setSelectedTab]=useState('pending')

 return (
   
  <DefaultLayout
    pageContent={{page:'appointment_invoices',title:t('common.payments'),desc:t('titles.payments')}}>
      <div className="flex items-center mb-4 gap-2">
          {['pending','approved','rejected'].map((i,_i)=>(
            <div onClick={()=>setSelectedTab(i)} className={`flex transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1 ${selectedTab==i ? 'bg-honolulu_blue-500 text-white':''}`}>
              <span>{getIcon(i,selectedTab==i)}</span>
              <span>{t('common.'+i)}</span>
              {((data._appointment_invoices?.data || []).filter(f=>f.status==i).length!=0) && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center">
                  <span>{(data._appointment_invoices?.data || []).filter(f=>f.status==i).length}</span>
              </div>}

            </div>
          ))}
      </div>
      

      <BaiscTable canAdd={false}  loaded={data._loaded.includes('appointment_invoices') && !loading} header={[
                   'ID',
                   'Ref',
                   t('common.status'),
                   t('common.patient'),
                   t('common.doctor'),
                   t('form.consultation-id'),
                   t('common.created_at'),
                   t('common.last-update'),
                   '.'
                 ]
               }

                body={(data._appointment_invoices?.data || []).filter(i=>i.status==selectedTab || (!i.status && selectedTab=="pending")).map((i,_i)=>(
                       <BaiscTable.Tr>
                          <BaiscTable.Td url={`/payment-management/`+i.id}>{i.id}</BaiscTable.Td>
                          <BaiscTable.Td url={`/payment-management/`+i.id}>{i.ref_id}</BaiscTable.Td>
                          <BaiscTable.Td url={`/payment-management/`+i.id}>
                           <button type="button" class={`text-white  ml-4 ${!i.status || i.status=="pending" ?"bg-orange-300": i.status=="rejected" ? ' bg-red-500' : "bg-green-500"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                              {!i.status ? t('common.pending') : i.status=="paid" ? t('common.waiting-for-consultation') : t('common.'+i.status)}
                           </button>
                         </BaiscTable.Td>
                         <BaiscTable.Td url={`/payment-management/`+i.id}>{i.patient?.name}</BaiscTable.Td>
                         <BaiscTable.Td url={`/payment-management/`+i.id}>{i.doctor?.name}</BaiscTable.Td>
                         <BaiscTable.Td url={`/payment-management/`+i.id}>{i.appointment?.id}</BaiscTable.Td>
                         <BaiscTable.Td url={`/payment-management/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.Td url={`/payment-management/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0] + " " +i.updated_at.split('T')[1].slice(0,5) : i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions id={i.id} items={[
                             {hide:i.status=="approved",name:t('common.approve'),onClick:()=>{handleItems({status:'approved',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>)},
                             {hide:i.status=="rejected",name:t('common.reject'),onClick:()=>{handleItems({status:'rejected',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)}
                         ]}/>
                     </BaiscTable.Tr>
                 ))}
             />


       <BasicPagination show={data._loaded.includes('appointment_invoices')} from={'appointment_invoices'} setCurrentPage={setCurrentPage} total={data._appointment_invoices?.total}  current={data._appointment_invoices?.current_page} last={data._appointment_invoices?.last_page}/>


  </DefaultLayout>
);
}

export default App;
