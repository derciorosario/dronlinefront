import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import BaiscTable from '../../components/Tables/basic';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import BasicPagination from '../../components/Pagination/basic';
import BasicSearch from '../../components/Search/basic';
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm';
import BasicFilter from '../../components/Filters/basic';

function App() { 
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()
  const [loading,setLoading]=useState(false)

  let required_data=['waiting_list']
  const {pathname} = useLocation()
  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  const [search,setSearch]=useState('')

  const [endDate,setEndDate]=useState('')
  const [startDate,setStartDate]=useState('')
    
  


 

  useEffect(()=>{ 
    if(!user) return
    data._get(required_data,{waiting_list:{name:search,page:currentPage,start_date:startDate,end_date:endDate,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage,updateFilters])


  useEffect(()=>{
    data.handleLoaded('remove','waiting_list')
  },[updateFilters])

  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','waiting_list')
         setCurrentPage(1)
         setLoading(false)
         data._get(required_data,{waiting_list:{name:search,page:currentPage,start_date:startDate,end_date:endDate,...data.getParamsFromFilters(filterOptions)}}) 

    }
 },[data.updateTable])

 useEffect(()=>{ 
        data.setUpdateTable(Math.random())
 },[endDate,startDate])



 const [filterOptions,setFilterOptions]=useState(
    data.waitingListOptions.map(option => ({
      open: false,
      field: option.name,
      name: t(`wl.${option.name}`),
      search: '',
      items: option.items.map(item => ({
        name: t(`wl.${item}`),
        id: item
      })),
      param: option.name,
      fetchable: false,
      loaded: true,
      selected_ids: [],
      default_ids: []
    }))
 )


 return (
   
  <DefaultLayout
    
     pageContent={{page:'waiting_list',title:t('common.waiting-list') + ` - ${t('common.stats')}`,desc:''}}>
      
     

      <div className="flex">
              {/*** <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
                */}
                <div className="flex-1">
                 {/** <BasicSearch hideResults={true} loaded={data._loaded.includes('waiting_list')} hideSearch={true} total={data._doctors?.total} search={search} from={'waiting_list'} setCurrentPage={setCurrentPage} setSearch={setSearch} />**/}
                  {!data._loaded.includes('waiting_list') && <DefaultFormSkeleton/>}

                
                  <div className={`flex ${!data._loaded.includes('waiting_list') ? 'hidden':''}`}>
                    <div className="flex w-full flex-wrap gap-4">
                            {data.waitingListOptions.map((i,_i)=>(
                                <div key={_i} className={`w-[30%] max-lg:w-[45%] max-md:w-full ${i.name=="most_frequent_consultation" ? '!w-full':''} mb-3`}>
                                    <span className="font-normal">{t('wl.'+i.name)}</span>
                                    <div className={`w-full mt-3 ${i.name=="most_frequent_consultation" ? 'flex flex-wrap':''}`}>
                                        {i.items.map((f,_f)=>(
                                            <div className="flex items-center mr-4">
                                                <span className="flex text-gray-500">{t('wl.'+f)}</span> 
                                                <span className="ml-2 flex">{data._waiting_list.option_counts?.[i.name]?.[f] || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div> 
                </div>
                 
                </div>
    </div>


      
    
      
   </DefaultLayout>
);
}

export default App;
