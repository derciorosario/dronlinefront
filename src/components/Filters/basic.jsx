import i18next, { t } from 'i18next'
import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Loader from '../Loaders/loader'
import i18n from '../../i18n'

export default function BasicFilter({dateFilters,setDateFilter,filterOptions,setFilterOptions,setUpdateFilters,show,end,start,setEnd,setStart}) {

  const data=useData()
  
  useEffect(()=>{

     (async()=>{
        let required_data = filterOptions.filter(i => i.fetchable).map(i => i.field);
        const d = await data._get(required_data);
        Object.keys(d).forEach(k => {
        const optionsIndex = filterOptions.findIndex(i => i.field === k);
        setFilterOptions(prev => {
            const newOptions = [...prev];
            if (optionsIndex !== -1) {
            newOptions[optionsIndex] = { ...newOptions[optionsIndex], items: d[k].data ? d[k].data : d[k], loaded: true };
            }
            return newOptions;
        });
        });
    })()

  },[])



  return (
    <>
    <div className={`max-md:${data.showFilters ? 'fixed':'hidden'} max-md:overflow-scroll max-md:mb-32 max-md:z-50 right-0 top-1 max-md:h-[100vh]  max-md:w-full`}>
    <div  style={data.isMobile ? {width:'100%'} : {width:data.showFilters ? '190px':'0'}} className={`min-h-[400px] bg-white   max-md:h-full relative h-auto  ${show ? 'opacity-0 pointer-events-none':'ease-in delay-75 transition-all'} overflow-x-hidden  mr-2`}>
         
         <div className="rounded-[2rem] pb-5 md:w-[170px] w-full  absolute left-0 top-0 max-md:px-3">

           <button onClick={()=>data.setShowFilters(false)} type="button" className="text-white flex  max-md:mt-2 justify-center items-center mb-1 w-full bg-honolulu_blue-500 font-medium rounded-full text-sm px-5 py-2.5  focus:outline-none">       
               <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
               {t('common.close-filters')}
           </button>

           {filterOptions.some(i=>i.selected_ids.length) && <span onClick={()=>{
                setFilterOptions(prev=>prev.map(i=>({...i,selected_ids:[]})))
                setUpdateFilters(Math.random())
           }} className=" text-gray-500 mb-4 text-[13px] hover:text-honolulu_blue-500 cursor-pointer flex justify-center">{t('common.clear-all-filters')}</span>
       }


       
         {dateFilters?.map((i,_i)=>(
             <div id="dropdown" className="z-10  p-3 bg-white rounded-lg shadow  w-full mb-2">
             <h6 className="mb-2 text-sm font-medium text-gray-900">
                 {i.start_name}
             </h6>

             <input onChange={(e)=>{
                 setDateFilter([...dateFilters.filter(f=>f.field!=i.field),{
                   ...i,start:e.target.value
                 }])
                 setUpdateFilters(Math.random())
             }} value={i.start} type="date" className="block w-full mb-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
           
             <h6 className="mb-2 text-sm font-medium text-gray-900">
                  {i.end_name}
             </h6>

             <input onChange={(e)=>{
                setDateFilter([...dateFilters.filter(f=>f.field!=i.field),{
                 ...i,end:e.target.value
               }])
               setUpdateFilters(Math.random())
             }} value={i.end} type="date" className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
         </div>
         ))}
         

           {(end!=undefined && start!=undefined) && <div id="dropdown" className="z-10  p-3 bg-white rounded-lg shadow  w-full mb-2">
               <h6 className="mb-2 text-sm font-medium text-gray-900">
                    {t('common.start')}
               </h6>

               <input onChange={(e)=>{
                setStart(e.target.value)
                setUpdateFilters(Math.random())
               }} value={start} type="date" className="block w-full mb-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
              
               <h6 className="mb-2 text-sm font-medium text-gray-900">
                    {t('common.end')}
               </h6>
               <input onChange={(e)=>{
                  setEnd(e.target.value)
                  setUpdateFilters(Math.random())
               }} value={end} type="date" className="block w-full py-1 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50"/>
              
           </div>}




           {filterOptions.map((f,_f)=>(

               <div id="dropdown" className="z-10  p-3 bg-white rounded-lg shadow  w-full mb-2">
               {f.selected_ids.length!=0 && <span className="underline text-honolulu_blue-400 text-[13px] cursor-pointer flex justify-end"  onClick={() => {
                       const optionsIndex = filterOptions.findIndex(i => i.field === f.field);
                       setFilterOptions(prev => {
                         const newOptions = [...prev];
                         if (optionsIndex !== -1) {
                           newOptions[optionsIndex] = {
                             ...newOptions[optionsIndex],
                             selected_ids: []
                           };
                         }
                         return newOptions;
                       });
                       setUpdateFilters(Math.random())
                       
                      }}>{t('common.clear')}</span>}

               <h6 className="mb-3 text-sm font-medium text-gray-900">
                    {f.name}
               </h6>

               {!f.loaded && <div className="flex items-center">
                    <Loader h={20} w={20}/>
                    <span className="ml-1 text-[14px]">{t('common.loading')}...</span>
               </div>}


               {f.loaded && <div className="relative mb-2">
                   <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                       <svg className="text-gray-500 dark:text-gray-400" height={16} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                           <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                       </svg>
                   </div>
                   <input onChange={(e) => {
                       const optionsIndex = filterOptions.findIndex(i => i.field === f.field);
                       setFilterOptions(prev => {
                       const newOptions = [...prev];
                       if (optionsIndex !== -1) {
                           newOptions[optionsIndex] = { ...newOptions[optionsIndex], search: e.target.value };
                       } 
                       return newOptions;
                       });
                       setUpdateFilters(Math.random())
                   }}   id="default-search" className="block w-full px-2 py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50" placeholder={t('common.search')}/>
               
               </div>}



               <ul className={`space-y-2 overflow-y-auto max-h-[140px] text-sm ${!f.loaded ? 'hidden':''}`} aria-labelledby="dropdownDefault">
               
               {f.items.filter(i=>(i?.name || (i?.pt_name || i?.en_name) || i)?.toLowerCase()?.includes(f.search.toLowerCase())).map((i,_i)=>(
                   <li className="flex items-center px-[1px] cursor-pointer" onClick={() => {
                       const optionsIndex = filterOptions.findIndex(i => i.field === f.field);
                       setFilterOptions(prev => {
                         const newOptions = [...prev];
                         if (optionsIndex !== -1) {
                           newOptions[optionsIndex] = {
                             ...newOptions[optionsIndex],
                             selected_ids: newOptions[optionsIndex].selected_ids.includes(i.id || i)
                               ? newOptions[optionsIndex].selected_ids.filter(j => j !== (i.id || i))
                               : [...newOptions[optionsIndex].selected_ids, (i.id || i)]
                           };
                         }
                         return newOptions;
                       });
                       setUpdateFilters(Math.random())

                      }}>

                       <input  checked={f.selected_ids.includes(i.id || i)} type="checkbox" value="" className="w-4 h-4 flex-shrink-0 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />

                       <span  className="ml-2 flex-1 flex  text-sm font-medium text-gray-900 cursor-pointer">
                         {i.name || (i?.pt_name || i?.en_name) || i} 
                       </span>
                  </li>
               ))}
               
               </ul>
              </div>


           ))}



         </div>
   </div>
    </div>
    
    </>
  )
}
