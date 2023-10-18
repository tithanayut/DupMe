import { useEffect, useRef, useState } from 'react';

import { MySwal } from '../common/alert';
import { socket } from '../common/socket';
import { ProfilePictureSelector } from '../components/ProfilePictureSelector';
import { useGame } from '../contexts/GameContext';

export function Gate() {
  const nameRef = useRef<HTMLInputElement>(null);
  const googleSignInRef = useRef<HTMLDivElement>(null);
  const [profilePicture, setProfilePicture] = useState('/assets/Profile1.jpg');
  const { setMe } = useGame();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: '1082322066020-0a2irp5i8b0shiq0njm8ksd5h4qvt4a8.apps.googleusercontent.com',
      callback: (response: any) => {
        const user = JSON.parse(atob(response.credential.split('.')[1]));
        onRegister(user.name, user.picture);
      },
    });
    if (googleSignInRef.current) {
      window.google.accounts.id.renderButton(googleSignInRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: 300,
      });
    }
  }, []);

  const onRegister = (name: string, profilePicture: string) => {
    socket.emit('register', name, profilePicture, (success: boolean, error: string) => {
      if (success) {
        setMe({ name, profilePicture });
      } else {
        alert(error);
      }
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Select your profile picture</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ProfilePictureSelector value={profilePicture} onChange={setProfilePicture} />
        </div>
        <input
          style={{
            position: 'absolute',
            bottom: '35%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            textAlign: 'center',
          }}
          type="text"
          placeholder="Your Name"
          ref={nameRef}
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translate(-50%, 0)' }}
            ref={googleSignInRef}
          ></div>
        </div>
        <button
          className="enter-btn"
          onClick={() => {
            if (!nameRef.current || nameRef.current.value === '') {
              MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Name cannot be blank!',
              });
              return;
            }
            onRegister(nameRef.current?.value, profilePicture);
          }}
        >
          ENTER
        </button>
      </form>
    </div>
  );
}
