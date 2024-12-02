import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHomeData } from '../../contexts/DataContext'

import DepImg1 from '../../assets/images/depart/cardiology.jpg'
import DepImg2 from '../../assets/images/depart/dermatology.jpg'
import DepImg3 from '../../assets/images/depart/neurology.jpg'
import DepImg4 from '../../assets/images/depart/pediatrics.jpg'
import DepImg5 from '../../assets/images/depart/orthopedics.jpg'
import DepImg6 from '../../assets/images/depart/psychiatry.jpg'
import DepImg7 from '../../assets/images/depart/radiology.jpg'
import i18next from 'i18next';




const DepartamentSilder = ({setActiveSlide}) => {

  const data=useHomeData()
    
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
   
  };

  const sliderRef = useRef(null);

  const images=[
    DepImg1,
    DepImg2,
    DepImg3,
    DepImg4,
    DepImg5,
    DepImg6,
    DepImg7
  ]

  const depImages={
    cardiology:DepImg1,
    dermatology:DepImg2,
    neurology:DepImg3,
    pediatrics:DepImg4,
    orthopedics:DepImg5,
    psychiatry:DepImg6,
    radiology:DepImg7

  }

  const [items, setItems] = useState([
    { name: 'cardiology' },
    { name: 'dermatology' },
    { name: 'neurology' },
    { name: 'pediatrics' },
    { name: 'orthopedics' },
    { name: 'psychiatry' },
    { name: 'radiology' },

    /*{ name: 'oncology' },
    { name: 'gastroenterology' },
    { name: 'ophthalmology' },
    { name: 'endocrinology' },
    { name: 'gynecology' },
    { name: 'urology' },
    { name: 'pulmonology' }*/
]);


  return (
    <div  className="w-full">
        <Slider {...settings}>
        {data._specialty_categories.map((i,_i)=>{
            return (
                <div onClick={()=>{
                  window.location.href='/doctors-list/?medical_specialty='+i.id
                }}  className="w-[300px] h-[300px] p-3 relative cursor-pointer hover:scale-105 hover:rounded-lg delay-75  ease-in transition-all overflow-hidden">
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full left-0 top-0 bg-honolulu_blue-400 opacity-15"></div>
                        <img src={i.image_filename} className="w-full h-full object-cover"/>
                        <span className="text-white mt-bold z-10 absolute text-[30px] max-md:text-[20px] flex bottom-[50px] left-[50px]">{i[i18next.language+"_name"]}</span>
                    </div>
                </div>
            )
        })}
        </Slider>
    </div>
  );
};

export default DepartamentSilder;
