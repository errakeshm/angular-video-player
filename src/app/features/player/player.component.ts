import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { SourceConfig } from './interfaces/player-config';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'player',
  template: `<video-player [sourceConfig]="sourceConfig" [height]="height" [width]="width"></video-player>`
})
export class PlayerComponent implements OnInit {

  @Input() sourceConfig: Array<SourceConfig>;
  @Input() height:number;
  @Input() width:number;

  constructor(registry:MatIconRegistry, domSantitizer:DomSanitizer){
    this.initMatIcons(registry, domSantitizer);
  }

  initMatIcons(registry:MatIconRegistry, domSanitizer:DomSanitizer){
    registry.addSvgIcon('mic_on', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/mic_on.svg"));
    registry.addSvgIcon('mic_off', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/mic_off.svg"));
    registry.addSvgIcon('play_arrow', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/play.svg"));
    registry.addSvgIcon('pause', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/pause.svg"));
    registry.addSvgIcon('replay', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/replay.svg"));
    registry.addSvgIcon('volume_up', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/volume.svg"));
    registry.addSvgIcon('volume_off', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/mute.svg"));
    registry.addSvgIcon('fullscreen', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/fullscreen.svg"));
    registry.addSvgIcon('settings', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/settings.svg"));
    registry.addSvgIcon('upload', domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/upload.svg"));
  }

  ngOnInit(): void {
  }

}
