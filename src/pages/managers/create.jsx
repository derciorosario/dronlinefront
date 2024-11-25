import React, { useEffect, useState } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import DefaultLayout from '../../layout/DefaultLayout'
import Messages from '../messages/index'
import { t } from 'i18next'
import FileInput from '../../components/Inputs/file'
import PatientForm from '../../components/Patient/form'
import { useData } from '../../contexts/DataContext'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AdditionalMessage from '../messages/additional'
import { useAuth } from '../../contexts/AuthContext'
import DefaultFormSkeleton from '../../components/Skeleton/defaultForm'
import LogoFIle from '../../components/Inputs/logo'
import toast from 'react-hot-toast'

function addPatients({ShowOnlyInputs}) {

  const [message,setMessage]=useState('')
  const [verified_inputs,setVerifiedInputs]=useState([])
  const [valid,setValid]=useState(false)
  const [messageType,setMessageType]=useState('red')
  const data = useData()
  const [searchParams, setSearchParams] = useSearchParams();
          

  const { id } = useParams()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  
  const [loading,setLoading]=useState(false);
  const [itemToEditLoaded,setItemToEditLoaded]=useState(false)
  const [MessageBtnSee,setMessageBtnSee]=useState(null)

  const {user} = useAuth()

  let initial_form={
    name:'',
    email:'',
  }
  const [form,setForm]=useState(initial_form)

  
  useEffect(()=>{

    let v=true

    if(!form.name ||
       !form.email
    ){
       v=false
    }

    setValid(v)

   
 },[form])



 let required_data=['specialty_categories']
 useEffect(()=>{
       if(!user) return
       setTimeout(()=>(
         data._get(required_data) 
       ),500)

 },[user,pathname])



 
 



const default_selected_permissions= {
  patient:[],
  doctor:[],
  specialty_categories:[],
  doctor_requests:[],
  payment_management:[],
  doctor_availability:[],
  appointments:[],
  feedback:[],
  support:[],
  app_settings:[],
  stats:[]
 }

const [selectedPermissions,setSelectedPermissions]=useState(default_selected_permissions)



const [permissions,setPermissions]=useState([
  {
    "resource":"patient",
    "actions":['read','create','update','delete']
  },
  {
    "resource":"doctor",
    "actions":['read','create','update','delete']
  },
  {
    "resource":"specialty_categories",
    "actions":['read','create','update']
  },
  {
    "resource":"doctor_requests",
    "actions":['read']
  },
  {
    "resource":"payment_management",
    "actions":['read','approve','reject']
  },
  {
    "resource":"doctor_availability",
    "actions":['read','update']
  },
  {
    "resource":"appointments",
    "actions":['read','reschedule','cancel']
  },
  {
    "resource":"feedback",
    "actions":['read','approve','reject']
  },
  {
    "resource":"support",
    "actions":['read','send-message']
  },
  {
    "resource":"app_settings",
    "actions":['read','create','update','delete']
  },
  {
    "resource":"stats",
    "actions":['read']
  }
])

  






useEffect(()=>{
  if(!user || !id){
      return
  }


  
  (async()=>{
    try{

      let response=await data.makeRequest({method:'get',url:`api/manager/`+id,withToken:true, error: ``},0);

       console.log({response})
       setForm({...form,...response.manager})
       setSelectedPermissions({...default_selected_permissions,...response.permissions})

      setLoading(false)

      setItemToEditLoaded(true)

    }catch(e){

      console.log({e})

      if(e.message==404){
         toast.error(t('common.item-not-found'))
         navigate('/managers')
      }else  if(e.message=='Failed to fetch'){
        
      }else{
        toast.error(t('common.unexpected-error'))
        navigate('/managers')  
      }
  }
 })()
},[user,pathname])





  async function SubmitForm(){
    setLoading(true)






    try{

        let _permissions=[]
        Object.keys(selectedPermissions).forEach(i=>{
          if(selectedPermissions[i].length){
            _permissions.push(
              {
                "resource": i,
                "actions": selectedPermissions[i]
              }
            )
          }
       })

       


       if(id){
        
        let r=await data.makeRequest({method:'post',url:`api/manager/`+id,withToken:true,data:{
          ...form,
          permissions:_permissions
        }, error: ``},0);
        setMessage(t('messages.updated-successfully'))
        setLoading(false)
        setMessageType('green')

      }else{

        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))){
          setMessage(t('common.invalid-email'))
          setMessageType('red')
          setLoading(false)
          return
        }

     
        await data.makeRequest({method:'post',url:`api/manager`,withToken:true,data:{
          ...form,permissions:_permissions
        }, error: ``},0)
        setLoading(false)
        setForm({...initial_form})
        setMessageType('green')
        setMessage(t('messages.added-successfully'))
        setLoading(false)
        data.handleLoaded('remove','doctors')
        setVerifiedInputs([])
        setSelectedPermissions(default_selected_permissions)
      }


    }catch(e){

      setMessageType('red')

      if(e.message==409 || e.message==422){
        setMessage(t('common.email-used'))
      }else if(e.message==400){
        setMessage(t('common.invalid-data'))
      }else if(e.message==500){
        setMessage(t('common.unexpected-error'))
      }else  if(e.message=='Failed to fetch'){
          setMessage(t('common.check-network'))
      }else{
          setMessage(t('common.unexpected-error'))
      }

      setLoading(false)
      
      
    }
  }

 



  
  return (

     <DefaultLayout hide={ShowOnlyInputs} pageContent={{btn:!id ? null : {onClick:()=>{ 
         navigate('/add-managers')
     },text:t('menu.add-managers')}}}>

          <AdditionalMessage btnSee={MessageBtnSee} float={true} type={messageType}  setMessage={setMessage} title={message} message={message}/>
          
            {!itemToEditLoaded && id && <div className="mt-10">
              <DefaultFormSkeleton/>
            </div>}

           <FormLayout hide={!itemToEditLoaded && id} hideTitle={ShowOnlyInputs} title={id ? t('common.update-manager') : t('common.add-manager')} verified_inputs={verified_inputs} form={form}
           
            bottomContent

              button={(
                <div className="mt-[60px]">
                  <FormLayout.Button onClick={SubmitForm} valid={valid} loading={loading} label={loading ? t('common.loading') : id ? t('common.update') : t('common.send') }/>
                </div>
              )}
              >

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form} 
              r={true} 
              label={t('form.full-name')}
              onBlur={() => setVerifiedInputs([...verified_inputs, 'name'])} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              field={'name'} 
              value={form.name}
            />

            <FormLayout.Input 
              verified_inputs={verified_inputs} 
              form={form}
              label={'Email'} 
              r={true} 
              onBlur={() => setVerifiedInputs([...verified_inputs, 'email'])} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              field={'email'} 
              value={form.email}
            />


     <div className="w-full">


              

