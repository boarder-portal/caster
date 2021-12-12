import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseIcon from '@mui/icons-material/Pause';
import PictureInPictureIcon from '@mui/icons-material/PictureInPictureAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import classNames from 'classnames';
import flvJs from 'flv.js';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { WithClassName } from 'client/types';

import Loader from 'client/components/Loader';
import Volume from 'client/components/Volume';

import { useBoolean, useConstantCallback, useEventListener, useLocalStorageState } from 'client/hooks';
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const {
    value: isLoading,
    setFalse: onLoadEnd,
  } = useBoolean(true);
  const {
    value: isPlaying,
    setTrue: startPlaying,
    setFalse: stopPlaying,
  } = useBoolean(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
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

  const enterFullScreen = useConstantCallback(async () => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    await root.requestFullscreen({
      navigationUI: 'hide',
    });
  });

  const exitFullScreen = useConstantCallback(async () => {
    await document.exitFullscreen();
  });

  const enterPictureInPicture = useConstantCallback(async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    await video.requestPictureInPicture();
  });

  const exitPictureInPicture = useConstantCallback(async () => {
    if (isPictureInPicture) {
      await document.exitPictureInPicture();
    }
  });

  useEventListener('fullscreenchange', () => {
    setIsFullScreen(Boolean(document.fullscreenElement));
  }, document);

  useEventListener('focus', exitPictureInPicture, window);

  useEffect(() => {
    const video = videoRef.current;

    if (!flvJs.isSupported() || !video) {
      return;
    }

    const player = flvJs.createPlayer({
      type: 'flv',
      isLive: true,
      url: `/live/${id}`,
    });

    player.attachMediaElement(video);
    player.load();

    playerRef.current = player;

    const onEnterPictureInPicture = () => {
      setIsPictureInPicture(true);
    };

    const onExitPictureInPicture = () => {
      setIsPictureInPicture(false);
    };

    video.addEventListener('enterpictureinpicture', onEnterPictureInPicture);
    video.addEventListener('leavepictureinpicture', onExitPictureInPicture);

    return () => {
      playerRef.current = null;

      player.destroy();
      player.detachMediaElement();

      video.removeEventListener('enterpictureinpicture', onEnterPictureInPicture);
      video.removeEventListener('leavepictureinpicture', onExitPictureInPicture);
    };
  }, [id]);

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.volume = volume;
    }
  }, [volume]);

  return (
    <div ref={rootRef} className={classNames(classes.root, className)}>
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
                <div
                  className={classNames(classes.pauseButton, classes.iconButton)}
                  onClick={pause}
                >
                  <PauseIcon />
                </div>
              ) : (
                <div
                  className={classNames(classes.playButton, classes.iconButton)}
                  onClick={play}
                >
                  <PlayArrowIcon />
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

            {!isMobile && (
              <div
                className={classNames(classes.pictureInPictureButton, classes.iconButton)}
                onClick={isPictureInPicture ? exitPictureInPicture : enterPictureInPicture}
              >
                {isPictureInPicture ? <AspectRatioIcon /> : <PictureInPictureIcon />}
              </div>
            )}

            <div
              className={classNames(classes.fullScreenButton, classes.iconButton)}
              onClick={isFullScreen ? exitFullScreen : enterFullScreen}
            >
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Player);
