import React from 'react';
import QRCode from 'qrcode.react';
import { t } from 'i18next';

const QRCodeGenerator = ({ link,code }) => {

    console.log({link})
    console.log(link)

  return (
    <div className="flex flex-col items-center justify-center text-center md:max-w-sm md:w-44">
    <span className="text-[13px] text-gray-500 hidden">{t('common.point-camera')}</span>
    <div className="w-[100px] h-[100px] relative  mt-2">
        <div style={{transform:'scale(0.4) translate(-70%,-100%)'}} className="absolute left-0 top-0  border border-slate-500 p-[0.5rem] rounded-md">
          <QRCode height={50} value={link} />
          {/*code && <span className="mt-1 flex text-[20px]">#{code}</span>*/ }
        </div>
    </div>
      
    </div>
  );
};
export default QRCodeGenerator;
