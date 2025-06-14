import React, { useEffect, useState } from 'react';
import i18next, { t } from 'i18next';
import SelectDoctorAvailability from '../../../components/Cards/selectDoctorAvailability';
import Loader from '../../components/Loaders/loader';
import { useHomeData } from '../../contexts/DataContext';
import { useData } from '../../../contexts/DataContext';

import dayjs from 'dayjs';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultLayout from '../../layout/DefaultLayout';

function DoctorProfile() {
  const { id } = useParams();
  const data = useData();
  const homeData = useHomeData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(()=>{
        data._scrollToSection('top','instant')
 },[])
  
  const [doctor, setDoctor] = useState(null);
  const [requestedDoctor,setRequestedDoctor]=useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeekDays, setSelectedWeekDays] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [itemsToShowInfull, setItemsToShowInfull] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  
  // Weekday names in both languages
  const weekdayNames = {
    en: {
      Sunday: 'Sunday',
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday'
    },
    pt: {
      Sunday: 'Domingo',
      Monday: 'Segunda',
      Tuesday: 'Terça',
      Wednesday: 'Quarta',
      Thursday: 'Quinta',
      Friday: 'Sexta',
      Saturday: 'Sábado'
    }
  };

  // Convert weekday names in availability data to current language
  const translateWeekdayAvailability = (availability) => {
    if (!availability || !availability.weekday) return availability;
    
    const translated = { ...availability };
    translated.weekday = {};
    
    const currentLang = i18next.language;
    
    for (const [enWeekday, slots] of Object.entries(availability.weekday)) {
      const translatedWeekday = weekdayNames[currentLang][enWeekday] || enWeekday;
      translated.weekday[translatedWeekday] = slots;
    }
    
    return translated;
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);

        const response = await data.makeRequest({
          method: 'get',
          url: `api/doctors`,
          params:{doctor_id:id || '-'},
          withToken: true,
          error: t('common.failed-to-load-doctor')
        }, 0);

        setRequestedDoctor(response?.data?.[0])
        
        if (response && response?.data?.[0]) {
          const translatedDoctor = {
            ...response && response?.data?.[0],
            availability: translateWeekdayAvailability(response && response?.data?.[0].availability),
            urgent_availability: translateWeekdayAvailability(response && response?.data?.[0].urgent_availability)
          };
          setDoctor(translatedDoctor);
        }else{
          navigate('/')
        }
      } catch (err) {

        console.log(err)
        setError(err.message || t('common.failed-to-load-doctor'));
      } finally {
        setLoading(false);
      }
    };

    data._scrollToSection('top','instant')
    fetchDoctor();


  }, [id, i18next.language]);

   let required_data=['specialty_categories']
   useEffect(()=>{
         if(!user) return
          data._get(required_data) 
   },[user,pathname])

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  function getAvailableHours(item, type) {
    if (!item?.id) return [];
    
    let date = selectedDates[item.id] || dayjs().format('YYYY-MM-DD');
    const weekday = weekdayNames[i18next.language][Object.keys(weekdayNames.en)[new Date(date).getDay()]];

    const availability = type === "normal" ? item.availability : item.urgent_availability;
    
    if (availability?.unavailable_specific_date?.[date]) {
      return [];
    }
    if (availability?.specific_date?.[date]) {
      return availability.specific_date[date];
    }
    return availability?.weekday?.[weekday] || [];
  }

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="w-full pb-[90px] max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        {/* Image skeleton */}
        <div className="flex-1">
          <div className="h-[380px] w-full bg-gray-200 rounded mb-4"></div>
          {/* Stats skeleton */}
          <div className="flex gap-3 bg-white py-4 px-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>
                <div className="h-4 w-16 bg-gray-300 mt-2"></div>
                <div className="h-4 w-8 bg-gray-300 mt-1"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="flex-1">
          <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/6 bg-gray-200 rounded"></div>
          </div>
          {/* Availability skeleton */}
          <div className="mt-8">
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 w-12 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getConsultationType = (time, careType) => {
    const slots = getAvailableHours(doctor, careType);
    const slot = slots.find(s => s.time_slot == time);
    return slot?.type || 'individual';
  };

  const handleTimeSlotClick = (time, type) => {
    const consultationType = getConsultationType(time, type);
    const date = selectedDates[doctor.id] || dayjs().format('YYYY-MM-DD');
    const weekday = weekdayNames[i18next.language][Object.keys(weekdayNames.en)[new Date(date).getDay()]];

    if (user?.role == "patient") {
      homeData.setIsLoading(true);
      window.location.href = (`/add-appointments&scheduled_doctor=${doctor.id}&type_of_care=${type}&consultation_type=${consultationType}&scheduled_hours=${time}&scheduled_date=${date}&scheduled_weekday=${weekday}`);
      return;
    }

    data._closeAllPopUps();
    homeData._closeAllPopUps();
    data.setPaymentInfo({ doctor });
    data.setSelectedDoctorToSchedule({});
    homeData.setSelectedDoctorToSchedule({});
    homeData.setIsLoading(true);
    window.location.href = (`/login?nextpage=add-appointments?scheduled_doctor=${doctor.id}&type_of_care=${type}&consultation_type=${consultationType}&scheduled_hours=${time}&scheduled_date=${date}&scheduled_weekday=${weekday}&canceled_appointment_id=${data.appointmentcancelationData?.consultation?.id || ''}`);
    data.setAppointmentcancelationData({});
  };

  const renderAvailability = () => {
    if (!doctor) return null;

    const selectedDate = selectedDates[doctor.id] || dayjs().format('YYYY-MM-DD');
    const selectedWeekDay = selectedWeekDays[doctor.id] || weekdayNames[i18next.language][Object.keys(weekdayNames.en)[new Date(selectedDate).getDay()]];
    const normalHours = getAvailableHours(doctor, "normal");
    const urgentHours = getAvailableHours(doctor, "urgent");

    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-honolulu_blue-500 text-lg font-semibold">
            {t('common.availability')}
          </h3>
          <button
            onClick={() => {
                 homeData.setSelectedDoctorToSchedule(requestedDoctor);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-honolulu_blue-300 hover:bg-honolulu_blue-400 text-white rounded-full text-sm"
          >
            {t('common.calendar')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {t('common.date')}:
          </label>
          <input
            type="date"
            min={dayjs().format('YYYY-MM-DD')}
            value={selectedDate}
            onChange={(e) => {
              const date = e.target.value;
              setSelectedDates({ [doctor.id]: date });
              setSelectedWeekDays({ [doctor.id]: weekdayNames[i18next.language][Object.keys(weekdayNames.en)[new Date(date).getDay()]] });
            }}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.values(weekdayNames[i18next.language]).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedWeekDays({ [doctor.id]: day })}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedWeekDay === day 
                  ? 'bg-honolulu_blue-300 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <h4 className="text-gray-700 mb-2">{t('common.available-times')}:</h4>
          {normalHours.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                <span className="text-sm font-medium">{t('common.normal')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {normalHours.map((slot) => (
                  <button
                    key={slot.time_slot}
                    onClick={() => handleTimeSlotClick(slot.time_slot, "normal")}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                  >
                    {slot.time_slot} {slot.type === 'group' ? `(${t('common.in-group')})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {urgentHours.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                <span className="text-sm font-medium">{t('common.urgent')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {urgentHours.map((slot) => (
                  <button
                    key={slot.time_slot}
                    onClick={() => handleTimeSlotClick(slot.time_slot, "urgent")}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200"
                  >
                    {slot.time_slot} {slot.type === 'group' ? `(${t('common.in-group')})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {normalHours.length === 0 && urgentHours.length === 0 && (
            <div className="text-gray-500 text-sm">
              {t('common.no-availability-for-this-date')}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="w-full pb-[90px] max-w-4xl mx-auto p-4 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-full pb-[90px] max-w-4xl mx-auto p-4 text-center">
        <div>{t('common.doctor-not-found')}</div>
      </div>
    );
  }

  return (
     <DefaultLayout>
          <div className="w-full pb-[90px] max-w-4xl mx-auto p-4 mt-5">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Doctor Image */}
        <div className="flex-1">
          <div className={`flex-1 ${!loadedImages[doctor.id] ? 'animate-pulse' : ''} bg-honolulu_blue-50 rounded-[0.3rem] overflow-hidden shadow mb-4`}>
            {doctor.profile_picture_filename ? (
              <img
                onLoad={() => handleImageLoad(doctor.id)}
                src={doctor.profile_picture_filename}
                className={`h-[380px] w-full object-cover object-top transition-opacity duration-500 ${
                  loadedImages[doctor.id] ? "opacity-100" : "opacity-0"
                }`}
                alt={doctor.name}
              />
            ) : (
              <div className="h-[380px] w-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#5f6368">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66 47 113t113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 bg-white py-4 px-1">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66 47 113t113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.patients')}</span>
              <span className="mt-bold">{data.getFakeConsultationCount(2,11)[doctor.id] + doctor.unique_patients_count + doctor.unique_dependents_count}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.rating')}</span>
              <span className="mt-bold">{data.getFakeConsultationCount(0,5)[doctor.id]}</span>
            </div>

            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.years')}</span>
              <span className="mt-bold">{doctor.years_of_experience}</span>
            </div>

            <div className="flex flex-col items-center w-full _reviews">
              <div className={`flex items-center justify-center w-[40px] ${doctor.reviews.length == 0 ? 'bg-gray-200' : 'bg-honolulu_blue-400 cursor-pointer hover:bg-honolulu_blue-500'} h-[40px] rounded-full`}>
                <svg className={`${doctor.reviews.length == 0 ? 'fill-[#5f6368]' : 'fill-white'}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m363-390 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
                </svg>
              </div>
              <span className="text-[13px]">{t('common.reviews')}</span>
              <span className="mt-bold">{data.getFakeConsultationCount(0,4)[doctor.id] + doctor.reviews.length}</span>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex flex-col w-full">
            <span className="text-honolulu_blue-300 text-[17px] uppercase mt-bold">{doctor.name}</span>
            <span className="text-honolulu_blue-500 mt-bold text-[20px] uppercase">
              {homeData._specialty_categories.find(i => i.id == doctor.medical_specialty)?.[i18next.language + "_name"]}
             </span>
            <p className="text-justify mt-5 text-gray-500 mb-4">
              {data.text_l(doctor[`${i18next.language}_short_biography`], itemsToShowInfull.includes(doctor.id) ? 1000 : 400)}
              {doctor[`${i18next.language}_short_biography`]?.length > 400 && (
                <span 
                  onClick={() => {
                    if (itemsToShowInfull.includes(doctor.id)) {
                      setItemsToShowInfull(itemsToShowInfull.filter(f => f !== doctor.id));
                    } else {
                      setItemsToShowInfull([...itemsToShowInfull, doctor.id]);
                    }
                  }} 
                  className="text-black ml-2 cursor-pointer opacity-65 text-[13px]"
                >
                  {itemsToShowInfull.includes(doctor.id) ? t('common.show-less') : t('common.show-more')}
                </span>
              )}
            </p>
          </div>

          {/* Availability Section */}
          {renderAvailability()}
        </div>
      </div>

    
    </div>
     </DefaultLayout>
  );
}

export default DoctorProfile;