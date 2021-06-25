import { Injectable } from '@angular/core';
import { IWindow } from '../interfaces/player-config';
import { fromEvent, Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
@Injectable({
  providedIn: 'root'
})
export class MicService {
  private speechRecognition:any;
  private startObservable$:any;
  private endObservable$:any;
  private resultObservable$:any;
  constructor() { 
    const {webkitSpeechRecognition}:IWindow = (window as any);
    this.speechRecognition = new webkitSpeechRecognition();

    this.startObservable$ = fromEvent(this.speechRecognition, 'start');
    this.endObservable$ = fromEvent(this.speechRecognition, 'end');
    this.resultObservable$ = fromEvent(this.speechRecognition, 'result');
  }

  start(){
    this.speechRecognition.start();
  }

  stop(){
    this.speechRecognition.stop();
  }

  getStartObservable(){
    return this.startObservable$;
  }

  getStopObservable(){
    return this.endObservable$;
  }

  getResultObservable(){
    return this.resultObservable$;
  }

  getAction(event:any):string|null{
    let transcript:string = event.results[0][0].transcript;
    let confidence:number = event.results[0][0].confidence;
    console.log(transcript)
    if(confidence >0.6) {
      if(transcript.indexOf(AppConstants.PLAY) !== -1 || transcript.indexOf(AppConstants.START) !== -1){
        return AppConstants.PLAY;
      } else if(transcript.indexOf(AppConstants.PAUSE) !== -1 || transcript.indexOf(AppConstants.STOP) !== -1){
        return AppConstants.PAUSE;
      } else if(transcript.indexOf(AppConstants.REPLAY) !== -1){
        return AppConstants.REPLAY;
      } else if(transcript.indexOf(AppConstants.VOLUME) !== -1){
        return AppConstants.VOLUME;
      } else if(transcript.indexOf(AppConstants.MUTE) !== -1){
        return AppConstants.MUTE;
      } else if(transcript.indexOf(AppConstants.FULL) !== -1){
        return AppConstants.FULL;
      }
    }
    return null;
  }
}
