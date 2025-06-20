import React from 'react'
import i18next, { t } from 'i18next'
import { useHomeData } from '../../contexts/DataContext'
import { useState } from 'react'
import { useHomeAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'



function DoctorList({max,items,center,loaded}) {
  const [selectedWeekDays,setSelectedWeekDays] = useState({})
  const [selectedDates,setSelectedDates] = useState({})
  const navigate=useNavigate()
  const {handleSelectDoctorAvailability,selectedDoctors,setSelectedDoctors} = useHomeData()
  const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const {APP_FRONDEND}=useHomeAuth()

  const [itemsToShowInfull,setItemsToShowInfull]=useState([])

  const [loadedImages, setLoadedImages] = useState({});
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };


  

  const data=useHomeData()

  function getAvailableHours(item,type){

  
    let date=selectedDates[item.id] || new Date().toISOString().split('T')[0]


    if(type=="normal"){
        return (item.availability.unavailable_specific_date[date] ? [] : item.availability.specific_date[date] ? item.availability.specific_date[date] : item.urgent_availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.availability.weekday[weeks[new Date().getDay()]] || []) : (item.availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m))
    }else{
        return (item.urgent_availability.unavailable_specific_date[date] ? [] : item.urgent_availability.specific_date[date] ? item.urgent_availability.specific_date[date] : item.availability.specific_date[date] ? [] : !selectedWeekDays[item.id] ? (item.urgent_availability.weekday[weeks[new Date().getDay()]] || []) : (item.urgent_availability.weekday[selectedWeekDays[item.id]] || [])).sort((a, b) => a.split(':').reduce((h, m) => +h * 60 + +m) - b.split(':').reduce((h, m) => +h * 60 + +m))
    }
}



const handleClick = (item) => { 
    if (!loaded) return;

    const nameParts = item.name?.toLowerCase()
        .normalize("NFD")                  
        .replace(/[\u0300-\u036f]/g, '')  
        .split(' ')
        .filter(Boolean);

    let slug = '';
    if (nameParts.length === 1) {
        slug = nameParts[0];
    } else if (nameParts.length > 1) {
        slug = `${nameParts[0]}-${nameParts[nameParts.length - 1]}`;
    }

    navigate(`/doctors/${item.id}/${slug}`);
};



  return (
    <div className="w-full pb-[90px]">
    <div className={`flex mx-auto gap-y-20 gap-x-5 flex-wrap ${center ? 'justify-center' : ''}`}>
  {(loaded ? items.filter((i, _i) => _i <= max || !max) : [{}, {}, {}]).map((item, _item) => (
    <div className={`flex w-[340px] max-md:w-[46%] max-sm:w-full gap-2 flex-col`} key={_item}>
      <div>
        
        <div
      onClick={()=>handleClick(item)}
      className={` transform transition duration-300 ${loaded ? 'hover:scale-[1.02] cursor-pointer active:scale-[0.98]':''} flex-1 ${
        !loadedImages[_item] ? 'animate-pulse' : ''
      } bg-honolulu_blue-50 rounded-[0.3rem] overflow-hidden shadow mb-4`}
    >
      <img
        onLoad={() => handleImageLoad(_item)}
        src={item.profile_picture_filename}
        alt="Profile"
        className={`h-[380px] max-sm:h-[430px] w-full object-cover object-top transition-opacity duration-500 ${
          loadedImages[_item] ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>

        {loaded && (
          <div className="flex gap-3 bg-white py-4 px-1">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66 47 113t113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.patients')}</span>
              <span className="mt-bold">{data.getFakeConsultationCount(2,11)[item.id] + item.unique_patients_count + item.unique_dependents_count}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.rating')}</span>
              <span className="mt-bold">{data.getFakeConsultationCount(0,5)[item.id]}{/*item.average_rating.toString().slice(0,3)*/}</span>
            </div>

            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.years')}</span>
              <span className="mt-bold">{item.years_of_experience}</span>
            </div>

            <div onClick={() => { if(item.reviews.length) data._showPopUp('reviews', item) }} className="flex flex-col items-center w-full _reviews">
              <div className={`flex items-center justify-center w-[40px] ${item.reviews.length == 0 ? 'bg-gray-200' : 'bg-honolulu_blue-400 cursor-pointer hover:bg-honolulu_blue-500'} h-[40px] rounded-full`}>
                <svg className={`${item.reviews.length == 0 ? 'fill-[#5f6368]' : 'fill-white'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m363-390 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.reviews')}</span>
              <span className="mt-bold">{data.getFakeConsultationCount(0,4)[item.id] + item.reviews.length}</span>
            </div>
          </div>
        )}
      </div>

      {!loaded && (
        <div className='w-full flex mt-2 justify-between items-start animate-pulse'>
          <div className="block">
            <h3 className='h-4 bg-gray-300 rounded-full w-48 mb-4'></h3>
            <p className='h-3 bg-gray-300 rounded-full w-32 mb-2.5'></p>
          </div>
          <span className="h-3 bg-gray-300 rounded-full w-16"></span>
        </div>
      )}

      {loaded && (
        <div className="flex flex-col w-full max-xl:w-full">
          <span className="text-honolulu_blue-300 text-[17px] uppercase mt-bold">{item.name}</span>
          <span className="text-honolulu_blue-500 mt-bold text-[20px] uppercase">{data._specialty_categories.filter(i => i.id == item.medical_specialty)[0]?.[i18next.language + "_name"]}</span>
          <p className="text-justify mt-5 text-gray-500 mb-4">
            {data.text_l(item[`${i18next.language}_short_biography`],itemsToShowInfull.includes(item.id) ? 1000 : 350)}
            {item[`${i18next.language}_short_biography`]?.length > 350 && <span onClick={()=>{
                 if(itemsToShowInfull.includes(item.id)){
                     setItemsToShowInfull(itemsToShowInfull.filter(f=>f!=item.id))
                 }else{
                     setItemsToShowInfull([...itemsToShowInfull,item.id])
                 }
            }} className="text-black ml-2 cursor-pointer opacity-65 text-[13px]">{itemsToShowInfull.includes(item.id) ? t('common.show-less') : t('common.show-more')}</span>}
          </p>
        </div>
      )}


       {loaded && <div className="mt-auto flex items-center">


            <button
              onClick={() => {
                   data.setSelectedDoctorToSchedule(item);
              }}
              className="px-5 max-md:w-full py-3 whitespace-nowrap bg-honolulu_blue-300 hover:bg-honolulu_blue-300 text-white table uppercase text-[14px] border-honolulu_blue-300 border rounded-full"
            >
              {t('common.book')}


            </button>
       </div>}


    </div>
  ))}
</div>
    </div>
  )
}

export default DoctorList