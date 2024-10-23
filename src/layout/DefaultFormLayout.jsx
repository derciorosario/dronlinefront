import { t } from 'i18next'
import React from 'react'
import ButtonLoader from '../components/Loaders/button';
import PopOver from '../components/PopOver';

function FormLayout({hideInputs,children,title,form, verified_inputs,bottomContent,button,hideTitle,hide,topBarContent}) {

const childrenWithProps = React.Children.map(children, child => {
    return React.cloneElement(child, { form, verified_inputs,hideInputs});
});

return (
    <div className={`bg-white w-full m-3 py-3 rounded-[0.3rem] min-h-[60vh] pb-[30px] ${hide ? 'hidden':''}`}>
        {!hideTitle && <div className="w-full border-b px-3 pb-2 flex justify-between items-center">
             <span>{title}</span>
             {topBarContent}
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


    FormLayout.Input = ({ignoreVilidation,inputStyle,width,hideInputs,confirmContent,popOver,listContent,has_items_to_add,style,label,type,onChange,value,field,verified_inputs,onBlur,onClick,form,r,selectOptions,disabled,errorMsg,noBorder,hide,textarea,custom_invalid_validation,height}) => {
       
        let _id=Math.random()

        return (   
            <div style={style ? {...style} : {}} className={`mt-7 ${width ? `w-[${width}]` : textarea ? 'w-full':'w-[300px]'} ${hide || hideInputs ? 'hidden':''}`}>
                    <label for={_id} class="flex items-center mb-2 text-sm  text-gray-900">{label} {r && <span className="text-red-500">*</span>} {popOver && <div>
                         <PopOver items={popOver}/>
                    </div>}</label>
                   
                    { textarea ? (
                        <>
                         <textarea style={inputStyle ? inputStyle : {}} disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id} rows="4" className={` p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300`} placeholder=""></textarea>
                        </>
                    ) : type=="item-list" ? (

                        <div className="">


                             {confirmContent}

                           
                             {has_items_to_add==true &&  <> <div className="w-full flex">

                                <input disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-tr-none rounded-[0.3rem] focus:ring-blue-500 rounded-b-none focus:border-blue-500 block w-full p-1.5`}/>

                                <button onClick={onClick} class={`text-white ${form[field] ? 'bg-honolulu_blue-400':'bg-gray-400 pointer-events-none'} hover:bg-honolulu_blue-500 focus:ring-4 focus:outline-none  font-medium rounded-[0.3rem] text-sm w-full sm:w-auto px-2 py-1.5 text-center rounded-b-none rounded-tl-none`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#fff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </button>

                                </div>
                                 {listContent}
                                </>
                                }

                        </div>

                    ) : !selectOptions ? (
                        
                        <input disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}/>
                   
                    ): (

                    <select disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}>
                            <option value={""} selected disabled>{t('common.select-an-option')}</option>
                            {selectOptions.map(i=>(
                                <option value={i.value}>{i.name}</option>
                            ))}
                    </select> 

                    )}
                    
                    {errorMsg  && r && !ignoreVilidation && <span className="text-[0.9rem] text-red-600">{errorMsg}</span>}
                    {((!errorMsg && !ignoreVilidation && verified_inputs.includes(field) && !form[field] && r && custom_invalid_validation==undefined) || custom_invalid_validation) && <span className="text-[0.9rem] text-red-600">{t('common.required-field')}</span>}
                    
                    
            </div>
        )
    }

    FormLayout.Button = ({label,loading,valid,onClick}) => {
        return (    
             <button onClick={onClick}   class={`text-white ${loading ? 'pointer-events-none':''} flex items-center ${valid ? 'bg-honolulu_blue-400 hover:bg-blue-500':'bg-gray-400 pointer-events-none'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[0.3rem] text-sm w-full sm:w-auto px-5 py-2.5 text-center`}>
             
             {loading && <ButtonLoader/>}

             <span>{loading ? t('common.loading') : label}</span>

            </button>
        )
    }

export default FormLayout