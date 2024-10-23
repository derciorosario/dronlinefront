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

  let required_data=['specialty_categories']
  
  useEffect(()=>{
        
        if(!user) return
        setTimeout(()=>(
          data._get(required_data) 
        ),500)

  },[user,pathname])


  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','specialty_categories')
         data._get(required_data) 
    }
 },[data.updateTable])

  

  return (
   
         <DefaultLayout pageContent={{title:t('menu.specialty-categories'),desc:t('titles.specialty-categories'),btn:{onClick:()=>{
                 navigate('/add-specialty-category')
         },text:t('menu.specialty-categories')}}}>
           

            
             <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-specialty-category'} loaded={data._loaded.includes('specialty_categories')} header={[
                        /* <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/specialty-categories/delete'}
                         } items={data._specialty_categories}/>,*/
                         'ID',
                          t('form.name'),
                          t('form.english-name'),
                          t('form.description'),
                        ]
                      }

                       body={data._specialty_categories.map((i,_i)=>(
                        
                              <BaiscTable.Tr>
                                {/*<BaiscTable.Td>
                                  <BaiscTable.Actions options={{
                                       deleteFunction:'default',
                                       deleteUrl:'api/specialty-categories/delete',
                                       id:i.id}
                                  }/>
                                </BaiscTable.Td>*/}
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.id}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.pt_name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.en_name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.description}</BaiscTable.Td>
                            </BaiscTable.Tr>
                        ))}

                      
                    />

         </DefaultLayout>
  );
}

export default App;
