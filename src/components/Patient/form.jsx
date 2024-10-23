import { t } from 'i18next'
import React, { useEffect } from 'react'
import FormLayout from '../../layout/DefaultFormLayout'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../../../landingpage/src/i18n'



function PatientForm({form_name,form,setForm,verified_inputs,setVerifiedInputs,itemsToHide,hide,cannot_edit}) {

  const data=useData()
  const {user} = useAuth()

  if(hide){
    return <></>
  }


  function handleList({action,form,setForm,list,input}){

    if(action=="add"){
      setForm({...form,[list]:[...form[list].filter(i=>i!=form[input]),{id:Math.random(),name:form[input]}]})
      setForm(prev=>({...prev,[input]:''}))
    }else{
      
    }
  

  }

  function confirmContent({form,setForm,field}){
    return (
        <>
        {form[field]!= true && <div className="flex items-center gap-x-4 mb-2">
                                <label onClick={()=>setForm({...form,[field]:false})} className="flex items-center cursor-pointer hover:opacity-70">
                                    <input type="radio" name={field} checked={form[field]==false}  className="mr-1 cursor-pointer"/>
                                    <span>{t('common.no')}</span>
                                </label>

                                <label onClick={()=>setForm({...form,[field]:true})} className="flex  items-center cursor-pointer hover:opacity-70">
                                    <input type="radio" name={field} checked={form[field]==true} className="mr-1 cursor-pointer"/>
                                    <span>{t('common.yes')}</span>
                                </label>
         </div>}
        </>
    )
  }

  function listItems({list,form}){
      return (<div>
        <div className="w-full flex py-1 gap-y-1 flex-wrap px-1 items-center min-h-[35px] bg-gray-100 rounded-[0.3rem] rounded-t-none">
        {!form[list]?.length ? <span className="text-gray-500 text-[0.8rem]">{t('common.no-item-added')}</span> : ''}
         {form[list]?.map((i,_i)=>(
            <span className="px-2 mr-1 py-1 border rounded-[0.3rem] bg-white inline-flex items-center text-[0.8rem]">{i.name} <label onClick={()=>{
            setForm({...form,[list]:form[list].filter((_,_f)=>_f!=_i)})
         }} className="cursor-pointer hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></label></span>
       
       ))}
       
    </div>
        <span onClick={()=>setForm({...form,['has_'+list]:false})} className="text-[14px] cursor-pointer underline text-honolulu_blue-400">{t('common.not-add-items')}</span>
    </div>)
  }



  let required_data=['specialty_categories']
  useEffect(()=>{
        if(!user) return
        setTimeout(()=>(
          data._get(required_data) 
        ),500)
  },[user])


  return (
    <>


      


              <FormLayout.Input disabled={data.auth.type=="google"} verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'name'])} label={t('form.full-name')} onChange={(e)=>setForm({...form,name:e.target.value})} field={'name'} value={form.name}  />
              <FormLayout.Input disabled={data.auth.type=="google"} verified_inputs={verified_inputs} form={form}  r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'email'])} label={'Email'} onChange={(e)=>setForm({...form,email:e.target.value})} field={'email'} value={form.email}/>
              <FormLayout.Input hide={itemsToHide?.includes('password')} errorMsg={
                 (form.length <= 7 && verified_inputs.includes('password')) ? t('messages.password-min-8') : verified_inputs.includes('password') && !form.password ? t('common.required-field') :''
              } verified_inputs={verified_inputs} form={form} r={true} type={'password'} onBlur={()=>setVerifiedInputs([...verified_inputs,'password'])} label={t('form.password')} onChange={(e)=>setForm({...form,password:e.target.value})} field={'password'} value={form.password}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true} type={'date'} onBlur={()=>setVerifiedInputs([...verified_inputs,'date_of_birth'])} label={t('form.date-of-birth')} onChange={(e)=>setForm({...form,date_of_birth:e.target.value})} field={'date_of_birth'} value={form.date_of_birth}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'main_contact'])} label={t('form.main-contact')} onChange={(e)=>setForm({...form,main_contact:e.target.value.replace(/[^0-9]/g, '')})} field={'main_contact'} value={form.main_contact}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} onBlur={()=>setVerifiedInputs([...verified_inputs,'alternative_contact'])} label={t('form.alternative-contact')} onChange={(e)=>setForm({...form,alternative_contact:e.target.value.replace(/[^0-9]/g, '')})} field={'alternative_contact'} value={form.alternative_contact}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true}  onBlur={()=>setVerifiedInputs([...verified_inputs,'occupation'])} label={t('form.occupation')} onChange={(e)=>setForm({...form,occupation:e.target.value})} field={'occupation'} value={form.occupation}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true}  onBlur={()=>setVerifiedInputs([...verified_inputs,'province_of_residence'])} label={t('form.province_of_residence')} onChange={(e)=>setForm({...form,province_of_residence:e.target.value})} field={'province-of-residence'} value={form.province_of_residence}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true}  onBlur={()=>setVerifiedInputs([...verified_inputs,'residential_address'])} label={t('form.residential_address')} onChange={(e)=>setForm({...form,residential_address:e.target.value})} field={'residential-address'} value={form.residential_address}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true}  onBlur={()=>setVerifiedInputs([...verified_inputs,'nationality'])} label={t('form.nationality')} onChange={(e)=>setForm({...form,nationality:e.target.value})} field={'residential-address'} value={form.nationality}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'years_of_experience'])} label={t('common.years_of_experience')} onChange={(e)=>setForm({...form,years_of_experience:e.target.value.replace(/[^0-9]/g, '')})} field={'years_of_experience'} value={form.years_of_experience}/>
         
              <FormLayout.Input 
                  verified_inputs={verified_inputs} 
                  form={form} 
                  r={true} 
                  hide={itemsToHide?.includes('medical-specialty')}
                  selectOptions={

                    data._specialty_categories.map((i,_i)=>({
                       name:i[i18n.language+"_name"] ? i[i18n.language+"_name"] : i.pt_name,
                       value:i.id
                    }))

                    /*[

                      { name: t('common.cardiology'), value: 'cardiology' },
                      { name: t('common.dermatology'), value: 'dermatology' },
                      { name: t('common.neurology'), value: 'neurology' },
                      { name: t('common.pediatrics'), value: 'pediatrics' },
                      { name: t('common.orthopedics'), value: 'orthopedics' },
                      { name: t('common.psychiatry'), value: 'psychiatry' },
                      { name: t('common.radiology'), value: 'radiology' },
                      { name: t('common.oncology'), value: 'oncology' },
                      { name: t('common.gastroenterology'), value: 'gastroenterology' },
                      { name: t('common.ophthalmology'), value: 'ophthalmology' },
                      { name: t('common.endocrinology'), value: 'endocrinology' },
                      { name: t('common.gynecology'), value: 'gynecology' },
                      { name: t('common.urology'), value: 'urology' },
                      { name: t('common.pulmonology'), value: 'pulmonology' }
                    ]*/
                  }
                  onBlur={() => setVerifiedInputs([...verified_inputs, 'medical-specialty'])} 
                  label={t('form.medical-specialty')} 
                  onChange={(e) => setForm({...form, medical_specialty: e.target.value})} 
                  field={'medical_specialty'} 
                  value={form.medical_specialty}
                />


              <FormLayout.Input verified_inputs={verified_inputs} form={form} selectOptions={
                [
                  {name:t('common.single'),value:'single'},
                  {name:t('common.married'),value:'married'},
                ]
               } r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'marital_status'])} label={t('form.marital_status')} onChange={(e)=>setForm({...form,marital_status:e.target.value})} field={'marital_status'} value={form.marital_status}/>
              
              <FormLayout.Input verified_inputs={verified_inputs} form={form} selectOptions={

                [
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
               } r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'country_of_residence'])} label={t('form.country_of_residence')} onChange={(e)=>setForm({...form,country_of_residence:e.target.value})} field={'country-of-residence'} value={form.country_of_residence}/>
       

               <FormLayout.Input verified_inputs={verified_inputs} form={form} selectOptions={
               
                [
                  {name:t('common.female'),value:'female'},
                  {name:t('common.male'),value:'male'},
                  {name:t('common.another'),value:'other'}
                ]

              } r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'gender'])} label={t('form.gender')} onChange={(e)=>setForm({...form,gender:e.target.value})} field={'gender'} value={form.gender}/>
              

              <FormLayout.Input verified_inputs={verified_inputs} form={form} r={true} onBlur={()=>setVerifiedInputs([...verified_inputs,'address'])} label={t('form.address')} onChange={(e)=>setForm({...form,address:e.target.value})} field={'address'} value={form.address}/>
              <FormLayout.Input hide={itemsToHide?.includes('order-number')} verified_inputs={verified_inputs} form={form} onBlur={()=>setVerifiedInputs([...verified_inputs,'order_number'])} label={t('form.order-number')} onChange={(e)=>setForm({...form,order_number:e.target.value})} field={'order-number'} value={form.order_number}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} onBlur={()=>setVerifiedInputs([...verified_inputs,'identification_number'])} label={t('form.identification-number')} onChange={(e)=>setForm({...form,identification_number:e.target.value})} field={'order_number'} value={form.identification_number}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} onBlur={()=>setVerifiedInputs([...verified_inputs,'birth_certificate'])} label={t('form.birth-certificate')} onChange={(e)=>setForm({...form,birth_certificate:e.target.value})} field={'birth_certificate'} value={form.birth_certificate}/>
              <FormLayout.Input verified_inputs={verified_inputs} form={form} onBlur={()=>setVerifiedInputs([...verified_inputs,'passport_number'])} label={t('form.passport-number')} onChange={(e)=>setForm({...form,passport_number:e.target.value})} field={'passport_number'} value={form.passport_number}/>
             
             {form_name=="patient" && <>

              <FormLayout.Input setForm={setForm} verified_inputs={verified_inputs} type={'item-list'} form={form}   label={t('form.chronic_diseases')} field={'chronic_diseases_input'}  onClick={()=>{
                handleList({action:'add',setForm,form,list:'chronic_diseases',input:'chronic_diseases_input'})
              }} r={true} has_items_to_add={form.has_chronic_diseases} confirmContent={confirmContent({list:'chronic_diseases',form,setForm,field:'has_chronic_diseases'})} listContent={listItems({form,list:'chronic_diseases'})}  onChange={(e)=>setForm({...form,chronic_diseases_input:e.target.value})} list={'chronic_diseases'}  value={form.chronic_diseases_input}/>

              <FormLayout.Input setForm={setForm} verified_inputs={verified_inputs} type={'item-list'} form={form}   label={t('form.drug_allergy')} field={'drug_allergy_input'}  onClick={()=>{
                handleList({action:'add',setForm,form,list:'drug_allergy',input:'drug_allergy_input'})
              }}  r={true} has_items_to_add={form.has_drug_allergy} confirmContent={confirmContent({list:'drug_allergy',form,setForm,field:'has_drug_allergy'})} listContent={listItems({form,list:'drug_allergy'})}  onChange={(e)=>setForm({...form,drug_allergy_input:e.target.value})} list={'drug_allergy'}  value={form.drug_allergy_input}/>

              <FormLayout.Input setForm={setForm} verified_inputs={verified_inputs} type={'item-list'} form={form}   label={t('form.surgery_or_relevant_procedures')} field={'surgery_or_relevant_procedures_input'}  onClick={()=>{
                handleList({action:'add',setForm,form,list:'surgery_or_relevant_procedures',input:'surgery_or_relevant_procedures_input'})
              }}  r={true} has_items_to_add={form.has_surgery_or_relevant_procedures} confirmContent={confirmContent({list:'surgery_or_relevant_procedures',form,setForm,field:'has_surgery_or_relevant_procedures'})} listContent={listItems({form,list:'surgery_or_relevant_procedures'})}  onChange={(e)=>setForm({...form,surgery_or_relevant_procedures_input:e.target.value})} list={'surgery_or_relevant_procedures'}  value={form.surgery_or_relevant_procedures_input}/>

              <FormLayout.Input setForm={setForm} verified_inputs={verified_inputs} type={'item-list'} form={form}   label={t('form.continuous_use_of_medications')} field={'continuous_use_of_medications_input'}  onClick={()=>{
                handleList({action:'add',setForm,form,list:'continuous_use_of_medications',input:'continuous_use_of_medications_input'})
              }}  r={true} has_items_to_add={form.has_continuous_use_of_medications} confirmContent={confirmContent({list:'continuous_use_of_medications',form,setForm,field:'has_continuous_use_of_medications'})} listContent={listItems({form,list:'continuous_use_of_medications'})}  onChange={(e)=>setForm({...form,continuous_use_of_medications_input:e.target.value})} list={'continuous_use_of_medications'}  value={form.continuous_use_of_medications_input}/>
       
             </>
              }

              
              
              <FormLayout.Input hide={itemsToHide?.includes('hospitalization_history')} verified_inputs={verified_inputs} textarea={true} form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'hospitalization_history'])} label={t('form.hospitalization_history')} onChange={(e)=>setForm({...form,hospitalization_history:e.target.value})} field={'hospitalization_history'} value={form.hospitalization_history}/>
              <FormLayout.Input hide={itemsToHide?.includes('family_history_of_diseases')} verified_inputs={verified_inputs} textarea={true} form={form}   onBlur={()=>setVerifiedInputs([...verified_inputs,'family_history_of_diseases'])} label={t('form.family_history_of_diseases')} onChange={(e)=>setForm({...form,family_history_of_diseases:e.target.value})} field={'family_history_of_diseases'} value={form.family_history_of_diseases}/>

              <FormLayout.Input hide={itemsToHide?.includes('short_biography')} verified_inputs={verified_inputs} textarea={true} form={form} r={true}  onBlur={()=>setVerifiedInputs([...verified_inputs,'short_biography'])} label={t('form.short_biography')} onChange={(e)=>setForm({...form,short_biography:e.target.value})} field={'short_biography'} value={form.short_biography}/>
              <FormLayout.Input hide={itemsToHide?.includes('long_biography')} verified_inputs={verified_inputs} textarea={true} form={form}  onBlur={()=>setVerifiedInputs([...verified_inputs,'long_biography'])} label={t('form.long_biography')} onChange={(e)=>setForm({...form,long_biography:e.target.value})} field={'long_biography'} value={form.long_biography}/>
             
    </>
  )
}

export default PatientForm