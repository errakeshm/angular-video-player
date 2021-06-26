import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { SourceConfig } from './interfaces/player-config';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'player',
  template: `<video-player [sourceConfig]="sourceConfig"></video-player>`
})
export class PlayerComponent implements OnInit {

  @Input() sourceConfig: Array<SourceConfig>;

  constructor(registry:MatIconRegistry, domSantitizer:DomSanitizer){
    this.initMatIcons(registry, domSantitizer);
  }

  initMatIcons(registry:MatIconRegistry, domSanitizer:DomSanitizer){
    registry.addSvgIcon('mic_on', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/mic_on.svg"));
    registry.addSvgIcon('mic_off', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/mic_off.svg"));
    registry.addSvgIcon('play', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/play.svg"));
    registry.addSvgIcon('pause', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/pause.svg"));
    registry.addSvgIcon('replay', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/replay.svg"));
    registry.addSvgIcon('volume_up', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/volume.svg"));
    registry.addSvgIcon('volume_off', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/mute.svg"));
    registry.addSvgIcon('fullscreen', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/fullscreen.svg"));
    registry.addSvgIcon('settings', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/settings.svg"));
    registry.addSvgIcon('upload', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/upload.svg"));
    registry.addSvgIcon('forward', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/forward.svg"));
    registry.addSvgIcon('backward', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/backward.svg"));
  }

  ngOnInit(): void {
  }

}
