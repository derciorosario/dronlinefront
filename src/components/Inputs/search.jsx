import { t } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'

function SearchInput({items,res,id,loaded,label,r,placeholder,btnAddRes,canAdd,inputRes,defaultInput}) {


  let input_id=Math.random().toString().replace('.','')

  const [input,setInput]=useState(defaultInput || '')
  const [searched,setSearched]=useState([])
  const [selectId,setSelectedId]=useState(id)
  const [showOptions,setShowOptions]=useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  

  useEffect(()=>{
    //setSearched(items.filter(i=>(i.name)?.toLowerCase()?.includes(input.toLowerCase())))
    const filteredItems = items.filter((i) =>
        i.name?.toLowerCase()?.includes(input.toLowerCase())
    );
    setSearched(filteredItems);
  },[items,input])

  function handleOutsideClick(event){
    if(!event?.target?.closest(`._search_list`))  {
        document.removeEventListener('click', handleOutsideClick)
        setShowOptions(false)
    }
 }

 console.log({defaultInput})




  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = searched.slice(startIndex, endIndex);

  // Total pages
  const totalPages = Math.ceil(searched.length / itemsPerPage);

  // Handlers
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(()=>{
      setSelectedId(id)
  },[id])

  useEffect(()=>{
        setInput(defaultInput || '')
  },[defaultInput])

 

  return (
    <div class="flex relative w-[300px] flex-col _search_list">
        <div className="flex items-center mb-2 ">
              {label && <label  class="block text-sm  text-gray-900">{label} {r && <span className="text-red-500">*</span>}</label>}
              {showOptions && totalPages!=1 && totalPages!=0 && <div className="flex items-center ml-4">
                  <div className={`flex items-center cursor-pointer ${currentPage==1 ? 'opacity-40 pointer-events-none':''}`} onClick={handlePrev}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#5f6368"><path d="m480-320 56-56-64-64h168v-80H472l64-64-56-56-160 160 160 160Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                  </div>
                  <span className="text-[11px] mx-1">{currentPage} {t('common.of')} {totalPages}</span>
                  <div className={`flex items-center cursor-pointer ${currentPage==totalPages ? 'opacity-40 pointer-events-none':''}`} onClick={handleNext}>
                       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                  </div>
              </div> }        
        </div>
        <div id="dropdown" class="z-10  absolute left-0 top-[100%] bg-white divide-y divide-gray-100 rounded-lg shadow w-full">
            {showOptions && <ul class="py-2 max-h-[200px] overflow-y-auto text-sm text-gray-700" aria-labelledby="dropdown-button">
             
                {((searched.length!=0 && loaded) && canAdd!==false) && <li className="flex justify-end"> 
                        <span onClick={() => {
                            btnAddRes()
                            setInput('')
                            inputRes('')
                        }} className="table px-2 bg-honolulu_blue-400 text-white py-1 text-[12px] rounded-full cursor-pointer hover:bg-honolulu_blue-500">
                            {t('common.add-new')}
                        </span>  
                </li>}

                {currentItems.map((i,_i)=>(
                    <li key={i.id}>
                        <button onClick={()=>{
                            setSelectedId(i.id)
                            res(i.id)
                            setInput('')
                            inputRes('')
                            setShowOptions(false)
                        }} type="button" class="inline-flex w-full text-[13px] truncate px-4 py-2 hover:bg-gray-100">{i.name}</button>
                    </li>
                ))}

                {searched.length==0 && <span className="px-4 py-2 text-gray-500 flex items-center justify-between">
                    {!loaded ? t('common.loading')+"..." : t('common.no-data-found')}

                    {btnAddRes && <span onClick={() => {
                        btnAddRes()
                        setInput('')
                        inputRes('')
                    }} className="table px-2 bg-honolulu_blue-400 text-white py-1 text-[12px] rounded-full cursor-pointer hover:bg-honolulu_blue-500">
                        {t('common.add-new')}
                    </span>}

                </span>}
           
            </ul>}
        </div>
        <div class="relative w-full">
            <div className="flex-1">
               <input id={input_id}  onFocus={()=>{
                    setShowOptions(true)
                    document.addEventListener('click', handleOutsideClick)
                    setCurrentPage(1);
               }}  value={input} onChange={(e)=>{
                        setInput(e.target.value)
                        inputRes(e.target.value)
                        setCurrentPage(1);
               }}   class={`${selectId ? 'hidden':''} p-2.5 w-full pr-10 z-20 text-sm text-gray-900 bg-gray-50 rounded-[0.3rem] border-s-gray-50 border-s-2 border border-gray-300`} placeholder={placeholder}  />  
               {selectId && <div className={`p-2 w-full text-[13px] z-20 rounded-[0.3rem] border-s-gray-50 border-s-2 border border-gray-300`}>
                   <span className="flex mr-[40px]">{items.filter(i=>i.id==selectId)[0]?.name}</span>
                </div>}
            </div>
            <div  onClick={()=>{
                  if(selectId){
                        setSelectedId(null)
                        res(null)
                        setInput('')
                        inputRes('')
                  }else{
                        setTimeout(()=>document.getElementById(input_id).focus(),300)
                  }
            }} class="absolute  cursor-pointer flex items-center justify-center top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-honolulu_blue-500 rounded-[0.3rem] border border-honolulu_blue-500 hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300">
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