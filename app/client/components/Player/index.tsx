import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import classNames from 'classnames';
import flvJs from 'flv.js';
import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { WithClassName } from 'client/types';

import Loader from 'client/components/Loader';
import Volume from 'client/components/Volume';

import { useBoolean, useConstantCallback, useLocalStorageState } from 'client/hooks';
import { isMobileAtom } from 'client/recoil/atoms';

import * as classes from './index.pcss';

interface Props extends WithClassName {
  id: string;
}

flvJs.LoggingControl.applyConfig({
  enableDebug: false,
  enableVerbose: false,
  enableInfo: false,
});

const Player: React.FC<Props> = (props) => {
  const { className, id } = props;

  const isMobile = useRecoilValue(isMobileAtom);
  const [volume, setVolume] = useLocalStorageState<number>('playerVolume', 1);
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
  const playerRef = useRef<flvJs.Player | null>(null);

  const play = useConstantCallback(async () => {
    const video = videoRef.current;

    if (!video || !video.paused) {
      return;
    }

    video.currentTime = video.buffered.end(0) - 0.1;

    await video.play();
  });

  const pause = useConstantCallback(() => {
    const video = videoRef.current;

    if (!video || video.paused) {
      return;
    }

    video.pause();
  });

  useEffect(() => {
    if (!flvJs.isSupported() || !videoRef.current) {
      return;
    }

    const player = flvJs.createPlayer({
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

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.volume = volume;
    }
  }, [volume]);

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

      {isLoading ? (
        <div className={classes.loaderContainer}>
          <Loader className={classes.loader} />
        </div>
      ) : (
        <div className={classNames(classes.controls)}>
          <div className={classNames(classes.playPauseContainer)} onClick={isPlaying ? pause : play}>
            {isPlaying ? (
              <PauseIcon className={classes.pauseButton} />
            ) : (
              <PlayArrowIcon className={classes.playButton} />
            )}
          </div>

          <div className={classes.bottomPanel}>
            {!isMobile && (
              isPlaying ? (
                <div className={classes.pauseButton} onClick={pause}>
                  <PauseIcon className={classes.pauseIcon} />
                </div>
              ) : (
                <div className={classes.playButton} onClick={play}>
                  <PlayArrowIcon className={classes.playIcon} />
                </div>
              )
            )}

            {!isMobile && (
              <Volume
                className={classes.volume}
                volume={volume}
                onVolumeChange={setVolume}
              />
            )}

            <div className={classes.controlsContent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Player);
