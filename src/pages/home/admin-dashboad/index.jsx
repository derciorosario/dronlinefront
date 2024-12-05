import React, { useEffect, useState } from 'react'
import DashboardCard from '../../../components/Cards/dashboardCard'
import i18next, { t } from 'i18next'
import { useData } from '../../../contexts/DataContext'
import { useAuth } from '../../../contexts/AuthContext'
import DashboardSkeleton from '../../../components/Skeleton/dashboad'
import BaiscTable from '../../../components/Tables/basic'

export default function AdminDashboard({startDate,endDate,setStartDate,setEndDate}) {

    const data=useData()
    const {user,APP_FRONDEND} = useAuth()
    const [hideAmounts,setHideAmounts]=useState(Boolean(localStorage.getItem('hide_dashboard_amounts')))
    

    function getIcon(name,active){
        return (
           <>

             {name=="doctor" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z"/></svg>}
             {name=="patient" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>}
             {name=='payment' && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M440-200h80v-40h40q17 0 28.5-11.5T600-280v-120q0-17-11.5-28.5T560-440H440v-40h160v-80h-80v-40h-80v40h-40q-17 0-28.5 11.5T360-520v120q0 17 11.5 28.5T400-360h120v40H360v80h80v40ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-560v-160H240v640h480v-480H520ZM240-800v160-160 640-640Z"/></svg>}
             {name=='refund' && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z"/></svg>}
             {name=="canceled" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill={active ? '#fff':'#5f6368'}><path d="m388-212-56-56 92-92-92-92 56-56 92 92 92-92 56 56-92 92 92 92-56 56-92-92-92 92ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg> }
             {name=="pending" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm67-105 28-28-75-75v-112h-40v128l87 87Zm-547 65q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v250q-18-13-38-22t-42-16v-212h-80v120H280v-120h-80v560h212q7 22 16 42t22 38H200Zm280-640q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg> }
             {name=="confirmed" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>}
             {name=="completed" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
             {name=="approved" &&  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>}
             {name=="in-progress" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-64-24-123t-69-104L480-480v-320q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>}
         
           </>
        )
      }
    
    
    const [selectedTab1,setSelectedTab1]=useState('payment')
    const [selectedTab2,setSelectedTab2]=useState('patient')

   
    let required_data=['admin_dashboard','specialty_categories']

    useEffect(()=>{ 

        if(!user) return
        data.handleLoaded('remove',required_data)
        data._get(required_data,{admin_dashboard:{end_date:endDate,start_date:startDate}})


        if(user?.role=="manager" && !user?.data?.permissions?.payment_management?.includes('read')){
              setHideAmounts(true)
        }
    
      },[user,endDate,startDate])

    useEffect(()=>{
        if(data.updateTable){
             data.setUpdateTable(null)
             data.handleLoaded('remove',required_data)
             data._get(required_data,{admin_dashboard:{end_date:endDate,start_date:startDate}}) 
        }
     },[data.updateTable,endDate,startDate])  
     
     
     const [topClients,setTopClients]=useState([])
    

     useEffect(()=>{
        
        if(!data._loaded.includes('admin_dashboard')) return
       
     },[data._admin_dashboard])

 

     useEffect(()=>{
        if(!data._loaded.includes('admin_dashboard')) return

        setTopClients([
            ...data._admin_dashboard.topDoctors.map(i=>({...i,...i.doctor,role:'doctor'})),
            ...data._admin_dashboard.topPatients.map(i=>({...i,...i.patient,role:'patient'}))
        ])

     },[data._admin_dashboard])


      function getAppIRPC(collected){
    
        let irpc=JSON.parse(user?.app_settings?.[0]?.value)?.irpc || 0
    
        if(!irpc) {
          return collected
        }else{
          return parseFloat(collected) * (irpc / 100)
        }
        
      }

      function getAppIVA(collected){
        let iva=JSON.parse(user?.app_settings?.[0]?.value)?.iva || 0
        if(!iva) {
          return collected
        }else{
          let t=parseFloat(collected) * (iva / 100)
          return collected ? collected - t: 0
        }
      }

      

    return (
        <div className="w-full">

           {!data._loaded.includes('admin_dashboard') && <DashboardSkeleton/>}

           {data._loaded.includes('admin_dashboard') && <div>

             <DashboardCard topContent={(

                 <>

               {!(user?.role=="manager" && !user?.data?.permissions?.payment_management?.includes('read')) && <div className="flex w-full justify-end absolute right-3 top-2">
                    <div className="table" onClick={()=>{
                    setTimeout(()=>setHideAmounts(!hideAmounts),100)
                    if(hideAmounts){
                            localStorage.removeItem('hide_dashboard_amounts')
                    }else{
                            localStorage.setItem('hide_dashboard_amounts',1)   
                    }
                    }}>
                        <label  class="inline-flex items-center cursor-pointer ml-10">
                            <input type="checkbox" value="" class="sr-only peer" checked={Boolean(hideAmounts)}/>
                            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4  peer-checked:bg-honolulu_blue-300  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all "></div>
                            <span class="ms-3 text-sm font-medium text-white">{t('common.hide-amounts')}</span>
                        </label>
                    </div>
                 </div>}

                 </>

             )} items={[
                
                {name:t('dashboard.patients'),value:data._admin_dashboard?.totalPatients || 0,icon:(         
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>
                )},
                {name:t('dashboard.doctors'),value:data._admin_dashboard?.totalDoctors || 0,icon:(         
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z"/></svg>
                )},

                {hide:hideAmounts,name:t('common.total_amount_collected'),value:((data._admin_dashboard?.totalInvoiceAmountByType?.payment || 0) - (data._admin_dashboard?.totalInvoiceAmountByType?.refund || 0)),icon:(         
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                )},
                 
               /** {{hide:hideAmounts,name:'IRPC',value:getAppIRPC((data._admin_dashboard?.totalInvoiceAmountByType?.payment || 0)),icon:(         
                    <span className="text-white">I</span>
                )}, }*/

                 {hide:hideAmounts,name:t('common.total_amount_collected_minus_iva'),value:getAppIVA((data._admin_dashboard?.totalInvoiceAmountByType?.payment || 0) - (data._admin_dashboard?.totalInvoiceAmountByType?.refund || 0)),icon:(         
                    <span className="text-white">I</span>
                 )}, 

                {name:t('dashboard.appointments'),value:[`Total:${data._admin_dashboard?.totalAppointments || 0}`,`${t('dashboard.upcoming')}:${data._admin_dashboard?.upcomingAppointments?.length || 0}`],icon:(         
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
                )},
                {name:t('dashboard.done-appointments'),value:[`Total:${data._admin_dashboard?.appointmentStatusCounts?.done || 0}`],icon:(                  
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>
                )},
                {name:t('dashboard.approved-appointments'),value:[`Total:${data._admin_dashboard?.appointmentStatusCounts?.approved || 0}`,`${t('dashboard.upcoming')}:${data._admin_dashboard?.upcomingStatusCounts?.approved || 0}`],icon:(                        
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                )},
                {name:t('dashboard.canceled-appointments'),value:[`Total:${data._admin_dashboard?.appointmentStatusCounts?.canceled || 0}`,`${t('dashboard.upcoming')}:${data._admin_dashboard?.upcomingStatusCounts?.canceled || 0}`],icon:(                  
                        <svg  className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m388-212-56-56 92-92-92-92 56-56 92 92 92-92 56 56-92 92 92 92-56 56-92-92-92 92ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                )},
                {name:t('dashboard.pending-appointments'),value:[`Total:${data._admin_dashboard?.appointmentStatusCounts?.pending || 0}`,`${t('dashboard.upcoming')}:${data._admin_dashboard?.upcomingStatusCounts?.pending || 0}`],icon:(         
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-640h560v-80H200v80Zm0 0v-80 80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v227q-19-9-39-15t-41-9v-43H200v400h252q7 22 16.5 42T491-80H200Zm520 40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm67-105 28-28-75-75v-112h-40v128l87 87Z"/></svg>
                )}
                ]}/>
                


                 <div className={`w-full ${(user?.role=="admin" || user?.data?.permissions?.payment_management?.includes('read')) ? '':'hidden'}`}>

                        <div className="w-full mt-8">
                            <span className="font-medium">{t('dashboard.recent-payments')}</span>
                            <span className="text-gray-500 ml-2">({(data._admin_dashboard?.recentInvoices || []).length})</span>
                        </div>

                        <div className="flex items-center mb-4 gap-2 mt-5">
                                {['payment','refund'].map((i,_i)=>(
                                    <div onClick={()=>setSelectedTab1(i)} className={`flex transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1 ${selectedTab1==i ? 'bg-honolulu_blue-500 text-white':''}`}>
                                        <span>{getIcon(i,selectedTab1==i)}</span>
                                        <span>{t('common.'+i+'s')}</span>
                                        {(data._admin_dashboard?.recentInvoices || []).filter(f=>f.type==i).length!=0 && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                                            <span>{(data._admin_dashboard?.recentInvoices || []).filter(f=>f.type==i).length}</span>
                                        </div>}
                                    </div>

                                ))}
                                {(data._admin_dashboard?.recentInvoices || []).length==0 && <span className="mr-[30px] ml-4 text-gray-400">({t('common.no-recent-payments')})</span>}
                        </div>

                        <BaiscTable canAdd={false} hide={(data._admin_dashboard?.recentInvoices || []).length==0}   loaded={data._loaded.includes('admin_dashboard')} header={[
                                    'ID',
                                    'Ref',
                                    t('common.status'),
                                    t('common.amount'),
                                    t('common.payment-method'),
                                    t('common.patient'),
                                    t('common.doctor'),
                                    t('common.invoice'),
                                    t('common.created_at'),
                                    ]
                                }

                                    body={(data._admin_dashboard?.recentInvoices || []).filter(i=>i.type==selectedTab1).map((i,_i)=>(
                                        <BaiscTable.Tr>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.id}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.ref_id}</BaiscTable.Td>

                                            <BaiscTable.Td url={`/payment-management/`+i.id}>
                                            <button type="button" class={`text-white  ml-4 ${!i.status || i.status=="pending" ?"bg-orange-300": i.status=="rejected" ? ' bg-red-500' : "bg-green-500"}  focus:outline-none  font-medium rounded-[0.3rem] text-sm px-2 py-1 text-center inline-flex items-center`}>
                                                {t('common.'+i.status)}
                                            </button>
                                            </BaiscTable.Td>

                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{data._cn(i.amount)+"MT"}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.payment_method=="mpesa" ? 'M-pesa' : t('common.bank-transfer')}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.patient?.name}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.doctor?.name || t('common.dronline-team')}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.policy_number || '-'}</BaiscTable.Td>
                                            <BaiscTable.Td>
                                                        <span onClick={()=>{
                                                            window.open(APP_FRONDEND+"/invoice/"+i.ref_id, '_blank')
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>
                                                        </span>
                                            </BaiscTable.Td>
                                            <BaiscTable.Td url={`/payment-management/`+i.id}>{i.created_at.split('T')[0] + " "+i.created_at.split('T')[1].slice(0,5)}</BaiscTable.Td>
                                        
                                        </BaiscTable.Tr>
                                    ))}
                                />

                 </div>




                 <div className="w-full">

                        <div className="w-full mt-8">
                            <span className="font-medium">{t('dashboard.clients-with-more-appointments')}</span>
                            <span className="text-gray-500 ml-2">({topClients.length})</span>
                        </div>

                        <div className="flex items-center mb-4 gap-2 mt-5">
                                {['patient','doctor'].map((i,_i)=>(
                                    <div onClick={()=>setSelectedTab2(i)} className={`flex transition-all ease-in duration-75 items-center cursor-pointer  rounded-[0.3rem] px-2 py-1 ${selectedTab2==i ? 'bg-honolulu_blue-500 text-white':''}`}>
                                        <span>{getIcon(i,selectedTab2==i)}</span>
                                        <span>{t('common.'+i+'s')}</span>
                                        {topClients.filter(f=>f.role==i).length!=0 && <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                                            <span>{topClients.filter(f=>f.role==i).length}</span>
                                        </div>}
                                    </div>
                                ))}

                               {topClients.length==0 && <span className="mr-[30px] ml-4 text-gray-400">({t('common.no-clients')})</span>}
                       
                        </div>

                        <BaiscTable canAdd={false} hide={topClients.length==0}   loaded={data._loaded.includes('admin_dashboard')} header={[
                                    'ID',
                                    t('common.name'),
                                    'Email',
                                    t('common.appointments'),
                                    t('common.specialty')
                                    ]
                                }

                                    body={topClients.filter(i=>i.role==selectedTab2).map((i,_i)=>(
                                        <BaiscTable.Tr>
                                            <BaiscTable.Td url={`/${selectedTab2}/`+i.id}>{i.id || '-'}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/${selectedTab2}/`+i.id}>{i.name || t('common.dronline-team')}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/${selectedTab2}/`+i.id}>{i.email || '-'}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/${selectedTab2}/`+i.id}>{i.appointment_count}</BaiscTable.Td>
                                            <BaiscTable.Td url={`/${selectedTab2}/`+i.id}>{i.medical_specialties.map(c=>data._specialty_categories.filter(f=>f.id==c)[0]?.[i18next.language+"_name"]).filter(f=>f).join(', ')}</BaiscTable.Td>
                                        
                                        </BaiscTable.Tr>
                                    ))}
                                />
                        </div>

           </div>}

    </div>
  )
}
