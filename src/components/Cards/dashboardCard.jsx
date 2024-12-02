import React from 'react'

export default function DashboardCard({items,topContent}) {
  return (
    <div className="w-full p-5 bg-honolulu_blue-500 rounded-[0.3rem] relative">
                 {topContent}
                 <div className="flex items-center flex-wrap">
                    {items.filter(i=>!i.hide).map((i,_i)=>{
                       let values=Array.isArray(i.value) ? i.value : [i.value]
                       return (
                        <div className="flex items-center w-[33%] max-lg:w-[50%] mt-5 pr-2">
                                <div className="p-1 flex-shrink-0 bg-[rgba(255,255,255,0.2)] lg:h-[60px] lg:w-[60px] rounded-full flex items-center justify-center">
                                    {i.icon}
                                </div>
                                <div className="flex flex-col ml-3 flex-1">
                                     <span className="text-white text-[17px] max-md:text-[13px]">{i.name}</span>
                                     <div className="flex">
                                        {values.map(f=>(
                                            <span className="text-[14px] max-md:text-[13px] mr-2 flex flex-wrap text-gray-300 break-words">{f}</span>

                                        ))}
                                      </div>
                                </div>
                        </div>
                      )
                    })}
                 </div>
    </div>
  )
}
