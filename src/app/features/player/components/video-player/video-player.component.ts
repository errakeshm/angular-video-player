import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { VideoPlayerState } from 'src/app/core/models/button-states';
import { SourceConfig } from '../../interfaces/player-config';

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

  constructor() { }
  
  ngOnInit(): void {

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

  onPlay(){
    if(this.videoPlayerState.isLoaded()) {
      this.changeVolume();
      this.videoPlayerState.setPlay();
      this.playVideo();
    } else if(this.videoPlayerState.isPaused()){
      this.playVideo();
      this.videoPlayerState.setPlay();
    } else if(this.videoPlayerState.isReplaying()){
      this.playVideo(0);
      this.videoPlayerState.setPlay();
    } else if(this.videoPlayerState.isPlaying()){
      this.pauseVideo();
      this.videoPlayerState.setPause();
    }
    this.determineIcon();
  }

  onVolumeClick() {
    let volumeLevel = VideoPlayerState.DEFAULT_AUDIO_LEVEL;
    if(!this.videoPlayerState.isMute()){
      this.videoPlayerState.setMute();
      volumeLevel = VideoPlayerState.MINIMUM_AUDIO_LEVEL;
    } else{
      this.videoPlayerState.setUnmute();
      if(this.videoPlayerState.audioVolumeLevel !== VideoPlayerState.MINIMUM_AUDIO_LEVEL) {
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

  fullscreen(event: any){
    this.videoHtmlMediaElement.requestFullscreen();
  }

  minimize(event: any){

  }
  changeDuration(event: any){
    this.videoHtmlMediaElement.currentTime = Math.floor(event.value);
  }
  ngOnDestroy(){
    if(this.keyPressListenerSubscriber$ !== undefined && !this.keyPressListenerSubscriber$.closed){
      this.keyPressListenerSubscriber$.unsubscribe();
    }
  }
}
