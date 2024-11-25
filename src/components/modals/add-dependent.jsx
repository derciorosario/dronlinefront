import { t } from 'i18next';
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import AddDependents from '../../pages/dependents/create';

function AddDependentPopUp({ show }) {
  const data = useData();
  const navigate = useNavigate()

  return (
    <div className={`w-full _add_dependent h-[100vh] bg-[rgba(0,0,0,0.2)] ease-in _doctor_list ${!show ? 'opacity-0 pointer-events-none translate-y-[100px]' : ''} ease-in transition-all delay-75 fixed flex items-center justify-center z-[60]`}>
      <div className="w-full overflow-y-auto p-4 max-h-[90vh] relative bg-white border border-gray-200 rounded-lg shadow sm:p-8 z-40 max-w-[1000px]">
        <div className="flex absolute mb-3 top-1 left-2">
          <span onClick={() => {
             data._closeAllPopUps()
          }} className="table px-2 bg-gray-200 py-1 text-[14px] rounded-full cursor-pointer hover:bg-gray-300">
            {t('common.go-back')}
          </span>
        </div>

        <div className="justify-between mb-4 mt-5">
             <AddDependents hideLayout={true}/>
        </div>
      </div>
    </div>
  );
}

export default AddDependentPopUp;
