import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'movie-player';
  sourceConfig = [{ path:'/assets/Wildlife.mp4', type:'mp4', name:"wildlife"}];
  ngOnInit(){

  }
}
