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

          setDoctorSignature(item.doctor?.signature_filename || item.i?.signature_filename)
          setDoctorStamp(item.doctor?.stamp_filename || item.i?.stamp_filename)
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
      
      <div id="_print" className={`w-full text-[0.9rem] justify-between  flex flex-col overflow-y-auto h-[100vh] ${!item ? '':'_print'} opacity-0 pointer-events-none    fixed left-0 top-0 z-50 px-10 bg-white`} style={{zIndex:9999}}>
                
                <div className="absolute left-0 right-0 z-50 opacity-15">
                         {Array.from({ length: estimatedNumberOfPages }, () => []).map((_,_i)=>(
                           <div className="w-full h-[100vh] flex items-center justify-center">
                              <img className="w-[80%]" src={Logo} style={{transform:'rotate(25deg)'}}/>
                           </div>
                         ))}
                </div>
                   
                 <div className="px-5">
                  <div className="justify-between flex w-full border-b border-b-gray-300 pb-2">
                        <div>
                            <div className="h-[70]">
                              <img className="w-auto h-[60px]" src={Logo}/>
                            </div>
                            <div className="mt-4 flex flex-col">
                                <span>
                                   <label className="font-bold">NUIT: </label>
                                   <label>{appSettings?.nuit}</label>
                                </span>
                                <span>
                                   <label className="font-bold">Email: </label>
                                   <label>{appSettings?.email}</label>
                                </span>
                                <span>
                                   <label className="font-bold">Cell: </label>
                                   <label>({appSettings?.main_contact_code}) {appSettings?.main_contact}</label>
                                </span>
                                <span>
                                   <label className="font-bold">{t('common.address')}: </label>
                                   <label>{appSettings?.address}</label>
                                </span>
                            </div>
                        </div>

                        <div>
                          <div className="h-[70]">
                            <h2 className="flex flex-col">
                              <span className="text-[26px] font-bold">{item?.title}</span>
                              <span>
                                <label className="font-bold">Doc. Ref.: </label>
                                <label>{(item?.i?.id || '').toString().padStart(5, '0')}/{item?.i?.created_at?.split('T')?.[0]?.split('-')?.[1]}/{item?.i?.created_at?.split('T')?.[0]?.split('-')?.[0]}/{data?.getDocumentLetterCodeFrom(item?.from)}/ADM</label>
                              </span>
                            </h2>
                          </div>

                          <div className="mt-4 flex flex-col">
                                <span>
                                   <label className="font-bold">{t('common._created_by')}: </label>
                                   <label>{item?.doctor?.name || ((item?.i?.status_changer?.role=="admin" ? appSettings?.administrative_assistant_name : item?.i?.status_changer?.name) || appSettings?.administrative_assistant_name)}</label>
                                </span> 
                                <span>
                                   <label className="font-bold">{t('common._created_for')}: </label>
                                   <label>{item?.appointment?.dependent?.name  || item?.patient?.name}</label>
                                </span>
                                <span>
                                   <label className="font-bold">{t('common.emission-date')}: </label>
                                   <label>{item?.i?.created_at?.split('T')?.[0]}</label>
                                </span>
                                <span>
                                   <label className="font-bold">{t('common.expiration-date')}: </label>
                                   <label className="lowercase">15 {t('common.days')}</label>
                                </span>
                          </div>

                        </div>

                  </div>
                  <div>
                       
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

                      <div className="w-full py-2 px-[20px] mt-5">

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

                                let v=variables

                                 return (
                                  <>
                                      <div>
                                        <div className="text-justify">

                                          {i18next.language=="pt" && <p className="leading-relaxed" style={{lineHeight:2}}>Eu, <label className="font-bold">{v.doctor_name}</label>, prestando serviços na plataforma de atendimento médico Dr. Online, declaro por minha honra que o(a) Sr.(a) <label className="font-bold">{v.patient_name}</label>, titular do <label className="font-bold">Bilhete de identidade n.° </label><label className="font-bold">{v.identification_number}</label>, passado pelo arquivo de iden ficação de/da <label className="font-bold">{v.place_of_issuance_of_the_identity_card}</label>, a <label className="font-bold">{v.date_of_issuance_of_the_identity_card}</label>, foi por mim observado(a) em uma consulta de <label className="font-bold">{v.medical_specialty}</label>, tendo sido constatado que o(a) paciente sofre de  <label className="font-bold">{v.disease}</label> sendo por isso recomendado como parte do seu tratamento o repouso e consumo de medicação controlada, tornando-o(a) indisponível para comparecer às suas actividades <label className="font-bold">Laborais</label> ou <label className="font-bold">Estudantis</label> por um prazo de 15 dias, a contar da data de emissão do presente atestado médico.</p>}
                                          {i18next.language=="en" && <p className="leading-relaxed" style={{lineHeight:2}}>I, <label className="font-bold">{v.doctor_name}</label>, providing services on the Dr. Online medical care platform, hereby declare on my honor that Mr./Ms. <label className="font-bold">{v.patient_name}</label>, holder of Identity Card No. <label className="font-bold">{v.identification_number}</label>, issued by the Identification Archive of <label className="font-bold">{v.place_of_issuance_of_the_identity_card}</label> on <label className="font-bold">{v.date_of_issuance_of_the_identity_card}</label>, was examined by me during a <label className="font-bold">{v.medical_specialty}</label> consultation. It was determined that the patient is suffering from <label className="font-bold">{v.disease}</label>. Therefore, as part of their treatment, rest and the use of controlled medication are recommended, rendering them unavailable to attend their <label className="font-bold">professional</label> or <label className="font-bold">academic</label> activities for a period of 15 days, starting from the date of issuance of this medical certificate.</p>}

                                          <div className="mt-1">
                                            {i18next.language=="pt" && <p className="leading-relaxed" style={{lineHeight:2}}>E por este atestado cconsƟtuir a verdade, adiciono a minha assinatura e carimbo.</p>}
                                            {i18next.language=="en" && <p className="leading-relaxed" style={{lineHeight:2}}>And to certify the truth of this statement, I add my signature and stamp.</p>}
                                          </div>
                             
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

             
                    



                <div>

                                     <div className="flex-col flex items-center justify-center">
                                          <p className="font-bold mt-6">{t('common.signature-and-stamp-of-the-doctor')}</p>
                                          <div className="min-h-[50px] flex justify-end flex-col mt-3">
                                              <div className="flex items-center justify-center">
                                                  {item?.doctor && <img width={80} className="h-auto mr-2" src={doctorSignature}/>}
                                                  {item?.doctor && <img width={80}  className="h-auto" src={doctorStamp}/>}
                                                  {!item?.doctor && <>
                                                    {item?.i?.status_changer?.signature_filename || appSettings?.signature_filename && <img width={80} className="h-auto mr-2" src={item?.i?.status_changer?.signature_filename || appSettings?.signature_filename}/>}
                                                    {appSettings?.stamp_filename && <img width={80}  className="h-auto" src={appSettings?.stamp_filename}/>}
                                                  </>}
                                              </div>
                                              <span className="w-[350px] flex h-[2px] bg-black"></span>
                                          </div>
                                          {!item?.doctor && <p className="mt-3 mb-2 font-bold">{t('common.dronline-team')}</p>}
                                          {item?.doctor && <p className="mt-3 mb-2 font-bold">{t('common.dr')} {item?.doctor?.name}</p>}
                                          {item?.doctor && <p>{t('common.doctor-of')} {data._specialty_categories.filter(f=>f.id==item?.appointment?.medical_specialty)[0]?.[i18next.language+"_name"]}</p>}     
                                          {item?.doctor?.order_number && <p>{t('common.medical-council-number')} - {item?.doctor?.order_number}</p>}
                                        </div>


                                        <div className="flex-col flex items-center justify-center">
                                          <p className="font-bold mt-10">{t('common.signature-and-stamp-of-the-Secretary')}</p>
                                          <div className="min-h-[50px] flex justify-end flex-col mt-3">
                                              <div className="flex items-center justify-center">
                                                  {(item?.i?.status_changer?.signature_filename || appSettings?.signature_filename) && <img width={80} className="h-auto mr-2" src={item?.i?.status_changer?.signature_filename || appSettings?.signature_filename}/>}
                                                  {appSettings?.stamp_filename && <img width={80}  className="h-auto" src={appSettings?.stamp_filename}/>}
                                              </div>
                                              <span className="w-[350px] flex h-[2px] bg-black"></span>
                                          </div>
                                          <p className="mt-3 mb-2 font-bold">{t('common.administrative-assistant')}</p>
                                          <p>{(item?.i?.status_changer?.role=="admin" ? appSettings?.administrative_assistant_name : item?.i?.status_changer?.name) || appSettings?.administrative_assistant_name}</p>
                                        </div>

                      </div>
              


               <div className="w-full flex-1 relative  text-[0.8rem] text-gray-500 flex justify-between mt-4 border-t border-t-gray-300 pt-3">
                     <span></span>
                     <div className="flex absolute left-0">
                        <span>
                          <QRCodeGenerator  link={`${data.APP_FRONDEND}/qrcode/${data.encodeBase64Multiple(`${`${(item?.i?.id || '').toString().padStart(5, '0')}/${item?.i?.created_at?.split('T')?.[0]?.split('-')?.[1]}/${item?.i?.created_at?.split('T')?.[0]?.split('-')?.[0]}/${data?.getDocumentLetterCodeFrom(item?.from)}/ADM`}---${item?.doctor?.name || ((item?.i?.status_changer?.role=="admin" ? appSettings?.administrative_assistant_name : item?.i?.status_changer?.name) || appSettings?.administrative_assistant_name)}---${item?.appointment?.is_for_dependent ? item?.appointment?.dependent?.name  :  item?.patient?.name}---${item?.from}---${item?.i?.created_at}`)}`}/>
                        </span>
                        <span className="w-[300px] -translate-x-[30px]">{t('messages.confirm-code-authenticity')}</span>
                     </div>

                     <div className="flex flex-col">
                         <span>{t('messages.this-document-is-a-propriety-of')}</span>
                         <span className="font-bold">
                              {appSettings?.name}
                         </span>
                     </div>
               </div>
               <span id="last-print-element"></span>
      </div>
      </>
    )
  }