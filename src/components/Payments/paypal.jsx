import React, { useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import { useData } from '../../contexts/DataContext';
import Loader from '../Loaders/loader';
import { useAuth } from '../../contexts/AuthContext';

const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject('Error loading script.');
    document.head.appendChild(script);
  });
};

const PayPal = ({info}) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRef = useRef(null);
  const [message,setMessage]=useState('')
  const _dataRef = useRef({});
  const d=useData()
  const invoice_number=Math.random().toString().slice(2,10)
  const key=Math.random().toString().slice(3,15)
  const {user} = useAuth()


  function paymentSuccessfully(appointment){
    d.setPaymentInfo({...info,doctor:null,done:true,appointment,loading:false})
  }

 
  useEffect(() => {
       _dataRef.current={
         server_url:d.APP_BASE_URL,
          ...info,
          doctor:null,
          patient_id:user?.data?.id,
          token:localStorage.getItem('token')
       }
  }, [info])



  useEffect(() => {

    if(info?.payment_method!="paypal"){
         return
    }

    const paypalSdkUrl = "https://www.paypal.com/sdk/js";
    const clientId = "AXJKJcDXlH8mKhbcdQQHTAsotX-s7w5oMtsOJVsGAARUUhUDfBfSKCHxd6rP36m-qsyY8-cc0fk_K0OR";
    const currency = "USD";
    const intent = "capture";

    loadScript(`${paypalSdkUrl}?client-id=${clientId}&enable-funding=venmo&currency=${currency}&intent=${intent}`)
      .then(() => {
        setPaypalLoaded(true)
    })
    .catch(error =>{
        console.error(error)
        console.log({error})
    });
  }, [info])


  useEffect(() => {

    if (paypalLoaded && window.paypal && !paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return fetch(d.socket_server +"/api/v1/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ "intent": "capture", ..._dataRef.current })
          })
            .then(response => response.json())
            .then(order => order.id);
        },
        onApprove: (data, actions) => {
          const orderId = data.orderID;
          return fetch(d.socket_server +"/api/v1/paypal/complete-order", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ "intent": "capture", "order_id": orderId,"key":key,..._dataRef.current})
          })
            .then(response => response.json())
            .then(orderDetails => {
              console.log({orderDetails})
              window.paypal.Buttons().close();
              paymentSuccessfully(orderDetails)
              
            })
            .catch(error => {
              console.error(error);
              console.log({error})
              setMessage(t('messages.try-again'))
            });
        },
        onCancel: () => {
             setMessage(t('messages.payment-cancelled'))
        },
        onError: (err) => {
          console.error(err);
          setMessage(t('messages.try-again'))
        },
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal'
        }
      }).render('#payment_options');

      paypalRef.current = true;
    }
  }, [paypalLoaded]);

  // Handle close alert
  const handleClose = (event) => {
    const alertElement = event.target.closest(".ms-alert");
    if (alertElement) {
      alertElement.remove();
    }
  };

  // Add event listener for close alerts
  useEffect(() => {
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, []);


  return (
    <div className={`w-full flex items-center justify-center  transition-all duration-75 ease-in `}>
        <div className="w-[500px] flex items-center justify-center flex-col">
             <h2 className="text-center max-w-[300px] text-[23px] font-semibold mb-10 mt-3">Paypal</h2>
             {message && <div id="alert-2" className="flex items-center w-full p-4 my-2 text-red-800 rounded-lg bg-red-50" role="alert">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div className="ms-3 text-sm font-medium">
                            {message}
                        </div>
                        <button onClick={()=>setMessage('')} type="button" className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#alert-2" aria-label="Close">
                            <span className="sr-only"></span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
            </div>}

            <div id="loading"></div>

            {(!paypalLoaded) &&
                    <div className="flex justify-center flex-col items-center my-10">
                        <div className=""><Loader/></div>
                        <span className="flex mt-4">{t('common.wait')}</span>
                    </div>
             }

            {/**${!paypalLoaded? 'opacity-0 pointer-events-none':''} */}
            <div id="content" className={`w-[300px] flex  justify-center flex-col`}>
                <div id="payment_options"></div>
            </div>
           
        </div>
    </div>
  );
};

export default PayPal;
