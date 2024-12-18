import { t } from 'i18next';
import React from 'react'

export default function SelectedFilters({filterOptions,setFilterOptions,setUpdateFilters}) {


  return (
    <div className="w-full flex flex-wrap items-center">
         {filterOptions.filter(i=>i.selected_ids.length).length!=0 && <span className="mr-2 text-gray-400">{t('common.filters')}:</span>}
         {filterOptions.filter(i=>i.selected_ids.length).map(i=>{
            
             return (
                <div className="bg-gray-200 rounded-[0.3rem] px-2 py-1 inline-flex items-center mb-1 mr-1">
                  <span className="text-[14px]">{i.name}</span>
                  <div className="ml-2 bg-honolulu_blue-400 text-white rounded-full px-2 flex items-center justify-center">
                         <span>{i.selected_ids.length}</span>
                  </div>
                  <div
                    onClick={() => {
                        const optionsIndex = filterOptions.findIndex(f => f.field === i.field);
                        setFilterOptions(prev => {
                          const newOptions = [...prev];
                          if (optionsIndex !== -1) {
                            newOptions[optionsIndex] = {
                              ...newOptions[optionsIndex],
                              selected_ids: []
                            };
                          }
                          return newOptions;
                        });
                        setUpdateFilters(Math.random())

                    }}
                    className="ml-1 cursor-pointer rounded-[0.3rem] hover:opacity-40  flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" fill="#5f6368">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    </div>
                </div>
             )
         })}
    </div>
  )
}
