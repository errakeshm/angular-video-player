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

 
  ngOnInit(): void {
  }

}
