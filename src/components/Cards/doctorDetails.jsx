import React, { useState } from 'react'
import MuiCalendar from '../Calendar/mui-calendar'
import { t } from 'i18next'

function DoctorDetails({onClick}) {


 const [aboutDetails,setAboutDetails]=useState({
    personal:{experience:['12 Anos'],
    languages:['Português']
   },
   available_hours:['10:00','12:00'],
   selected_hour:''
 })



function Item({i,active,selected}){
    return (
        <span className={`table px-3 py-1 ${selected ? 'border-honolulu_blue-300 border':''} ${active ? ' bg-honolulu_blue-50 cursor-pointer text-honolulu_blue-400':'bg-gray-300'} rounded-full text-[14px]`}>{i}</span>
    )
 }



 return (
    
 <div  class="w-full bg-white border border-gray-200 rounded-lg shadow ">
    <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 " id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
        <li class="me-2">
            <button id="about-tab" data-tabs-target="#about" type="button" role="tab" aria-controls="about" aria-selected="true" class="inline-block p-4 text-blue-600 rounded-ss-lg hover:bg-gray-100">{t('common.doctor-info')}</button>
        </li>
        <li class="me-2 hidden">
            <button id="services-tab" data-tabs-target="#services" type="button" role="tab" aria-controls="services" aria-selected="false" class="inline-block p-4 hover:text-gray-600 hover:bg-gray-100 ">Services</button>
        </li>
        <li class="me-2 hidden">
            <button id="statistics-tab" data-tabs-target="#statistics" type="button" role="tab" aria-controls="statistics" aria-selected="false" class="inline-block p-4 hover:text-gray-600 hover:bg-gray-100">Facts</button>
        </li>
    </ul>
    
    
<div className="p-5">

     <div className="flex justify-between">

        <div class="py-4 px-5 bg-white border border-gray-200 rounded-lg shadow-sm w-[300px]">
            <div class="flex flex-col items-center py-5">
                <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" />
                <h5 class="mb-1 text-xl font-medium text-gray-900">Ana Marca</h5>
                <span class="text-sm text-gray-500">Cardiologia</span>
                <div class="flex mt-4 md:mt-6">
                    <a href="#" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 ">
                        {t('common.send-message')}
                    </a>
                </div>
            </div>
        </div>

        <div className="flex-1 p-5">
              <span className="font-semibold text-[20px] mb-2 flex">Cardiologia</span>
              <p className="text-gray-500">Lorem ipsum dolor sit, amet consectetur adipisicing elit. In consequatur earum commodi mollitia voluptas libero dicta dolore voluptates ducimus voluptatum est quae eos ipsa laborum minus, obcaecati quibusdam amet quasi.</p>
             
              <div className="mt-5 flex gap-x-6">

                  {Object.keys(aboutDetails.personal).map(i=>(

                        <div className="mb-2">
                            <span className="text-[15px] mb-2 flex font-medium">{t('common.'+i)}</span>
                            <div class="flex items-center">
                                {aboutDetails.personal[i].map(f=>(
                                    <Item i={f}/>
                                ))}
                            </div>
                        </div>

                  ))}
                 
              </div>
        </div>

     </div>


     <div className="flex mx-5 items-start py-5 flex-wrap">
 

            <div>
                <MuiCalendar/>
            </div>

          
            <div>
                <span className="text-[18px] mb-2 flex font-medium">{t('common.availability')}</span>
                <div className="flex border border-[rgba(0,0,0,0.2)] rounded-[0.3rem] p-3">
                    {[{d:'monday'},{d:'tuesday'},{d:'thursday'},{d:'friday'},{d:'saturday'},{d:'sunday'}].map((i,_i)=>(
                        <div className="shadow-sm rounded-[0.3rem] flex flex-col items-center  px-3 py-1 border border-[rgba(0,0,0,0.1)] mx-2">
                            <span className="font-medium">{t('common.weeks.'+i.d)}</span>
                            <span>{_i+1}</span>
                        </div>
                    ))}
                    
                </div>
                <span className="text-[18px] mb-2 mt-5 flex font-medium">{t('common.available-hours')}</span>
                <div class="flex items-center gap-x-6">
                                {aboutDetails.available_hours.map(f=>(
                                    <Item i={f} active={true} selected={true}/>
                                ))}
                </div>
                


            </div>


    </div>



    </div>
</div>

  )
}

export default DoctorDetails