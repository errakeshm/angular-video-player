import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    VideoPlayerComponent,
    PlayerComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    PlayerComponent
  ]
})
export class PlayerModule { }
