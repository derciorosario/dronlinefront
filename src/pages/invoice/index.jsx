import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import i18next, { t } from 'i18next'
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import Loader from '../../components/Loaders/loader';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/images/dark-logo-1.png'

function Invoice({}) {
  const [message,setMessage]=useState('')
  const [status,setStatus] = useState('')
  const data = useData()
  const [invoice,setInvoice] = useState()
  const [loading,setLoading] = useState(true)
  const {pathname} = useLocation()
  const [sub,setSub]=useState(0)
  const { id } = useParams()
  const {user,serverTime}=useAuth()
  const [appSettings,setAppSettings]=useState(null)

  let required_data=['specialty_categories']





  async function get_invoice(){

        try{
            let response=await data.makeRequest({method:'get',url:`api/invoice/`+id,withToken:true, error: ``},0);
           if(!response?.id){
             setStatus(404)
           }else{
             setStatus(200)
             setInvoice(response)
           }

           setLoading(false)
        }catch(e){
            console.log({e})
            setLoading(false)
        }

  }

  useEffect(()=>{
     get_invoice()
  },[])


  useEffect(()=>{
    data._scrollToSection('top')
  },[pathname])

  useEffect(()=>{
        
    setTimeout(()=>(
      data._get(required_data) 
    ),500)

},[pathname])


useEffect(()=>{

    (async()=>{
       setAppSettings(null)
       try{
           let r=await data.makeRequest({method:'get',url:`api/userdata/`,withToken:true, error: ``},1000);
           setAppSettings({...JSON.parse(r.app_settings[0].value)})
       }catch(e){
           console.log({e})
       }
    })()


  },[])



useEffect(()=>{

    /*if(invoice){
        setSub(invoice?.payment_items?.map(i=>parseFloat(i.price) * parseInt(i.quantity))?.reduce((acc, curr) => acc + curr, 0))
    }else{
        setSub(0)
    }*/
      
},[invoice])


useEffect(()=>{
    if(status==404){
        setMessage(t('common.item-not-found'))
    }
},[status])


if(loading || !appSettings){
     return (
        <DefaultLayout hide={user?.id ? false : true}>
         <div className="flex justify-center flex-col h-[80vh]">
            <div className={`flex justify-center`}>
              <Loader/> <span>{t('common.loading')}...</span>
            </div>
          </div>
          </DefaultLayout>
     )
 }

  
  return (
   <DefaultLayout hide={user?.id ? false : true} hideSupportBadges={true}>
           
           <div className={`${!message && status!=500 ? 'hidden' :'mt-20'} flex  min-h-[40vh] items-center justify-center flex-col`}>
               {message &&  <div id="alert-2" className="flex items-center w-[300px] p-4 my-2 text-red-800 rounded-lg bg-white shadow" role="alert">
                <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ms-3 text-sm font-medium">
                    {message}
                  </div>
                  
                </div>}

                {status==500 && <div onClick={()=>window.location.reload()}>

                    <DefaultButton text={t('messages.try-again')}/>

                </div>}
           </div>

            
            <div className={`min-h-[100vh]  py-20 max-md:py-10 pb-10 px-5 w-full ${message || status==500 ? 'hidden':''} bg-[#D9D9D9]`}>
                 <div className="max-w-[700px] px-3 pb-3 mx-auto flex items-center justify-between">
                     <h2 className="text-[27px]">{t('common.invoice')}</h2>
                     <button onClick={()=>{

                        data.downloadPDF('_invoice',`${t('common.invoice')} #${invoice?.ref_id}`)
                        
                     }} className=" bg-white rounded-[0.3rem] px-2 mt-6 py-1 cursor-pointer text-gray-600 shadow hover:underline mb-3">{t('common.download')}</button>
                    </div>
                 <div id="_invoice" className={`bg-white max-w-[700px] min-h-[90vh] p-10 max-md:p-5 mx-auto ${pathname.includes('/invoice/') ? '_print print-table':''}`}>
                         <span className={`flex mb-2 justify-end text-[14px] ${invoice?.status=="pending" ? 'text-orange-400':invoice?.status=="approved" ? ' text-green-500':' text-red-500'}`}>{t('common.'+invoice?.status)}</span>
               
                        <div className="flex justify-between mb-10">
                               <img className="md:w-[130px]  w-[100px]" src={Logo}/>
                               <span className="text-[26px] font-bold hidden">Dr. Online</span>
                               <span className="text-[23px] max-md:text-[19px]">{t('common.invoice')}</span>
                        </div>

                        <div className="sm:flex justify-between">
                             <div className="max-sm:mb-5">
                                 <span className="text-[21px] font-semibold">{t('invoice.invoice-for')}:</span>
                                 <p className="break-words block max-w-[200px] text-[17px] mb-2">{invoice?.user?.name}</p>
                                 <p className="break-words block max-w-[200px] text-[17px]">{invoice?.patient?.main_contact}</p>
                                 <p className="break-words block max-w-[200px] text-[17px]">{invoice?.patient?.address}</p>
                             </div>

                             <div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[14px] mr-4">{t('invoice.date')}:</span><span className="text-[15px]">{invoice?.created_at?.split('T')?.[0]}</span></div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[14px] mr-4">{t('invoice.invoice-number')}:</span><span className="text-[15px]">#{invoice?.ref_id}</span></div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[14px] mr-4">{t('common.payment-method')}:</span><span className="text-[15px] break-words w-[100px] block text-right">{t('common.'+invoice?.payment_method)}</span></div>
                             </div>
                        </div>
        <div className="w-full mt-10 mb-5">

                              

  <div class="relative overflow-x-auto _invoice_table">
   

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 lg:table-fixed">
        <thead class="text-xs text-white uppercase bg-honolulu_blue-500">
            <tr>
                <th scope="col" class="px-6 py-3">
                    {t('invoice.description')}
                </th>
                <th scope="col" class="px-6 py-3">
                    {t('common.price')}
                </th>
                <th scope="col" class="px-6 py-3">
                    Sub total
                </th>
                <th scope="col" class="px-6 py-3">
                    Total
                </th>
            </tr>
        </thead>
        <tbody>
           
            <tr class="bg-white  hover:bg-gray-50">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900">
                     {t('common.consultation-scheduling',{medical_specialty:data._specialty_categories.filter(i=>i.id==invoice?.doctor?.medical_specialty)[0]?.[i18next.language+"_name"]})}
                </th>
                
                <td class="px-6 py-4">
                {data._cn(parseFloat(invoice?.price))} MT
                </td>
                <td class="px-6 py-4">
                {data._cn(parseFloat(invoice?.price))} MT
                </td>
                <td class="px-6 py-4">
                {data._cn(parseFloat(invoice?.amount))} MT
                </td>
               
            </tr>
        </tbody>
    </table>
</div>



</div>

  </div>

     <div className="flex justify-end mb-10">
           <div className="table">
                <div className="flex justify-between border-b py-2">
                    <span className="mr-10 font-semibold">Sub total</span><span className="text-gray-600">{data._cn(parseFloat(invoice?.price))} MT</span>
                </div>
                <div className="flex justify-between border-b py-2 hidden">
                    <span className="mr-10 font-semibold">{t('common.taxes')}</span><span className="text-gray-600">{data._cn(parseFloat(invoice?.taxes))} MT</span>
                </div>
                {(invoice?.price > invoice?.amount) && <div className="flex justify-between border-b py-2">
                    <span className="mr-10 font-semibold ">{t('common.refund')}</span><span className="text-green-500">{data._cn(parseFloat(invoice?.price) - parseFloat(invoice?.amount))} MT</span>
                </div>}
                <div className="flex justify-between border-b py-2">
                    <span className="mr-10 font-semibold">Total</span><span className="text-honolulu_blue-400">{data._cn(parseFloat(invoice?.amount))} MT</span>
                </div>
           </div>
     </div>

                        

                        <div className="flex justify-center mt-40"><span className="mr-3">{t('invoice.generated-in')}:</span><label>{serverTime?.date} {serverTime?.hour} </label></div>
                        <div className="w-full text-[0.8rem] flex-wrap max-md:text-[0.7rem] flex justify-between mt-10 border-t border-t-gray-200 py-3">
                                <span>{appSettings?.name}</span>
                                <div className="flex max-sm:flex-col">
                                    <span>{appSettings?.email}</span>
                                    <label className="mx-2 max-sm:hidden">|</label>
                                    <span>{appSettings?.main_contact}</span>
                                </div>
                        </div>
                 </div>
           </div>
   </DefaultLayout>
  )
}

export default Invoice