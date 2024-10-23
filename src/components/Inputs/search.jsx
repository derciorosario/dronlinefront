import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'

function SearchInput({items,res,id,loaded,label,r}) {


  let input_id=Math.random().toString().replace('.','')

  const data=useData()
  const [input,setInput]=useState('')
  const [searched,setSearched]=useState([])
  const [selectId,setSelectedId]=useState(id)
  const [showOptions,setShowOptions]=useState(false)

  useEffect(()=>{
    //setSearched(data._search(input,items))
  },[input,data._loaded])





  return (

    <div class="flex relative w-[300px] mt-7 flex-col">

        <label  class="block mb-2 text-sm  text-gray-900">{label} {r && <span className="text-red-500">*</span>}</label>
                   
        <div id="dropdown" class="z-10  absolute left-0 top-[100%] bg-white divide-y divide-gray-100 rounded-lg shadow w-full">
            {showOptions && <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
             
                {searched.map((i,_i)=>(
                    <li key={i.id}>
                        <button onClick={()=>{
                            setSelectedId(i.id)
                            res(i.id)
                        }} type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100">{i.name}</button>
                    </li>
                ))}

                {searched.length==0 && <span className="px-4 py-2 text-gray-500">{!loaded ? t('common.loading')+"..." : t('common.no-data-found')}</span>}
           
            </ul>}
        </div>
        <div class="relative w-full">
            <div>
               <input id={input_id} onBlur={()=>{
                 setTimeout(()=>setShowOptions(false),300)
               }} onFocus={()=>setShowOptions(true)}  value={input} onChange={(e)=>setInput(e.target.value)}   class={`${selectId ? 'hidden':''} p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-[0.3rem] border-s-gray-50 border-s-2 border border-gray-300`} placeholder={t('common.search-patients')}  />  
               {selectId && <div className={`p-2 w-full z-20 rounded-[0.3rem] border-s-gray-50 border-s-2 border border-gray-300`}>{items.filter(i=>i.id==selectId)[0]?.name}</div>}
            </div>
            <div  onClick={()=>{
                  if(selectId){
                        setSelectedId(null)
                        res(null)
                  }else{
                        setTimeout(()=>document.getElementById(input_id).focus(),300)
                  }
            }} class="absolute cursor-pointer top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-[0.3rem] border border-honolulu_blue-500 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300">
                     {selectId &&  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                 </div>}

                    {!selectId && <div>
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>}
                <span class="sr-only">Search</span>
            </div>
        </div>
    </div>

  )
}

export default SearchInput