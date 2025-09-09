import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, MonitorOff } from 'lucide-react';
import Webcam from 'react-webcam';

interface VideoCallProps {
  isDoctor: boolean;
  onEndCall: () => void;
  patientName?: string;
  doctorName?: string;
}

export default function VideoCall({ isDoctor, onEndCall, patientName, doctorName }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = async () => {
    if (!isDoctor) return; // Only doctors can screen share

    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(true);
        
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } else {
        if (screenShareRef.current?.srcObject) {
          const stream = screenShareRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          screenShareRef.current.srcObject = null;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between text-white">
        <div>
          <h3 className="text-lg font-semibold">
            {isDoctor ? `Call with ${patientName}` : `Call with ${doctorName}`}
          </h3>
          <p className="text-sm text-gray-300">Duration: {formatDuration(callDuration)}</p>
        </div>
        <div className="text-sm text-gray-300">
          {isDoctor ? 'Doctor' : 'Patient'} View
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Main Video */}
        <div className="absolute inset-0">
          {isScreenSharing ? (
            <video
              ref={screenShareRef}
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isVideoOn ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="w-full h-full object-cover"
                  mirrored
                />
              ) : (
                <div className="bg-gray-800 rounded-full p-8">
                  <div className="w-24 h-24 bg-healthcare-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {isDoctor ? doctorName?.[0] : patientName?.[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Picture-in-Picture (Remote Video) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-healthcare-accent rounded-full p-4">
              <span className="text-lg font-bold text-white">
                {isDoctor ? patientName?.[0] : doctorName?.[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 left-4 flex gap-2">
          {!isVideoOn && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <VideoOff className="w-4 h-4" />
              Video Off
            </div>
          )}
          {!isAudioOn && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <MicOff className="w-4 h-4" />
              Muted
            </div>
          )}
          {isScreenSharing && (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Monitor className="w-4 h-4" />
              Screen Sharing
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center gap-4">
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              isVideoOn 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all duration-200 ${
              isAudioOn 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Screen Share (Doctor Only) */}
          {isDoctor && (
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-all duration-200 ${
                isScreenSharing 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </button>
          )}

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mt-4 text-gray-400 text-sm">
          {isDoctor ? 'You can share your screen and control the call' : 'Waiting for doctor to start screen sharing'}
        </div>
      </div>
    </div>
  );
}