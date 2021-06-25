import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { VideoPlayerState } from 'src/app/core/models/button-states';
import { IWindow, SourceConfig } from '../../interfaces/player-config';
import { MicService } from '../../services/mic.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() sourceConfig: Array<SourceConfig>;

  controlColor:string = "white";
  playButtonIcon:string = "play_arrow";
  replayButtonIcon:string;
  videoFileUrl:string;
  videoFileType:any;

  videoPlayerState : VideoPlayerState = new VideoPlayerState();
  
  @ViewChild("videoControl") videoControl:ElementRef<HTMLMediaElement>;
  videoHtmlMediaElement: HTMLMediaElement;

  @ViewChild('audioSlider') audioSlider:MatSlider;

  @ViewChild('playSlider') playSlider:MatSlider;

  /* Use Rxjs to capture the Keyboard event. can also be done directly as a method (keyup) from
     the element itself or can be done through HostListener
  */
  keyPressListener:Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(document, 'keyup');
  keyPressListenerSubscriber$:Subscription;
  action:string|null;
  constructor(private micService: MicService) { }
  
  ngOnInit(): void {
    this.micService.getStartObservable().subscribe(()=>{
      console.log('listening');
    });

    this.micService.getStopObservable().subscribe(()=>{
      this.videoPlayerState.micToggle();
    });

    this.micService.getResultObservable().subscribe((event:any)=>{
      this.action = this.micService.getAction(event);
     
      if(this.action !== null) {
        switch(this.action){
          case AppConstants.PLAY:
            this.onPlay(this.action);
            break;
          case AppConstants.PAUSE:
            this.onPlay(this.action);
            break;
          case AppConstants.REPLAY:
            this.onPlay(this.action);
            break;
          case AppConstants.MUTE:
            this.onVolumeClick(this.action);
            break;
          case AppConstants.VOLUME:
            this.onVolumeClick(this.action);
            break;
          case AppConstants.FULL:
            this.onFullscreen();
            break;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if(this.videoControl !== undefined){
      this.videoHtmlMediaElement = (this.videoControl.nativeElement as HTMLMediaElement);
      
      this.videoHtmlMediaElement.addEventListener('ended',(ev)=>{
        this.videoPlayerState.setReplay();
        this.determineIcon();
      });

      this.videoPlayerState.maxVideoDuration = Math.floor(this.videoHtmlMediaElement.duration);

      this.videoHtmlMediaElement.addEventListener('timeupdate',(ev)=>{
        this.playSlider.value = Math.floor(this.videoHtmlMediaElement.currentTime);
      });
    }

    if(this.keyPressListener !== undefined){
      this.keyPressListenerSubscriber$ = this.keyPressListener.subscribe(event => {
        if (event.code == 'ArrowLeft') {
          event.preventDefault();
          this.skipVideoForDuration(-1 * VideoPlayerState.AUDIO_SKIP_LEVEL);
          this.determineIcon();
          this.replayButtonIcon = `replay_${VideoPlayerState.AUDIO_SKIP_LEVEL}`;
        } else if( event.code == 'ArrowRight') {
          event.preventDefault();
          this.skipVideoForDuration(VideoPlayerState.AUDIO_SKIP_LEVEL);
          this.determineIcon();
          this.replayButtonIcon = `forward_${VideoPlayerState.AUDIO_SKIP_LEVEL}`;
        }       
      });
    }
  }

  onPlay(action?:string){
    if(this.videoPlayerState.isLoaded() && (action == undefined || action == AppConstants.PLAY)) {
      this.changeVolume();
      this.videoPlayerState.setPlay();
      this.playVideo();
    } else if(this.videoPlayerState.isPaused() && (action == undefined || action == AppConstants.PLAY)){
      this.playVideo();
      this.videoPlayerState.setPlay();
    } else if(this.videoPlayerState.isReplaying() && (action == undefined || action == AppConstants.REPLAY)){
      this.playVideo(0);
      this.videoPlayerState.setPlay();
    } else if(this.videoPlayerState.isPlaying() && (action == undefined || action == AppConstants.PAUSE)){
      console.log('pausing')
      this.pauseVideo();
      this.videoPlayerState.setPause();
    }
    this.determineIcon();
  }

  onVolumeClick(action?:string) {
    let volumeLevel = VideoPlayerState.DEFAULT_AUDIO_LEVEL;
    if(!this.videoPlayerState.isMute() && (action == undefined || action == AppConstants.MUTE)){
      this.videoPlayerState.setMute();
      volumeLevel = VideoPlayerState.MINIMUM_AUDIO_LEVEL;
    } else if(this.videoPlayerState.isMute() && (action == undefined || action == AppConstants.VOLUME)){
      this.videoPlayerState.setUnmute();
      if(this.videoPlayerState.audioVolumeLevel !== undefined && this.videoPlayerState.audioVolumeLevel !== VideoPlayerState.MINIMUM_AUDIO_LEVEL) {
        volumeLevel = this.videoPlayerState.audioVolumeLevel;
      }
    }
    this.changeVolume(volumeLevel);
    this.audioSlider.value = volumeLevel;
  }

  onVolumeChange(event:any){
    this.changeVolume(event.value);
    this.videoPlayerState.setAudioLevel(event.value);
  }

  changeVolume(volume?: number) {
    if(volume == undefined) {
      this.audioSlider.value = VideoPlayerState.DEFAULT_AUDIO_LEVEL;
    }
    else if(volume !== this.videoHtmlMediaElement.volume) {
      this.videoHtmlMediaElement.volume = volume;
      if(volume == 0){
        this.videoPlayerState.setMute();
      } else {
        if(this.videoPlayerState.isMute())
          this.videoPlayerState.setUnmute();
      }
    }
  }

  playVideo(currentTime?:number){
    if(this.videoHtmlMediaElement !== undefined){
      if(currentTime !== undefined && !Number.isNaN(currentTime)){
        this.videoHtmlMediaElement.currentTime = currentTime;
      }
      this.videoHtmlMediaElement.play();
    }
  }

  pauseVideo() {
    if(this.videoHtmlMediaElement !== undefined){
      this.videoHtmlMediaElement.pause();
    }
  }

  skipVideoForDuration(duration: number){
    if(this.videoHtmlMediaElement !== undefined) {
      if(this.videoHtmlMediaElement.currentTime + duration < 0) {
        this.videoHtmlMediaElement.currentTime = 0;
      } else
        this.videoHtmlMediaElement.currentTime = this.videoHtmlMediaElement.currentTime + duration;
    }
  }

  determineIcon(){
    if(this.videoPlayerState.isPlaying()){
      this.playButtonIcon = 'pause';
    } else if(this.videoPlayerState.isPaused() ){
      this.playButtonIcon = 'play_arrow';
    } else if(this.videoPlayerState.isReplaying()){
      this.playButtonIcon = 'replay';
    }
  }

  onFullscreen(){
    this.videoHtmlMediaElement.requestFullscreen();
  }

  changeDuration(event: any){
    this.videoHtmlMediaElement.currentTime = Math.floor(event.value);
  }

  onFileChange(event:any){
    const files:FileList = event.target.files;
    if(files.length > 0){
      this.videoFileUrl = URL.createObjectURL(files.item(0));
      this.videoFileType = files.item(0)?.type;
    }
  }

  onSpeak(event:any){
    this.videoPlayerState.micToggle();
    if(this.videoPlayerState.isMicEnabled())
      this.micService.start();
    else
      this.micService.stop();
  }
  
  ngOnDestroy(){
    if(this.keyPressListenerSubscriber$ !== undefined && !this.keyPressListenerSubscriber$.closed){
      this.keyPressListenerSubscriber$.unsubscribe();
    }
  }
}
