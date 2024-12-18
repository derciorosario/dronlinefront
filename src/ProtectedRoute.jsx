import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, Outlet , useLocation} from 'react-router-dom';
import toast from 'react-hot-toast';
import PreLoader from './components/Loaders/preloader';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children, redirectTo = '/', path }) => {
  const { isAuthenticated, user, login, loading, token,logout,serverTime } = useAuth();
 
  const location=useLocation()

  let page_restriction={
         admin:['/loans'],
         manager:['/microcredits','/managers'],
         operator:['/microcredits','/managers','/cash-management/settings'],
         client:['/microcredits','/managers','/operators']
  }

 
  if(loading || !serverTime){
     return <PreLoader/>
  }
  if(!loading && !user || !token){
        logout() 
        return <Navigate to={'/login'} replace />
 }

 
  if(redirectTo=="/logout" && token && user){
        logout() 
        toast.remove()
        toast.success('Logout successfuly!')
        return <Navigate to={'/login'} replace />
  }


  if (loading) {
      return <Outlet/>;
  }else if(!user && !loading){
      return <Navigate to={'/login'} replace />
  }else if(user.role=="client"){
      toast.remove()
      toast.error('Página restrita para clientes')
      return <Navigate to={'/login'} replace />
  }else{

     return isAuthenticated ? children : <Navigate to={redirectTo} replace />;

  }
};


export default ProtectedRoute;



