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
        data.handleLoaded('remove','specialty_categories')
        data._get(required_data) 


  },[user,pathname])


  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','specialty_categories')
         data._get(required_data) 
    }
 },[data.updateTable])

 useEffect(()=>{
  if(!user) return
  if(user?.role=="manager" && !user?.data?.permissions?.specialty_categories?.includes('read')){
         navigate('/') 
  }
},[user])

  

  return (
   
         <DefaultLayout pageContent={{title:t('menu.specialty-categories'),desc:t('titles.specialty-categories'),btn:!(user?.role=="admin" || (user?.role=="manager" && user?.data?.permissions?.specialty_categories?.includes('create'))) ? null : {onClick:()=>{
                 navigate('/add-specialty-category')
         },text:t('menu.specialty-categories')}}}>
            
             <BaiscTable canAdd={user?.role=="admin"} addPath={'/add-specialty-category'} loaded={data._loaded.includes('specialty_categories')} header={[
                        /* <BaiscTable.MainActions options={{
                          deleteFunction:'default',
                          deleteUrl:'api/specialty-categories/delete'}
                         } items={data._specialty_categories}/>,*/
                         'ID',
                          t('form.name'),
                          t('common.normal_consultation_price'),
                          t('common.urgent_consultation_price'),
                          t('common.home_consultation_price'),
                          t('form.english-name'),
                          t('form.description'),
                          t('common.created_at'),
                          t('common.last-update'),
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
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i[`${i18n.language}_name`]}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{data.formatNumber(data._cn_op(i.normal_consultation_price))} {'MT'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{data.formatNumber(data._cn_op(i.urgent_consultation_price))} {'MT'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{data.formatNumber(data._cn_op(i.home_consultation_price))}   {'MT'}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.en_name=="null" ? "" : i.en_name}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.description=="null" ? "" : i.description}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                <BaiscTable.Td url={`/specialty-category/`+i.id}>{i.updated_at ? data._c_date(i.updated_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " " +data._c_date(i.updated_at).split('T')[1].slice(0,5) : data._c_date(i.created_at).split('T')[0]?.split('-')?.reverse()?.join('/') + " "+data._c_date(i.created_at).split('T')[1].slice(0,5)}</BaiscTable.Td>
                                                                
                            </BaiscTable.Tr>
                        ))}

                      
                    />

         </DefaultLayout>
  );
}

export default App;
