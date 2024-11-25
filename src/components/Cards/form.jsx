
import React from 'react'
import { useNavigate } from 'react-router-dom'

function FormCard({items,hide,printMode}) {
  const navigate=useNavigate()
  return (
    <div  className={`w-full  flex mt-5 flex-wrap gap-y-10 px-5 py-5 bg-gray-50 rounded-[0.3rem] ${hide ? 'hidden':''}`}>
               {items.filter(i=>!i.hide).map((i,_i)=>(
                   <div class={`w-[33%] px-3 max-sm:w-full  ${printMode ? 'mb-2':'mb-5 max-md:w-[48%]'}`}>
                    <div>
                        <div class={`rounded-full ${printMode ? 'mb-1':'mb-2.5'} w-full font-medium`}>
                           {i.name}
                        </div>
                        <div onClick={()=>{
                             if(i.link){
                                navigate(i.link)
                             }
                        }} class={`w-full ${i.link ? 'underline  text-honolulu_blue-500 cursor-pointer':''} rounded-full font-medium opacity-65 flex items-center`}>
                           <span style={{color:i.color ? i.color : null}}>{i.value}</span>
                           {i.link && <span className="text-[15px] ml-1">
                              <svg className="fill-honolulu_blue-400" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
                           </span>}
                        </div>
                    </div>
                  </div>
               ))}
    </div>
  )
}

export default FormCard