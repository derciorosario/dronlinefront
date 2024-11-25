import React from 'react'
import { t } from 'i18next'

export default function DownloadProgress({progress}) {
  return (
    <div className={`w-full flex ${!progress ? 'translate-y-[100px]':''} transition-all ease-in delay-100 h-[100vh] justify-center items-end fixed left-0 top-0`} style={{zIndex:999,pointerEvents:'none'}}>

        <div className="border rounded-[0.3rem] p-2 mb-5 flex items-center bg-white shadow">
             <div className="mr-2 _download_box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"/></svg>
             </div>
             <div>
                <span className="text-[0.9rem]">{t('common.downloading')}...</span> <label className="text-[0.8rem]">({progress}%)</label>
                <div className="w-[200px] bg-gray-400 relative rounded-[0.3rem] h-[3px] overflow-hidden">
                    <span style={{width:`${progress}%`}} className={`h-full bg-honolulu_blue-400 absolute flex`}></span>
                </div>
             </div>
        </div>

    </div>
  )
}
