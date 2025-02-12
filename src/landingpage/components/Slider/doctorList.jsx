import React, {  useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHomeData } from '../../contexts/DataContext';

import DoctorList from '../Doctors/list';

const DoctorSlider = ({}) => {

  const data=useHomeData()


  console.log(data._get_all_doctors)
    
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

  return (
    <Slider {...settings} ref={sliderRef}>
         <DoctorList animate={true} items={data._get_all_doctors?.data || []}/>
    </Slider>
  );
};

export default DoctorSlider;
