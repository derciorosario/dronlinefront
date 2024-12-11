import { t } from 'i18next';
import { createContext, useContext, useState, useEffect} from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

/***
 * const config = {
  public_key: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyrOP7fgXIJgJyp6nP/Vtlu8kW94Qu+gJjfMaTNOSd/mQJChqXiMWsZPH8uOoZGeR/9m7Y8vAU83D96usXUaKoDYiVmxoMBkfmw8DJAtHHt/8LWDdoAS/kpXyZJ5dt19Pv+rTApcjg7AoGczT+yIU7xp4Ku23EqQz70V5Rud+Qgerf6So28Pt3qZ9hxgUA6lgF7OjoYOIAKPqg07pHp2eOp4P6oQW8oXsS+cQkaPVo3nM1f+fctFGQtgLJ0y5VG61ZiWWWFMOjYFkBSbNOyJpQVcMKPcfdDRKq+9r5DFLtFGztPYIAovBm3a1Q6XYDkGYZWtnD8mDJxgEiHWCzog0wZqJtfNREnLf1g2ZOanTDcrEFzsnP2MQwIatV8M6q/fYrh5WejlNm4ujnKUVbnPMYH0wcbXQifSDhg2jcnRLHh9CF9iabkxAzjbYkaG1qa4zG+bCidLCRe0cEQvt0+/lQ40yESvpWF60omTy1dLSd10gl2//0v4IMjLMn9tgxhPp9c+C2Aw7x2Yjx3GquSYhU6IL41lrURwDuCQpg3F30QwIHgy1D8xIfQzno3XywiiUvoq4YfCkN9WiyKz0btD6ZX02RRK6DrXTFefeKjWf0RHREHlfwkhesZ4X168Lxe9iCWjP2d0xUB+lr10835ZUpYYIr4Gon9NTjkoOGwFyS5ECAwEAAQ==',
  api_key: 'v9cmahazr4ojcle2bsrgk0lxyhfaxvms',
  env: 'live', // or 'sandbox'
  service_provider_code: '901817'
}
 */

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverTime,setServerTime]=useState(null)
  const [pathname,setPathName]=useState(null)
  const [recoveringPassword,setRecoveringPassword]=useState(false)
  
  let env="pro"
  const APP_BASE_URL = env =="pro" ? "https://dronline-server.arsbeta-mz.com": 'http://127.0.0.1:8000'
  const SERVER_FILE_STORAGE_PATH=`storage/uploads`
  const APP_FRONDEND=env == "dev" ? "http://localhost:5173" : "https://dronline-landingpage.netlify.app" 
     
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
   
  };


    async function logoutFromServer(){
         try{
           await makeRequest({method:'post',url:'api/logout',withToken:true, error: ``},0);
         }catch(e){
           console.log({e})
           if(e.message=='Failed to fetch'){
            return false
           }
         }
         return true
    }

    const logout =  async() => {

      if(recoveringPassword) return

     
      if(!window.location.href.includes('/login')) {
          setIsLoading(true)
      }


     if(localStorage.getItem('token')){
      if(!await logoutFromServer()){
        toast.error(t('common.check-network'))
        setIsLoading(false)
        return
      }
     }
     

     

    
    localStorage.removeItem('token');
    


    if(!window.location.href.includes('/login') && pathname!="/" && pathname && !window.location.href.includes('/register')) {
       window.location.href="/login"
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };



   async function check_user(){
       try{
          await makeRequest({method:'get',url:`api/user`, error: ``,withToken:true},0);
          return true
       }catch(e){
          if(e.message==401){
            return false
          }else{
            return true
          }
          
       }
   }

    useEffect(() => {


      const fetchUserData = async () => {
        try {
         
          let response=await makeRequest({method:'get',url:`api/user`, error: ``,withToken:true},1);
          login(response, localStorage.getItem('token'));
          setAuth(true)
        } catch (error) {
          console.log({error})
          console.error('Error fetching user data:', error);
          setLoading(false)
          localStorage.removeItem('token')
          logout()
        } finally {
         // setLoading(false);
        }
      };


      
      if (isAuthenticated && !user && loading && token) {
        fetchUserData();
      } else {
        setLoading(false);
      }

       if(!token){
          logout()
          setLoading(false)
       }

     }, [isAuthenticated, user, token]);





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
        'Content-Type': 'application/x-www-form-urlencoded'
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
      //console.log({url,params:options.params})

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
        
          if(result[f]=="null"){
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

        if(error.message=="401" && !url.includes('login') && !url.includes('api/user')){

           if(recoveringPassword) return

           toast.remove()
           if(!await check_user() && user){
              toast.error(t('common.user-not-authorized'))
              localStorage.removeItem('token');
              setTimeout(()=>{
                window.location.href="/login"
              },500)
              setIsLoading(true)
              return
            }
        }
    
        if (maxRetries > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return makeRequest(options, maxRetries - 1, retryDelay);
        } else {
          throw error;
        }
      }
  }



  return (
    <AuthContext.Provider value={{setRecoveringPassword,check_user,APP_FRONDEND,setPathName,isLoading,serverTime,setServerTime, setIsLoading,APP_BASE_URL, user, login,SERVER_FILE_STORAGE_PATH, makeRequest,logout, isAuthenticated , loading, setUser, setLoading, token,auth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
