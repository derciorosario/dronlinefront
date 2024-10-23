import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';



function App() {

 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()

  let required_data=['patients']
  const {pathname} = useLocation()
  
  
  useEffect(()=>{
        
        if(!user) return
        setTimeout(()=>(
          data._get(required_data) 
        ),500)

  },[user,pathname])


  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','patients')
         data._get(required_data) 
    }
 },[data.updateTable])


 console.log(data._patients)
  return (
   
         <DefaultLayout pageContent={{title:user?.role=="doctor" ? t('common.my-patients') : t('common.patients'),desc:user?.role=="doctor" ? t('common.my-patients') : t('titles.patients'),btn:{onClick:(e)=>{
                 
             navigate('/add-patient')

          },text:t('menu.add-patients')}}}>
           
            
             <BaiscTable canAdd={user?.role=="admin"}  addPath={'/add-patient'} loaded={data._loaded.includes('patients')} header={[
                          user?.role=="doctor" ? null : <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/patients/delete'}
                         } items={data._patients}/>,
                         'ID',
                          t('form.full-name'),
                          'Email',
                          t('form.main-contact'),
                          t('form.gender'),
                          t('form.uploaded-documents'),
                          t('form.address'),
                        ]
                      }

                       body={data._patients.map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                <BaiscTable.Td hide={user?.role=="doctor"}>

                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/patients/delete',
                                       id:i.id}
                                  }/>

                                </BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.email}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.main_contact}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.gender ? t('common.'+i.gender) : '-'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{i.uploaded_documents?.length || 0}</BaiscTable.Td>
                                <BaiscTable.Td url={`/patient/`+i.id}>{t(i.address)}</BaiscTable.Td>
                            </BaiscTable.Tr>
                        ))}

                      
                    />

         </DefaultLayout>
  );
}

export default App;
