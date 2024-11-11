import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import { t } from 'i18next'
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import Loader from '../../components/Loaders/loader';
import { useAuth } from '../../contexts/AuthContext';

function Invoice({}) {
  const [message,setMessage]=useState('')
  const [status,setStatus] = useState('')
  const data = useData()
  const [invoice,setInvoice] = useState()
  const [loading,setLoading] = useState(true)
  const {pathname} = useLocation()
  const [sub,setSub]=useState(0)
  const { id } = useParams()
  const {user}=useAuth()


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


if(loading){
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
   <DefaultLayout hide={user?.id ? false : true}>
           
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

            
            <div className={`min-h-[100vh]  py-32 pb-10 px-5 w-full ${message || status==500 ? 'hidden':''} bg-[#D9D9D9]`}>
                 <div className="max-w-[600px] px-3 pb-3 mx-auto flex items-center justify-between">
                     <h2 className="text-[27px]">{t('common.invoice')}</h2>
                     <button onClick={()=>{

                        data.downloadPDF('_invoice',`${t('common.invoice')} #${invoice?.ref_id}`)
                        
                     }} className=" bg-white rounded-[0.3rem] px-2 mt-6 py-1 cursor-pointer text-gray-600 shadow hover:underline mb-3">{t('common.download')}</button>
                    </div>
                 <div id="_invoice" className={`bg-white max-w-[600px] p-10 mx-auto ${pathname.includes('/invoice/') ? '_print print-table':''}`}>
                        <div className="flex justify-between mb-10">
                               <span className="text-[26px] font-bold">Dr. Online</span>
                               <span className="text-[23px]">{t('common.invoice')}</span>
                        </div>

                        <div className="sm:flex justify-between">
                             <div className="max-sm:mb-5">
                                 <span className="text-[21px] font-semibold">{t('invoice.invoice-for')}</span>
                                 <p className="break-words block max-w-[220px] text-[17px] mb-2">{invoice?.user?.name}</p>
                                 <p className="break-words block max-w-[220px] text-[17px]">{invoice?.user?.email}</p>
                             </div>

                             <div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('invoice.date')}</span><span className="text-[15px]">{invoice?.created_at?.split('T')?.[0]}</span></div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('invoice.invoice-number')}</span><span className="text-[15px]">#{invoice?.ref_id}</span></div>
                                 <div className="flex justify-between mb-1"><span className="font-semibold text-[15px] mr-4">{t('common.payment-method')}</span><span className="text-[15px]">{t('common.'+invoice?.payment_method)}</span></div>
                             </div>
                        </div>
        <div className="w-full mt-10 mb-5">

                              

  <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-white">
        <thead class="text-xs text-white uppercase bg-honolulu_blue-500">
            <tr>

                <th scope="col" class="px-6 py-3">
                    {t('invoice.description')}
                </th>
                <th scope="col" class="px-6 py-3">
                    {t('invoice.quantity')}
                </th>
                <th scope="col" class="px-6 py-3">
                    {t('common.price')}
                </th>
                <th scope="col" class="px-6 py-3">
                    Total
                </th>

            </tr>
        </thead>
        <tbody>

            {invoice?.payment_items?.map((i,_i)=>(
                   <tr class="bg-white border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {i.name}
                        </th>
                        <td class="px-6 py-4 text-gray-900 whitespace-nowrap">
                           {i.quantity}
                        </td>
                        <td class="px-6 py-4 text-gray-900 whitespace-nowrap">
                            {data._cn(i.price)} MT
                        </td>
                        <td class="px-6 py-4 text-gray-900 whitespace-nowrap">
                             {data._cn(parseFloat(i.quantity) * parseFloat(i.price))} MT
                        </td>
                    </tr>
            ))}
           
           
        </tbody>
    </table>
</div>
  </div>

     <div className="flex justify-end mb-10">
           <div className="table">
                <div className="flex justify-between border-b py-2">
                    <span className="mr-10 font-semibold">Total</span><span className="text-honolulu_blue-400">{data._cn(parseFloat(invoice?.amount))}</span>
                </div>
           </div>
     </div>

                        <div className="hidden">
                           {/***8<QRCodeGenerator link={`${data.server_url}/api/v1/invoice/`+invoice_number} /> */}
                        </div>

                        <div className="flex justify-center mt-20"><span className="mr-3">{t('invoice.generated-in')}:</span><label>{new Date().toISOString().split('T')?.[0]}</label></div>
                 </div>
           </div>
   </DefaultLayout>
  )
}

export default Invoice