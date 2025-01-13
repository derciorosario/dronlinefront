import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import i18n from '../../i18n'
import { useHomeData } from '../../contexts/DataContext'
import toast from 'react-hot-toast';
import {useLocation, useNavigate} from 'react-router-dom'

function FindSpecialist() {
    
  const data = useHomeData()
  const {pathname} = useLocation()

  const [searchInput1,setSearch1] = useState('')
  const [searchedData1,setSearchedData1] = useState([])
  const [searchInput2,setSearch2] = useState('')
  const [searchedData2,setSearchedData2] = useState([])
  const [selected1,setSelected1]=useState(null)
  const [selected2,setSelected2]=useState(null)

  
 const navigate=useNavigate()

  useEffect(()=>{
    setSearchedData1(data.specialty.filter(i=>(i.name)?.toLowerCase()?.includes(searchInput1.toLowerCase())))
  },[searchInput1,data._loaded,data.specialty])

  useEffect(()=>{
    setSearchedData2(data._search(searchInput2,data._doctors?.data || []))
  },[searchInput2,data._loaded])



  useEffect(()=>{ 
    data._get('doctors',{doctors:{all:true,status:'active'}}) 
  },[pathname])


  return (
    <div style={{zIndex:9}} className="w-full max-md:px-[15px] px-[50px] z-40 relative">
          <div className="w-[1160px] max-xl:w-full  mx-auto px-7 py-10 bg-honolulu_blue-500 max-md:translate-y-[0%]  max-md:my-[50px]  translate-y-[-50%] rounded-[0.5rem]">
              <div className="mt-bold uppercase text-[18px] text-white mb-3">{t('common.i-need-to-find')}</div>
              <div className="w-full flex max-md:flex-col  max-md:gap-y-4 items-center gap-x-2">
                    
                    <div className="flex w-full items-center bg-white rounded-[0.3rem] p-2 relative">   
                         <svg xmlns="http://www.w3.org/2000/svg" className="fill-honolulu_blue-400" height="24px" viewBox="0 -960 960 960"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm400 360H600v80H360v-80H160v160h640v-160Zm-360 0h80v-80h-80v80Zm-280-80h200v-80h240v80h200v-200H160v200Zm320 40Z"/></svg>
                        
                         <input onChange={(e)=>setSearch1(e.target.value)} onFocus={()=>data._showPopUp('show_specialist_list')}  placeholder={t('common.specialty')} className="w-full _show_specialist_list px-2 outline-none"/>
                         {selected1?.name && <div className="absolute px-2 rounded-[0.3rem] w-full h-full left-0 top-0 bg-white flex items-center justify-between">
                             <span className="text-[14px] leading-tight">{selected1.name}</span>
                             <span onClick={()=>setSelected1(null)} className="cursor-pointer hover:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
                         </div>}

                           {(data._openPopUps.show_specialist_list && (data._loaded.includes('specialty_categories') && data._loaded.includes('medical_specialities'))) && <div className="w-full shadow z-40 max-h-[300px] overflow-y-auto absolute left-0 top-[100%] px-2 bg-white rounded-[0.3rem]">
                          
                            {searchedData1.map((i,_i)=>(
                                 <div onClick={()=>setSelected1(i)} className="w-full flex  items-center p-2 hover:bg-slate-100 cursor-pointer rounded-[0.3rem]">
                                    <div className="flex flex-col">
                                        <span>{i.name}</span>
                                    </div>
                                 </div>
                            ))}

                            {(data.specialty.length==0) && <div className="w-full flex  items-center p-2 rounded-[0.3rem]">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400">{t('common.loading')}...</span>
                                    </div>
                            </div>}

                         </div>}
                     </div>

                    <div className="flex w-full items-center bg-white rounded-[0.3rem] p-2 relative">
                         <svg xmlns="http://www.w3.org/2000/svg" className="fill-honolulu_blue-400" height="24px" viewBox="0 -960 960 960"><path d="M160-80q-33 0-56.5-23.5T80-160v-440q0-33 23.5-56.5T160-680h200v-120q0-33 23.5-56.5T440-880h80q33 0 56.5 23.5T600-800v120h200q33 0 56.5 23.5T880-600v440q0 33-23.5 56.5T800-80H160Zm0-80h640v-440H600q0 33-23.5 56.5T520-520h-80q-33 0-56.5-23.5T360-600H160v440Zm80-80h240v-18q0-17-9.5-31.5T444-312q-20-9-40.5-13.5T360-330q-23 0-43.5 4.5T276-312q-17 8-26.5 22.5T240-258v18Zm320-60h160v-60H560v60Zm-200-60q25 0 42.5-17.5T420-420q0-25-17.5-42.5T360-480q-25 0-42.5 17.5T300-420q0 25 17.5 42.5T360-360Zm200-60h160v-60H560v60ZM440-600h80v-200h-80v200Zm40 220Z"/></svg>
                         <input onChange={(e)=>setSearch2(e.target.value)} onFocus={()=>data._showPopUp('show_doctors_list')}  placeholder={t('common.select-doctor')} className="w-full _show_doctors_list px-2 outline-none"/>
                         {selected2?.name && <div className="absolute px-2 rounded-[0.3rem] w-full h-full left-0 top-0 bg-white flex items-center justify-between">
                             <span className="text-[14px] leading-tight">{selected2.name} ({data._specialty_categories.filter(i=>i.id==selected2.medical_specialty)[0]?.[i18n.language+"_name"]})</span>
                             <span onClick={()=>setSelected2(null)} className="cursor-pointer hover:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></span>
                         </div>}
                         {data._openPopUps.show_doctors_list && <div className="w-full max-h-[300px] overflow-auto shadow z-40 absolute left-0 top-[100%] px-2 bg-white rounded-[0.3rem]">
                            
                             {searchedData2.filter(i=>i.medical_specialty==selected1?.id || !selected1).map(f=>(
                                <div onClick={()=>setSelected2(f)} className="w-full flex items-center p-2 hover:bg-slate-100 cursor-pointer rounded-[0.3rem]">
                                <div className="w-[50px] h-[50px] relative overflow-hidden mr-3 rounded-full bg-slate-100 flex items-center justify-center">
                                    {f.name.charAt().toUpperCase()}
                                    {f.profile_picture_filename && <img className="w-full object-cover absolute object-top" src={f.profile_picture_filename}/>}
                                </div>
                                    <div className="flex flex-col">
                                        <span className="mt-medium">{f.name}</span>
                                        <span>{data._specialty_categories.filter(i=>i.id==f.medical_specialty)[0]?.[i18n.language+"_name"]}</span>
                                    </div>
                                </div>
                             ))}

                              {!data._loaded.includes('doctors') && <div className="w-full flex  items-center p-2 rounded-[0.3rem]">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400">{t('common.loading')}...</span>
                                    </div>
                            </div>}
                         </div>}

                         

                    </div>

                    <button onClick={()=>{
                        
                         if(!selected2){
                            toast(t('common.select-a-specialist'))
                         }else{
                            navigate('/doctors-list/?doctor='+selected2.id)
                         }
                    }} className="px-5 py-[0.6rem] max-md:w-full whitespace-nowrap bg-honolulu_blue-300 text-white table uppercase text-[14px] max-sm:text-[12px] border-honolulu_blue-300 border rounded-[0.3rem]">{t('menu.add-appointment')}</button>
              
              </div>
          </div>
    </div>
  )
}

export default FindSpecialist