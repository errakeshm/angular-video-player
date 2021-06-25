import { AppConstants } from "../constants/app.constants";

export class VideoPlayerState {
    video : string;
    audio : boolean;
    audioVolumeLevel : number;
    maxVideoDuration : number;
    mic:boolean;

    public static MAX_AUDIO_LEVEL:number = 1;
    public static DEFAULT_AUDIO_LEVEL:number = 0.5;
    public static MINIMUM_AUDIO_LEVEL:number = 0;
    public static AUDIO_SKIP_LEVEL:number = 5;

    isLoaded(): boolean {
        return this.video == undefined;
    }

    isPlaying() : boolean {
        return this.video !== undefined && this.video == AppConstants.PLAY;
    }

    isPaused() : boolean {
        return this.video !== undefined  && this.video == AppConstants.PAUSE;
    }

    isReplaying() : boolean {
        return this.video !== undefined && this.video == AppConstants.REPLAY;
    }

    isMute(): boolean {
        return !(this.audio == undefined || this.audio);
    }

    setPlay() : void {
        this.video = AppConstants.PLAY;
    }

    setPause() : void {
        this.video = AppConstants.PAUSE;
    }

    setReplay() : void {
        this.video = AppConstants.REPLAY;
    }

    setUnmute() : void {
        this.audio = true;
    }

    setMute() : void {
        this.audio = false;
    }

    setAudioLevel(volume:number) : void {
        this.audioVolumeLevel = volume;
    }

    isMicEnabled(){
        return this.mic;
    }

    micToggle(){
        this.mic = !this.mic;
    }
}