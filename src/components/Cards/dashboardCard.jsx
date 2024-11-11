import React from 'react'

export default function DashboardCard({items}) {
  return (
    <div className="w-full p-5 bg-honolulu_blue-500 rounded-[0.3rem]">
                 <div className="">
                     <div className="flex justify-between">
                           <span className="text-white text-[18px] font-medium">You have a new appointment</span>
                           <button type="button" class="text-white bg-green-600 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Default</button>
                     </div>
                 </div>
                 <div className="">
                    {items.map((i,_i)=>(
                        <div className="w-full flex items-center">
                                <div className="w-[60px] bg-[rgba(255,255,255,0.2)] h-[60px] rounded-full flex items-center justify-center">
                                    {i.icon}
                                </div>
                                <div className="flex flex-col ml-3">
                                    <span className="text-white text-[20px]">{i.name}</span>
                                    <span className="text-[17px] text-white">{i.value}</span>
                                </div>
                        </div>
                    ))}
                 </div>
    </div>
  )
}
