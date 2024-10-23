import React from 'react'

function FormCard({items,hide}) {
  return (
    <div  className={`w-full flex mt-5 flex-wrap gap-y-10 px-5 py-5 bg-gray-50 rounded-[0.3rem] ${hide ? 'hidden':''}`}>
               {items.filter(i=>!i.hide).map((i,_i)=>(
                   <div class="max-md:w-[48%] w-[33%] max-sm:w-full mb-5">
                    <div>
                        <div class="rounded-full w-full mb-2.5">
                           {i.name}
                        </div>
                        <div class="w-full rounded-full font-medium">
                           {i.value}
                        </div>
                    </div>
                  </div>
               ))}
    </div>
  )
}

export default FormCard