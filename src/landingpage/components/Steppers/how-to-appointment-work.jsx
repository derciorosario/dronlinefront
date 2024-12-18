import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import LeftImage from '../../assets/images/consultation-stepper.jpg'


function DoctorJoinAppointment() {

  const { t, i18n } = useTranslation();
 
  return (
    <section class="text-gray-600 body-font">
  <div class="px-5 py-24 mx-auto flex flex-wrap md:mx-[80px]">
    <div class="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden relative">
      <div className="absolute left-0 top-0 bg-[rgba(0,0,0,0.5)] flex-col h-full w-full flex items-center justify-center">
                <h2 className="text-white text-[45px] font-bold max-md:text-[30px] max-sm:text-[20px] mb-2">{t('common.how-does-it-work')}</h2>
                <p className="text-white text-[25px] max-sm:text-[17px] opacity-70">{t('common.consultation-steps')}</p>
      </div>
      <img src={LeftImage} alt="feature" class="object-cover object-center h-full w-full"/>
    </div>
    <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">


      <div class="flex flex-col mb-10 lg:items-start items-center">
      <div className="flex items-center mb-5">

        <span className="text-[20px] max-sm:hidden font-medium flex w-[30px]">1</span>

        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-honolulu_blue-50">
             <span className=" text-honolulu_blue-300 text-[18px] sm:hidden">1</span>     
             <svg className="max-sm:hidden fill-honolulu_blue-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q14-36 44-58t68-22q38 0 68 22t44 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-200h400v-10q-42-35-93-52.5T480-280q-56 0-107 17.5T280-210v10Zm200-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z"/></svg>
        </div>
        <h2 class="text-gray-900 text-[15px] title-font font-medium ml-4">{t('common.make-appointment-stepper.step-1-title')}</h2>
          
        </div>
        <div class="flex-grow md:ml-[30px]">
          <p class="leading-relaxed text-base">{t('common.make-appointment-stepper.step-1-text')}</p>
        </div>
      </div>

      <div class="flex flex-col mb-10 lg:items-start items-center">
      <div className="flex items-center mb-5">

        <span className="text-[20px]  max-sm:hidden font-medium flex w-[30px]">2</span>

        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-honolulu_blue-50">
             <span className=" text-honolulu_blue-300 text-[18px] sm:hidden">2</span>      
             <svg className="max-sm:hidden fill-honolulu_blue-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
        </div>

        <h2 class="text-gray-900 text-[15px] title-font font-medium ml-4">{t('common.make-appointment-stepper.step-2-title')}</h2>
        

        </div>
        <div class="flex-grow md:ml-[30px]">
           <p class="leading-relaxed text-base">{t('common.make-appointment-stepper.step-2-text')}</p>
        </div>
      </div>



      <div class="flex flex-col mb-10 lg:items-start items-center">
      <div className="flex items-center mb-5">

        <span className="text-[20px]  max-sm:hidden font-medium flex w-[30px]">3</span>

        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-honolulu_blue-50">   
              <span className=" text-honolulu_blue-300 text-[18px] sm:hidden">3</span>   
              <svg className="max-sm:hidden fill-honolulu_blue-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-280h80v-40h40q17 0 28.5-11.5T600-360v-120q0-17-11.5-28.5T560-520H440v-40h160v-80h-80v-40h-80v40h-40q-17 0-28.5 11.5T360-600v120q0 17 11.5 28.5T400-440h120v40H360v80h80v40ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>
        </div>

        <h2 class="text-gray-900 text-[15px] title-font font-medium ml-4">{t('common.make-appointment-stepper.step-3-title')}</h2>

        </div>
        <div class="flex-grow md:ml-[30px]">
          <p class="leading-relaxed text-base">{t('common.make-appointment-stepper.step-3-text')}</p>
        </div>
      </div>




      <div class="flex flex-col mb-10 lg:items-start items-center">
      <div className="flex items-center mb-5">

        <span className="text-[20px]  max-sm:hidden font-medium flex w-[30px]">4</span>

        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-honolulu_blue-50">   
           <span className=" text-honolulu_blue-300 text-[18px] sm:hidden">4</span>   
           <svg className="max-sm:hidden fill-honolulu_blue-300" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M80-160v-120h80v-440q0-33 23.5-56.5T240-800h600v80H240v440h240v120H80Zm520 0q-17 0-28.5-11.5T560-200v-400q0-17 11.5-28.5T600-640h240q17 0 28.5 11.5T880-600v400q0 17-11.5 28.5T840-160H600Zm40-120h160v-280H640v280Zm0 0h160-160Z"/></svg>
        </div>

        <h2 class="text-gray-900 text-[15px] title-font font-medium ml-4">{t('common.make-appointment-stepper.step-4-title')}</h2>
         
        </div>
        <div class="flex-grow md:ml-[30px]">
          <p class="leading-relaxed text-base">{t('common.make-appointment-stepper.step-4-text')}</p>
        </div>
      </div>

    </div>
  </div>
</section>
  )
}

export default DoctorJoinAppointment