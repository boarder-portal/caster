declare module 'node-media-server' {
  import EventEmitter from 'events';
  import { Socket } from 'net';

  export interface Config {
    rtmp?: {
      port?: number;
      chunk_size?: number;
      gop_cache?: boolean;
      ping?: number;
      ping_timeout?: number;
    };
    http?: {
      port?: number;
      mediaroot?: string;
      allow_origin?: string;
    };
    trans?: {
      ffmpeg?: string;
      tasks?: {
        app?: string;
        hls?: boolean;
        hlsFlags?: string;
        dash?: boolean;
        dashFlags?: string;
      }[];
    };
    logType?: number;
  }

  export class Session {
    config: Config;
    socket: Socket;
    res: Socket;
    id: string;
    ip: string;
    isLocal: boolean;
    isStarting: boolean;
    isPublishing: boolean;
    isPlaying: boolean;
    isIdling: boolean;
    isPause: boolean;
    isReceiveAudio: boolean;
    isReceiveVideo: boolean;
    publishStreamPath: string;
    appname: string;
    connectTime: Date;

    reject(): void;
  }

  export default class NodeMediaServer extends EventEmitter {
    constructor(config?: Config);

    getSession(id: string): Session | undefined;
    on(event: 'prePublish', callback: (id: string, streamPath: string, args: unknown) => unknown): this;
    on(event: 'donePublish', callback: (id: string, streamPath: string, args: unknown) => unknown): this;
    run(): void;
  }
}
