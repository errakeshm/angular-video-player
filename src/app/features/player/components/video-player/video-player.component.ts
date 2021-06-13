import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
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
    }

    if(this.keyPressListener !== undefined){
      this.keyPressListenerSubscriber$ = this.keyPressListener.subscribe(event => {
        if (event.code == 'ArrowLeft') {
          this.skipVideoForDuration(-10);
          this.determineIcon();
          this.replayButtonIcon = "replay_10";
        } else if( event.code == 'ArrowRight') {
          this.skipVideoForDuration(10);
          this.determineIcon();
          this.replayButtonIcon = "forward_10";
        }
      });
    }
  }

  onPlay(){
    if(this.videoPlayerState.isLoaded() || this.videoPlayerState.isPaused()) {
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

  onVolume() {
    if(!this.videoPlayerState.isMute()){
      this.videoPlayerState.setMute();
    } else{
      this.videoPlayerState.setUnmute();
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

  ngOnDestroy(){
    if(this.keyPressListenerSubscriber$ !== undefined && !this.keyPressListenerSubscriber$.closed){
      this.keyPressListenerSubscriber$.unsubscribe();
    }
  }
}
