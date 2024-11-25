import React from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { useHomeData } from '../../contexts/DataContext'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Loader from '../../components/Loaders/loader';

function Faq() {
  const data=useHomeData()
  const { t } = useTranslation();
  let required_data=['all_faqs']

  useEffect(()=>{ 
    data._get(required_data) 
  },[])

  const pages=['support','about-us','our-services']
  const [currentPage,setCurrentPage]=useState('support')

  
  return (
      <DefaultLayout>




           <>

            {!data._loaded.includes('all_faqs') && <div className="h-[400px] w-full flex items-center justify-center">
                 <Loader/>
            </div>}

          {data._loaded.includes('all_faqs') && <section class="bg-white py-10">
            <div class="container px-6 py-12 mx-auto">
                <h1 class="text-2xl font-semibold text-gray-800 lg:text-3xl">{t('common.faq')}</h1>

                <div className="flex items-center mt-4">
                    {pages.map((i,_i)=>(
                        <div onClick={()=>{
                            setCurrentPage(i)
                        }} className={`px-3 p-2 text-white mr-2 cursor-pointer ${currentPage==i ? 'bg-honolulu_blue-300':'bg-gray-300'} hover:bg-honolulu_blue-500 rounded-full`}>
                                {i=="support" ? t('common._support') : t('common.'+i)}
                        </div>
                    ))}
                </div>

                <div class="grid grid-cols-1 gap-8 mt-8 lg:mt-16 md:grid-cols-2 xl:grid-cols-3">
                
                    {data._all_faqs.filter(i=>i.type==currentPage).map((i,_i)=>(
                        <div>
                            <div class="inline-block p-3 text-white bg-honolulu_blue-400 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <div>
                                <h1 class="text-xl font-semibold text-gray-700">{i.title}</h1>
                                <p class="mt-2 text-sm text-gray-500">
                                    {i.content}
                                </p>
                            </div>
                    </div>
                    ))}

                </div>
              </div>
              </section>}

           </>

<Footer/>

      </DefaultLayout>
  )
}

export default Faq