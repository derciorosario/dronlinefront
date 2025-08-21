import React, { useState, useEffect, useRef } from "react";
import { Bot, Send } from "lucide-react"; 
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

export default function NurseChat() {
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { socket } = useData();

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // In your React component
const startChat = () => {
  setIsIntroOpen(false);
  setIsChatOpen(true);
  
  // Emit the start-chat event and handle the response
  socket.emit('start-chat', { patientId: user?.id || null }, (response) => {
    if (response.status === 'success') {
      setConversationId(response.conversationId);
      //addMessage("Olá! Sou o assistente virtual da Saúde+. Como posso ajudar você hoje?", 'bot');
    } else {
      console.error('Error starting chat:', response.error);
      addMessage("Desculpe, ocorreu um erro ao iniciar o chat. Por favor, tente novamente.", 'bot');
    }
  });
};


// Handle receiving messages - ATUALIZADO
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      setIsBotTyping(false);
      
      if (data.type === 'doctor_recommendation') {
        // Esta é uma mensagem especial com recomendação de médicos
        setBotData(prev => ({
          ...prev,
          messages: [...prev.messages, {
            type: 'doctor_recommendation',
            data: data,
            sender: 'bot',
            time: new Date().toLocaleTimeString()
          }]
        }));
      } else {
        // Mensagem normal de texto
        addMessage(data.message, 'bot');
      }
    };

    const handleTyping = (isTyping) => {
      setIsBotTyping(isTyping);
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('bot-typing', handleTyping);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('bot-typing', handleTyping);
    };
  }, [socket]);

  const addMessage = (text, sender) => {
    const newMessage = {
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

 

  // Send message function
  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };

    setBotData(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      input: inputMessage
    }));

    // Preparar dados baseado no estado da conversa
    let messageData = { message: inputMessage, conversationId };
    
    // Se estamos coletando disponibilidade, enviar junto
    if (conversationState.step === 'collecting_availability') {
      messageData.patient_availability = extractAvailability(inputMessage);
    }

    // Se estamos coletando sintomas, armazenar
    if (conversationState.step === 'collecting_symptoms') {
      updateCollectedSymptoms(inputMessage);
    }

    socket.emit('send-message', messageData);
    setInputMessage("");
    setIsBotTyping(true);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Messages component
  const Messages = ({ messages }) => {
    return (
      <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start space-x-2'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1c9cd3] text-white font-bold">
                D
              </div>
            )}
            <div 
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-[#1c9cd3] text-white' 
                  : 'bg-gray-100'
              }`}
            >
              {message.text}
              <div className="text-xs mt-1 opacity-70 text-right">
                {message.time}
              </div>
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1c9cd3] text-white font-bold">
              D
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <div className="absolute left-0 top-0 min-h-screen bg-white z-50" style={{ zIndex: 999 }}>
      {/* Full Chat Window */}
      {isChatOpen && (
        <div
          className="
            fixed bottom-0 left-0 
            w-full h-full sm:w-96 sm:h-[550px] sm:bottom-20 sm:left-4 
            bg-white shadow-xl rounded-none sm:rounded-xl 
            flex flex-col border border-gray-200
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1c9cd3] text-white font-bold">
                D
              </div>
              <span className="font-semibold text-[#074665]">
                Enfermeira MARIA
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <button className="hover:text-[#095e89]">Expandir</button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <Messages messages={messages} />

          {/* Input */}
          <div className="border-t p-2 flex items-center">
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Descreva o que está a sentir..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
            />
            <button 
              onClick={sendMessage}
              disabled={inputMessage.trim() === ""}
              className="ml-2 px-3 py-2 bg-[#1c9cd3] text-white rounded-lg hover:bg-[#095e89] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Intro Popup */}
      {isIntroOpen && !isChatOpen && (
        <div
          className="
            fixed bottom-20 left-6 mb-3 w-80 max-h-[80vh] 
            rounded-xl shadow-lg border border-gray-200 bg-white p-4 
            flex flex-col
          "
        >
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <p className="font-medium text-[#074665]">
              Pergunte à Enfermeira{" "}
              <span className="text-[#1c9cd3] font-semibold">M.A.R.I.A</span>
            </p>
            <button
              onClick={() => setIsIntroOpen(false)}
              className="text-gray-400 hover:text-[#095e89] transition"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto mt-3 text-sm text-gray-600">
            <p>
              Descreva seus sintomas e receba orientação médica personalizada,
              recomendações de especialistas e horários disponíveis com a nossa
              IA.
            </p>
          </div>

          <button
            onClick={startChat}
            className="mt-3 w-full bg-[#1c9cd3] text-white font-medium py-2 rounded-lg hover:bg-[#095e89] transition"
          >
            Iniciar conversa
          </button>
        </div>
      )}

      {/* Floating Button with Animation */}
      {!isChatOpen && (
        <button
          onClick={() => setIsIntroOpen(!isIntroOpen)}
          className="
            fixed bottom-4 left-4 flex items-center gap-2 
            bg-[#095e89] text-white px-4 py-2 rounded-full shadow-lg 
            hover:bg-[#1c9cd3] hover:scale-105 
            transition-all duration-300 ease-in-out
            animate-pulse
          "
          style={{
            animation: isIntroOpen ? 'none' : 'gentle-pulse 2s infinite'
          }}
        >
          <Bot className="w-5 h-5" />
          {isIntroOpen ? "Fechar" : "Pergunte à Enfermeira MARIA"}
        </button>
      )}

      {/* Custom CSS for gentle pulse animation */}
      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}