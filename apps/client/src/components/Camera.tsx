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
          onClick={async () => {
            if (!videoRef.current) return;
            stream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoRef.current.srcObject = stream.current;
            setCameraActive(true);
          }}
        >
          Start Camera
        </button>
      ) : (
        <button
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
          Take Photo
        </button>
      )}
      <video
        ref={videoRef}
        width="320"
        height="240"
        autoPlay
        style={{ display: cameraActive ? 'block' : 'none' }}
      ></video>
      <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
    </div>
  );
}
