import { t } from 'i18next'
import React, { useState } from 'react'
import { useHomeData } from '../../contexts/DataContext'

export default function BasicSearch({setSearch,setCurrentPage,show,from,total,search}) {
  const data=useHomeData()
  return (
    <div className={`flex items-center mb-2  ${show ? 'opacity-0 pointer-events-none':''}`}>
        <div className={`${data.showFilters ? 'hidden':''}  mr-4`}>
            <button onClick={()=>data.setShowFilters(true)} type="button" className="text-white w-full bg-honolulu_blue-500 font-medium rounded-full text-sm px-5 py-2.5 flex items-center  focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg>
                <span className="ml-1">{t('common.filters')}</span>
            </button>
        </div>
        <div className="relative flex items-center">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center  pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input value={search} placeholder={t('common.search-name')} onChange={(e)=>{
                setCurrentPage(1)
                setSearch(e.target.value)
                data.handleLoaded('remove',from)
            }} id="default-search" className="block w-full px-4 py-3 _pr-[120px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" required />
            <button type="submit" className="text-white hidden absolute end-1  bg-honolulu_blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">{t('common.search')}</button>
        </div>

        <div className="ml-2">
            <div type="button" class={`py-[13px] px-5 me-2  text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200`}>
                {total ? total +" "+ t('common.results') :  t('common.no-data-found')}
            </div>
        </div>
    </div>
  )
}