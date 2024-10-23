import React from 'react'
import { GoogleLogin , useGoogleOneTapLogin, useGoogleLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { t } from 'i18next';
import axios from 'axios';

import GoogleIcon from '../../assets/images/google-icon.svg'

function GoogleSignIn() {


    async  function converToken(access_token){



        try {
            const res = await axios.get(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  
                },
              }
            );
            console.log(res);
          } catch (err) {
            console.log(err);   
          
          }


      }

      const login = useGoogleLogin({
       onSuccess: tokenResponse => converToken(tokenResponse.access_token),
        onError: () => {
            console.log('Login Failed');
          },
      });
  

       //  const decoded = jwtDecode(tokenResponse);
       //console.log(decoded);

   
  return (
       <div className="w-full">
          <div className="flex items-center my-3">
              <div className="w-full bg-gray-300 h-[1px]"></div>
              <div className="px-2">{t('common.or')}</div>
              <div className="w-full bg-gray-300 h-[1px]"></div>
          </div>
          <button onClick={login} type="button" class="border focus:ring-4 w-full  focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-[0.3rem] text-sm px-5 py-2.5 text-center inline-flex justify-center items-center me-2">
                <img src={GoogleIcon} width={"20"}/>
                <span className="ml-2"> {t('common.sign-in-with-google')}</span>
          </button>
       </div>
  )
}

export default GoogleSignIn