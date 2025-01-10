import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Logo from '../../assets/images/dark-logo-1.png'
import i18next, { t } from 'i18next'
import PrintTable from '../Tables/print'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import BaiscTable from '../Tables/basic'
import QRCodeGenerator from '../Scan/QR-code'
import _medications from '../../assets/medications.json'


export default function SinglePrint({item,setItem}) {
    const data=useData()
    const [doctorSignature,setDoctorSignature]=useState(null)
    const [doctorStamp,setDoctorStamp]=useState(null)
    const [secretaryChiefSignature,setSecretaryChiefSignature]=useState(null)
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [appSettings,setAppSettings]=useState(null)
    const [estimatedNumberOfPages, setEstimatedNumberOfPages]=useState(0)

    function estimateA4Pages() {
      const a4HeightPixels = 1123; 
      const pages = Math.ceil(document.querySelector('#last-print-element').offsetTop / a4HeightPixels);
      console.log({pages})
      return pages;
   }
    

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

          if(item?.from=="medical-certificate"){
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

          await Promise.all(promises);

          setEstimatedNumberOfPages(estimateA4Pages())

          setTimeout(()=>{

                window.print()

                setTimeout(()=>{
                  setItem(null)
                  data.setUpdateTable(Math.random())
                },300)
              setImagesLoaded(true);
              data.setIsLoading(false)
          },1000)

      } catch (error) {
          setEstimatedNumberOfPages(estimateA4Pages())
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


   useEffect(()=>{
       if(!item){
           setEstimatedNumberOfPages(0)
       }
   },[item])

    const {user}=useAuth()

    function formatDate(dateString, lang) {

      if(!dateString){
        return ''
      }
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


    const calculateAge = birthDate => {

      if(!birthDate) {
        return '-'
      }

      const birth = new Date(birthDate);
      const today = new Date();
      return today.getFullYear() - birth.getFullYear() - 
             (today.getMonth() < birth.getMonth() || 
             (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
    }

   
 
    return (
      
      <>
      
      <div id="_print" className={`w-full text-[0.9rem]  flex flex-col overflow-y-auto h-[100vh] ${!item ? '':'_print'} opacity-0 pointer-events-none    fixed left-0 top-0 z-50 px-10 bg-white`} style={{zIndex:9999}}>
                 
                   <div className="absolute left-0 right-0 z-50 opacity-15">
                         {Array.from({ length: estimatedNumberOfPages }, () => []).map((_,_i)=>(
                           <div className="w-full -translate-y-[70px] h-[100vh] flex items-center justify-center">
                              <img className="w-[80%]" src={Logo} style={{transform:'rotate(-75deg)'}}/>
                           </div>
                         ))}
                   </div>
      
                   
                 <div className="px-5">
                  <div className="justify-between flex w-full border-b border-gray-700 pb-2">
                        <div>
                            <div className="h-[70]">
                              <img className="w-auto h-[60px]" src={Logo}/>
                            </div>
                            <div className="mt-4 flex flex-col">
                                <span>
                                   <label className="font-bold">NUIT:</label>
                                   <label>{appSettings?.nuit}</label>
                                </span>
                                <span>
                                   <label className="font-bold">Email:</label>
                                   <label>{appSettings?.email}</label>
                                </span>
                                <span>
                                   <label className="font-bold">Cell:</label>
                                   <label>({appSettings?.main_contact_code}) {appSettings?.main_contact}</label>
                                </span>
                                <span>
                                   <label className="font-bold">{t('common.address')}:</label>
                                   <label>{appSettings?.address}</label>
                                </span>
                            </div>
                        </div>

                        <div>
                          <div className="h-[70]">
                            <h2 className="flex flex-col">
                              <span className="text-[26px] font-bold">{item?.title}</span>
                              <span>
                                <label className="font-bold">Doc. Ref.:</label>
                                <label>0001/{i.created_at?.split('T')?.[0]?.split('-')?.[0]}/{i.created_at?.split('T')?.[0]?.split('-')?.[0]}/{data?.getDocumentLetterCodeFrom(item?.from)}/ADM </label>
                              </span>
                            </h2>
                          </div>

                          <div className="mt-4 flex flex-col">
                                <span>
                                   <label className="font-bold">NUIT:</label>
                                   <label>{appSettings?.nuit}</label>
                                </span>
                                <span>
                                   <label className="font-bold">Email:</label>
                                   <label>{appSettings?.email}</label>
                                </span>
                                <span>
                                   <label className="font-bold">Cell:</label>
                                   <label>({appSettings?.main_contact_code}) {appSettings?.main_contact}</label>
                                </span>
                                <span>
                                   <label className="font-bold">{t('common.address')}:</label>
                                   <label>{appSettings?.address}</label>
                                </span>
                          </div>

                        </div>

                  </div>
                  <div>
                       
                  </div>
                 </div>


          
                 <div className={`${item?.from=="medical-certificate" ? 'hidden':''}`}>
                        <div className="flex px-5 mt-2 justify-between">
                           
                            <div className="flex flex-col w-[80px]">
                                  <span>Paciente:</span>
                                  <span>Patient:</span>
                            </div>

                            <div  className="w-[300px] border-b border-b-gray-600 flex items-end mx-2">
                                  <span className="font-medium">{item?.appointment?.is_for_dependent ? item?.appointment?.dependent?.name  :  item?.patient?.name }</span>
                            </div>

                            <div className="flex flex-1">
                               <div className="flex items-end ml-5 w-[170px]">
                                  <span>Pro. No:</span>
                                  <span className="flex border-b border-b-gray-600 ml-4 min-w-[140px]">{(item?.appointment?.dependent?.created_at || item?.patient?.created_at)?.split('T')?.[0]?.split('-')?.[0]}/{(item?.patient?.id || '').toString().padStart(4, '0')} {item?.appointment?.is_for_dependent ? ' - '+(item?.appointment?.dependent?.id || '').toString().padStart(3, '0') : ''}</span>
                              </div>
                              <div className="flex items-end ml-5 w-[100px]">
                                <span>Sex.</span>
                                <span className="flex border-b border-b-gray-600 ml-4 min-w-[50px]">{(item?.appointment?.dependent?.gender || item?.patient?.gender)?.charAt()?.toUpperCase() || '-'}</span>
                              </div>
                            </div>                          
                        </div>
          
                        <div className="flex px-5 mt-3 justify-between">
          
                            <div className="flex flex-col w-[80px]">
                                  <span>Endereço:</span>
                                  <span>Address:</span>
                            </div>
          
                            <div  className="w-[300px] border-b border-b-gray-600 flex items-end mx-2">
                                  <span className="font-medium">{item?.appointment?.dependent?.address || item?.patient?.address}</span>
                            </div>

                            <div className="flex flex-1">
                              <div className="flex items-end ml-5 mr-5 w-[170px]">
                                  <span>Tel:</span>
                                  <span className="flex border-b border-b-gray-600 ml-4 min-w-[140px]">{item?.appointment?.dependent?.main_contact  || item?.patient?.main_contact}</span>
                              </div>
                              <div className="flex items-end w-[100px]">
                                <span>Idade/Age</span>
                                <span className="flex border-b border-b-gray-600 ml-4">{calculateAge((item?.appointment?.dependent?.date_of_birth || item?.patient?.date_of_birth))}</span>
                              </div>
                           </div>
          
                         

                          </div>
                  </div>


                  {item?.from=="medical-prescription" ? (
                      <div className="w-full py-7 px-5">
                          <h2 className="mb-3 text-[20px] font-medium">{t('common.medications')}</h2>
                          <p className="mb-3 text-gray-600"> 
                             {t('messages.medications-creation-details',{date:item?.i.created_at?.split('T')?.[0],hour:item?.i.created_at?.split('T')?.[1]?.slice(0,5)})}
                          </p>
                          {(item?.i?.medical_prescription_items || []).map((f,_f)=>{
                              return (
                                 <div className="flex w-full mb-2">
                                     <span className="text-[0.9rem] font-bold">{f.name ? `${_medications.filter(g=>g.ITEM==f.name)?.[0]?.name}` : f.custom_name} {f.dosage}, {f.pharmaceutical_form}:
                                        <label className="font-normal">{f.route_of_administration}, </label>
                                        <label className="font-normal">{f.dosing_instructions}, </label>
                                        <label className="font-normal">{f.treatment_duration}, </label>
                                        <label className="font-normal">{f.prescribed_quantity}{f.recommendations ? ', ':''}</label> 
                                        <label className="font-normal">{f.recommendations}</label>

                                     </span>
                                    
                                  
                                 </div>
                              )
                          })}
                      </div>
                  ) : item?.from=="medical-certificate" ? (

                      <div className="w-full py-2 px-5">

                             {(item?.content || []).map(f=>{
                                 f=f[0]
                                 let variables={

                                  date_of_leave:f.date_of_leave,
                                  medical_specialty:f.medical_specialty,
                                  patient_name:item?.patient?.name,
                                  doctor_name:item?.doctor?.name,
                                  identification_number:item?.patient?.identification_number,
                                  disease:f.disease || ' -',
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
                                              {item?.doctor && <img width={100}  className="h-auto" src={doctorStamp}/>}
                                              {(user?.app_settings?.[0]?.value && !item?.doctor) && <img width={100}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>}
                                        </div>

                                        <div className="border-t border-t-gray-400 w-full mt-10">
                                          <p className="leading-relaxed" style={{lineHeight:2}}>{t('medical-certification-t-3',variables)}</p>
                                          <p className="mt-5 text-[18px] mb-2 flex justify-center">{formatDate(f.status_changed_at?.split('T')?.[0] || f?.created_at?.split('T')[0],i18next.language)}</p>
                                          <p className="leading-relaxed mt-3 flex justify-center" style={{lineHeight:2}}>{t('medical-certification-t-4',variables)}</p>
                                        </div>
                                      
                                         <div className="flex justify-center w-full">
                                             {(user?.app_settings?.[0]?.value && item?.i?.status_changer?.role=="admin") ? (
                                                <img width={100}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>
                                             ) : (
                                                <img width={100}  className="h-auto" src={secretaryChiefSignature}/>
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

                    <div className="w-full py-5">

                                {item?.type!="table" && (item?.content || []).map(f=>(
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



                                {item?.type=="table" && <div>
                                                  <BaiscTable loaded={true} header={item.table_header} body={(item?.table_items || []).map(i=>(
                                                          <BaiscTable.Tr>
                                                              <BaiscTable.Td>{i.name}</BaiscTable.Td>
                                                              <BaiscTable.Td>{i.dosage}</BaiscTable.Td>
                                                              <BaiscTable.Td>{i.dosing_instructions}</BaiscTable.Td>
                                                              <BaiscTable.Td>{i.prescribed_quantity}</BaiscTable.Td>
                                                              <BaiscTable.Td>{i.treatment_duration}</BaiscTable.Td>
                                                              <BaiscTable.Td>{i.pharmaceutical_form}</BaiscTable.Td>
                                                         </BaiscTable.Tr>
                                                   ))}/>
                                  
                                </div>}
                    </div>

                  )}

             
                    

               <div style={{width:'100%'}} className={`flex-1 ${item?.from=="medical-certificate" ? 'hidden':''}  flex flex-col justify-end w-full`}>
                      <div className="mt-2 flex justify-between">
                          <span className="ml-5 flex">{t('common.date')}: <label className="font-medium">{new Date().toISOString().split('T')[0]}</label></span>
  
                          <div className="flex-1 flex justify-end">
                            <div>
                              <div className="mb-2 flex justify-end flex-1 w-[400px]">
                                 {(user?.app_settings?.[0]?.value && item?.from!="medical-certificate") && <img width={70}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>}
                          
                                  {item?.doctor && <img width={70} className="h-auto mr-2" src={doctorSignature}/>}
                                  {item?.doctor && <img width={70}  className="h-auto" src={doctorStamp}/>}
                               </div>

                              <div className="flex justify-end">
                                  <span className="min-w-[100px] flex border-black border-b border-dashed  items-center" >Dr. {item?.doctor?.name || t('common.dronline-team')}</span>
                              </div>
                            </div>
                          </div>
                         
                    </div>
               </div>

               <div className="w-full text-[0.8rem] text-gray-500 flex justify-between mt-4 border-t border-t-gray-200 pt-3">
                    <span>
                       <QRCodeGenerator  code={`${(item?.i?.id || '').toString().padStart(5, '0')}${data?.getDocumentLetterCodeFrom(item?.from)}`} link={`${data.APP_FRONDEND}/qrcode/${data.encodeBase64Multiple(`${(item?.i?.id || '').toString().padStart(5, '0')}---${item?.from}---${item?.appointment?.is_for_dependent ? item?.appointment?.dependent?.name  :  item?.patient?.name}---${item?.i?.created_at}`)}`}/>
                    </span>
                    <span className="translate-y-3">{appSettings?.name}</span>
                    <div className="flex translate-y-3">
                      <span>{appSettings?.email}</span>
                      <label className="mx-2">|</label>
                      <span>{appSettings?.main_contact}</span>
                    </div>
               </div>
               <span id="last-print-element"></span>


      </div>
      </>
    )
  }