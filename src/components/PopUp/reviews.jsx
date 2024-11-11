import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useData } from '../../contexts/DataContext'


function Reviews() {
    const data=useData()

 const [details,setDetails]=useState(null)
 useEffect(()=>{
    setDetails(data._openPopUps.reviews)
 },[data._openPopUps.reviews])


 
  return (

     <div  className={`w-full  h-[100vh] bg-[rgba(0,0,0,0.4)] ease-in  _reviews ${details ? '':'opacity-0 pointer-events-none translate-y-[100px]'} ease-in transition-all delay-75 fixed flex items-center justify-center z-50`}>   
          <div class="w-full h-[90vh] overflow-y-auto  p-4 relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[950px]">
                     

          <div class="flex items-center justify-between mb-4">

          <h5 class="text-xl font-bold leading-none text-gray-900 flex items-center">{t('common.reviews')} - {details?.name} <label className="text-honolulu_blue-400 items-center ml-2 text-[16px] font-normal flex"><svg className="fill-honolulu_blue-400" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16px" viewBox="0 0 24 24" ><g><path d="M0 0h24v24H0V0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/></g><g><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></g></svg> {details?.average_rating?.slice(0,3)}</label></h5>

          <div onClick={()=>data._closeAllPopUps()} className="w-[30px] cursor-pointer h-[30px] absolute right-1 top-1 rounded-full bg-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </div>         

          </div>

          <div>


        



          {details?.reviews?.filter(i=>i.comment)?.map((i,_i)=>(

            <article class="p-6 text-base bg-white border-t border-gray-200">
            <footer class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <p class="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">{i?.user?.name}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-06-23"
                            title="June 23rd, 2022">{i.created_at.split('T')[0]}</time></p>
                </div>
                <button id="dropdownComment4Button" data-dropdown-toggle="dropdownComment4"
                    class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                    type="button">
                   
                </button>
            
            </footer>
            <p class="text-gray-500">{i.comment}</p>
            <div class="flex items-center mt-4 space-x-4">
                {i.rating && <button type="button"
                    class="flex items-center  text-sm text-honolulu_blue-400 hover:underline font-medium">
                    <svg className="fill-honolulu_blue-400" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="16px" viewBox="0 0 24 24" ><g><path d="M0 0h24v24H0V0z" fill="none"/><path d="M0 0h24v24H0V0z" fill="none"/></g><g><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></g></svg>
                    {i.rating}
                </button>}
            </div>
        </article>

          ))}

          


               

              
          </div>


           </div>
     </div>
           
  )
}

export default Reviews