# Video Player

This is a custom Angular Video Player component. This project is just to playaround with the default video api by overriding its default controls and do quirky things with it.

![](snapshot_custom_player.JPG)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
    

## Quirky functionalities 

### SPEECH CONTROL : Control the player through speech 
- The ability to control the video through speech.
- The video player has been enabled to be controlled using voice. Just press the 'microphone' icon and when (mic +) icon is shown, speak either of the following commands:
    - PLAY / START - To start the video
    - PAUSE / STOP - To pause the video
    - FULLSCREEN - Enable fullscreen
    - MUTE - Mute the video
    - VOLUME - Unmute the video
- Press the microphone button each time you want to speak a command
- For now the functionality is only available in chrome based browsers.

### CUSTOM CONTROL : Control the behavior of the player with custom buttons

- All prebuilt control buttons have been disabled, and custom buttons have been added. 
    
- Following custom buttons have been added (basic) :

	-  **Play/Pause/Replay** : To play, pause , replay(incase the video playback has ended)
	-  **Rewind** : Replay video by 5s. Initiated by pressing the left arrow key;
	-  **Forward** : Forward video by 5s. Initiated by pressing the right arrow key
	-  **Volume** : Volume Slider
	-  **Mute / Unmute** : Mute/ Unmute the audio. If audio has not changed it will go to a default value otherwise it will go to the previously changed value.
	-  **Video slider** : To slide through the video.
	-  **Audion slider** : To increase or decrease the volume.
	-  **Full screen** : Make the video go full screen

- Also you can trigger the custom control button using keyboard buttons

	-  **Play/Pause/Replay** : Press the space bar
	-  **Arrow Up** : Increase the volume
	-  **Arrow Down** : Decrease the volume
	-  **Arrow Right** : Forward the video by 5s
	-  **Arrow Left** : Rewind the video by 5s


