# Video Player

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.4. This is a custom Angular component encapsulating the HTML5 video api. This project is just to playaround with the default HTML5 video api by overriding its default controls and do quirky little things with it.

![](snapshot_custom_player.JPG)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Functionalities

- All prebuilt control buttons have been disabled, and custom buttons have been added. This is to test out the basic apis of the Video API
    
- Following custom buttons have been added (basic) :
    

1.  Play/Pause/Replay : To play, pause , replay(incase the video playback has ended)
    
2.  Replay 10s : Replay video by 10s. Initiated by pressing the left arrow key;
    
3.  Forward 10s : Forward video by 10s. Initiated by pressing the right arrow key
    
4.  Volume : Volume Slider
    
5.  Mute / Unmute
    
6.  Video slider : To slide through the video.
    

## Quirky functionalities 

### SPEECH CONTROL : Control the player through speech 
- The ability to control the video through speech.
- The video player has been enabled to be controlled using voice. Just press the 'mic' icon and when (mic +) icon is shown, speak either of the following commands:
    - PLAY / START - To start the video
    - PAUSE / STOP - To pause the video
    - FULLSCREEN - Enable fullscreen
    - MUTE - Mute the video
    - VOLUME - Unmute the video
- Press the mic button each time you want to speak a command
<img src="src/assets/mic_off.svg">