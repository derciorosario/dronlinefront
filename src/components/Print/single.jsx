import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Logo from '../../assets/images/dark-logo-1.png'
import i18next, { t } from 'i18next'
import FormCard from '../Cards/form'
import PrintTable from '../Tables/print'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
export default function SinglePrint({item,setItem}) {
    const data=useData()

    const [doctorSignature,setDoctorSignature]=useState(null)
    const [doctorStamp,setDoctorStamp]=useState(null)
    const [secretaryChiefSignature,setSecretaryChiefSignature]=useState(null)
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [appSettings,setAppSettings]=useState(null)



     useEffect(()=>{

       (async()=>{
          setAppSettings(null)
          if(!item) return

          try{
              data.setIsLoading(true)
              let r=await data.makeRequest({method:'get',url:`api/userdata/`,withToken:true, error: ``},0);
              setAppSettings({...JSON.parse(r.app_settings[0].value)})
          }catch(e){
              toast.error(t('common.error-while-printing'))
              data.setIsLoading(false)
              console.log({e})
              setItem(null)
          }
       })()


     },[item])


      useEffect(()=>{

         if(item && appSettings){

          setDoctorSignature(item.doctor?.signature_filename)
          setDoctorStamp(item.doctor?.stamp_filename)
          setSecretaryChiefSignature(item?.i?.status_changer?.signature_filename)

        
          if(!localStorage.getItem('print_single'))  {

           data.setIsLoading(true)
             
          let imagestoLoad=[
            item.doctor?.signature_filename,
            item.doctor?.stamp_filename,
            JSON.parse(user?.app_settings?.[0]?.value).stamp_filename
          ]

         
          if(item?.from=="medical-certificates"){
             imagestoLoad.push(item?.i?.status_changer?.signature_filename)
          }

          preloadImages(imagestoLoad.filter(i=>i))

          }

          localStorage.setItem('print_single', 1)

          setTimeout(()=>{
            localStorage.removeItem('print_single')
          },300)
          
        }
         
    },[item,appSettings])


    const preloadImages = async (links) => {
      try {

          const promises = links.map(
              (link) =>
                  new Promise((resolve, reject) => {
                      const img = new Image();
                      img.src = link;
                      img.onload = () => resolve(img);
                      img.onerror = () => reject(`Failed to load image: ${link}`);
                  })
          );

          const images = await Promise.all(promises);

          setTimeout(()=>{
            window.print()
              setTimeout(()=>{
                setItem(null)
              },2000)
            setImagesLoaded(true);
            data.setIsLoading(false)
          },1000)

      } catch (error) {

          data._showPopUp('basic_popup','printing-images-missing')
          console.error(error);
          //setItem(null)
          //toast.error(t('common.error-while-printing'))
          //window.print()
          data.setIsLoading(false)
      }
  };

   useEffect(()=>{
    setItem(null)
   },[data.updateTable])


  


    const {user}=useAuth()

    function formatDate(dateString, lang) {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
    
      const months = {
        pt: [
          "janeiro", "fevereiro", "março", "abril", "maio", "junho",
          "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ],
        en: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
      };
    
      const day = date.getDate();
      const month = date.getMonth(); // 0-based index
      const year = date.getFullYear();
    
      if (!months[lang]) {
        return "Unsupported language";
      }
    
      if (lang === "pt") {
        return `${day} de ${months[lang][month]} de ${year}`;
      } else if (lang === "en") {
        return `${day} of ${months[lang][month]} ${year}`;
      }
      
      return "Unsupported language";
    }
    
    
  
   
    return (
      
      <div className={`w-full  flex flex-col overflow-y-auto h-[100vh] ${!item ? '':'_print'} pointer-events-none opacity-0  fixed left-0 top-0 bg-white z-50 px-10`}>
                 
                 {(user?.app_settings?.[0]?.value && item?.from!="medical-certificates") && <div className="top-2 left-2">
                      <img width={100}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>
                 </div>}
                 <div className="justify-around flex w-full">
                      <h2 className="text-[26px] font-medium flex flex-col items-center">
                       <span>{item?.title}</span>
                      </h2>
                     <img className="w-[160px] h-[60px]" src={Logo}/>
                 </div>

                 <div className={`${item?.from=="medical-certificates" ? 'hidden':''}`}>

                        <div className="flex px-5 mt-5 justify-between">
          
                            <div className="flex flex-col justify-end items-end">
                                  <span>Nome do paciente:</span>
                                  <span>Patient name:</span>
                            </div>
          
                            <div  className="flex-1 border-b border-b-gray-600 flex items-end mx-4">
                                  <span className="font-medium">{item?.patient?.name}</span>
                            </div>
          
                            <div className="flex items-end ml-5 w-[170px]">
                                <span>Pro. No:</span>
                                <span className="flex border-b border-b-gray-600 ml-4 min-w-[200px]">{item?.patient?.id}</span>
                            </div>
                        </div>

          
          
                        <div className="flex px-5 mt-10 justify-between">
          
                            <div className="flex flex-col justify-end items-end">
                                  <span>Endereço:</span>
                                  <span>Address:</span>
                            </div>
          
                            <div  className="flex-1 border-b border-b-gray-600 flex items-end mx-4">
                                  <span className="font-medium">{item?.patient?.address}</span>
                            </div>
          
                            <div className="flex items-end ml-5 w-[170px]">
                                <span>Tel:</span>
                                <span className="flex border-b border-b-gray-600 ml-4 min-w-[200px]">{item?.patient?.main_contact}</span>
                            </div>

                          </div>
                  </div>


                  {item?.from=="medical-certificates" ? (

                      <div className="w-full py-10 px-5">

                             {(item?.content || []).map(f=>{

                                 f=f[0]

                                 let variables={
                                  date_of_leave:f.date_of_leave,
                                  medical_specialty:f.medical_specialty,
                                  patient_name:item?.patient?.name,
                                  doctor_name:item?.doctor?.name,
                                  identification_number:item?.patient?.identification_number,
                                  disease:f.disease,
                                  place_of_issuance_of_the_identity_card:item?.patient?.place_of_issuance_of_the_identity_card || `(${t('form.place_of_issuance_of_the_identity_card')})` ,
                                  date_of_issuance_of_the_identity_card:item?.patient?.date_of_issuance_of_the_identity_card?.split('T')?.[0] || `(${t('form.date_of_issuance_of_the_identity_card')})` 
                                  
                                }

                                 return (
                                  <>
                                      <div>
                                        <div className="text-justify">
                                        
                                        <p className="leading-relaxed" style={{lineHeight:2}}>{t('medical-certification-t-1',variables)}</p>
                                        <p className="leading-relaxed" style={{lineHeight:2}}>{t('medical-certification-t-2',variables)}</p>
                                        <p className="mt-5 text-[18px] flex justify-center">{formatDate(f.created_at.split('T')[0],i18next.language)}</p>

                                        </div>
                                        <div className="flex justify-center mt-2">
                                              {item?.doctor && <img width={100} className="h-auto ml-2" src={doctorSignature}/>}
                                              {(user?.app_settings?.[0]?.value && !item?.doctor) && <div className="top-2 left-2">
                                                      <img width={100}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>
                                              </div>}
                                        </div>

                                        <div className="border-t border-t-gray-400 w-full mt-10">
                                          <p className="leading-relaxed" style={{lineHeight:2}}>{t('medical-certification-t-3',variables)}</p>

                                          <p className="mt-5 text-[18px] mb-2 flex justify-center">{formatDate(f.created_at.split('T')[0],i18next.language)}</p>
                                          <p className="leading-relaxed mt-3 flex justify-center" style={{lineHeight:2}}>{t('medical-certification-t-4',variables)}</p>
                                        </div>

                                      
                                         <div className="flex justify-center">
                                             <img width={100}  className="h-auto" src={secretaryChiefSignature}/>
                                             {(user?.app_settings?.[0]?.value && item?.i?.status_changer?.role=="admin")  && (
                                              <img width={100}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>
                                             )}
                                        </div>

                                        

                                        <div className="border-t border-t-gray-400 w-full mt-10">
                                          <p className="leading-relaxed" style={{lineHeight:2}}>{t('medical-certification-t-5',variables)}</p>
                                        </div>

                                      </div>
                                  </>
                              )
                             })}
                            
                      </div>



                  ) : (
                    <div className="w-full py-10">
                                {(item?.content || []).map(f=>(
                                    <>
                                        <PrintTable header={[t('common.name'),'']} body={f.filter(i=>i.name || i.value).map(i=>(
                                            <PrintTable.Tr>
                                                    <PrintTable.Td>{i.name}</PrintTable.Td>
                                                    <PrintTable.Td>{i.value}</PrintTable.Td>
                                            </PrintTable.Tr>
                                        ))}>
                                        </PrintTable>
                                        <div className="mb-6"></div>
                                    </>
                                ))}
                    </div>
                  )}

             
                    

               <div style={{width:'100%'}} className={`flex-1 ${item?.from=="medical-certificates" ? 'hidden':''}  flex flex-col justify-end w-full`}>
                      <div className="mt-10 flex justify-between">
                          <span>{t('common.date')}: <label className="font-medium">{new Date().toISOString().split('T')[0]}</label></span>
  
                          <div>
                            <div className="flex">
                                <span className="min-w-[100px] flex border-black border-b border-dashed  items-center" >{item?.doctor?.name || t('common.dronline-team')}</span>
                            </div>
                           
                            <div className="mt-2 flex justify-between">
                                {item?.doctor && <img width={100} className="h-auto mr-2" src={doctorSignature}/>}
                                {item?.doctor && <img width={100}  className="h-auto" src={doctorStamp}/>}
                               
                            </div>
                            
                          </div>
                         
                    </div>
               </div>

               <div className="w-full text-[0.8rem] text-gray-500 flex justify-between mt-10 border-t border-t-gray-200 pt-3">
                    <span>{appSettings?.address}</span>
                    <span>{appSettings?.name}</span>
                    <div className="flex">
                      <span>{appSettings?.email}</span>
                      <label className="mx-2">|</label>
                      <span>{appSettings?.main_contact}</span>
                    </div>
               </div>


      </div>
    )
  }