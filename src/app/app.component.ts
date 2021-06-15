import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'movie-player';
  sourceConfig = [
    { path:'/assets/Wildlife.mp4', type:'mp4', name:"wildlife"}];
  
    constructor(registry:MatIconRegistry, domSantitizer:DomSanitizer){
      registry.addSvgIcon('play_arrow', domSantitizer.bypassSecurityTrustResourceUrl("/assets/icons/play.svg"));
      registry.addSvgIcon('pause', domSantitizer.bypassSecurityTrustResourceUrl("/assets/icons/pause.svg"));
      registry.addSvgIcon('replay', domSantitizer.bypassSecurityTrustResourceUrl("/assets/icons/replay.svg"));
      registry.addSvgIcon('volume_up', domSantitizer.bypassSecurityTrustResourceUrl("/assets/icons/volume.svg"));
      registry.addSvgIcon('volume_off', domSantitizer.bypassSecurityTrustResourceUrl("/assets/icons/mute.svg"));
      registry.addSvgIcon('fullscreen', domSantitizer.bypassSecurityTrustResourceUrl("/assets/icons/fullscreen.svg"));
    
    }  
  ngOnInit(){

  }
}
