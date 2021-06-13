import { Component, OnInit, Input } from '@angular/core';
import { SourceConfig } from './interfaces/player-config';

@Component({
  selector: 'player',
  template: `<video-player [sourceConfig]="sourceConfig" [height]="height" [width]="width"></video-player>`
})
export class PlayerComponent implements OnInit {

  constructor() { }
  @Input() sourceConfig: Array<SourceConfig>;
  @Input() height:number;
  @Input() width:number;
  ngOnInit(): void {
  }

}
