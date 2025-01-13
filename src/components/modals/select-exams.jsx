import React from 'react'
import { useTranslation } from 'react-i18next';
import { useData } from '../../contexts/DataContext';
import exams from '../../assets/exams.json'
export default function SelectExams({show,setShow,form,setForm}) {
  const { t, i18n } = useTranslation();
  const data=useData()


  return (
            
        <div style={{zIndex:999}} id="crud-modal" tabindex="-1" aria-hidden="true" class={`overflow-y-auto  bg-[rgba(0,0,0,0.3)] flex ease-in delay-100 transition-all ${!show ? 'opacity-0 pointer-events-none translate-y-[50px]':''} overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100vh] max-h-full`}>
            <div class="relative p-4 w-full max-w-[1100px] max-h-full ">
                
                <div class="relative bg-white rounded-lg shadow pb-[50px]">
                    
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 class="text-lg font-semibold text-gray-900">
                          {t('menu.exams')}
                        </h3>
                    </div>

                    <div class="p-4 md:p-5 flex flex-wrap">
                     {exams.map((i,_i)=>(
                        <div className="p-2 w-[33.3%] max-lg:w-[50%] max-md:w-full">
                             <div id="dropdown" class="z-10  p-3 bg-white rounded-lg shadow h-full">
                            <h6 class="mb-3 text-sm font-bold text-gray-900">
                                {i.category}
                            </h6>
                                <ul class="space-y-2 text-sm" aria-labelledby="dropdownDefault">
                            
                                {i.items.map((f,_f)=>(
                                    <li onClick={()=>{
                                         if(form.exam_items.some(g=>g.name==f.name)){
                                            setForm({...form,exam_items:form.exam_items.filter(g=>g.name!=f.name)})
                                         }else{
                                            setForm({...form,exam_items:[...form.exam_items,f]})
                                         }
                                    }} class="flex items-center cursor-pointer">
                                        <input id={_f+f.name} checked={form.exam_items.some(g=>g.name==f.name)} type="checkbox" value=""
                                        class="w-4 h-4 bg-gray-100 cursor-pointer border-gray-300 rounded text-primary-600 focus:ring-primary-500  focus:ring-2" />

                                        <label for={_f+f.name} class="ml-2 text-sm font-medium text-gray-900">
                                           {f.name}
                                        </label>
                                   </li>
                                ))}

                            </ul>
                        </div>
                        </div>
                     ))}
                </div>


                </div>

               

                <div onClick={()=>{

                  setShow(false)

                 }} className="w-[30px] cursor-pointer h-[30px] absolute right-5 top-5 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>


            </div>
        </div> 

  )
}
