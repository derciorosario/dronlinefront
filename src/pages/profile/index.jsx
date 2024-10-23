import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'

import { t } from 'i18next'
import { useAuth } from '../../contexts/AuthContext'
import PersonalPage from './pages/personal'
import LoginPage from './pages/login-and-password'
import { useData } from '../../contexts/DataContext'
import ConfirmDialog from '../../components/modals/confirm'

function index() {

    const data=useData()
    const {user,logout,isLoading,setIsLoading}=useAuth()
    const [itemToEditLoaded,setItemToEditLoaded]=useState(false)

    function logout_user(){
        logout()
        setIsLoading(true)
    }

    const [loading,setLoading]=useState(false)


    useEffect(()=>{
        if(!user){
            return
        }
      
        (async()=>{
          try{
            let response=await data.makeRequest({method:'get',url:`api/userdata/`+id,withToken:true, error: ``},0);
      
           setForm({...form,...response})
           setLoading(false)
           setItemToEditLoaded(true)
      
          }catch(e){
              toast.error(t('unexpected-error'))
              navigate('/')  
          }
      })()
      
    },[user])

  

    function Icon({name,active}){
        return (
            <>
              { name=="login-and-password" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>
              : name=="personal-info" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={active ? '#fff':'#5f6368'}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>}
            </>
        )
    }

    const [currentPage,setCurrentPage]=useState('personal-info')
 
    let pages=[
        {t_label:'personal-info',name:'personal-info'},
        {t_label:'login-and-password',name:'login-and-password'},
        {t_label:'logout',name:'logout'}
    ]

    const [verified_inputs,setVerifiedInputs]=useState([])
    const [valid,setValid]=useState(false)
    const [messageType,setMessageType]=useState('red')

    let initial_form={
      name:'',
      date_of_birth:'',
      main_contact:'',
      alternative_contact:'',
      gender:'',
      password:'',
      email:'',
      passport_number:'',
      birth_certificate:'',
      identification_number:'',
      passport_number_filename:'',
      identification_number_filename:'',
      birth_certificate_filename:'',
      address:'',
      marital_status: "",
      occupation: "",
      nationality: "",
      country_of_residence: "",
      province_of_residence: "",
      residential_address: "",
      type_of_care:'',
      uploaded_files:[],
      chronic_diseases: [],
      surgery_or_relevant_procedures: [],
      hospitalization_history: [],
      family_history_of_diseases: [],
      drug_allergy: [],
      continuous_use_of_medications: [],
    }
  
    const [form,setForm]=useState(initial_form)


    useEffect(()=>{


    },[form])


    
    return (

      <DefaultLayout>
        <ConfirmDialog res={logout_user} show={data._openPopUps.confim_message} />
        <div className="w-full p-5 gap-x-2 flex">
             <div className="w-[300px] p-3 rounded-[0.3rem] bg-white">
                  
                    <div className="w-[170px] h-[170px] rounded-full bg-gray-200 relative mx-auto">  
                           <div className="absolute cursor-pointer active:opacity-50 right-0 bottom-6 rounded-full w-[30px] h-[30px] bg-honolulu_blue-400 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"  fill="#fff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                           </div>
                    </div>

                    <div className="my-4 flex-col flex justify-center items-center">
                           <span className="font-medium">{user?.name}</span>
                           <span>{t('common.'+user?.role)}</span>
                           <span className="text-gray-500">{user?.email}</span>
                    </div>

                    <div className="mt-4 px-3 gap-y-2">
                        {pages.map(i=>(
                            <div onClick={()=>{
                                  if(i.name=="logout"){
                                    data._showPopUp('confim_message',t('common.sure-to-logout'))
                                  }else{
                                    setCurrentPage(i.name)
                                  }
                            }} className={`flex _confim_message mb-2 items-center cursor-pointer hover:bg-honolulu_blue-400 _profile_left_item ${currentPage==i.name ? 'bg-honolulu_blue-400 text-white':''} p-2 rounded-[0.3rem]`}>
                                <Icon name={i.name} active={currentPage==i.name}/>
                                <span className="ml-3">{t('common.'+i.t_label)}</span>
                            </div>
                        ))}
                    </div>

             </div>

             <div className="p-3 rounded-[0.3rem] bg-white flex-1 min-h-[100vh]">
               
                <h2 className="text-[20px] font-medium">{t('common.'+currentPage)}</h2>
                <div className="flex flex-wrap gap-x-2">
                   {currentPage=="personal-info" && <PersonalPage form={form} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>}
                   {currentPage=="login-and-password" && <LoginPage form={form} verified_inputs={verified_inputs} setVerifiedInputs={setVerifiedInputs}/>}
                </div>

             </div>

        </div>
    </DefaultLayout>
  )
 

}

export default index