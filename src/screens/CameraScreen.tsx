import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowRight, RefreshCw, AlertCircle, Image as ImageIcon, CheckCircle, VideoOff } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SAMPLE_PIPE_SCENARIOS } from '../data/demoScenarios';

interface CameraScreenProps {
  onPhotoSelected: (photoUrl: string) => void;
  onSkipPhoto: () => void;
  onBack: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onPhotoSelected,
  onSkipPhoto,
  onBack,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera stream cleanly when unmounting
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser. Please use file upload.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Live camera error:', err);
      setCameraError(
        'Unable to access camera directly. Please tap "Take Photo or Upload" below to use your device camera.'
      );
      setIsCameraActive(false);
    }
  };

  const captureFromVideo = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoPreview(dataUrl);
      stopCameraStream();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setPhotoPreview(sampleUrl);
    stopCameraStream();
  };

  const handleContinue = () => {
    if (photoPreview) {
      onPhotoSelected(photoPreview);
    } else {
      onSkipPhoto();
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Take or Upload Pipe Photo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step 1 of 2: Pipe Visual Inspection
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100"
        >
          Back
        </button>
      </div>

      <DisclaimerBanner compact />

      {/* Guide Box */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-950 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-sky-900">
          <AlertCircle className="w-4 h-4 text-sky-600" />
          <span>Where to find your pipe:</span>
        </div>
        <p className="text-sky-800 leading-relaxed">
          Go to your basement, crawlspace, or lowest utility closet. Locate the <strong>incoming water pipe</strong> coming out of the foundation floor or wall, <em>before</em> it connects to the water meter or shut-off valve.
        </p>
      </div>

      {/* Camera / Preview Viewport */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center border-2 border-slate-700 shadow-inner">
        {photoPreview ? (
          <div className="relative w-full h-full">
            <img
              src={photoPreview}
              alt="Captured pipe preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Photo Ready</span>
            </div>
            <button
              onClick={() => {
                setPhotoPreview(null);
                setCameraError(null);
              }}
              className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake / Change
            </button>
          </div>
        ) : isCameraActive ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Reticle Overlay */}
            <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-[11px] text-white/90 bg-black/50 px-2.5 py-1 rounded-md font-medium text-center">
                Center water pipe here
              </span>
            </div>
            {/* Capture shutter */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
              <button
                onClick={captureFromVideo}
                className="w-16 h-16 rounded-full bg-white border-4 border-brand-500 shadow-xl flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Capture Photo"
              >
                <div className="w-11 h-11 rounded-full bg-brand-600" />
              </button>
              <button
                onClick={stopCameraStream}
                className="absolute right-4 text-xs font-semibold text-white/80 bg-black/50 px-2.5 py-1.5 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">
                No photo selected yet
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Snap a clear photo with your iPhone camera or choose an image from your photo album.
              </p>
            </div>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <VideoOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Camera & Upload Action Buttons */}
      {!photoPreview && (
        <div className="space-y-2.5">
          {/* Native Mobile Camera / File Picker (Standard iOS Safari Camera trigger) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
            id="pipe-photo-input"
          />

          <label
            htmlFor="pipe-photo-input"
            className="w-full cursor-pointer bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-base py-3.5 px-5 rounded-2xl shadow-md flex items-center justify-center gap-2.5 transition-all"
          >
            <Camera className="w-5 h-5" />
            <span>Take Photo or Upload (iPhone / Android)</span>
          </label>

          <button
            onClick={startLiveCamera}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
          >
            <Camera className="w-4 h-4 text-slate-600" />
            <span>Open Browser Live Viewfinder</span>
          </button>
        </div>
      )}

      {/* Sample Pipe Photos for Instant Testing */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-brand-600" />
          <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Or Pick a Sample Pipe Photo
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Tap one of these verified reference photos to test:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_PIPE_SCENARIOS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample.imageUrl)}
              className="text-left p-2.5 bg-white border border-slate-200 rounded-xl hover:border-brand-400 hover:shadow-xs transition-all flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {sample.expectedMaterial.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {sample.title.split('(')[0]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Flow Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleContinue}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>{photoPreview ? 'Continue to Pipe Check Questions' : 'Continue Without Photo'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onSkipPhoto}
          className="w-full text-slate-500 hover:text-slate-800 text-xs font-medium py-2 transition-colors"
        >
          Skip photo and answer questions directly
        </button>
      </div>
    </div>
  );
};
