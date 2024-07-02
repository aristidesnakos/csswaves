import { useState, useEffect, useRef } from 'react';

interface AudioData {
  average: number;
  // Add other audio data properties as needed
}

const useAudioAnalyzer = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const setupAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current || !isListening) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    setAudioData({ average });

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      setupAudio();
    }
  };

  useEffect(() => {
    if (isListening) {
      analyzeAudio();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);

  return { audioData, isListening, toggleListening };
};

export default useAudioAnalyzer;