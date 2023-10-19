import { useState } from 'react';

import { Camera } from './Camera';

interface ProfilePictureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}
export function ProfilePictureSelector({ value, onChange }: ProfilePictureSelectorProps) {
  const [options, setOptions] = useState([
    '/assets/Profile1.png',
    '/assets/Profile2.png',
    '/assets/Profile3.png',
    '/assets/Profile4.png',
  ]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
      <button
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
      </button>
      <div style={{ margin: '20px 20px 40px 20px' }}>
        <img src={value} width={150} height={150} style={{ marginTop: '25%' }} />
      </div>
      <button
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
      </button>
      <Camera
        onCapture={(data) => {
          setOptions((options) => [...options, data]);
          onChange(data);
        }}
      />
    </div>
  );
}
