import { useEffect, useRef, useState } from 'react';

import { MySwal } from '../common/alert';
import { socket } from '../common/socket';
import { ProfilePictureSelector } from '../components/ProfilePictureSelector';
import { useGame } from '../contexts/GameContext';

export function Gate() {
  const nameRef = useRef<HTMLInputElement>(null);
  const googleSignInRef = useRef<HTMLDivElement>(null);
  const [profilePicture, setProfilePicture] = useState('/assets/Profile8.png');
  const { setMe } = useGame();

  useEffect(() => {
    try {
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
    } catch {
      console.log('Google Sign In not loaded');
    }
  }, []);

  const onRegister = (name: string, profilePicture: string) => {
    socket.emit('register', name, profilePicture, (success: boolean, error: string) => {
      if (success) {
        setMe({ socketId: socket.id, name, profilePicture });
      } else {
        alert(error);
      }
    });
  };

  return (
    <div>
      <img src="/assets/lobblycurtain.png" className="z-30 absolute w-screen top-0" />
      <img src="/assets/curtainL.png" className="z-20 absolute h-screen left-0 top-0 bottom-0" />
      <img src="/assets/curtainR.png" className="z-20 absolute h-screen right-0 top-0 bottom-0" />
      <div className="z-10">
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              position: 'absolute',
              top: '11%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              fontSize: '14px',
            }}
          >
            Select your profile picture
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="z-20 mt-14"
            >
              <ProfilePictureSelector value={profilePicture} onChange={setProfilePicture} />
            </div>
            <input
              style={{
                position: 'absolute',
                bottom: '35%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                textAlign: 'center',
                border: '2px solid darkgrey',
                borderRadius: '20px',
                color: 'black',
              }}
              type="text"
              placeholder="Your Name"
              ref={nameRef}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '25%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                }}
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
          <img
            src="/assets/pianoGate.gif"
            style={{
              position: 'absolute',
              bottom: '-15%',
              display: 'flex',
            }}
          />
        </div>
      </div>
    </div>
  );
}
