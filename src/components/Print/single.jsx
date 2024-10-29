import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Logo from '../../assets/images/dark-logo-1.png'
import { t } from 'i18next'
import FormCard from '../Cards/form'
import PrintTable from '../Tables/print'
export default function SinglePrint({item,setItem}) {
    const data=useData()

    useEffect(()=>{
  
         if(item){
          setItem(null)
          window.print()
         }
    },[item])

    return (
      <div className={`w-full flex flex-col overflow-y-auto h-[100vh] ${!item ? '':'_print'} pointer-events-none opacity-0  fixed left-0 top-0 bg-white z-50 px-10`}>
                 <div className="justify-around flex">
                     <h2 className="text-[26px] font-medium flex flex-col items-center">
                       <span>{item?.title}</span>
                  </h2>
                     <img className="w-[160px] h-[60px]" src={Logo}/>
                 </div>
  
  
                 <div className="flex px-5 mt-5 justify-between">
  
                     <div className="flex flex-col justify-end items-end">
                          <span>Nome do paciente:</span>
                          <span>Paciente name:</span>
                     </div>
  
                     <div  className="flex-1 border-b border-b-black flex items-end mx-4">
                          <span className="font-medium">{item?.patient?.name}</span>
                     </div>
  
                     <div className="flex items-end ml-5">
                         <span>Pro. No:</span>
                         <span className="flex border-b border-black ml-4 min-w-[200px]">{item?.id}</span>
                     </div>
                 </div>
  
  
                 <div className="flex px-5 mt-10 justify-between hidden">
  
                     <div className="flex flex-col justify-end items-end">
                          <span>Endereço:</span>
                          <span>Address:</span>
                     </div>
  
                     <div  className="flex-1 border-b border-b-black flex items-end mx-4">
                          <span className="font-medium">{item?.patient?.address}</span>
                     </div>
  
                     <div className="flex items-end ml-5">
                         <span>Tel:</span>
                         <span className="flex border-b border-black ml-4 min-w-[200px]">{item?.patient?.main_contact}</span>
                     </div>

                   </div>

                    {/**** <div className="w-full py-10">
                        <FormCard printMode={true} items={(item?.content || [])}/>
                    </div> */}
                 
                    <div className="w-full py-10">

                    <PrintTable header={[t('common.name'),'']} body={(item?.content || []).filter(i=>i.name || i.value).map(i=>(
                            <PrintTable.Tr>
                                    <PrintTable.Td>{i.name}</PrintTable.Td>
                                    <PrintTable.Td>{i.value}</PrintTable.Td>
                          </PrintTable.Tr>
                    ))}>
                        
                    </PrintTable>

                    </div>
  
  
                 <div className="flex-1 flex flex-col justify-end">
                      <div className="mt-10 flex justify-between">
                          <span className="font-medium">{new Date().toISOString().split('T')[0]}</span>
  
                          <div className="flex">
                              <label>Dr.</label> <span className="min-w-[100px] flex border-black border-b border-dashed"></span>
                          </div>
                      </div>
                      <span className="flex w-full justify-center my-5">Dr Online</span>
                 </div>
      </div>
    )
  }