// audioController.ts

import { radioList } from "./radioInterfaces";

class AudioController {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private currentRadio: string | null = null;

  constructor() { }

  loadRadio(name: string, url: string) {
    if (!this.audioElements.has(name)) {
      const audio = new Audio(url);
      audio.preload = 'none'; // Don't preload the stream
      this.audioElements.set(name, audio);
    }
  }

  playRadio(name: string) {
    const audio = this.audioElements.get(name);
    if (!audio) {
      console.error(`Radio ${name} not found`);
      return;
    }

    if (this.currentRadio && this.currentRadio !== name) {
      this.stopRadio();
    }

    // Reload the stream before playing
    audio.load();
    audio.play().catch(error => console.error('Error playing audio:', error));
    this.currentRadio = name;
  }

  stopRadio() {
    if (this.currentRadio) {
      const audio = this.audioElements.get(this.currentRadio);
      if (audio) {
        audio.pause();
        // Reload the stream instead of resetting currentTime
        audio.load();
      }
      this.currentRadio = null;
    }
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