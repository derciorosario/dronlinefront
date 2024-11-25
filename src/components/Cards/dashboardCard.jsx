import React from 'react'

export default function DashboardCard({items,topContent}) {
  return (
    <div className="w-full p-5 bg-honolulu_blue-500 rounded-[0.3rem] relative">
                 {topContent}
                 <div className="flex items-center flex-wrap">
                    {items.filter(i=>!i.hide).map((i,_i)=>{

                       let values=Array.isArray(i.value) ? i.value : [i.value]
                       
                       return (
                        <div className="flex items-center w-[33%] mt-5 pr-2">
                                <div className="w-[60px] bg-[rgba(255,255,255,0.2)] h-[60px] rounded-full flex items-center justify-center">
                                    {i.icon}
                                </div>
                                <div className="flex flex-col ml-3">
                                     <span className="text-white text-[17px]">{i.name}</span>
                                     <div className="flex">
                                        {values.map(f=>(
                                            <span className="text-[14px] mr-2  text-gray-300">{f}</span>
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
