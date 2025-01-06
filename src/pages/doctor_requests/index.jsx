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

  let required_data=['doctor_requests']
  const {pathname} = useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')




  useEffect(()=>{ 
    if(!user) return
    data._get(required_data,{doctor_requests:{name:search,page:currentPage}}) 
  },[user,pathname,search,currentPage,updateFilters])

  useEffect(()=>{
    data.handleLoaded('remove','doctor_requests')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','doctor_requests')
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{doctor_requests:{name:search,page:1}}) 

    }
 },[data.updateTable])


 
 
 return (
   
  <DefaultLayout
    pageContent={{page:'doctor_requests',title:t('menu.membership-requests'),desc:''}}>

      <BaiscTable canAdd={false}  loaded={data._loaded.includes('doctor_requests') && !loading} header={[
                   <BaiscTable.MainActions options={{
                        deleteFunction:'default',
                        deleteUrl:'api/doctor-requests/delete'}
                   } items={data._doctor_requests?.data || []}/>,
                   'ID',
                   t('form.full-name'),
                   t('form.main-contact'),
                   'Email',
                   t('form.medical-specialty'),
                   t('form.address'),
                   t('common.additional-info'),
                   t('common.created_at'),
                 ]
               }

                body={(data._doctor_requests?.data || []).map((i,_i)=>(
                       <BaiscTable.Tr>
                         <BaiscTable.Td>
                            <BaiscTable.Actions  options={{
                                  deleteFunction:'default',
                                  deleteUrl:'api/doctor-requests/delete',
                                  id:i.id}
                            }/>
                         </BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.id}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.name}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.main_contact_code+" "+i.contact}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.email}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.specialty}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.address}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.additional_info}</BaiscTable.Td>
                         <BaiscTable.Td url={`/membership-requests/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                         <BaiscTable.AdvancedActions id={i.id} items={[
                              {name:t('common.edit-to-add'),onClick:()=>{
                                data._closeAllPopUps()
                                  window.open('/add-doctors?add_from_doctor_request_id='+i.id,'_blank')
                              }},
                              
                          ]}/>
                       </BaiscTable.Tr>
                 ))}
             />


       <BasicPagination show={data._loaded.includes('doctor_requests')} from={'doctor_requests'} setCurrentPage={setCurrentPage} total={data._doctor_requests?.total}  current={data._doctor_requests?.current_page} last={data._doctor_requests?.last_page}/>


  </DefaultLayout>
);
}

export default App;
