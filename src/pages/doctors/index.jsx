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
import i18next from 'i18next';
import SelectedFilters from '../../components/Filters/selected-filters';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function App() {

  const data=useData()
  const {user,serverTime} =  useAuth()
  const { t } = useTranslation();

  const navigate = useNavigate()
  const {pathname} = useLocation()
  const [loading,setLoading]=useState(false)

  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  const [printing,setPrinting]=useState(false)

  const [dateFilters,setDateFilter]=useState([
    {field:'invoice',start:'',end:'',start_name:t('common.start_payment_date'),end_name:t('common.end_payment_date')}
  ])
  
  let required_data=['doctors','specialty_categories']

  const [filterOptions,setFilterOptions]=useState([
    {
      open:false,
      field:'specialty_categories',
      name:t('common.specialty'),
      t_name:'specialists',
      search:'',
      items:[],
      param:'medical_specialty',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    {
      open:false,
      field:'years_of_experience',
      name:t('common.years_of_experience'),
      t_name:'years_of_experience',
      search:'',
      items:[],
      param:'years_of_experience',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    {
      open:false,
      field:'gender',
      name:t('form.gender'),
      t_name:'gender',
      search:'',
      items:[
        {name:t('common.female'),id:'female'},
        {name:t('common.male'),id:'male'}
      ],
      param:'gender',
      fetchable:false,
      loaded:true,
      selected_ids:[],
      default_ids:[]
    }
  ])
 
  
  useEffect(()=>{ 
    if(!user) return
    data._get(required_data,{doctors:{name:search,page:currentPage,
    has_invoices:(dateFilters.filter(i=>i.field=="invoice")[0].start || dateFilters.filter(i=>i.field=="invoice")[0].end) ? true : undefined,
    invoice_start_date:dateFilters.filter(i=>i.field=="invoice")[0].start,
    invoice_end_date:dateFilters.filter(i=>i.field=="invoice")[0].end,
    ...data.getParamsFromFilters(filterOptions)}})
  
  },[user,pathname,search,currentPage,updateFilters,dateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','doctors')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','doctors')
         setCurrentPage(1)
         data._get(required_data,{doctors:{name:search,page:1,
           invoice_start_date:dateFilters.filter(i=>i.field=="invoice")[0].start,
           invoice_end_date:dateFilters.filter(i=>i.field=="invoice")[0].end,
           has_invoices:(dateFilters.filter(i=>i.field=="invoice")[0].start || dateFilters.filter(i=>i.field=="invoice")[0].end) ? true : undefined,
          ...data.getParamsFromFilters(filterOptions)}}) 

    }
 },[data.updateTable])



async function handleItems({action,id,status}){
   if(action=="see-availabilty"){
      navigate('/consultation-availability/'+id)
   }

   if(action=="see-scheduler"){
      navigate('/scheduler/'+id)
   }

   if(action=="status"){

    data._closeAllPopUps()
    toast.remove()
    toast.loading(t('common.updating'))      

    setLoading(true)

    try{

     await data.makeRequest({method:'post',url:`api/doctor/${id}/status`,withToken:true,data:{
       status
     }, error: ``},0);

     toast.remove()
     toast.success(t('messages.updated-successfully'))
     data.setUpdateTable(Math.random())
     setLoading(false)

    }catch(e){
      
       setLoading(false)
       toast.remove()
       if(e.message==500){
         toast.error(t('common.unexpected-error'))
       }else if(e.message=='Failed to fetch'){
           toast.error(t('common.check-network'))
       }else{
           toast.error(t('common.unexpected-error'))
       }

    }

   }
 }

 useEffect(()=>{
  
  if(!user) return
  if(user?.role=="manager" && !user?.data?.permissions?.doctor?.includes('read')){
         navigate('/') 
  }

},[user])


function getDoctorAmountEarned(i){
  let percentage=i.use_app_gain_percentage ? JSON.parse(user?.app_settings?.[0]?.value)?.gain_percentage : i.gain_percentage
  percentage=parseInt(percentage || 0)
  let collected=parseFloat((i.total_payment_amount || 0) - (i.total_refund_amount || 0))
  return collected * (percentage / 100)
}


function exportToExcelArray(data,fileName){
  const wb = XLSX.utils.book_new();
  const wsData = data;
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
}








const Print = async (_data) => {

  
       console.log({_data})

       let name=t('titles.doctors')+` - ${serverTime?.date?.split('-')?.[0]} ${serverTime?.hour}`
       let _d=[[
        `${t('common.start_payment_date')}:${dateFilters.filter(i=>i.field=="invoice")[0].start?.split('-')?.reverse().join('-') || '-'} ${t('common.end_payment_date')}:${dateFilters.filter(i=>i.field=="invoice")[0].end?.split('-')?.reverse().join('-') || '-'}`
       ],[]]

       _d.push([
        'ID',
        t('form.full-name'),
        t('form.medical-specialty'),
        'Email',
        t('form.main-contact'),
        t('common.gain_percentage'),
        t('common.total_amount_collected'),
        'IVA',
        `${ t('common.total_amount_collected')} (- IVA)`,
        t('common.amount_earned'),
        'IRPS',
        `${ t('common.amount_earned')} (- IRPS)`,
        t('form.gender'),
        t('form.address'),
        'Status',
        t('common.created_at'),
        t('common.last-update'),
       ])

       _d=[..._d,..._data.map(i=>[
        i.id,
        i.name,
        data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.[`${i18next.language}_name`],
        i.email,
        i.main_contact,
        ((i.use_app_gain_percentage ? JSON.parse(user?.app_settings?.[0]?.value)?.gain_percentage : i.gain_percentage) || 0)+'%',
        data._cn(parseFloat(i.total_payment_amount).toFixed(2)),
        data._cn(parseFloat(i.total_payment_amount - i.total_point_1).toFixed(2)),
        data._cn(parseFloat(i.total_point_1).toFixed(2)),
        data._cn(parseFloat(i.total_point_2).toFixed(2)),
        data._cn(parseFloat(i.total_point_2 - i.total_point_3).toFixed(2)),
        data._cn(parseFloat(i.total_point_3).toFixed(2)),
        t('common.'+i.gender),
        t(i.address),
        i.status=="active" ? t('common.active') : t('common.inactive'),
        i.created_at.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.created_at.split('T')[1].slice(0,5),
        i.created_at.split('T')[0].split('-')?.reverse().join('-')
       ])]

      exportToExcelArray(_d,name)


      /*const workbook = XLSX.utils.book_new();
      const sheetData = XLSX.utils.json_to_sheet(mappedData);
      XLSX.utils.book_append_sheet(workbook, sheetData, 'Sheet1');
      XLSX.writeFile(workbook, `${name}.xlsx`);*/

}



const Export =async (type) => {
     
  try{
      setPrinting(true) 
      let response=await data.makeRequest({method:'get', url:`api/doctors`,params:{
          all:true,
          has_invoices:(dateFilters.filter(i=>i.field=="invoice")[0].start || dateFilters.filter(i=>i.field=="invoice")[0].end) ? true : undefined,
          invoice_start_date:dateFilters.filter(i=>i.field=="invoice")[0].start,
          invoice_end_date:dateFilters.filter(i=>i.field=="invoice")[0].end,
          ...data.getParamsFromFilters(filterOptions) 
      }, error: ``,withToken:true},0);
      Print(response.data)

  }catch(e){
      toast.remove()
      let msg="Acorreu um erro, tente novamente"
      if(e.response){
        if(e.response.status==500){
            msg="Erro, inesperado. Contacte seu administrador"
        }
      }else if(e.code=='ERR_NETWORK'){
            msg="Verfique sua internet e tente novamente"
      }
      toast.error(msg)
  }
  setPrinting(false)

}


return (
   
         <DefaultLayout Export={Export} printing={printing} pageContent={{title:t('common.doctors'),desc:t('titles.doctors'),btn:!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('create'))) ? null : {onClick:(e)=>{
          navigate('/add-doctors')
         },text:t('menu.add-doctors')}}}>
           
            
        <div className="flex">
           <BasicFilter dateFilters={dateFilters} setDateFilter={setDateFilter} setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
           <div className="flex-1">
          
           <BasicSearch total={data._doctors?.total} from={'doctors'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
           <SelectedFilters setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>                 
           <div className="flex w-full relative">

            <div className="absolute w-full">
            <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-doctors'} loaded={data._loaded.includes('doctors')  && !loading} header={[
                         <BaiscTable.MainActions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('delete')))} options={{
                          deleteFunction:'default',
                          deleteUrl:'api/doctors/delete'}
                         } items={data._doctors?.data || []}/>,
                         'ID',
                          t('form.full-name'),
                          t('form.medical-specialty'),
                          'Email',
                          t('form.main-contact'),
                          t('common.gain_percentage'),
                          t('common.total_amount_collected'),
                          'IVA',
                          `${ t('common.total_amount_collected')} (- IVA)`,
                          t('common.amount_earned'),
                          'IRPS',
                          `${ t('common.amount_earned')} (- IRPS)`,
                          t('form.gender'),
                          t('form.address'),
                          (user?.role=="admin" || user?.role=="manager") ? 'Status' : undefined,
                          t('common.created_at'),
                          t('common.last-update'),
                          (user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor_availability?.includes('update'))) ? '.' : ''
                        ]
                      }

                       body={(data._doctors?.data || []).map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td>
                                  <BaiscTable.Actions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor?.includes('delete')))} options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/doctors/delete',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._specialty_categories.filter(f=>f.id==i.medical_specialty)[0]?.[`${i18next.language}_name`]}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.main_contact}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{(i.use_app_gain_percentage ? JSON.parse(user?.app_settings?.[0]?.value)?.gain_percentage : i.gain_percentage) || 0}{'%'}</BaiscTable.Td>
                                {/**<BaiscTable.Td url={`/doctor/`+i.id}>{parseFloat((i.total_payment_amount || 0) - (i.total_refund_amount || 0)).toFixed(2)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{parseFloat(getDoctorAmountEarned(i)).toFixed(2)}</BaiscTable.Td> */}
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._cn(parseFloat(i.total_payment_amount).toFixed(2))}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._cn(parseFloat(i.total_payment_amount - i.total_point_1).toFixed(2))}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._cn(parseFloat(i.total_point_1).toFixed(2))}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._cn(parseFloat(i.total_point_2).toFixed(2))}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._cn(parseFloat(i.total_point_2 - i.total_point_3).toFixed(2))}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{data._cn(parseFloat(i.total_point_3).toFixed(2))}</BaiscTable.Td>
                                
                                <BaiscTable.Td url={`/doctor/`+i.id}>{t('common.'+i.gender)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{t(i.address)}</BaiscTable.Td>
                                <BaiscTable.Td hide={!(user?.role=="admin" || user?.role=="manager")} url={`/appointment/`+i.id}>
                                                                        <button type="button" class={`text-white cursor-default ml-4 ${i.status=="active" ? "bg-honolulu_blue-500": "bg-gray-400"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                                                           {i.status=="active" ? t('common.active') : t('common.inactive')}
                                                                        </button>
                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.created_at.split('T')[0]?.split('-')?.reverse()?.join('/') + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/doctor/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0]?.split('-')?.reverse()?.join('/') + " " +i.updated_at.split('T')[1].slice(0,5) : i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.AdvancedActions hide={!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.doctor_availability?.includes('update')))} w={200} id={i.id} items={[
                                    {name:t('common.availability'),onClick:()=>{handleItems({action:'see-availabilty',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>)},
                                    {name:t('menu.scheduler'),onClick:()=>{handleItems({action:'see-scheduler',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>)},
                                    {name:t('common.activate-account'),hide:i.status=="active" || user?.role!="admin",onClick:()=>{handleItems({action:'status',status:'active',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)},
                                    {name:t('common.inactivate-account'),hide:i.status=="inactive" || user?.role!="admin",onClick:()=>{handleItems({action:'status',status:'inactive',id:i.id})},icon:(<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>)},
                                ]}/>
                                

                            </BaiscTable.Tr>
                        ))}

                      
          />
       <BasicPagination show={data._loaded.includes('doctors')} from={'doctors'} setCurrentPage={setCurrentPage} total={data._doctors?.total}  current={data._doctors?.current_page} last={data._doctors?.last_page}/>
      
            </div>

            
           

           </div>


           </div>
        </div>
       </DefaultLayout>

  );
}

export default App;
