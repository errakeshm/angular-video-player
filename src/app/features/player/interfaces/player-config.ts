interface FileConfig {
    path: string;
    name: string;
    type: string;
}
export interface IWindow extends Window {
    webkitSpeechRecognition:any;
}
export interface SourceConfig extends FileConfig{
}