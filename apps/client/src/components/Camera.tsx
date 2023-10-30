import { useRef, useState } from 'react';

interface CameraProps {
  onCapture: (data: string) => void;
}
export function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const stream = useRef<MediaStream | null>(null);

  return (
    <div>
      {!cameraActive ? (
        <button
          style={{
            position: 'absolute',
            bottom: '40%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            border: '2px black solid',
            backgroundColor: 'lightgrey',
            borderRadius: '8px',
            width: '140px',
            color: 'black',
          }}
          onClick={async () => {
            if (!videoRef.current) return;
            stream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoRef.current.srcObject = stream.current;
            setCameraActive(true);
          }}
        >
          📷 Start Camera
        </button>
      ) : (
        <button
          style={{
            position: 'absolute',
            bottom: '40%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            border: '2px black solid',
            backgroundColor: 'lightgrey',
            borderRadius: '8px',
            width: '140px',
            color: 'black',
          }}
          onClick={() => {
            if (!canvasRef.current || !videoRef.current || !stream.current) return;
            canvasRef.current
              .getContext('2d')
              ?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            videoRef.current.srcObject = null;
            setCameraActive(false);
            onCapture(canvasRef.current.toDataURL('image/jpeg'));
            stream.current.getTracks().forEach((track) => {
              if (track.readyState == 'live') {
                track.stop();
              }
            });
          }}
        >
          📸 Take Photo
        </button>
      )}
      <video
        ref={videoRef}
        width="300px"
        autoPlay
        style={{
          display: cameraActive ? 'block' : 'none',
          position: 'absolute',
          bottom: '45%',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      ></video>
      <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
    </div>
  );
}
