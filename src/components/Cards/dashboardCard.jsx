import React from 'react'

export default function DashboardCard({items,topContent}) {
  return (
    <div className="w-full p-5 max-sm:p-3 bg-honolulu_blue-500 rounded-[0.3rem] relative">
                 {topContent}
                 <div className="flex items-center flex-wrap">
                    {items.filter(i=>!i.hide).map((i,_i)=>{
                       let values=Array.isArray(i.value) ? i.value : [i.value]
                       return (
                        <div className="flex items-center w-[33%] max-lg:w-[50%] mt-5 pr-2">
                                <div className="p-1 flex-shrink-0 bg-[rgba(255,255,255,0.2)] lg:h-[60px] lg:w-[60px] rounded-full flex items-center justify-center">
                                    {i.icon}
                                </div>
                                <div className="flex flex-col ml-3 max-md:ml-1 flex-1 w-full">
                                     <span className="text-white text-[17px] block max-md:text-[12px] w-full break-words">{i.name}</span>
                                     <div className="flex w-full flex-wrap">
                                        {values.map(f=>(
                                            <span className="text-[14px] w-full max-md:text-[13px] mr-2 flex flex-wrap text-gray-300 break-words">{f}</span>

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
