import axios from 'axios';
import { createContext, useContext, useState} from 'react';
import toast from 'react-hot-toast';

const HomeAuthContext = createContext();

export const HomeAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  
  let env="pro"
  const APP_BASE_URL  = env =="pro" ? "https://api.dronlinemz.com": 'http://127.0.0.1:8000'
  const SERVER_FILE_STORAGE_PATH=`storage/uploads`
  const APP_FRONDEND=env == "dev" ? "http://localhost:5173" : "https://dronline-landingpage.netlify.app" 
 
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');

    if(!window.location.href.includes('/login')) {
       window.location.href="/login"
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };






     function encodeFormData(data) {
      const formData = new URLSearchParams();
      
      function buildFormData(formData, data, parentKey) {
        if (Array.isArray(data)) {
          data.forEach((value, index) => {
            buildFormData(formData, value, `${parentKey}[${index}]`);
          });
        } else if (typeof data === 'object' && data !== null) {
          Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
          });
        } else {
          formData.append(parentKey, data);
        }
      }
    
      buildFormData(formData, data);
      return formData.toString();
    }



 

    async function makeRequest(options = { data: {}, method: 'get', url: '' ,withToken:false}, maxRetries = 200, retryDelay = 3000) {
    
      let { data = {}, method = 'get', url = '' } = options;
     
       const headers = {
         'Accept': 'application/json',
         'Content-Type': 'application/x-www-form-urlencoded',
       };
     
       if(options.withToken) {
         headers['Authorization'] = `Bearer ${token}`;
       }
 
 
       
       if (method.toLowerCase() === 'get' && Object.keys(options.params || {}).length > 0) {
         const queryString = new URLSearchParams(options.params || {}).toString();
         url = `${APP_BASE_URL}/${url}?${queryString}`;
       } else {
         url = `${APP_BASE_URL}/${url}`; // For non-GET methods
       }
     
       let body;
       if (method.toLowerCase() !== 'get') {
         body = encodeFormData(data); 
       }
 
       console.log({url,params:options.params})
     
       try {
         const response = await fetch(url, {
           method: method.toUpperCase(),
           headers: headers,
           body: method.toLowerCase() === 'post' ? body : undefined,
         });
     
         if (!response.ok) {
           throw new Error(`${response.status}`);
         }
     
         const result = await response.json();
 
        
         Object.keys(result).forEach(f=>{
         
           if(result[f]==="null"){
             result[f]=""
           }
          
          /* if(result[f]===0){
             result[f]=false
           }
           if(result[f]===1){
             result[f]=true
           }*/
 
         })
 
 
         return  result;
     
       } catch (error) {
         console.error('Error making request:', error);
     
         if (maxRetries > 0) {
           await new Promise(resolve => setTimeout(resolve, retryDelay));
           return makeRequest(options, maxRetries - 1, retryDelay);
         } else {
           throw error;
         }
       }
   }



  return (
    <HomeAuthContext.Provider value={{APP_BASE_URL, user,APP_FRONDEND,login,SERVER_FILE_STORAGE_PATH, makeRequest,logout, isAuthenticated , loading, setUser, setLoading, token,auth}}>
      {children}
    </HomeAuthContext.Provider>
  );
};

export const useHomeAuth = () => useContext(HomeAuthContext);