<div class="relative overflow-x-auto">

    <h2 className="mt-7 mb-5">{t('common.permissions')}</h2>

    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
                <th scope="col" class="px-6 py-3">
                    {t('common.module')}
                </th>
                <th scope="col" class="px-6 py-3">
                    {t('common.permissions')}
                </th>
            </tr>
        </thead>
        <tbody>

               {permissions.map((i,_i)=>(
                  <tr class="bg-white">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                       <div className="flex items-center cursor-pointer">
                          <input onChange={()=>{
                              if(!selectedPermissions[i.resource].length){
                                setSelectedPermissions({...selectedPermissions,[i.resource]:i.actions})
                              }else if(selectedPermissions[i.resource].length==i.actions.length){
                                setSelectedPermissions({...selectedPermissions,[i.resource]:[]})
                              }else{
                                setSelectedPermissions({...selectedPermissions,[i.resource]:i.actions})
                              }
                          }} checked={selectedPermissions[i.resource].length==i.actions.length} id={i.resource+"item"} type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />
                          <label for={i.resource+"item"} className="ml-2 cursor-pointer">{t('common.'+i.resource.replaceAll('_','-'))}</label>
                        </div>
                    </th>

                    {i.actions.map(f=>(
                      <td class="px-6 py-4 cursor-pointer">
                        <div className="flex items-center">
                          <input onChange={()=>{
                              setSelectedPermissions({...selectedPermissions,[i.resource]:selectedPermissions[i.resource].includes(f) ? selectedPermissions[i.resource].filter(z=>z!=f) : [...selectedPermissions[i.resource],f]})
                          }} checked={selectedPermissions[i.resource].includes(f)} id={i.resource+f} type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />
                          <label for={i.resource+f} className="ml-2 cursor-pointer">{t('common.'+f)}</label>
                        </div>
                     </td>

                    ))}
                </tr>
               ))}

        </tbody>
    </table>
</div>




            </div>


            </FormLayout>


     </DefaultLayout>
  )
}

export default addPatients