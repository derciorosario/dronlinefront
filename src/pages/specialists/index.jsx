import React,{useEffect,useState} from 'react';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../contexts/AuthContext';
import DoctorCard from '../../components/Cards/doctor';
import CardSkeleton from '../../components/Skeleton/cards';
import BasicFilter from '../../components/Filters/basic';
import BasicSearch from '../../components/Search/basic';
import BasicPagination from '../../components/Pagination/basic';
import SelectDoctorAvailability from '../../components/Cards/selectDoctorAvailability';



function App({showOnlyList}) {
  const data=useData()
  const {user} =  useAuth()
  const { t, i18n } = useTranslation();

  const navigate = useNavigate()

  let required_data=['doctors']
  const {pathname} = useLocation()
  const [search,setSearch]=useState('')



  let contries= [
    { name: t('contries.Afghanistan'), value: "Afghanistan" },
    { name: t('contries.Albania'), value: "Albania" },
    { name: t('contries.Algeria'), value: "Algeria" },
    { name: t('contries.Andorra'), value: "Andorra" },
    { name: t('contries.Angola'), value: "Angola" },
    { name: t('contries.Argentina'), value: "Argentina" },
    { name: t('contries.Armenia'), value: "Armenia" },
    { name: t('contries.Australia'), value: "Australia" },
    { name: t('contries.Austria'), value: "Austria" },
    { name: t('contries.Azerbaijan'), value: "Azerbaijan" },
    { name: t('contries.Bahamas'), value: "Bahamas" },
    { name: t('contries.Bahrain'), value: "Bahrain" },
    { name: t('contries.Bangladesh'), value: "Bangladesh" },
    { name: t('contries.Barbados'), value: "Barbados" },
    { name: t('contries.Belarus'), value: "Belarus" },
    { name: t('contries.Belgium'), value: "Belgium" },
    { name: t('contries.Belize'), value: "Belize" },
    { name: t('contries.Benin'), value: "Benin" },
    { name: t('contries.Bhutan'), value: "Bhutan" },
    { name: t('contries.Bolivia'), value: "Bolivia" },
    { name: t('contries.BosniaAndHerzegovina'), value: "Bosnia and Herzegovina" },
    { name: t('contries.Botswana'), value: "Botswana" },
    { name: t('contries.Brazil'), value: "Brazil" },
    { name: t('contries.Brunei'), value: "Brunei" },
    { name: t('contries.Bulgaria'), value: "Bulgaria" },
    { name: t('contries.BurkinaFaso'), value: "Burkina Faso" },
    { name: t('contries.Burundi'), value: "Burundi" },
    { name: t('contries.Cambodia'), value: "Cambodia" },
    { name: t('contries.Cameroon'), value: "Cameroon" },
    { name: t('contries.Canada'), value: "Canada" },
    { name: t('contries.CapeVerde'), value: "Cape Verde" },
    { name: t('contries.CentralAfricanRepublic'), value: "Central African Republic" },
    { name: t('contries.Chad'), value: "Chad" },
    { name: t('contries.Chile'), value: "Chile" },
    { name: t('contries.China'), value: "China" },
    { name: t('contries.Colombia'), value: "Colombia" },
    { name: t('contries.Comoros'), value: "Comoros" },
    { name: t('contries.Congo'), value: "Congo" },
    { name: t('contries.CostaRica'), value: "Costa Rica" },
    { name: t('contries.Croatia'), value: "Croatia" },
    { name: t('contries.Cuba'), value: "Cuba" },
    { name: t('contries.Cyprus'), value: "Cyprus" },
    { name: t('contries.CzechRepublic'), value: "Czech Republic" },
    { name: t('contries.Denmark'), value: "Denmark" },
    { name: t('contries.Djibouti'), value: "Djibouti" },
    { name: t('contries.Dominica'), value: "Dominica" },
    { name: t('contries.DominicanRepublic'), value: "Dominican Republic" },
    { name: t('contries.Ecuador'), value: "Ecuador" },
    { name: t('contries.Egypt'), value: "Egypt" },
    { name: t('contries.ElSalvador'), value: "El Salvador" },
    { name: t('contries.EquatorialGuinea'), value: "Equatorial Guinea" },
    { name: t('contries.Eritrea'), value: "Eritrea" },
    { name: t('contries.Estonia'), value: "Estonia" },
    { name: t('contries.Eswatini'), value: "Eswatini" },
    { name: t('contries.Ethiopia'), value: "Ethiopia" },
    { name: t('contries.Fiji'), value: "Fiji" },
    { name: t('contries.Finland'), value: "Finland" },
    { name: t('contries.France'), value: "France" },
    { name: t('contries.Gabon'), value: "Gabon" },
    { name: t('contries.Gambia'), value: "Gambia" },
    { name: t('contries.Georgia'), value: "Georgia" },
    { name: t('contries.Germany'), value: "Germany" },
    { name: t('contries.Ghana'), value: "Ghana" },
    { name: t('contries.Greece'), value: "Greece" },
    { name: t('contries.Grenada'), value: "Grenada" },
    { name: t('contries.Guatemala'), value: "Guatemala" },
    { name: t('contries.Guinea'), value: "Guinea" },
    { name: t('contries.GuineaBissau'), value: "Guinea-Bissau" },
    { name: t('contries.Guyana'), value: "Guyana" },
    { name: t('contries.Haiti'), value: "Haiti" },
    { name: t('contries.Honduras'), value: "Honduras" },
    { name: t('contries.Hungary'), value: "Hungary" },
    { name: t('contries.Iceland'), value: "Iceland" },
    { name: t('contries.India'), value: "India" },
    { name: t('contries.Indonesia'), value: "Indonesia" },
    { name: t('contries.Iran'), value: "Iran" },
    { name: t('contries.Iraq'), value: "Iraq" },
    { name: t('contries.Ireland'), value: "Ireland" },
    { name: t('contries.Israel'), value: "Israel" },
    { name: t('contries.Italy'), value: "Italy" },
    { name: t('contries.IvoryCoast'), value: "Ivory Coast" },
    { name: t('contries.Jamaica'), value: "Jamaica" },
    { name: t('contries.Japan'), value: "Japan" },
    { name: t('contries.Jordan'), value: "Jordan" },
    { name: t('contries.Kazakhstan'), value: "Kazakhstan" },
    { name: t('contries.Kenya'), value: "Kenya" },
    { name: t('contries.Kiribati'), value: "Kiribati" },
    { name: t('contries.Kuwait'), value: "Kuwait" },
    { name: t('contries.Kyrgyzstan'), value: 'Kyrgyzstan' },
    { name: t('contries.Laos'), value: 'Laos' },
    { name: t('contries.Latvia'), value: 'Latvia' },
    { name: t('contries.Lebanon'), value: 'Lebanon' },
    { name: t('contries.Lesotho'), value: 'Lesotho' },
    { name: t('contries.Liberia'), value: 'Liberia' },
    { name: t('contries.Libya'), value: 'Libya' },
    { name: t('contries.Liechtenstein'), value: 'Liechtenstein' },
    { name: t('contries.Lithuania'), value: 'Lithuania' },
    { name: t('contries.Luxembourg'), value: 'Luxembourg' },
    { name: t('contries.Madagascar'), value: 'Madagascar' },
    { name: t('contries.Malawi'), value: 'Malawi' },
    { name: t('contries.Malaysia'), value: 'Malaysia' },
    { name: t('contries.Maldives'), value: 'Maldives' },
    { name: t('contries.Mali'), value: 'Mali' },
    { name: t('contries.Malta'), value: 'Malta' },
    { name: t('contries.MarshallIslands'), value: 'Marshall Islands' },
    { name: t('contries.Mauritania'), value: 'Mauritania' },
    { name: t('contries.Mauritius'), value: 'Mauritius' },
    { name: t('contries.Mexico'), value: 'Mexico' },
    { name: t('contries.Micronesia'), value: 'Micronesia' },
    { name: t('contries.Moldova'), value: 'Moldova' },
    { name: t('contries.Monaco'), value: 'Monaco' },
    { name: t('contries.Mongolia'), value: 'Mongolia' },
    { name: t('contries.Montenegro'), value: 'Montenegro' },
    { name: t('contries.Morocco'), value: 'Morocco' },
    { name: t('contries.Mozambique'), value: 'Mozambique' },
    { name: t('contries.Myanmar'), value: 'Myanmar' },
    { name: t('contries.Namibia'), value: 'Namibia' },
    { name: t('contries.Nauru'), value: 'Nauru' },
    { name: t('contries.Nepal'), value: 'Nepal' },
    { name: t('contries.Netherlands'), value: 'Netherlands' },
    { name: t('contries.NewZealand'), value: 'New Zealand' },
    { name: t('contries.Nicaragua'), value: 'Nicaragua' },
    { name: t('contries.Niger'), value: 'Niger' },
    { name: t('contries.Nigeria'), value: 'Nigeria' },
    { name: t('contries.NorthKorea'), value: 'North Korea' },
    { name: t('contries.NorthMacedonia'), value: 'North Macedonia' },
    { name: t('contries.Norway'), value: 'Norway' },
    { name: t('contries.Oman'), value: 'Oman' },
    { name: t('contries.Pakistan'), value: 'Pakistan' },
    { name: t('contries.Palau'), value: 'Palau' },
    { name: t('contries.Panama'), value: 'Panama' },
    { name: t('contries.PapuaNewGuinea'), value: 'Papua New Guinea' },
    { name: t('contries.Paraguay'), value: 'Paraguay' },
    { name: t('contries.Peru'), value: 'Peru' },
    { name: t('contries.Philippines'), value: 'Philippines' },
    { name: t('contries.Poland'), value: 'Poland' },
    { name: t('contries.Portugal'), value: 'Portugal' },
    { name: t('contries.Qatar'), value: 'Qatar' },
    { name: t('contries.Romania'), value: 'Romania' },
    { name: t('contries.Russia'), value: 'Russia' },
    { name: t('contries.Rwanda'), value: 'Rwanda' },
    { name: t('contries.SaintKittsAndNevis'), value: 'Saint Kitts and Nevis' },
    { name: t('contries.SaintLucia'), value: 'Saint Lucia' },
    { name: t('contries.SaintVincentAndTheGrenadines'), value: 'Saint Vincent and the Grenadines' },
    { name: t('contries.Samoa'), value: 'Samoa' },
    { name: t('contries.SanMarino'), value: 'San Marino' },
    { name: t('contries.SaoTomeAndPrincipe'), value: 'Sao Tome and Principe' },
    { name: t('contries.SaudiArabia'), value: 'Saudi Arabia' },
    { name: t('contries.Senegal'), value: 'Senegal' },
    { name: t('contries.Serbia'), value: 'Serbia' },
    { name: t('contries.Seychelles'), value: 'Seychelles' },
    { name: t('contries.SierraLeone'), value: 'Sierra Leone' },
    { name: t('contries.Singapore'), value: 'Singapore' },
    { name: t('contries.Slovakia'), value: 'Slovakia' },
    { name: t('contries.Slovenia'), value: 'Slovenia' },
    { name: t('contries.SolomonIslands'), value: 'Solomon Islands' },
    { name: t('contries.Somalia'), value: 'Somalia' },
    { name: t('contries.SouthAfrica'), value: 'South Africa' },
    { name: t('contries.SouthKorea'), value: 'South Korea' },
    { name: t('contries.SouthSudan'), value: 'South Sudan' },
    { name: t('contries.Spain'), value: 'Spain' },
    { name: t('contries.SriLanka'), value: 'Sri Lanka' },
    { name: t('contries.Sudan'), value: 'Sudan' },
    { name: t('contries.Suriname'), value: 'Suriname' },
    { name: t('contries.Sweden'), value: 'Sweden' },
    { name: t('contries.Switzerland'), value: 'Switzerland' },
    { name: t('contries.Syria'), value: 'Syria' },
    { name: t('contries.Taiwan'), value: 'Taiwan' },
    { name: t('contries.Tajikistan'), value: 'Tajikistan' },
    { name: t('contries.Tanzania'), value: 'Tanzania' },
    { name: t('contries.Thailand'), value: 'Thailand' },
    { name: t('contries.TimorLeste'), value: 'Timor-Leste' },
    { name: t('contries.Togo'), value: 'Togo' },
    { name: t('contries.Tonga'), value: 'Tonga' },
    { name: t('contries.TrinidadAndTobago'), value: 'Trinidad and Tobago' },
    { name: t('contries.Tunisia'), value: 'Tunisia' },
    { name: t('contries.Turkey'), value: 'Turkey' },
    { name: t('contries.Turkmenistan'), value: 'Turkmenistan' },
    { name: t('contries.Tuvalu'), value: 'Tuvalu' },
    { name: t('contries.Uganda'), value: 'Uganda' },
    { name: t('contries.Ukraine'), value: 'Ukraine' },
    { name: t('contries.UnitedArabEmirates'), value: 'United Arab Emirates' },
    { name: t('contries.UnitedKingdom'), value: 'United Kingdom' },
    { name: t('contries.UnitedStates'), value: 'United States' },
    { name: t('contries.Uruguay'), value: 'Uruguay' },
    { name: t('contries.Uzbekistan'), value: 'Uzbekistan' },
    { name: t('contries.Vanuatu'), value: 'Vanuatu' },
    { name: t('contries.VaticanCity'), value: 'Vatican City' },
    { name: t('contries.Venezuela'), value: 'Venezuela' },
    { name: t('contries.Vietnam'), value: 'Vietnam' },
    { name: t('contries.Yemen'), value: 'Yemen' },
    { name: t('contries.Zambia'), value: 'Zambia' },
    { name: t('contries.Zimbabwe'), value: 'Zimbabwe' }
  ]
  


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
      selected_ids:[],
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
    },
    {
      open:false,
      field:'years_of_experience',
      name:t('common.years_of_experience'),
      t_name:'years_of_experience',
      search:'',
      items:[],
      param:'years_of_experience',
      fetchable:true,
      selected_ids:[],
      default_ids:[]
    },
    /*{
      open:false,
      field:'country_of_residence',
      name:t('form.country_of_residence'),
      t_name:'form.country_of_residence',
      search:'',
      items:contries.map(i=>({...i,id:i.value})),
      param:'country_of_residence',
      fetchable:false,
      selected_ids:[],
      loaded:true,
      default_ids:[]
    }*/
  ])
 


  const [currentPage,setCurrentPage]=useState(1)
  const [updateFilters,setUpdateFilters]=useState(null)
  
  useEffect(()=>{ 
        if(!user) return
        data._get(required_data,{doctors:{name:search,page:currentPage,...data.getParamsFromFilters(filterOptions)}}) 
  },[user,pathname,search,currentPage,updateFilters,data.updateTable])

