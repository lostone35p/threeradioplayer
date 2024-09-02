// audioController.ts

import { radioList } from "./radioInterfaces";

class AudioController {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private currentRadio: string | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;


  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  loadRadio(name: string, url: string) {
    if (!this.audioElements.has(name)) {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = url;
      audio.preload = 'none';
      this.audioElements.set(name, audio);
    }
  }

  async playRadio(name: string) {
    const audio = this.audioElements.get(name);
    if (!audio) {
      console.error(`Radio ${name} not found`);
      return;
    }

    if (this.currentRadio && this.currentRadio !== name) {
      this.stopRadio();
    }

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Ensure audio context is running
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create analyzer
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;

    try {
      // Connect the audio element to the analyser
      const source = this.audioContext.createMediaElementSource(audio);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Play the audio
      await audio.play();
      this.currentRadio = name;
    } catch (error) {
      console.error('Error playing audio:', error);
      // If there's an error, try loading the audio again
      audio.load();
      setTimeout(() => {
        audio.play().catch(e => console.error('Retry error:', e));
      }, 1000);
    }
  }
  stopRadio() {
    if (this.currentRadio) {
      const audio = this.audioElements.get(this.currentRadio);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      this.currentRadio = null;
      this.analyser = null;
    }
  }



  getAnalyser() {
    return this.analyser;
  }

  getCurrentRadio() {
    return this.currentRadio;
  }

  getCurrentRadioInfo() {
    if (this.currentRadio) {
      const radio = radioList.find(r => r.name === this.currentRadio);
      return radio ? { name: radio.name, api: radio.api } : null;
    }
    return null;
  }
}

export const audioController = new AudioController();