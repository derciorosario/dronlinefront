import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { useHomeData } from '../../contexts/DataContext'
import DefaultLayout from '../../layout/DefaultLayout'
import Footer from '../../components/Footer'
import TopImage from '../../assets/images/privacy.jpg'

function Privacy() {


    const data=useHomeData()
      useEffect(()=>{
        data._scrollToSection('top')
      },[])

      
  return (
    <DefaultLayout>

           <div  className="w-full h-[280px] flex _cancel_consultation bg-gray-400 relative">
                         <img src={TopImage} className="w-full h-full object-cover"/>
                         <div className="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex items-center px-[100px] max-md:px-6">
                         <h2 className="text-white text-[31px]">{t('common.privacy')}</h2>
                         </div>
            </div>
           
           <div className="px-7 my-14">
                <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">{t('common.privacy')}</h3>
               
         </div>

         <div className="divide">
  <div className="left"></div>
  <div className="right">
    <div className="section-item">
      <span><strong>{t('last_updated')}</strong> {t('last_updated_period')}</span>
      <br/><br/>
      <p>{t('privacy.t')}</p>

      <h2>{t('privacy.t-1')}</h2>
      <span>{t('privacy.p-1')}</span>

      <h2>{t('privacy.t-2')}</h2>
      <span>{t('privacy.p-2')}</span>
      <p>{t('privacy.p-2.1')}</p>
      <p>{t('privacy.p-2.2')}</p>

      <h2>{t('privacy.t-3')}</h2>
      <span>{t('privacy.p-3')}</span>

      <h2>{t('privacy.t-4')}</h2>
      <span>{t('privacy.p-4')}</span>

      <h2>{t('privacy.t-5')}</h2>
      <span>{t('privacy.p-5')}</span>

      <h2>{t('privacy.t-6')}</h2>
      <span>{t('privacy.p-6')}</span>
      <p>{t('privacy.p-6.1')}</p>


      <h2>{t('privacy.t-7')}</h2>
      <span>{t('privacy.p-7')}</span>
      <p>{t('privacy.p-7.1')}</p>
      <p>{t('privacy.p-7.2')}</p>


      <h2>{t('privacy.t-8')}</h2>
      <span>{t('privacy.p-8')}</span>

      <h2>{t('privacy.p-9')}</h2>



    </div>
 
    <br/><br/>

  </div>
</div>

<Footer/>
    </DefaultLayout>
  )
}

export default Privacy