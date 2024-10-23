import { t } from 'i18next'
import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Loader from '../Loaders/loader'

export default function BasicFilter({filterOptions,setFilterOptions,setUpdateFilters,show}) {

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
    <div  style={{width:data.showFilters ? '190px':'0'}} className={`min-h-[400px] h-auto  ${show ? 'opacity-0 pointer-events-none':'ease-in delay-75 transition-all'} overflow-x-hidden  relative mr-2`}>
         
          <div className="rounded-[2rem] pb-5 w-[170px] absolute left-0 top-0">

            <button onClick={()=>data.setShowFilters(false)} type="button" className="text-white flex items-center mb-1 w-full bg-honolulu_blue-500 font-medium rounded-full text-sm px-5 py-2.5  focus:outline-none">       
                <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                {t('common.close-filters')}
            </button>

            {filterOptions.some(i=>i.selected_ids.length) && <span onClick={()=>{
                 setFilterOptions(prev=>prev.map(i=>({...i,selected_ids:[]})))
                 setUpdateFilters(Math.random())
            }} className=" text-gray-500 mb-4 text-[13px] hover:text-honolulu_blue-500 cursor-pointer flex justify-center">{t('common.clear-all-filters')}</span>
}

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
                    }}   id="default-search" className="block w-full px-2 py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-[0.3rem] bg-gray-50" placeholder={t('common.search')}/>
                
                </div>}



                <ul className={`space-y-2 overflow-y-auto max-h-[140px] text-sm ${!f.loaded ? 'hidden':''}`} aria-labelledby="dropdownDefault">
                
                {f.items.filter(i=>(i.name || i.pt_name || i).toLowerCase().includes(f.search.toLowerCase())).map((i,_i)=>(
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

                        <input  checked={f.selected_ids.includes(i.id || i)} type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />

                        <span  className="ml-2 text-sm font-medium text-gray-900 cursor-pointer">
                          {i.name || i.pt_name || i}
                        </span>
                   </li>
                ))}
                
                </ul>
               </div>
            ))}



          </div>
    </div>
  )
}
