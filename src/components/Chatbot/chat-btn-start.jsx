import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function NurseChat({hide}) {
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFAQ, setShowFAQ] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  const { socket } = useData(); 
  const {pathname} = useLocation()
  

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);



  
 
 
  useEffect(() => {
    if(hide) return

    const initPopup = () => {
      const popupShown = localStorage.getItem('nurseChatPopupShown');
      
      if (!popupShown) {
        const timer = setTimeout(() => {
          setIsIntroOpen(true);
          localStorage.setItem('nurseChatPopupShown', Date.now().toString());
        }, 5000);
        
        return () => clearTimeout(timer);
      } else {
        const lastShownTime = parseInt(popupShown);
        const twoDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const currentTime = Date.now();
        
        if (currentTime - lastShownTime > twoDaysInMs) {
          const timer = setTimeout(() => {
            setIsIntroOpen(true);
            localStorage.setItem('nurseChatPopupShown', Date.now().toString());
          }, 5000);
          
          return () => clearTimeout(timer);
        }
      }
    };

    if (document.readyState !== 'loading') {
      initPopup();
    } else {
      document.addEventListener('DOMContentLoaded', initPopup);
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initPopup);
    };
  }, [hide]);



  const faqQuestions = [
  // Orientação médica
  "Como devo proceder se estiver com febre alta?",
  "Quais são os horários de atendimento dos especialistas?",
  "Preciso de uma consulta com um neurologista",
  "Quais são os sintomas da malária?",
  "Como posso marcar uma consulta presencial?",
  "Quais são os preços das consultas?",
  //  "Como posso atualizar meus dados na plataforma?"

];

  // Optimized scroll to bottom with smooth behavior
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Connection status monitoring
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setConnectionStatus('connected');
    const handleDisconnect = () => setConnectionStatus('disconnected');
    const handleReconnect = () => setConnectionStatus('reconnecting');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnecting', handleReconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnecting', handleReconnect);
    };
  }, [socket]);

  // Handle receiving messages with improved error handling
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setIsBotTyping(false);
      
      if (isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
      
      if (data.type === 'doctor_recommendation') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'doctor_recommendation',
          data: data,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date()
        }]);
      } else {
        addMessage(data.message || data, 'bot');
      }
    };

    const handleTyping = (isTyping) => {
      setIsBotTyping(isTyping);
    };

    const handleError = (error) => {
      console.error('Chat error:', error);
      addMessage("Desculpe, ocorreu um erro. Por favor, tente novamente.", 'bot', 'error');
      setIsBotTyping(false);
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('bot-typing', handleTyping);
    socket.on('chat-error', handleError);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('bot-typing', handleTyping);
      socket.off('chat-error', handleError);
    };
  }, [socket, isMinimized]);

  // Enhanced message addition with message status
  const addMessage = useCallback((text, sender, status = 'sent') => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      sender,
      status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Start a new chat
  const startNewChat = useCallback(() => {
    // Save current conversation to history if it exists
    if (messages.length > 0) {
      const conversation = {
        id: conversationId || Date.now(),
        messages: [...messages],
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, conversation]);
    }
    
    // Reset chat state
    setMessages([]);
    setConversationId(null);
    setIsBotTyping(false);
    
    if (!socket) {
      addMessage("Erro de conexão. Por favor, recarregue a página.", 'bot', 'error');
      return;
    }

    socket.emit('start-chat', { patientId: user?.id || null }, (response) => {
      if (response?.status === 'success') {
        setConversationId(response.conversationId);
      } else {
        addMessage("Erro ao iniciar conversa. Tente novamente.", 'bot', 'error');
      }
    });
  }, [socket, user?.id, addMessage, messages, conversationId]);

  // Start chat with loading state
  const startChat = useCallback(() => {
    setIsIntroOpen(false);
    setIsChatOpen(true);
    setIsMinimized(false);
    setIsExpanded(false);
    setUnreadCount(0);
    setShowFAQ(false);
    
    startNewChat();
  }, [startNewChat]);

  // Enhanced send message with validation
  const sendMessage = useCallback(() => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || !socket || connectionStatus !== 'connected') return;
    
    addMessage(trimmedMessage, 'user');
    
    socket.emit('send-message', {
      message: trimmedMessage,
      conversationId,
      timestamp: new Date().toISOString()
    });
    
    setInputMessage("");
    setIsBotTyping(true);
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [inputMessage, socket, connectionStatus, conversationId, addMessage]);

  // Handle FAQ question click
  const handleFAQClick = useCallback((question) => {
    addMessage(question, 'user');
    
    if (socket && connectionStatus === 'connected') {
      socket.emit('send-message', {
        message: question,
        conversationId,
        timestamp: new Date().toISOString()
      });
      
      setIsBotTyping(true);
    }
    
    setInputMessage("");
    setShowFAQ(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [socket, connectionStatus, conversationId, addMessage]);

  // Handle Enter key press with Shift+Enter for new lines
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Toggle chat minimization
  const toggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setUnreadCount(0);
    }
  }, [isMinimized]);

  // Toggle chat expansion
  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
    setIsMinimized(false);
  }, [isExpanded]);

  // Toggle FAQ visibility
  const toggleFAQ = useCallback(() => {
    setShowFAQ(prev => !prev);
  }, []);

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
        scheduled_date:slot.datetime?.split('T')?.[0] || new Date().split('T')[0]
      });

      window.open(`/add-appointments?${params}`, '_blank', 'noopener,noreferrer');
      
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
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" aria-hidden="true" />
                      <span>{doctor.location || 'Localização não informada'}</span>
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

                                <span className="!text-[9px] text-gray-500">{(slot.datetime?.split('T')?.[0]?.split('-')?.reverse().join('/') || new Date().split('T')[0]?.split('-')?.reverse().join('/'))}</span>
                               
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

  // Enhanced Messages component with better performance
  const Messages = (({ messages }) => {
    const getMessageStatusIcon = (status) => {
      switch(status) {
        case 'error': return <AlertCircle className="w-3 h-3 text-red-500" />;
        case 'sent': return <CheckCircle className="w-3 h-3 text-green-500" />;
        default: return null;
      }
    };

    return (
      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4 scroll-smooth">
        {messages.map((message) => (
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
                <div className="whitespace-pre-wrap">{message.text}</div>
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
        
        {isBotTyping && (
          <div className="flex items-start space-x-2 animate-slideIn">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#074665] text-white font-bold shadow-md">
              M
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-[#1c9cd3] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-[#1c9cd3] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#1c9cd3] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  });

  // FAQ Component
  const FAQSection = () => (

    <div className="bg-gray-50 border-t border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Perguntas Frequentes</h3>
        <button 
          onClick={toggleFAQ}
          className="text-xs text-[#095e89] hover:text-[#074665]"
        >
          {showFAQ ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      
      {showFAQ && (
        <div className="grid grid-cols-1 gap-2 animate-fadeIn">
          {faqQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleFAQClick(question)}
              className="text-left p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-[#e6f2f8] hover:border-[#1c9cd3] transition-colors duration-200"
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Connection status indicator
  const ConnectionIndicator = () => {
    const statusConfig = {
      connected: { color: 'bg-green-500', text: 'Conectado' },
      disconnected: { color: 'bg-red-500', text: 'Desconectado' },
      reconnecting: { color: 'bg-yellow-500', text: 'Reconectando...' }
    };

    const config = statusConfig[connectionStatus];

    return (
      <div className="flex items-center space-x-2 text-xs text-white">
        <div className={`w-2 h-2 rounded-full ${config.color} ${connectionStatus === 'reconnecting' ? 'animate-pulse' : ''}`}></div>
        <span>{config.text}</span>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${hide || pathname=="/login" ? 'opacity-0 pointer-events-none':''}`}>
      {/* Chat Window */}
      {isChatOpen && (
        <div className={`fixed bg-white shadow-2xl rounded-2xl border border-gray-200 pointer-events-auto flex flex-col transition-all duration-300 ${
          isMinimized 
            ? 'bottom-4 left-4 w-80 max-w-[calc(100vw-2rem)] h-16' 
            : isExpanded 
              ? 'inset-0 w-full h-full rounded-none'
              : 'bottom-4 left-4 w-full sm:w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] h-[min(600px,calc(100vh-2rem))]'
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-[#074665] text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#074665] font-bold shadow-lg">
                M
              </div>
              <div>
                <span className="font-semibold">Enfermeira MARIA</span>
                {!isMinimized && (
                  <>
                    <p className="text-xs text-blue-100">DRONLINE MZ</p>
                    <ConnectionIndicator />
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isMinimized && (
                <button 
                  onClick={startNewChat}
                  className="text-white hover:text-blue-200 transition p-1"
                  title="Nova Conversa"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              {unreadCount > 0 && isMinimized && (
                <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {unreadCount}
                </div>
              )}
              {!isMinimized && (
                <button 
                  onClick={toggleExpand} 
                  className="text-white hover:text-blue-200 transition p-1"
                  title={isExpanded ? "Restaurar" : "Expandir"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                </button>
              )}
              <button 
                onClick={toggleMinimize} 
                className="text-white hover:text-blue-200 transition p-1"
                title={isMinimized ? "Expandir" : "Minimizar"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="text-white hover:text-blue-200 transition p-1"
                title="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages - only show if not minimized */}
          {!isMinimized && <Messages messages={messages} />}

          {/* FAQ Section - only show if not minimized */}
          {!isMinimized && <FAQSection />}

          {/* Input - only show if not minimized */}
          {!isMinimized && (
            <div className="border-t p-4 bg-gray-50 rounded-b-2xl">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={connectionStatus === 'connected' ? "Escreva sua mensagem..." : "Aguardando conexão..."}
                  disabled={connectionStatus !== 'connected'}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c9cd3] resize-none shadow-inner disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button 
                  onClick={sendMessage}
                  disabled={inputMessage.trim() === "" || connectionStatus !== 'connected'}
                  className="px-4 py-3 bg-[#095e89] text-white rounded-xl hover:bg-[#074665] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                  title="Enviar mensagem"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Intro Popup */}
      {isIntroOpen && !isChatOpen && (
        <div className="fixed bottom-20 left-6 w-full sm:w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 pointer-events-auto animate-slideUp z-60"
             style={{
               maxHeight: 'calc(100vh - 8rem)'
             }}>
          <div className="flex justify-between items-center pb-3 border-b">
            <p className="font-semibold text-gray-800">
              Pergunte à Enfermeira <span className="text-[#095e89]">MARIA</span>
            </p>
              <button onClick={() =>{
                setIsIntroOpen(false)
                localStorage.setItem('nurseChatPopupShown', Date.now().toString());
              }
              
              } className="text-gray-400 hover:text-gray-600 transition">
              ✕
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-600 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
            <p>Olá! 👋 Sou a MARIA, sua enfermeira virtual.
Estou aqui para te acompanhar e tornar mais fácil cuidar da sua saúde.</p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                Orientação médica 24/7
              </div>
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                Receba recomendações de especialistas
              </div>
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                Tire dúvidas sobre serviços e procedimentos
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Perguntas Frequentes:</h4>
              <div className="space-y-2">
                {faqQuestions.slice(0, 2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      startChat();
                      setTimeout(() => handleFAQClick(question), 300);
                    }}
                    className="block w-full text-left p-2 bg-gray-50 rounded-lg text-xs text-gray-600 hover:bg-blue-50 hover:text-[#095e89] transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={startChat} 
            className="mt-4 w-full bg-[#095e89] text-white font-medium py-3 rounded-xl hover:bg-[#074665] transition shadow-md hover:scale-105 transform flex-shrink-0"
          >
            Iniciar Conversa
          </button>
        </div>
      )}

      {/* Enhanced Floating Button */}
      {!isChatOpen && (
     <button 
  onClick={() =>{ 
    setIsIntroOpen(!isIntroOpen)
    if (!isIntroOpen) {
      localStorage.setItem('nurseChatPopupShown', Date.now().toString());
    }
  }} 
  className="fixed bottom-6 left-6 flex items-center space-x-3 bg-[#095e89] text-white px-6 py-3 rounded-full shadow-2xl hover:bg-[#074665] transition transform hover:scale-105 pointer-events-auto group z-50"
>
  <Bot className={`w-6 h-6 ${!isIntroOpen ? 'animate-bounce':''}`} />

  {isIntroOpen && <span className="font-semibold">Fechar</span>}
  
  {!isIntroOpen && (
    <span className="font-semibold hidden group-hover:inline">
      Falar com à Enfermeira MARIA
    </span>
  )}

  {unreadCount > 0 && (
    <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
      {unreadCount}
    </div>
  )}
</button>

      )}
    </div>
  );
}