useEffect(()=>{
  data.handleLoaded('remove','doctors')
},[updateFilters])
    
  useEffect(()=>{
    data.setSelectedDoctors({})
},[pathname])


  useEffect(()=>{
    if(data.updateTable){
         data.setUpdateTable(null)
         data.handleLoaded('remove','doctors')
    }
 },[data.updateTable])



 function pageContet(){

    return   (
      <>
            
            <div className="flex">
                <BasicFilter setUpdateFilters={setUpdateFilters} filterOptions={filterOptions}  setFilterOptions={setFilterOptions}/>
                <div className="flex-1">
                  <BasicSearch total={data._doctors?.total} from={'doctors'} setCurrentPage={setCurrentPage} setSearch={setSearch} />
                  <div className={`flex flex-wrap gap-2 ease-in transition ${!data._loaded.includes('doctors') ? 'hidden':''}`}>
                        {data._doctors?.data?.map(i=>(
                          <DoctorCard item={i}/>
                        ))}
                  </div>
                  {!data._loaded.includes('doctors') && <CardSkeleton replicate={3}/>}
                </div>
             </div>
             <BasicPagination show={data._loaded.includes('doctors')} from={'doctors'} setCurrentPage={setCurrentPage} total={data._doctors?.total}  current={data._doctors?.current_page} last={data._doctors?.last_page}/>
          
      </>
    )
 }


 if(showOnlyList){
  return (
    <>
     {pageContet()}
    </>
 )
 }


  return (
   
         <DefaultLayout  pageContent={{page:'specialists',title:t('common.specialists'),desc:t('titles.specialists'),btn:{onClick:user?.role=="patient" ? (e)=>{
              
             if(!user?.data?.date_of_birth){
                data._showPopUp('basic_popup','conclude_patient_info')
              }else{
                navigate('/add-appointments')
              }
              
         } : null,text:t('menu.add-appointments')}}}>

           {pageContet()}

         </DefaultLayout>
  );
}

export default App;
