import { t } from 'i18next'
import React, { useEffect } from 'react'
import ButtonLoader from '../components/Loaders/button';
import PopOver from '../components/PopOver';
import _var from '../assets/vaiables.json'
import { useData } from '../contexts/DataContext';

function FormLayout({advancedActions,hideInputs,children,title,form, verified_inputs,bottomContent,button,hideTitle,hide,topBarContent}) {

const childrenWithProps = React.Children.map(children, child => {
    return React.cloneElement(child, { form, verified_inputs,hideInputs});
});


function getAdvancedActions(items=[],id=null,w=undefined){

      const data=useData()
   
       return (
        <div className={`relative ${hide ? 'hidden':''}  ${(items || []).filter(i=>!i.hide).length == 0 ? 'hidden':''} flex items-center`}>
          <span className="_table_options" onClick={()=>{
               if(!data._openPopUps.table_options){
                  data._showPopUp('table_options',id)
               }else{
                  data._closeAllPopUps()
               }
          }}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#111"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg></span>
          {data._openPopUps.table_options==id && <div id="dropdown" class={`z-10 _table_options bg-white  absolute right-[20px] divide-y divide-gray-100 rounded-lg shadow w-[${w ? w :'130'}px]`}>
                <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                    {(items || []).filter(i=>!i.hide).map((i,_i)=>(
                        <li onClick={i.onClick} className="flex items-center px-4 hover:bg-gray-100">
                        <span className="mr-2">{i.icon}</span>
                        <a href="#" class="block py-2 text-[14px]">{i.name}</a>
                        </li>
                    ))}
                </ul>
          </div>}
       </div>
       )
}

return (
    <div className={`bg-white w-full md:m-3 py-3 rounded-[0.3rem] min-h-[60vh] pb-[30px] ${hide ? 'hidden':''}`}>
        {!hideTitle && <div className="w-full max-md:flex-col border-b px-3 pb-2 flex justify-between items-center">
             <span className="mr-3 max-md:mb-5">{title}</span>
            
             <div className="relative flex items-center">
               {topBarContent}
               <div className="cursor-pointer">
                  {!advancedActions?.hide && getAdvancedActions(advancedActions?.items,advancedActions?.id)}
               </div>
             </div>
        </div>}
        
        <div class="px-3 flex flex-wrap gap-x-4">
             {childrenWithProps}
        </div>

        <div className="px-[15px]">

            {bottomContent}

            {button}

        </div>
       
    </div>
  )
 } 


    FormLayout.Input = ({max,min,inputLeftContent,contact_code_field,hideErrorMsg,placeholder,ignoreVilidation,inputStyle,width,hideInputs,confirmContent,popOver,listContent,has_items_to_add,style,label,type,onChange,value,field,verified_inputs,onBlur,onClick,form,r,selectOptions,disabled,errorMsg,noBorder,hide,textarea,custom_invalid_validation,height}) => {
      
        let _id=Math.random()

        return (   
            <div style={style ? {...style} : {}} className={`mt-7 ${width ? `w-[${width}]` : textarea ? 'w-full':'w-[300px] max-md:w-full'} ${hide || hideInputs ? 'hidden':''}`}>
                    <label for={_id} class="flex items-center mb-2 text-sm  text-gray-900">{label} {r && <span className="text-red-500">*</span>} {!r && <span className="text-gray-500 ml-1">{`(${t('common.optional')})`.toLowerCase()}</span>} {popOver && <div>
                         <PopOver items={popOver}/>
                    </div>}</label>
                   
                    { textarea ? (
                        <>
                          <textarea style={inputStyle ? inputStyle : {}} disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id} rows="4" className={`${Boolean(disabled) ? 'opacity-55':''} p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300`} placeholder={placeholder}></textarea>
                        </>
                    ) : type=="item-list" ? (

                        <div className="">

                             {confirmContent}
                             {has_items_to_add==true &&  <> <div className="w-full flex">

                                <input min={min} placeholder={placeholder} disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-tr-none rounded-[0.3rem] focus:ring-blue-500 rounded-b-none focus:border-blue-500 block w-full p-1.5`}/>

                                <button onClick={onClick} class={`text-white ${form[field] ? 'bg-honolulu_blue-400':'bg-gray-400 pointer-events-none'} hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none  font-medium rounded-[0.3rem] text-sm w-full sm:w-auto px-2 py-1.5 text-center rounded-b-none rounded-tl-none`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </button>

                                </div>
                                 {listContent}
                                </>
                                }

                        </div>

                    ) : !selectOptions ? (
                       <div className="flex items-center">
                            {inputLeftContent}
                            <input min={min} placeholder={placeholder} disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}/>
                       </div>
                    ): (

                    <select disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}>
                            <option value={""} selected disabled>{t('common.select-an-option')}</option>
                            {selectOptions.map(i=>(
                                <option value={i.value} disabled={i.disabled}>{i.name}</option>
                            ))}
                    </select> 

                    )}
                    
                    {errorMsg  && r && !ignoreVilidation && !hideErrorMsg &&  <span className="text-[0.9rem] text-red-600">{errorMsg}</span>}
                    {((!errorMsg && !ignoreVilidation && !hideErrorMsg && verified_inputs.includes(field) && !form[field] && r && custom_invalid_validation==undefined) || custom_invalid_validation) && <span className="text-[0.9rem] text-red-600">{t('common.required-field')}</span>}
                    
                    
            </div>
        )
    }

    FormLayout.Button = ({label,loading,valid,onClick}) => {
        return (    
             <button onClick={onClick}   class={`text-white ${loading ? 'pointer-events-none':''} flex justify-center items-center ${valid ? 'bg-honolulu_blue-400 hover:bg-honolulu_blue-500':'bg-gray-400 pointer-events-none'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[0.3rem]  text-sm w-full sm:w-auto px-5 py-2.5 text-center`}>
             
             {loading && <ButtonLoader/>}

             <span className=" ">{loading ? t('common.loading') : label}</span>

            </button>
        )
    }

export default FormLayout