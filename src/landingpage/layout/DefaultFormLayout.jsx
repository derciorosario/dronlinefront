import { t } from 'i18next'
import React from 'react'
import ButtonLoader from '../components/Loaders/button';

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
        
        <form class="px-3 flex flex-wrap gap-x-4">
             {childrenWithProps}
        </form>

        <div className="px-[15px]">

            {bottomContent}

            {button}

        </div>
       
    </div>
  )
 }


    FormLayout.Input = ({hideInputs,style,label,type,onChange,value,field,verified_inputs,onBlur,form,r,selectOptions,disabled,errorMsg,noBorder,hide,textarea,custom_invalid_validation,height}) => {
       
        let _id=Math.random()

        return (   
            <div style={style ? {...style} : {}} className={`mt-7 ${textarea ? 'w-full':'w-[300px]'} ${hide || hideInputs ? 'hidden':''}`}>
                    <label for={_id} class="block mb-2 text-sm  text-gray-900">{label} {r && <span className="text-red-500">*</span>}</label>
                   
                    { textarea ? (
                        <>
                         <textarea disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id} rows="4" className={` p-2.5 w-full ${height ? `h-[${height}]`:''} text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300`} placeholder=""></textarea>
                        </>
                    ): !selectOptions ? (
                        
                        <input disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}/>
                   
                    ) : (

                    <select disabled={Boolean(disabled)} onBlur={onBlur} value={value} onChange={onChange} type={type ? type : 'text'} id={_id}  class={`bg-gray ${!noBorder ? 'border':''} border-gray-300 ${disabled ? 'opacity-50':''} text-gray-900 text-sm rounded-[0.3rem] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}>
                            <option value={""} selected disabled>{t('common.select-an-option')}</option>
                            {selectOptions.map(i=>(
                                <option value={i.value}>{i.name}</option>
                            ))}
                    </select> 

                    )}
                    
                    {errorMsg  && r && <span className="text-[0.9rem] text-red-600">{errorMsg}</span>}
                    {((!errorMsg && verified_inputs.includes(field) && !form[field] && r && custom_invalid_validation==undefined) || custom_invalid_validation) && <span className="text-[0.9rem] text-red-600">{t('common.required-field')}</span>}
                    
                    
            </div>
        )
    }

    FormLayout.Button = ({label,loading,valid,onClick}) => {
        return (    
             <button onClick={onClick} type="submit"  class={`text-white ${loading ? 'pointer-events-none':''} flex items-center ${valid ? 'bg-honolulu_blue-400 hover:bg-blue-500':'bg-gray-400 pointer-events-none'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[0.3rem] text-sm w-full sm:w-auto px-5 py-2.5 text-center`}>
             
             {loading && <ButtonLoader/>}

             <span>{loading ? t('common.loading') : label}</span>

            </button>
        )
    }

export default FormLayout