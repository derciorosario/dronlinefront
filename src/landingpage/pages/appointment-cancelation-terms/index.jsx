import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { useHomeData } from '../../contexts/DataContext'
import DefaultLayout from '../../layout/DefaultLayout'
import Footer from '../../components/Footer'
import TopImage from '../../assets/images/cancelation-terms.jpg'


function Terms() {


const data=useHomeData()

useEffect(()=>{
    data._scrollToSection('top')
},[])

      
  return (
    <DefaultLayout>

    
               <div  className="w-full h-[280px] flex _cancel_consultation bg-gray-400 relative">
                             <img src={TopImage} className="w-full h-full object-cover"/>
                             <div className="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex items-center px-[100px] max-md:px-6">
                             <h2 className="text-white text-[31px]">{t('appointment-cancelation.t')}</h2>
                             </div>
                </div>


           
    <div className="px-7 my-14">
            <h3 className="max-w-[700px] mx-auto text-center text-[45px] font-semibold mb-6 max-md:text-[27px]">{t('appointment-cancelation.t')}</h3>    
    </div>


    <div className="divide">
  <div className="left"></div>
  <div className="right">
    <div className="section-item">
    <span><strong>{t('last_updated')}:</strong> {t('last_updated_period')}</span>
      <br/><br/>
      
      <h2>{t('appointment-cancelation.t')}</h2>
      <p>{t('appointment-cancelation.p-1')}</p>
      <p>{t('appointment-cancelation.p-2')}</p>
      <p>{t('appointment-cancelation.p-3')}</p>
      <p>{t('appointment-cancelation.p-4')}</p>


    </div>
 
    <br/><br/>

  </div>
</div>

<Footer/>
  </DefaultLayout>
  )
}

export default Terms