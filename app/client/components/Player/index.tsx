import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import classNames from 'classnames';
import flvjs from 'flv.js';
import React, { useCallback, useEffect, useRef } from 'react';

import { WithClassName } from 'client/types';

import Loader from 'client/components/Loader';

import { useBoolean } from 'client/hooks';

import * as classes from './index.pcss';

interface Props extends WithClassName {
  id: string;
}

flvjs.LoggingControl.applyConfig({
  enableDebug: false,
  enableVerbose: false,
  enableInfo: false,
});

const Player: React.FC<Props> = (props) => {
  const { className, id } = props;

  const {
    value: isLoading,
    setFalse: onLoadEnd,
  } = useBoolean(true);
  const {
    value: isPlaying,
    setTrue: startPlaying,
    setFalse: stopPlaying,
  } = useBoolean(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<flvjs.Player | null>(null);

  const play = useCallback(async () => {
    const video = videoRef.current;

    if (!video || !video.paused) {
      return;
    }

    video.currentTime = video.buffered.end(0) - 0.1;

    video.play();
  }, []);

  useEffect(() => {
    if (!flvjs.isSupported() || !videoRef.current) {
      return;
    }

    const player = flvjs.createPlayer({
      type: 'flv',
      isLive: true,
      url: `/live/${id}`,
    });

    player.attachMediaElement(videoRef.current);
    player.load();

    playerRef.current = player;

    return () => {
      playerRef.current = null;

      player.destroy();
      player.detachMediaElement();
    };
  }, [id]);

  return (
    <div className={classNames(classes.root, className)}>
      <video
        ref={videoRef}
        className={classes.player}
        playsInline
        autoPlay
        onCanPlay={onLoadEnd}
        onPlay={startPlaying}
        onPause={stopPlaying}
      />

      <div className={classes.controls}>
        {isLoading ? (
          <div className={classes.loaderContainer}>
            <Loader className={classes.loader} />
          </div>
        ) : isPlaying ? null : (
          <div className={classes.playContainer} onClick={play}>
            <PlayCircleOutlinedIcon className={classes.playButton} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Player);
