import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { useHomeData } from '../../contexts/DataContext'
import DefaultLayout from '../../layout/DefaultLayout'
import Footer from '../../components/Footer'

function Terms() {


    const data=useHomeData()


      useEffect(()=>{
        data._scrollToSection('top')
      },[])

      
  return (
    <DefaultLayout>

           <div className="w-full min-h-[200px]  flex items-center p-6 bg-honolulu_blue-500">
               <h2 className="text-white text-[31px]">{t('common.terms')}</h2>
           </div>
           
           <div className="px-7 my-14">
            <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">{t('common.terms')}</h3>    
         </div>


         <div className="divide">
  <div className="left"></div>
  <div className="right">
    <div className="section-item">
      <span><strong>{t('last_updated')}</strong> {t('last_updated_period')}</span>
      <br/><br/>
      
      <h2>{t('terms.t-1')}</h2>
      <span>{t('terms.p-1')}</span>

      <h2>{t('terms.t-2')}</h2>
      <span>{t('terms.p-2')}</span>
      <p>{t('terms.p-2.1')}</p>

      <h2>{t('terms.t-3')}</h2>
      <span>{t('terms.p-3')}</span>

      <h2>{t('terms.t-4')}</h2>
      <span>{t('terms.p-4')}</span>
      <span>{t('terms.p-4.1')}</span>
      <span>{t('terms.p-4.2')}</span>

      <h2>{t('terms.t-5')}</h2>
      <span>{t('terms.p-5')}</span>
      <span>{t('terms.p-5.1')}</span>

      <h2>{t('terms.t-6')}</h2>
      <span>{t('terms.p-6')}</span>
      <p>{t('terms.p-6.1')}</p>


      <h2>{t('terms.t-7')}</h2>
      <span>{t('terms.p-7')}</span>


      <h2>{t('terms.t-8')}</h2>
      <span>{t('terms.p-8')}</span>

      <h2>{t('terms.t-9')}</h2>
      <span>{t('terms.p-9')}</span>
      
      <h2>{t('terms.t-10')}</h2>
      <span>{t('terms.p-10')}</span>



    </div>
 
    <br/><br/>

  </div>
</div>

<Footer/>
  </DefaultLayout>
  )
}

export default Terms