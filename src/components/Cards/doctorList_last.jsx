import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import DoctorDetails from './doctorDetails'
import DoctorCard from './doctor'

function DoctorList({show}) {

  const data=useData()

  const [searchInput,setSearch] = useState('')

  const [searchedData,setSearchedData] = useState([]) 

  const [showDoctorDetails,setShowDoctorDetails]=useState(false)

  const {user} = useAuth()

  let required_data=['doctors']


  useEffect(()=>{
        
        if(!user) return

        setTimeout(()=>(
          data._get(required_data) 
        ),500)

  },[user])


  useEffect(()=>{
    //setSearchedData(data._search(searchInput,data._doctors))
  },[searchInput,data._loaded])



 
  return (

  <div  className={`w-full  h-[100vh] bg-[rgba(0,0,0,0.4)] ease-in  _doctor_list ${!show ? 'opacity-0 pointer-events-none translate-y-[100px]':''} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>

                  <div class="w-full h-[90vh] overflow-y-auto  p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[950px]">

                  { showDoctorDetails && <div className="flex mb-3">
                           <span onClick={()=>{
                            setTimeout(()=>{
                              setShowDoctorDetails(false)
                            },100)
                           }} className="table px-2 bg-gray-200 py-2 rounded-[0.3rem] cursor-pointer hover:bg-gray-300">{t('common.go-back')}</span>
                   </div>}
                  {!showDoctorDetails &&  <div class="flex items-center justify-between mb-4">

                                <h5 class="text-xl font-bold leading-none text-gray-900 ">{t('titles.doctors')}</h5>
                                
                                <label className="bg-gray left-[50%] bottom-[-20px] border-gray-300 border text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 flex p-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                                        <input value={searchInput} onChange={(e)=>setSearch(e.target.value)} placeholder={t('common.document-name')} className={` outline-none`}/>
                                </label>

                                <div onClick={()=>data._closeAllPopUps()} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                                </div>         
                            
                    </div>}


                    <div className={`flex ${showDoctorDetails ? "hidden":''} flex-wrap gap-2`}>
                          {searchedData.map(i=>(
                            <DoctorCard onClick={()=>setShowDoctorDetails(true)} item={i}/>
                          ))}
                    </div>


                      {showDoctorDetails && <div>

                        <DoctorDetails/>

                      </div>}

                      {(!searchedData.length && !showDoctorDetails) && <div className="w-full flex justify-center">
                               <span>{t('common.no-data-found')}</span>
                      </div>}


                    </div>



    </div>



  )
}

export default DoctorList