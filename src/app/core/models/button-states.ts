import { AppConstants } from "../constants/app.constants";

export class VideoPlayerState {
    video : string;
    audio : boolean;

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
}