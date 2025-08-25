import React, { useEffect, useState } from 'react';
import { 
  Bot, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  ExternalLink, 
  Minimize2, 
  Maximize2,
  Phone,
  Video,
  AlertCircle,
  CheckCircle,
  Expand,
  Minus,
  Plus,
  RotateCcw,
  MessageCircle
} from "lucide-react";
import { useMemo } from 'react';

const MARIAMessages = ({messages=[]}) => {

 const non_shown_types = [
    'specialty_prices',
    'all_specialties', 
    'doctors_info',
    'doctor_search_result',
    'doctor_details',
    'availability_analysis',
    'no_specialty_found',
    'no_doctors_available',
    'specialty_not_found',
    'no_doctors_found',
    'emergency_alert'
  ];

// Componente para renderizar mensagens com formatação Markdown e links clicáveis
const MessageRenderer = ({ text }) => {
  const renderFormattedText = (content) => {
    if (!content) return null;
    
    // Regex para detectar URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Divide o texto em partes: texto normal e URLs
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      // Verifica se é uma URL
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-words"
            onClick={(e) => {
              e.stopPropagation();
              // Opcional: você pode adicionar tracking de clicks aqui
              console.log('Link clicado:', part);
            }}
          >
            {part}
          </a>
        );
      }
      
      // Processa texto com **negrito** dentro do texto normal
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      
      return (
        <span key={index}>
          {boldParts.map((boldPart, boldIndex) => {
            if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
              const boldText = boldPart.slice(2, -2);
              return (
                <strong key={boldIndex} className="font-semibold">
                  {boldText}
                </strong>
              );
            }
            return <span key={boldIndex}>{boldPart}</span>;
          })}
        </span>
      );
    });
  };

  return <div className="whitespace-pre-wrap break-words">{renderFormattedText(text)}</div>;
};


 // Enhanced Doctor Recommendation Component
  const DoctorRecommendation = ({ data }) => {
    // Format time with validation
    const formatTime = (time) => {
      if (!time || typeof time !== 'string') return 'Horário indisponível';
      return time.replace(':', 'h');
    };

    // Format date with robust error handling
    const formatDate = (dateString) => {
      if (!dateString) return 'Data não especificada';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('pt-MZ', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          weekday: 'short'
        });
      } catch (error) {
        console.warn('Invalid date format:', dateString, error);
        return dateString;
      }
    };

    // Map weekdays to Portuguese
    const getDayName = (dayValue) => {
      const dayMap = {
        'Monday': 'Segunda-feira',
        'Tuesday': 'Terça-feira',
        'Wednesday': 'Quarta-feira',
        'Thursday': 'Quinta-feira',
        'Friday': 'Sexta-feira',
        'Saturday': 'Sábado',
        'Sunday': 'Domingo'
      };
      return dayMap[dayValue] || dayValue || 'Dia não especificado';
    };


    // Determine slot display date
    const getSlotDisplayDate = (slot) => {
      if (!slot) return 'Data não especificada';
      if (slot.day_type === 'specific_date' && slot.date) {
        return formatDate(slot.date);
      } else if (slot.day_type === 'weekday' && slot.day_value) {
        return getDayName(slot.day_value);
      }
      return 'Data não especificada';
    };

    // Handle booking with validation
    const handleBookAppointment = (doctor, slot) => {
      if (!doctor || !slot) {
        console.error('Invalid doctor or slot data');
        return;
      }

      const params = new URLSearchParams({
        scheduled_doctor: doctor.id || '',
        scheduled_hours: slot.time_slot || '',
        scheduled_weekday: slot.date || slot.day_value || '',
        consultation_type: slot.type || 'individual',
        type_of_care: slot.is_urgent ? 'urgent' : 'normal',
        scheduled_date: slot.datetime?.split('T')?.[0] || new Date().toISOString().split('T')[0]
      });

      window.open(`/login?nextpage=add-appointments&${params}`, '_blank', 'noopener,noreferrer');
    };

    // Group and sort slots by date
    const groupSlotsByDate = useMemo(() => {
      return (slots) => {
        if (!slots || !Array.isArray(slots)) return {};
        
        const grouped = {};
        slots.forEach(slot => {
          const dateKey = slot.date || slot.day_value || 'unknown';
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(slot);
        });

        // Sort dates
        return Object.keys(grouped)
          .sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return a.localeCompare(b);
            return dateA - dateB;
          })
          .reduce((sorted, key) => {
            sorted[key] = grouped[key].sort((a, b) => {
              const timeA = a.time_slot?.split(':').join('') || '0';
              const timeB = b.time_slot?.split(':').join('') || '0';
              return timeA - timeB;
            });
            return sorted;
          }, {});
      };
    }, []);

    return (
      <div className="bg-white border-2 border-[#1c9cd3] rounded-xl shadow-lg p-6 mb-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center mb-4 p-3 bg-[#074665] rounded-lg text-white">
          <Calendar className="w-6 h-6 mr-3" aria-hidden="true" />
          <div>
            <h3 className="text-xl font-bold">Médicos Disponíveis</h3>
            <p className="text-sm text-blue-100">{data.recommended_specialty?.name || 'Especialidade não especificada'}</p>
            {data.patient_availability && (
              <p className="text-xs text-blue-200 mt-1">Baseado na sua disponibilidade</p>
            )}
          </div>
          {data.is_urgent && (
            <div className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" aria-hidden="true" />
              URGENTE
            </div>
          )}
        </div>

        {/* Doctors List */}
        <div className="space-y-6">
          {data.doctors?.length > 0 ? (
            data.doctors.map((doctor, index) => {
              const groupedSlots = groupSlotsByDate(doctor.available_slots || []);
              console.log({doctor})

              return (
                <div key={doctor.id || index} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  {/* Doctor Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                    <div className="flex items-start space-x-4">
                      {doctor.profile_picture ? (
                        <img 
                          src={doctor.profile_picture} 
                          alt={`Foto do ${doctor.name}`} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#1c9cd3]" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#095e89] rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-xl">
                            {doctor.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'MD'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{doctor.name || 'Médico'}</h4>
                        <p className="text-[#095e89] font-medium">{doctor.specialty || 'Especialidade não informada'}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                            <span className="text-sm text-gray-600 ml-1">{doctor.rating || '5.0'}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {doctor.experience ? `${doctor.experience} anos de experiência` : 'Experiência não informada'}
                          </span>
                          {doctor.teleconsultation && (
                            <div className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              <Video className="w-3 h-3 mr-1" aria-hidden="true" />
                              Teleconsulta
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                   
                  </div>

                  {/* Available Slots */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                      Horários Disponíveis ({Object.values(groupedSlots).flat().length || 0}):
                    </h5>
                    {Object.keys(groupedSlots).length > 0 ? (
                      Object.entries(groupedSlots).map(([dateKey, dateSlots]) => (
                        <div key={dateKey} className="mb-4">
                          <h6 className="font-medium text-gray-800 mb-2 capitalize">
                            {getSlotDisplayDate(dateSlots[0])}
                          </h6>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2">
                            {dateSlots.map((slot, slotIndex) => (
                              <button
                                key={slotIndex}
                                onClick={() => handleBookAppointment(doctor, slot)}
                                className="p-3 bg-blue-50 border border-[#1c9cd3] rounded-lg hover:bg-[#b7cad2] hover:text-white hover:border-[#095e89] transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-[#095e89]"
                                aria-label={`Agendar consulta com ${doctor.name} para ${getSlotDisplayDate(slot)} às ${formatTime(slot.time_slot)}`}
                              >
                                <div className="text-sm font-medium text-[#074665] group-hover:text-white">
                                  {formatTime(slot.time_slot)}
                                </div>
                                 <div className="text-xs text-gray-500 capitalize mt-1 group-hover:text-white">
                                  {slot.type || 'Consulta'}
                                </div>
                                {slot.is_urgent && (
                                  <div className="text-xs text-orange-600 mt-1 group-hover:text-white">
                                    Urgente
                                  </div>
                                )}

                                <span className="!text-[9px] text-gray-500">{(slot.datetime?.split('T')?.[0]?.split('-')?.reverse().join('/') || new Date().toISOString().split('T')[0]?.split('-')?.reverse().join('/'))}</span>
                               
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Nenhum horário disponível</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200 gap-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Preço: </span>
                      <span className="text-green-600 font-bold">
                        {data.consultation_prices?.normal ? `${data.consultation_prices.normal} MT` : 'Consultar'}
                      </span>
                      {data.is_urgent && data.consultation_prices?.urgent && (
                        <span className="text-orange-600 ml-2">
                          (Urgente: {data.consultation_prices.urgent} MT)
                        </span>
                      )}
                    </div>
                    {doctor.teleconsultation && (
                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                        📞 Teleconsulta disponível
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 italic">Nenhum médico disponível</p>
          )}
        </div>

        {/* Footer Call to Action */}
        <div className="mt-6 p-4 bg-[#1c9cd3] rounded-lg border border-[#095e89]">
          <div className="flex items-center">
            <ExternalLink className="w-5 h-5 text-white mr-2" aria-hidden="true" />
            <p className="text-sm text-white font-medium">
              Clique em qualquer horário para finalizar o agendamento
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getMessageStatusIcon = (status) => {
      switch(status) {
        case 'error': return <AlertCircle className="w-3 h-3 text-red-500" />;
        case 'sent': return <CheckCircle className="w-3 h-3 text-green-500" />;
        default: return null;
      }
};


  return (
     <>
           {messages.filter(i=>!non_shown_types.includes(i?.text?.type) && !non_shown_types.includes(i?.type)).map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start space-x-2'} animate-slideIn`}>
                      {message.sender === 'bot' && message.type !== 'doctor_recommendation' && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#074665] text-white font-bold shadow-md">
                          <Bot className={`w-6 h-6`} />
                        </div>
                      )}
                      
                      {message.type === 'doctor_recommendation' ? (
                        <DoctorRecommendation data={message.data} />
                      ) : (
                        <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm relative ${
                          message.sender === 'user' 
                            ? 'bg-[#095e89] text-white' 
                            : `bg-white border ${message.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-100'} shadow-md`
                        }`}>
                          <MessageRenderer text={message.text} />
                          <div className={`flex items-center justify-between text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{message.time}</span>
                            {message.sender === 'user' && getMessageStatusIcon(message.status)}
                          </div>
                        </div>
                      )}
                </div>
         ))}
     </>
  );
};

export default MARIAMessages;