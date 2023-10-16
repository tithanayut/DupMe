import { useState } from 'react';

import { Camera } from './Camera';

interface ProfilePictureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}
export function ProfilePictureSelector({ value, onChange }: ProfilePictureSelectorProps) {
  const [options, setOptions] = useState([
    '/assets/Profile1.jpg',
    '/assets/Profile2.jpg',
    '/assets/Profile3.jpg',
    '/assets/Profile4.jpg',
  ]);

  return (
    <div>
      <button
        onClick={() => {
          onChange(options[(options.indexOf(value) - 1 + options.length) % options.length]);
        }}
      >
        Prev
      </button>
      <img src={value} width={100} />
      <button
        onClick={() => {
          onChange(options[(options.indexOf(value) + 1) % options.length]);
        }}
      >
        Next
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
