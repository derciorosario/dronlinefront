import React, { useEffect, useState } from 'react';
import Logo from '../../landingpage/assets/images/light-logo-2.png'

const MaintenancePage = () => {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    // Efeito de parallax suave no mouse
    const handleMouseMove = (e) => {
      const container = document.querySelector('.container');
      if (container) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        container.style.transform = `translate(${x * 0.02}px, ${y * 0.02}px)`;
      }
    };

    // Animação de entrada dos elementos de contato
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 100);
      }, index * 200);
    });

    // Atualização do tempo
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    updateTime();
    const timeInterval = setInterval(updateTime, 60000); // Atualiza a cada minuto

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeInterval);
    };
  }, []);

  const handleSocialClick = (e) => {
    e.preventDefault();
    e.target.style.transform = 'scale(0.9)';
    setTimeout(() => {
      e.target.style.transform = '';
    }, 150);
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c9cd3] via-[#095e89] to-[#074665] animate-gradient-shift"></div>
      
      {/* Elementos flutuantes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[rgba(28,156,211,0.1)] rounded-full border border-[rgba(28,156,211,0.2)] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[rgba(28,156,211,0.1)] rounded-full border border-[rgba(28,156,211,0.2)] animate-float animation-delay-3000"></div>
      </div>
      
      {/* Container principal */}
      <div className="container text-center text-white p-8 max-w-4xl backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-2xl animate-fade-in-up">
        <div className="text-6xl mb-6 inline-block">
            <img src={Logo} width={200}/>
        </div>
         <p className="text-xl mb-8 font-light opacity-90">Estamos a trabalhar para melhorar sua experiência</p>
        
        <div className="text-lg leading-relaxed mb-8 opacity-80">
          Nossa plataforma de saúde digital está temporariamente indisponível devido a melhorias e atualizações importantes. 
          Continuamos a oferecer os melhores serviços médicos online. Pedimos desculpas pelo inconveniente e agradecemos sua paciência.
        </div>

        <div className="contact-info bg-white/10 rounded-xl p-6 my-8 border border-white/20">
        
          <div className="contact-details flex flex-col gap-3">
            <div className="contact-item flex items-center justify-center gap-2 transition-transform duration-300">
              <span>📧</span>
              <span>dronline@dronlinemz.com</span>
            </div>
            <div className="contact-item flex items-center justify-center gap-2 transition-transform duration-300">
              <span>📱</span>
              <span>+258 86 102 4024</span>
            </div>
           
          </div>
        </div>

      

        <div className="eta mt-8 text-sm opacity-70 italic">
          Previsão de retorno: Em breve
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          from { opacity: 0.8; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-spin {
          animation: spin 3s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite alternate;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .social-link:hover {
          background: rgba(28, 156, 211, 0.3);
          border-color: rgba(28, 156, 211, 0.5);
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 10px 20px rgba(7, 70, 101, 0.3);
        }
        
        .contact-item:hover {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .container {
            margin: 1rem;
            padding: 1.5rem;
          }
          
          h1 {
            font-size: 2.2rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
          
          .gear-icon {
            font-size: 3rem;
          }

          .contact-details {
            font-size: 0.9rem;
          }

          .social-links {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;