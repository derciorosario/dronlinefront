import React, { useState } from 'react'
import { GoogleLogin , useGoogleOneTapLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import GoogleIcon from '../../assets/images/google-icon.svg'
import { t } from 'i18next';


function GoogleSignIn({signUpWithGoogle,setMessage,isSignup,setLoading}) {

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });

  };

   
  return (
        <label className="relative flex justify-center overflow-hidden" onMouseMove={handleMouseMove}>

            <div onClick={()=>{
                return
                signUpWithGoogle({
                    name:'dercio',
                    email:'ded@sad.com'
                })
            }} className="w-full max-lg:hidden  login-container">
               
                <button type="button" class="border focus:ring-4 w-full  focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center inline-flex justify-center items-center">
                        <img src={GoogleIcon} width={"20"}/>
                        <span className="ml-2"> {isSignup ? t('common.sign-up-with-google') : t('common.sign-in-with-google')}</span>
                </button>

            </div>


            <div style={{left: position.x, top: position.y,transform: 'translate(-50%, -50%)',opacity:'0.01'}} className="absolute left-0 top-0  h-full max-lg:hidden">

                    <GoogleLogin
                            onSuccess={credentialResponse => {
                                const decoded = jwtDecode(credentialResponse.credential);
                                signUpWithGoogle(decoded)
                            }}
                            onError={() => {
                                setMessage(t('common.check-network'))
                            }}
                />

            </div>


            <div className="flex  w-full lg:hidden">
                <GoogleLogin
                                onSuccess={credentialResponse => {
                                    const decoded = jwtDecode(credentialResponse.credential);
                                    signUpWithGoogle(decoded)
                                }}
                                onError={() => {
                                    setMessage(t('common.check-network'))
                                }}
                />
            </div>

        </label>
  )
}

export default GoogleSignIn