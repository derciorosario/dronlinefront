import { t } from 'i18next'
import React from 'react'
import { useHomeData } from '../../contexts/DataContext'

function Search({show}) {
 const data=useHomeData()
  return (
    <div className={`w-full _global_search bg-white h-[100vh] fixed left-0 top-0 z-50 flex ${!show ? 'scale-90 opacity-0 pointer-events-none':''} items-center transition-all ease-in delay-100 justify-center`}>
              <div onClick={()=>{
                  setTimeout(()=>data._closeAllPopUps(),40)
              }} className={`bg-honolulu_blue-400 ${!show ? 'scale-90 opacity-0':''} cursor-pointer  w-[50px] h-[50px] rounded-[0.3rem] absolute right-4 top-4 flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="25px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
              </div>

              <div className="w-[400px] max-md:w-full flex items-center px-5 h-[30px] relative">
                 <input className="w-full outline-none border-b-2 focus:border-honolulu_blue-400 transition-all ease-in delay-100 px-2 py-3 pl-8" type="text" placeholder={t('common.search')}/>
                 <span className="absolute top-1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg></span>
              </div>
    </div>
  )
}

export default Search