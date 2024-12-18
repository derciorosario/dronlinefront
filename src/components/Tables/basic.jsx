import React from 'react'
import TableSkeleton from '../Skeleton/table'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext'

function BaiscTable({header,body,loaded,addPath,canAdd,notClickable,hide}) {
  const navigate=useNavigate()

  return (
    <div className={`${notClickable ? '_not_clickable_table':''} ${hide ? 'hidden':''} max-h-[1300px] overflow-y-auto`}>
     <div class="relative overflow-x-auto shadow-sm sm:rounded-lg">
      <table class={`w-full ${!loaded ? 'hidden':''} text-sm text-left rtl:text-right`}>
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

    <div className="mt-2">
         {!loaded && <TableSkeleton/>}
    </div>
      {(loaded && !body.length) && <div className="w-full min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center">
            <p className="text-gray-600">{t('common.no-data-found')}</p>
            {canAdd && <button onClick={()=>{
                navigate(addPath)
            }}  type="button" class="text-honolulu_blue-500 cursor-pointer focus:ring-4 border border-honolulu_blue-400 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-4 py-2 mt-3 text-center inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" className="fill-honolulu_blue-400"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                  {t('common.add')}
            </button>}
        </div>    
      </div>}
    </div>
  )
}

BaiscTable.Tr = ({children,onClick,hide}) => {
  return (    
    <tr onClick={onClick} class={`odd:bg-white ${hide ? 'hidden':''} even:bg-white  border-b hover:bg-gray-200 cursor-pointer active:opacity-45`}>
       {children}
    </tr>
  )
}

BaiscTable.Td = ({children,url,hide,onClick}) => {
  const navigate=useNavigate()
  
  return (    
    <> 
      {onClick && <td onClick={onClick} class={`px-6 ${hide ? 'hidden':''} py-4`}>{children}</td>}
      {!onClick && <td onClick={()=>{
        navigate(url)
      }} class={`px-6 ${hide ? 'hidden':''} py-4`}>{children}</td>}
    </>
  )
}



BaiscTable.MainActions = ({items,options,hide}) => {

  const data=useData()

  if(hide){
    return <></>
  }
  return (   
    
    <div className={`flex items-center _delete ${hide ? 'hidden':''}`}>
      <input onClick={()=>{

      if(items.length==data._selectedTableItems.length){
        data.setSelectedTableItems([])
      }else{
        data.setSelectedTableItems(items.map(i=>i.id))
      }

      }} checked={data._selectedTableItems.length==items.length} id="checked-checkbox" type="checkbox" value="" class={`w-4 ${!items.length ? 'hidden':''} mr-5 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded`}/>    

      {(items.length!=0 && data._selectedTableItems.length!=0) && <div  className="cursor-pointer" onClick={()=>{
            data.setItemsToDelete({...data.itemsToDelete,url:options.deleteUrl,items:data._selectedTableItems,deleteFunction:options.deleteFunction})
            data._showPopUp('delete')
      }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </div>}

   </div>
  )
}


BaiscTable.AdvancedActions=({items,id,w,hide})=>{
  
    const data=useData()

    return (
       <>
       <div></div>
       <div className={`relative ${hide ? 'hidden':''} translate-y-[30px] ${(items || []).filter(i=>!i.hide).length == 0 ? 'hidden':''} flex items-center`}>
          
          <span className="_table_options" onClick={()=>{
               data._showPopUp('table_options',id)
          }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg></span>
          {data._openPopUps.table_options==id && <div id="dropdown" class={`z-10 _table_options bg-white  absolute right-[20px] divide-y divide-gray-100 rounded-lg shadow w-[${w ? w :'130'}px]`}>
                        <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                           {(items || []).filter(i=>!i.hide).map((i,_i)=>(
                              <li onClick={i.onClick} className="flex items-center px-4 hover:bg-gray-100">
                                <span className="mr-2">{i.icon}</span>
                                <a href="#" class="block py-2 text-[14px]">{i.name}</a>
                              </li>
                            ))}
                        </ul>
          </div>}
       </div>
       </>
    )
}


BaiscTable.Actions=({options,hide})=>{

  const data=useData()

  return (
     <div className={`flex items-center _delete ${hide ? 'hidden':''}`}>
        <div onClick={()=>data.add_remove_table_item(options.id)} class="flex items-center mr-5">
            <input checked={data._selectedTableItems.includes(options.id)} id="checked-checkbox" type="checkbox" value="" class="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"/>
        </div>

        <div  className="cursor-pointer" onClick={()=>{
            data.setItemsToDelete({...data.itemsToDelete,url:options.deleteUrl,items:[options.id],deleteFunction:options.deleteFunction})
            data._showPopUp('delete')
            
        }}>

          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </div>
     </div>
  )
}



export default BaiscTable