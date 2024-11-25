import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const { id } = useParams()
  const {pathname,search } = useLocation()
  const navigate = useNavigate()

  let required_data=['cancellation_taxes']
  
  useEffect(()=>{
        
        if(!user) return
        data.handleLoaded('remove','cancellation_taxes')
        data._get(required_data) 


  },[user,pathname])


  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','cancellation_taxes')
         data._get(required_data) 
    }
 },[data.updateTable])

 useEffect(()=>{
  if(!user) return
  if(user?.role=="manager" && !user?.data?.permissions?.cancellation_taxes?.includes('read')){
         navigate('/') 
  }
},[user])

  

  return (
   
         <DefaultLayout pageContent={{title:t('common.cancellation-taxes')}}>
            
             <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-cancellation-taxes'} loaded={data._loaded.includes('cancellation_taxes')} header={[
                      
                         'ID',
                          t('common.payment-method'),
                          t('common.value'),
                          t('common.last-update'),
                        ]
                      }


                       body={data._cancellation_taxes.map((i,_i)=>(
                        
                              <BaiscTable.Tr>

                                {/*<BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/specialty-categories/delete',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>*/}
                                
                                <BaiscTable.Td url={`/cancellation-taxes/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/cancellation-taxes/`+i.id}>{t('common.'+i.payment_method)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/cancellation-taxes/`+i.id}>{i.value} {i.is_by_percentage ? '%' : 'MT'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/cancellation-taxes/`+i.id}>{i.updated_at ? i.updated_at.split('T')[0] + " " +i.updated_at.split('T')[1].slice(0,5) : '-'}</BaiscTable.Td>
                               
                            </BaiscTable.Tr>
                        ))}

                      
                    />

         </DefaultLayout>
  );
}

export default App;
