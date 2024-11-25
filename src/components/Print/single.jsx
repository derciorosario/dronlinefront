import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'
import Logo from '../../assets/images/dark-logo-1.png'
import { t } from 'i18next'
import FormCard from '../Cards/form'
import PrintTable from '../Tables/print'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
export default function SinglePrint({item,setItem}) {
    const data=useData()

    const [doctorSignature,setDoctorSignature]=useState(null)
    const [doctorStamp,setDoctorStamp]=useState(null)
    const [imagesLoaded, setImagesLoaded] = useState(false);


      useEffect(()=>{

         if(item){

          setDoctorSignature(item.doctor.signature_filename)
          setDoctorStamp(item.doctor.stamp_filename)

        
          if(!localStorage.getItem('print_single'))  {


          data.setIsLoading(true)

             
          preloadImages([
            item.doctor.signature_filename,
            item.doctor.stamp_filename,
            JSON.parse(user?.app_settings?.[0]?.value).stamp_filename
          ].filter(i=>i))



          }

          localStorage.setItem('print_single', 1)

          setTimeout(()=>{
            localStorage.removeItem('print_single')
          },300)
          
        }
         
    },[item])


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
          console.log({images})
          setTimeout(()=>{
            window.print()
              setTimeout(()=>{
                setItem(null)
              },2000)
            setImagesLoaded(true);
            data.setIsLoading(false)
          },1000)

          

      } catch (error) {
          window.print()
          console.error(error);
          setItem(null)
          toast.error(t('common.error-while-printing'))
          data.setIsLoading(false)
      }
  };


    const {user}=useAuth()

  
   
    return (
      <div className={`w-full flex flex-col overflow-y-auto h-[100vh] ${!item ? '':'_print'} pointer-events-none opacity-0  fixed left-0 top-0 bg-white z-50 px-10`}>
                 
                 {user?.app_settings?.[0]?.value && <div className="top-2 left-2">
                      <img width={100}  className="h-auto" src={JSON.parse(user?.app_settings?.[0]?.value).stamp_filename}/>
                 </div>}
                 <div className="justify-around flex">
                     <h2 className="text-[26px] font-medium flex flex-col items-center">
                       <span>{item?.title}</span>
                  </h2>
                     <img className="w-[160px] h-[60px]" src={Logo}/>
                 </div>
  
  
                 <div className="flex px-5 mt-5 justify-between">
  
                     <div className="flex flex-col justify-end items-end">
                          <span>Nome do paciente:</span>
                          <span>Paciente name:</span>
                     </div>
  
                     <div  className="flex-1 border-b border-b-black flex items-end mx-4">
                          <span className="font-medium">{item?.patient?.name}</span>
                     </div>
  
                     <div className="flex items-end ml-5">
                         <span>Pro. No:</span>
                         <span className="flex border-b border-black ml-4 min-w-[200px]">{item?.patient?.id}</span>
                     </div>
                 </div>
  
  
                 <div className="flex px-5 mt-10 justify-between">
  
                     <div className="flex flex-col justify-end items-end">
                          <span>Endereço:</span>
                          <span>Address:</span>
                     </div>
  
                     <div  className="flex-1 border-b border-b-black flex items-end mx-4">
                          <span className="font-medium">{item?.patient?.address}</span>
                     </div>
  
                     <div className="flex items-end ml-5">
                         <span>Tel:</span>
                         <span className="flex border-b border-black ml-4 min-w-[200px]">{item?.patient?.main_contact}</span>
                     </div>

                   </div>

             
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
                                        <span className="flex mb-4"></span>
                                    </>

                                  ))}
                           

                            

                    </div>
  
  
                 <div className="flex-1 flex flex-col justify-end">
                      <div className="mt-10 flex justify-between">
                          <span className="font-medium">{new Date().toISOString().split('T')[0]}</span>
  
                          <div>
                            <div className="flex">
                                <span className="min-w-[100px] flex border-black border-b border-dashed  items-center" >{item?.doctor?.name}</span>
                            </div>
                            <img width={100} className="h-auto" src={doctorSignature}/>
                          </div>
                         
                    </div>

                      <span className="flex w-full justify-center my-5">Dr Online</span>

                      <div className="mt-2 flex justify-between">
                          <img onLoad={()=>{

                          }} width={100}  className="h-auto" src={doctorStamp}/>
                      </div>
                 </div>


      </div>
    )
  }