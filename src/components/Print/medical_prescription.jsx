import React, { useEffect, useState } from 'react'
import Logo from '../../assets/images/dark-logo-1.png'
import { t } from 'i18next'

function MedicalPrescriptionPrint({item,setItem}) {

  const data=useState()

  useEffect(()=>{

       if(item){
        window.print()
         setItem(null)
       }
  },[item])

  return (
    <div className={`w-full flex flex-col overflow-y-auto h-[100vh] ${!item ? '':'_print'} pointer-events-none opacity-0  fixed left-0 top-0 bg-white z-50 px-10`}>
               <div className="justify-around flex mt-5">
                   <h2 className="text-[26px] font-medium flex flex-col items-center">
                     <span>Receita médica</span>
                     <span>Medical prescription</span>
                </h2>
                   <img className="w-[160px] h-[60px]" src={Logo}/>
               </div>


               <div className="flex px-5 mt-20 justify-between">

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


               <div className="flex px-5 mt-10 justify-between">

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




               <div className="mt-10 min-h-[400px]">
                     {item?.medical_prescription_items?.map((i,_i)=>(
                            <div className="flex gap-x-4 mb-5">
                                <span className="w-[40px] h-[40px] border-[rgba(0,0,0,0.4)] border rounded-full  flex items-center justify-center">{_i+1}</span>
                                <div className="mt-2 flex flex-col">
                                   {Object.keys(i).filter(f=>f!="id" && f!="updated_at" && f!="medical_prescription_id" && f!="created_at").map((f)=>(
                                         <div>
                                            <span className="mt-1 mr-2">{t('form.'+f.replace('_','-'))}:</span>
                                            <span className="mt-1 font-medium text-[18px]">{i[f]}</span>
                                        </div>
                                   ))}
                                </div>
                            </div>
                    ) )}
                     
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

export default MedicalPrescriptionPrint