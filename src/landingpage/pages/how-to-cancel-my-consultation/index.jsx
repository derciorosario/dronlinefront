import React, { useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import TopImage from '../../assets/images/cancel-consultaion.jpg'
import { t } from 'i18next'
import Footer from '../../components/Footer'
import { useHomeData } from '../../contexts/DataContext'
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function HowToCancelConsultation() {


    const data=useHomeData()

    useEffect(()=>{
      data._scrollToSection('top')
    },[])

    useEffect(() => {
        AOS.init({
          duration: 700,
          delay: 200, 
          easing: 'ease-in-out', 
          offset: 50, 
        }); 
    }, []);
    

    return (
    <DefaultLayout>
          <div  className="w-full h-[350px] flex _cancel_consultation bg-gray-400 relative">
              <img src={TopImage} className="w-full h-full object-cover"/>
              <div className="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.3)] flex items-center px-[100px] max-md:px-6">
                  <h2 data-aos="fade-up" className="text-[35px]  font-medium text-white max-w-[400px] max-sm:text-[26px]">{t('common.how-to-cancel-consultation')}</h2>
              </div>
          </div>

          <div>
                <section className="p-6 bg-gray-100 text-gray-800 pt-10">
                    <div className="container mx-auto">
                        <span data-aos="fade-up" className="block  text-[25px] font-medium tracking-widest text-center uppercase text-honolulu_blue-400 mb-5">{t('common.how-does-it-work')}</span>
                        <h2 data-aos="fade-up" className="text-5xl max-md:text-[28px] max-w-[700px] mx-auto font-bold text-center text-gray-900">{t('common.how-to-cancel-my-consultation')}</h2>
                        <div className="grid gap-6 my-16 lg:grid-cols-3">
                            <div data-aos-delay={`200`} data-aos="fade-up" className="flex flex-col p-8 space-y-4 rounded-md bg-gray-50">
                                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-honolulu_blue-300 text-gray-50">1</div>
                                <p className="text-[18px] font-semibold">
                                    <b>{t('common.cancel-consultation-stepper.step-1-title')}</b> <br/>  {t('common.cancel-consultation-stepper.step-1-text')}
                                </p>
                            </div>
                            <div data-aos-delay={`300`} data-aos="fade-up" className="flex flex-col p-8 space-y-4 rounded-md bg-gray-50">
                                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-honolulu_blue-300 text-gray-50">2</div>
                                <p className="text-[18px] font-semibold">
                                    <b>{t('common.cancel-consultation-stepper.step-2-title')}</b>  <br/> {t('common.cancel-consultation-stepper.step-2-text')}
                                </p>
                            </div>
                            <div data-aos-delay={`400`} data-aos="fade-up" className="flex flex-col p-8 space-y-4 rounded-md bg-gray-50">
                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-honolulu_blue-300 text-gray-50">3</div>
                                <p className="text-[18px] font-semibold">
                                    <b>{t('common.cancel-consultation-stepper.step-3-title')}</b> <br/>  {t('common.cancel-consultation-stepper.step-3-text')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


          </div>

          <Footer/>
    </DefaultLayout>
  )
}
