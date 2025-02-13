import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHomeData } from '../../contexts/DataContext';
import Img1 from '../../assets/images/slider/1.jpg'
import Img2 from '../../assets/images/slider/2.jpg'
import Img3 from '../../assets/images/slider/3.jpg'

import i18n from '../../i18n';
import { t } from 'i18next';

const HeroSlider = ({setActiveSlide}) => {

  const data=useHomeData()
    
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    fade:true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: 'linear',
   // beforeChange: (current, next) => setActiveSlide(next),
  };

  const sliderRef = useRef(null);

  const [items,setItems]=useState([])

  useEffect(()=>{

    setItems([
        {title:t('titles.slide-1-title'),subtitle:t('titles.slide-1-sub-title'),marked_text:t('titles.slide-1-marked-text'),img:Img1},
        {title:t('titles.slide-2-title'),subtitle:t('titles.slide-2-sub-title'),marked_text:t('titles.slide-2-marked-text'),img:Img2},
        {title:t('titles.slide-3-title'),subtitle:t('titles.slide-3-sub-title'),marked_text:t('titles.slide-3-marked-text'),img:Img3},
    ])

  },[i18n.language])


  return (
    <Slider {...settings} ref={sliderRef}>
      {items.map((i,_i)=>{
          let parts=i.title.split(i.marked_text)
          return (
            <div  className="h-[100vh] max-md:h-[70vh] md:min-h-[500px] home-slider bg-gray-600">
                <div  className="w-full h-full bg-center bg-no-repeat bg-cover relative">
                    <img src={i.img}  className="h-full w-full object-cover"/>
                    <div className="absolute w-full bg-[rgba(0,0,0,0.3)] left-0 top-0 h-full">

                    </div>
                    <div className="absolute w-full top-0 left-0 flex items-center max-md:px-[20px] px-[100px] h-full">
                                 <div>
                                        <h2 data-aos="fade-up" className="text-[50px] max-md:text-[27px]  text-white mt-light max-w-[500px]">
                                             {parts[0]}
                                               <span className="mt-bold">{i.marked_text}</span>
                                             {parts[1]}
                                        </h2>
                                 </div>
                    </div>
                </div>
             </div>
          )
      })}
    </Slider>
  );
};


export default HeroSlider;
