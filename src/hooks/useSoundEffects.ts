import { useCallback, useState } from 'react';

type SoundType = 'send' | 'receive' | 'roast' | 'confused' | 'typing' | 'pop';

// Audio context for generating sounds
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playMultipleTones = (tones: { freq: number; delay: number; duration: number; type?: OscillatorType }[]) => {
  const ctx = getAudioContext();
  tones.forEach(({ freq, delay, duration, type = 'sine' }) => {
    setTimeout(() => playTone(freq, duration, type, 0.2), delay * 1000);
  });
};

export const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return;
    
    try {
      switch (type) {
        case 'send':
          // Upward cheerful bloop
          playMultipleTones([
            { freq: 400, delay: 0, duration: 0.1 },
            { freq: 600, delay: 0.08, duration: 0.15 },
          ]);
          break;
          
        case 'receive':
          // Descending confused bloop
          playMultipleTones([
            { freq: 500, delay: 0, duration: 0.1 },
            { freq: 350, delay: 0.1, duration: 0.15 },
            { freq: 300, delay: 0.2, duration: 0.2 },
          ]);
          break;
          
        case 'roast':
          // Airhorn style! Multiple rising tones
          playMultipleTones([
            { freq: 350, delay: 0, duration: 0.15, type: 'sawtooth' },
            { freq: 450, delay: 0.1, duration: 0.15, type: 'sawtooth' },
            { freq: 550, delay: 0.2, duration: 0.15, type: 'sawtooth' },
            { freq: 700, delay: 0.3, duration: 0.3, type: 'sawtooth' },
          ]);
          break;
          
        case 'confused':
          // Wobbly confused sound
          playMultipleTones([
            { freq: 300, delay: 0, duration: 0.1 },
            { freq: 350, delay: 0.1, duration: 0.1 },
            { freq: 280, delay: 0.2, duration: 0.15 },
          ]);
          break;
          
        case 'typing':
          // Soft click
          playTone(800, 0.05, 'sine', 0.1);
          break;
          
        case 'pop':
          // Pop sound
          playTone(600, 0.08, 'sine', 0.25);
          break;
      }
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return { playSound, soundEnabled, toggleSound };
};
