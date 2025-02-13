import React,{useEffect,useState} from 'react';
import { useHomeData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useHomeAuth } from '../../contexts/AuthContext';
import HeroSlider from '../../components/Slider/hero';
import Header from '../../components/Header';
import FindSpecialist from '../../components/Sections/FindSpecialist';
import AboutImage1 from '../../assets/images/slider/1.jpg'
import AboutImage2 from '../../assets/images/slider/2.jpg'
import AboutImage3 from '../../assets/images/slider/3.jpg'
import AboutImage4 from '../../assets/images/slider/4.jpg'
import AboutImage5 from '../../assets/images/slider/5.jpg'
import ServicesImage from '../../assets/images/services.jpg'
import DepartamentSilder from '../../components/Slider/departments';
import Footer from '../../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import DoctorList from '../../components/Doctors/list';
import DoctorJoinAppointment from '../../components/Steppers/how-to-appointment-work';
import { useAuth } from '../../../contexts/AuthContext';

function App() {

  const {setPathName} = useAuth()

  const {pathname} = useLocation()
  useEffect(()=>{
    setPathName(pathname)
  },[pathname])

  let required_data=['specialty_categories','medical_specialities','settings']


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;

    document.body.appendChild(script);
   
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(()=>{

   
    data._get(required_data) 
 

    if(localStorage.getItem('show_work_with_us_popup')){
          data._showPopUp('doctor_reuqest_form')
    }
    localStorage.removeItem('show_work_with_us_popup')

   
  },[pathname])


  useEffect(() => {
      AOS.init({
        duration: 700,
        delay: 200, 
        easing: 'ease-in-out', 
        offset: 50, 
      }); 
  }, []);

  const data=useHomeData()
  const { t, i18n } = useTranslation();
  const {user} = useHomeAuth()
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0);
  const [showFeedback,setShowFeedback]=useState(true)

  const aboutImages=[
    AboutImage3,
    AboutImage1,
    AboutImage2,
    AboutImage4,
    AboutImage5
  ]


  console.log(data.app_settings)

  const [selectedAboutImgIndex,setSelectedAboutImgIndex]=useState(0)
  const [benefitItems,setBenefitItems]=useState([])
  const [serviceItems,setServiceItems]=useState([])
  const [doctorItems,setDoctorItems]=useState([])

  function serviceImages(_i,size,fill){
    return (
        <>
           {_i==0 && <svg xmlns="http://www.w3.org/2000/svg"  height={size} viewBox="0 -960 960 960"  fill={fill}><path d="M320-400h240q17 0 28.5-11.5T600-440v-80l80 80v-240l-80 80v-80q0-17-11.5-28.5T560-720H320q-17 0-28.5 11.5T280-680v240q0 17 11.5 28.5T320-400ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>}
           {_i==1 &&  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960"  fill={fill}><path d="M200-160v-80h64l79-263q8-26 29.5-41.5T420-560h120q26 0 47.5 15.5T617-503l79 263h64v80H200Zm148-80h264l-72-240H420l-72 240Zm92-400v-200h80v200h-80Zm238 99-57-57 142-141 56 56-141 142Zm42 181v-80h200v80H720ZM282-541 141-683l56-56 142 141-57 57ZM40-360v-80h200v80H40Zm440 120Z"/></svg>}
           {_i==2 &&  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960"  fill={fill}><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>}
        </>
    )
  }

  useEffect(()=>{
 
    setBenefitItems([
      t('common.platform-benefit-1'),
      t('common.platform-benefit-2'),
      t('common.platform-benefit-3'),
      t('common.platform-benefit-4'),
      t('common.platform-benefit-5'),
      t('common.platform-benefit-6'),
      t('common.platform-benefit-7'),
      t('common.platform-benefit-8')
    ])

    setServiceItems([
      {name:t('common.service-1'),desc:t('common.service-1-desc')},
     // {name:t('common.service-2'),desc:t('common.service-2-desc')},
      {name:t('common.service-3'),desc:t('common.service-3-desc')},
      {name:t('common.service-4'),desc:t('common.service-4-desc')}
    ])


  },[i18n.language])


 
  return (
   
    <>


   <DefaultLayout>
                   <div className="">

                   <div className="w-full h-[100vh] md:min-h-[500px] max-md:h-[70vh] bg-blue-300 relative">
                       <div className="absolute w-full top-0 left-0 z-20"> 
                           <Header.BottomBar/>
                       </div>
                      
                       <HeroSlider activeSlide={activeSlide}/>

                       <div className="absolute bottom-[100px] w-full flex justify-center items-center hidden">
                           {[1,2,3].map(()=>(
                              <span className="w-3 mx-2 h-3 rounded-full border-2 shadow-sm"></span>
                           ))}
                       </div>
                       
                   </div>

                   <FindSpecialist/>

                  <div className="w-full flex min-h-[400px] mt-[50px] relative mb-[70px] px-10 overflow-hidden">
          
                        <div className="relative max-lg:absolute  max-lg:h-full left-0 top-0 rounded-[1rem] overflow-hidden">
                          <div className="bg-[rgba(0,0,0,0.05)]  max-lg:flex absolute left-0 top-0 w-full h-full"></div>
                          <img src={ServicesImage} className="h-full   left-0 top-0  object-cover max-lg:blur"/>
                        </div>

                        <div className="absolute max-lg:relative right-0 top-0 min-h-full w-full py-[100px] md:px-[80px]   max-md:pr-0">
                                  <p data-aos="fade-left" className="mb-3 text-[20px] text-white max-w-[300px]">{t('messages.services-sub')}</p>      
                                  <h2 data-aos="fade-left" className="mt-bold uppercase text-white mb-10 text-[25px] mb-10">{t('messages.services-title')}</h2>


                                  <div  className="flex flex-wrap gap-x-2 justify-between w-full">
                                    

                                      <div>
                                          {benefitItems.filter((_,_i)=>_i<=3).map(i=>(
                                            <div data-aos="fade-left" className="flex items-center mb-3">
                                                <span className="w-[10px]  h-[10px] bg-white flex mr-3"></span>
                                                <span className="flex-1 text-white">{i}</span>
                                              </div>
                                          ))}
                                      </div>

                                      <div>
                                          {benefitItems.filter((_,_i)=>_i > 3).map(i=>(
                                            <div data-aos="fade-left" className="flex items-center mb-3">
                                                <span className="w-[10px] h-[10px] bg-white flex mr-3"></span>
                                                <span className="flex-1 text-white">{i}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                      <button data-aos="fade-top" onClick={()=>{

                                          navigate('/?contact')
                                          let c=document.getElementById('contact');
                                          c.scrollIntoView();

                                      }} className="px-5 py-4 mt-8 whitespace-nowrap bg-honolulu_blue-300 text-white table uppercase text-[14px] border-honolulu_blue-300 border rounded-[0.3rem]">{t('common.contact-us')}</button>
                                  
                                
                        </div>
                  </div>

                  
               <div className={`max-xl:px-[20px] px-[40px] max-lg:px-[20px] max-w-[1593px] mx-auto`}>
                  <h2 data-aos="fade-up" className="mt-bold text-center uppercase text-honolulu_blue-400 text-[25px] mb-10">{t('common.our-specialists')}</h2>               
                 
                  <DoctorList loaded={data._loaded.includes('get_all_doctors')} center={true} animate={true} items={data._get_all_doctors?.data || []} max={5}/> 
        
                  <div className="flex justify-center mb-[140px]">
                    <button onClick={()=>{
                      navigate('/doctors-list')
                    }} className="px-5 py-4 whitespace-nowrap flex items-center bg-honolulu_blue-400 hover:bg-honolulu_blue-300 text-white  uppercase text-[14px] border-honolulu_blue-300 border rounded-[0.3rem]">
                    {t('common.find-more')} 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                    </button>
                                  
                    </div>
               </div>

               
              





                   <div id="about" className="w-full flex justify-center pt-10">

                     
                         <div className="max-w-[1423px] mx-auto flex gap-4 max-xl:w-full px-[100px] max-lg:px-[20px] max-md:flex-col">
                                <div className="flex-1">
                                    <h2 className="mt-bold uppercase text-honolulu_blue-400 text-[33px] mb-3">{t('common.who-we-are')}</h2>
                                    <p className="mb-3 text-[20px] text-honolulu_blue-300">{t('titles.about-us')}</p>
                                    <p className="text-gray-600">{t('messages.about-us')}</p>
                                    <div className="flex items-center mt-8 max-lg:flex-col">
                                       <button onClick={()=>{
                                        navigate('/?contact')
                                        let c=document.getElementById('contact');
                                        c.scrollIntoView();
                                       }} className="px-5 max-lg:mb-4 max-lg:w-full py-4 whitespace-nowrap bg-honolulu_blue-300 text-white table uppercase text-[14px] border-honolulu_blue-300 border rounded-[0.3rem]">{t('common.contact-us')}</button>
                                       <div className="flex flex-col ml-3">
                                          <p  className="text-[13px] uppercase text-honolulu_blue-400 mt-bold">{t('common.central-info')}</p>
                                          <span className="text-[25px] font-medium text-honolulu_blue-500">+258 861024024</span>
                                       </div>
                                    </div>
                                </div>
                                <div className="w-[500px] max-lg:w-[400px] max-md:w-full">
                                      <div className="w-full">
                                         <img className="h-full w-full object-cover" src={aboutImages[selectedAboutImgIndex]}/>
                                      </div>

                                      <div className="w-full flex">
                                          {aboutImages.map((i,_i)=>(
                                              <div onClick={()=>setSelectedAboutImgIndex(_i)} className={`border-2 h-[80px] max-sm:h-[50px] cursor-pointer ${selectedAboutImgIndex == _i ? 'border-honolulu_blue-400':'border-transparent'}`}>
                                                <img className="w-full h-full object-cover" src={i}/>
                                              </div>
                                          ))}
                                      </div>

                                </div>
                         </div>

                        
                   </div>



                   <div id="services" className={`pt-[100px] px-[100px] max-md:px-[20px] ${data._specialty_categories.length==0 ? 'mb-20':''}`}>
                           <div className="max-w-[1423px] max-xl:flex-wrap mx-auto flex gap-10">
                                   {serviceItems.map((i,_i)=>(
                                      <div className="max-xl:w-[45%]  max-md:w-full" data-aos="fade-up" data-aos-delay={`${(_i+1) * 200}`}>
                                          <div>{serviceImages(_i,'60px','#43addb')}</div>
                                          <span className="text-[17px] mt-medium text-honolulu_blue-300 mt-3 flex mb-4 uppercase">{i.name}</span>
                                        <p className="text-[15px] text-honolulu_blue-500">{i.desc}</p>
                                      </div>
                                   ))}
                           </div>
                   </div>


                   <DoctorJoinAppointment/>


                   <div id="departments" className={`my-[100px] ${data._specialty_categories.length==0 ? ' absolute opacity-0 pointer-events-none':''} max-lg:px-[20px] px-[100px]`}>
                             
                             <div className="max-w-[1423px] mx-auto">
                                  <h2 className="mt-bold uppercase text-honolulu_blue-400 text-[25px] mb-10 text-center">{t('menu.departments')}</h2>
                                   <DepartamentSilder/>
                             </div>


                  </div>


                {/**  <div className="my-[100px]">
                     <div class="elfsight-app-ccccb092-5472-4e1f-b77b-cec83c1b39db" data-elfsight-app-lazy></div>
                  </div> */}


                   <Footer serviceItems={serviceItems}/>

                   <div onClick={()=>{
                    data._scrollToSection('top')
                   }} style={{zIndex:48}} className={`w-[60px] h-[60px] max-md:h-[45px] max-md:w-[45px] cursor-pointer  ${data.scrollY < 100 ? 'opacity-0 scale-50':''} ease-in transition-all delay-100 fixed  right-4 bottom-4 rounded-[0.3rem] flex items-center justify-center bg-honolulu_blue-400  shadow-sm`}>
                       <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"  fill="#fff"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>
                   </div>

                  {showFeedback && <div id="feedback"  style={{transform:'rotate(90deg) translateY(-100%)'}} className={`top-[50%] _feedback hover:bg-honolulu_blue-500  items-center   right-0 text-white flex cursor-pointer ${data.scrollY < 1000 ? 'opacity-0 translate-y-[-300%]':''} ease-in transition-all delay-100 fixed z-50  rounded-[0.3rem]  items-center  bg-honolulu_blue-400  shadow-sm`}>       
                     
                       <div onClick={()=>{
                            setShowFeedback(false)
                        }} className="rounded-[0.2rem] translate-x-[10px] p-[1px] bg-[rgba(255,255,255,0.2)]  mr-2">
                         <svg className="opacity-65 hover:opacity-100" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960"  fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                       </div>

                       <span className="px-2 py-2" onClick={()=>{
                            data._showPopUp('feedback')
                       }}>Feedback</span>


                   </div>}


                 

              </div>
         </DefaultLayout>
        </>
  );
}

export default App;
