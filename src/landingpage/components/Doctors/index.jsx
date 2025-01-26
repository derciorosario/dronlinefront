import React, { useEffect } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import DoctorList from './list'
import { t } from 'i18next'
import { useHomeData } from '../../contexts/DataContext'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import BasicPagination from '../Pagination/basic'
import Loader from '../Loaders/loader'
import BasicFilter from '../../../components/Filters/basic'
import BasicSearch from '../../../components/Search/basic'
import SelectedFilters from '../../../components/Filters/selected-filters'

export default function Doctors() {
    const data=useHomeData()

    useEffect(()=>{
        data._scrollToSection('top')
    },[])
    
    const [canFetch,setCanFetch]=useState(false)

    let required_data=['doctors']
    const {pathname} = useLocation()

    const [filterOptions,setFilterOptions]=useState([
      {
        open:false,
        field:'specialty_categories',
        name:t('common.specialty'),
        t_name:'specialists',
        search:'',
        items:[],
        param:'medical_specialty',
        fetchable:true,
        selected_ids:new URLSearchParams(window.location.search).get('medical_specialty') ? [parseInt(new URLSearchParams(window.location.search).get('medical_specialty'))] : [],
        default_ids:[]
      },
      {
        open:false,
        field:'gender',
        name:t('form.gender'),
        t_name:'gender',
        search:'',
        items:[
          {name:t('common.female'),id:'female'},
          {name:t('common.male'),id:'male'}
        ],
        param:'gender',
        fetchable:false,
        loaded:true,
        selected_ids:[],
        default_ids:[]
      }
    ])


    const [currentPage,setCurrentPage]=useState(1)
    const [updateFilters,setUpdateFilters]=useState(null)
    const [search,setSearch]=useState('')
    
    
    
    useEffect(()=>{
            if(!canFetch) return
            data._get(required_data,{doctors:{status:'active',name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
            data.handleLoaded('remove','doctors')
    },[pathname,search,currentPage,updateFilters])



  


    useEffect(()=>{
      const doctor = new URLSearchParams(window.location.search).get('doctor');
      if(doctor){
        setSearch(doctor)
      }

      setCanFetch(true)
      setUpdateFilters(Math.random())

      if(new URLSearchParams(window.location.search).get('medical_specialty')){
        data.setShowFilters(true)
      }
      data.setShowFilters(true)
    },[])
  
    
  
  useEffect(()=>{
    data.handleLoaded('remove','doctors')
  
  },[updateFilters])

  

  return (
     <DefaultLayout>
           <div className="mt-[40px]">

           <div className="mx-[50px] max-lg:mx-[20px]" id="our-specialists">
                       <h2 className="mt-bold uppercase text-honolulu_blue-400 text-[25px] mb-10">{t('common.our-specialists')}</h2>          
           </div>


           <div className="flex px-[50px] max-lg:px-[20px]">
           <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
         
            <div className="flex-1">
                <BasicSearch loaded={data._loaded.includes('doctors')} search={search} total={data._doctors?.total} from={'doctors'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                <SelectedFilters setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>     
                
                {!data._loaded.includes('doctors') && <div className="flex-col flex justify-center items-center h-[200px]">
                        <Loader w={30} h={30}/>
                        <span className="mt-2">{t('common.loading')}...</span>
                </div>}
                 {data._loaded.includes('doctors') && <div className="relative w-full">
                    <DoctorList  max={10} items={data._doctors?.data || []}/>
                 </div>}
             </div>
           </div>

          

           <div className="px-[50px]">
           <BasicPagination show={data._loaded.includes('doctors')} from={'doctors'} setCurrentPage={setCurrentPage} total={data._doctors?.total}  current={data._doctors?.current_page} last={data._doctors?.last_page}/>
          
           </div>

           </div>
     </DefaultLayout>
  )
}
