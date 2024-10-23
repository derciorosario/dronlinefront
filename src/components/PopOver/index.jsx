import React, { useState } from 'react'

function PopOver({items,read_more_link,color}) {
 const [show,setShow]=useState(false)
  return (
      <div className="relative" onMouseLeave={()=>setShow(false)} onMouseEnter={()=>setShow(true)}>
        <svg class={`w-4 h-4 ms-2 ${color ? `text-${color}` : 'text-gray-400'}`} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
        <div data-popover id="popover-description" role="tooltip" class={`absolute translate-y-[-1rem] ${!show ? 'opacity-0 pointer-events-none':''} z-10 inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72`}>
            <div class="p-3 space-y-2">

                {items.map((i,_i)=>(
                   <>
                        <h3 class="font-semibold text-gray-900">{i.title}</h3>
                        <p>{i.text}</p>
                   </>
                ))}
                
                {read_more_link && <a href="#" class="flex items-center font-medium text-blue-600  hover:text-blue-700 hover:">Read more <svg class="w-2 h-2 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg></a>}
            </div>
            <div data-popper-arrow></div>
        </div>
      </div>
  )
}

export default PopOver