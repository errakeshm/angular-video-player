import { Renderer2, HostListener, Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlider } from '@angular/material/slider';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app.constants';
import { ApplicationError } from 'src/app/core/constants/error';
import { KeyboardEventCode } from 'src/app/core/constants/keyboard';
import { VideoPlayerState } from 'src/app/core/models/button-states';
import { IWindow, SourceConfig } from '../../interfaces/player-config';
import { MicService } from '../../services/mic.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() width: number = 100;
  @Input() sourceConfig: Array<SourceConfig>;

  static MIN_ICON_WIDTH:number = 30;
  static MAX_ICON_WIDTH:number = 40;

  controlColor:string = "white";
  playButtonIcon:string = AppConstants.PLAY;
  replayButtonIcon:string;
  videoFileUrl:string;
  videoFileType:any;

  videoPlayerState : VideoPlayerState = new VideoPlayerState();
  
  @ViewChild("videoControl") videoControl:ElementRef<HTMLMediaElement>;
  @ViewChild('audioSlider') audioSlider:MatSlider;
  @ViewChild('playSlider') playSlider:MatSlider;
  @ViewChildren('controlButton') controlButton:QueryList<MatIcon>;

  videoHtmlMediaElement: HTMLMediaElement;

  /* Use Rxjs to capture the Keyboard event. can also be done directly as a method (keyup) from
     the element itself or can be done through HostListener
  */
  keyPressListener:Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(document, KeyboardEventCode.KEY_UP);
  keyPressListenerSubscriber$:Subscription;
  action:string|null;
  constructor(private micService: MicService, private renderer:Renderer2) { }
  
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
          case AppConstants.PAUSE:
          case AppConstants.REPLAY:
            this.onPlay(this.action);
            break;
          case AppConstants.MUTE:
          case AppConstants.VOLUME:
            this.onVolumeClick(this.action);
            break;
          case AppConstants.FULL:
            this.onFullscreen();
            break;
        }
      } else {
        this.action = ApplicationError.UNRECOGNIZED;
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
        console.log(event.code)
        if (event.code == KeyboardEventCode.ARROW_LEFT) {
          event.preventDefault();
          this.onbackward();
        } else if( event.code == KeyboardEventCode.ARROW_RIGHT) {
          event.preventDefault();
          this.onforward();
        } else if(event.code == KeyboardEventCode.SPACE_BAR) {
          event.preventDefault();
          this.onPlay();  
        } else if(event.code == KeyboardEventCode.ARROW_UP) {
          event.preventDefault();
          this.incrementVolume(VideoPlayerState.AUDIO_INCREMENTAL_VALUE);  
        } else if(event.code == KeyboardEventCode.ARROW_DOWN) {
          event.preventDefault();
          this.incrementVolume(-1 * VideoPlayerState.AUDIO_INCREMENTAL_VALUE);  
        }     
      });
    }
    this.resizeControls();
    
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
    // this.audioSlider.value = volumeLevel;
  }

  onVolumeChange(event:any){
    this.changeVolume(event.value);
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
  
  onFullscreen(){
    this.videoHtmlMediaElement.requestFullscreen();
  }

  onbackward(){
    this.skipVideoForDuration(-1 * VideoPlayerState.AUDIO_SKIP_LEVEL);
  }

  onforward(){
    this.skipVideoForDuration(VideoPlayerState.AUDIO_SKIP_LEVEL);
  }

  @HostListener('window:resize',['$event'])
  onResize(event:any){
    this.resizeControls();
  }

  resizeControls(){
    let sizeTobeSetForIcons = Math.floor(0.04 * this.videoControl.nativeElement.getBoundingClientRect().width);
    let paddingToBeSet = Math.floor(0.01 * this.videoControl.nativeElement.getBoundingClientRect().width);

    let iconWidth = ((sizeTobeSetForIcons < VideoPlayerComponent.MIN_ICON_WIDTH) ? VideoPlayerComponent.MIN_ICON_WIDTH : sizeTobeSetForIcons) + 'px'
    this.controlButton.map(item=>{ 
      item._elementRef.nativeElement.style.width = iconWidth;
      item._elementRef.nativeElement.style.height = iconWidth;
      item._elementRef.nativeElement.style.fontSize = iconWidth;
    });
  }

  incrementVolume(volume:number){
    this.changeVolume(this.videoPlayerState.getAudioLevel() + volume);
    this.audioSlider.value = this.videoPlayerState.getAudioLevel();
  }
  
  changeVolume(volume?: number) {
    if(volume === undefined) {
      volume = this.audioSlider.value = VideoPlayerState.DEFAULT_AUDIO_LEVEL;
    }
    else if(volume !== this.videoHtmlMediaElement.volume) {
      if(volume <= VideoPlayerState.MINIMUM_AUDIO_LEVEL){
        volume = VideoPlayerState.MINIMUM_AUDIO_LEVEL;
        this.videoPlayerState.setMute();
      } else {
        if(volume > VideoPlayerState.MAX_AUDIO_LEVEL)
          volume = VideoPlayerState.MAX_AUDIO_LEVEL;
        if(this.videoPlayerState.isMute())
          this.videoPlayerState.setUnmute();
      }
      this.videoHtmlMediaElement.volume = volume;
    }
    this.videoPlayerState.setAudioLevel(volume);
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
      this.playButtonIcon = AppConstants.PAUSE;
    } else if(this.videoPlayerState.isPaused() ){
      this.playButtonIcon = AppConstants.PLAY;
    } else if(this.videoPlayerState.isReplaying()){
      this.playButtonIcon = AppConstants.REPLAY;
    }
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
