import React from 'react'

function PrintTable({header,body}) {

  return (
    <div className={`hide_scrollbar`}>
     <div class="relative overflow-x-auto shadow-sm sm:rounded-lg hide_scrollbar">
      <table class={`w-full  text-sm text-left rtl:text-right`}>
          <thead class="text-xs text-gray-700 bg-gray-50">
              <tr>
                {header.filter(i=>i).map((i,_i)=>(
                    <th key={_i} scope="col" class="px-6 py-3">
                      {i}
                  </th>
                ))}
              </tr>
          </thead>
          <tbody>
               {body}
          </tbody>
      </table>
    </div>
    </div>

  )
}

PrintTable.Tr = ({children}) => {
  return (    
    <tr class={`odd:bg-white even:bg-white  border-b hover:bg-gray-200 cursor-pointer active:opacity-45`}>
       {children}
    </tr>
  )
}


PrintTable.Td = ({children}) => {
  return (    
    <> 
      <td class={`px-6 py-4`}>{children}</td>
    </>
  )
}


export default PrintTable