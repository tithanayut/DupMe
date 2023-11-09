import { useState } from 'react';

import { Camera } from './Camera';

interface ProfilePictureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}
export function ProfilePictureSelector({ value, onChange }: ProfilePictureSelectorProps) {
  const [options, setOptions] = useState([
    // 'https://dupme.up.railway.app/assets/Profile1.png',
    // 'https://dupme.up.railway.app/assets/Profile2.png',
    // 'https://dupme.up.railway.app/assets/Profile3.png',
    // 'https://dupme.up.railway.app/assets/Profile4.png',
    'https://dupme.up.railway.app/assets/Profile8.png',
    'https://dupme.up.railway.app/assets/Profile6.png',
    'https://dupme.up.railway.app/assets/Profile7.png',
    'https://dupme.up.railway.app/assets/Profile5.png',
  ]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', height: '250px' }}>
      <img
        src="/assets/profileLeft.png"
        className="scale-[50%] hover:scale-[55%] mr-30 top-[16%] mt-20 "
        onClick={() => {
          onChange(options[(options.indexOf(value) - 1 + options.length) % options.length]);
        }}
      />

      {/* <button
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          borderRadius: '50%',
          backgroundColor: 'grey',
          color: 'white',
          width: '40px',
          height: '40px',
          lineHeight: '40px',
          marginTop: '90px',
        }}
        onClick={() => {
          onChange(options[(options.indexOf(value) - 1 + options.length) % options.length]);
        }}
      >
        &lt;
      </button> */}
      <div style={{ margin: '20px 20px 40px 20px' }}>
        <img src={value} width={170} height={170} style={{ marginTop: '25%' }} />
      </div>
      <img
        src="/assets/profileRight.png"
        className="scale-[50%] hover:scale-[55%] ml-30 top-[16%] mt-20"
        onClick={() => {
          onChange(options[(options.indexOf(value) + 1) % options.length]);
        }}
      />
      {/* <button
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          borderRadius: '50%',
          backgroundColor: 'grey',
          color: 'white',
          width: '40px',
          height: '40px',
          lineHeight: '40px',
          marginTop: '90px',
        }}
        onClick={() => {
          onChange(options[(options.indexOf(value) + 1) % options.length]);
        }}
      >
        &gt;
      </button> */}
      <Camera
        onCapture={(data) => {
          setOptions((options) => [...options, data]);
          onChange(data);
        }}
      />
    </div>
  );
}
