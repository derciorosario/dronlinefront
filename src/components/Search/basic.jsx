import { t } from 'i18next'
import React, { useState } from 'react'
import { useData } from '../../contexts/DataContext'

export default function BasicSearch({search,setSearch,setCurrentPage,show,from,total,hideFilters,hideSearch,printAction,loaded}) {
  const data=useData()
  return (
    <div className={`flex items-center mb-2  ${show ? 'opacity-0 pointer-events-none':''}`}>

       {printAction && <div onClick={printAction} className="mr-2 cursor-pointer hover:opacity-70 active:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>                    
        </div>}

        {!hideFilters && <div className={`${data.showFilters ? 'hidden':''}  mr-4`}>
            <button onClick={()=>data.setShowFilters(true)} type="button" className="text-white w-full bg-honolulu_blue-500 font-medium rounded-full text-sm px-5 py-2.5 flex items-center  focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg>
                <span className="ml-1 max-md:hidden">{t('common.filters')}</span>
            </button>
        </div>}
        {!hideSearch && <div className="relative flex items-center">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center  pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input value={search} placeholder={t('common.search-name')} onChange={(e)=>{
                setCurrentPage(1)
                setSearch(e.target.value)
                data.handleLoaded('remove',from)
            }} id="default-search" className="block w-full px-4 pr-[25px]   py-3 _pr-[120px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" required />
            {search && <button onClick={()=>{
                setCurrentPage(1)
                setSearch('')
                data.handleLoaded('remove',from)
            }} type="submit" className=" absolute end-1 hover:bg-honolulu_blue-400 hover:text-white  bg-gray-200 text-gray-400 border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[0.3rem] text-sm px-1 py-2">
                x
            </button>}
        </div>}

        {loaded && <div className={`${!hideSearch ? 'ml-2':''}`}> 
            <div type="button" class={`py-[13px] px-5 me-2  text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200`}>
                <span className="max-md:hidden">{total ? total +" "+ t('common.results') :  t('common.no-data-found')}</span>
                <span className={"md:hidden"}>{total}</span>
            </div>
        </div>}
    </div>
  )
}
