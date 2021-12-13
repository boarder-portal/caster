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

import {
  useBoolean,
  useConstantCallback,
  useEventListener,
  useLocalStorageState,
  usePlayPauseController,
} from 'client/hooks';
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
  const {
    value: hiddenControls,
    setTrue: hideControls,
    setFalse: showControls,
  } = useBoolean(true);
  const {
    isInProcess,
    startProcess,
    cancelProcess,
  } = usePlayPauseController();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<flvJs.Player | null>(null);
  const hideControlsTimeoutRef = useRef<number | undefined>();

  const setHideControlsTimeout = useConstantCallback(() => {
    hideControlsTimeoutRef.current = window.setTimeout(hideControls, 2000);
  });

  const clearHideControlsTimeout = useConstantCallback(() => {
    window.clearTimeout(hideControlsTimeoutRef.current);
  });

  const handleFullScreenIfNeeded = useConstantCallback(async (): Promise<boolean> => {
    if (isInProcess) {
      cancelProcess();

      if (isFullScreen) {
        await exitFullScreen();
      } else {
        await enterFullScreen();
      }

      return true;
    }

    await startProcess();

    return false;
  });

  const togglePlay = useConstantCallback(async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (await handleFullScreenIfNeeded()) {
      return;
    }

    if (video.paused) {
      video.currentTime = video.buffered.end(0) - 0.1;

      await video.play();
    } else {
      video.pause();
    }
  });

  const enterFullScreen = useConstantCallback(async () => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    await Promise.all([
      root.requestFullscreen({
        navigationUI: 'hide',
      }),
      screen.orientation.lock('landscape'),
    ]);
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

  const onMouseMove = useConstantCallback(() => {
    if (!isPlaying) {
      return;
    }

    showControls();

    clearHideControlsTimeout();
    setHideControlsTimeout();
  });

  useEventListener('fullscreenchange', () => {
    setIsFullScreen(Boolean(document.fullscreenElement));
  }, document);

  useEventListener('keydown', async (e) => {
    if (e.code === 'Space') {
      await togglePlay();
    }
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

  useEffect(() => {
    if (isPlaying) {
      setHideControlsTimeout();
    } else {
      clearHideControlsTimeout();
      showControls();
    }
  }, [clearHideControlsTimeout, isPlaying, setHideControlsTimeout, showControls]);

  useEffect(() => {
    if (isMobile && !isFullScreen) {
      screen.orientation.unlock();
    }
  }, [isFullScreen, isMobile]);

  return (
    <div
      ref={rootRef}
      className={classNames(classes.root, className)}
      onMouseMove={onMouseMove}
    >
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
        <div className={classNames(classes.controls, hiddenControls && classes.hidden)}>
          <div
            className={classNames(classes.playPauseContainer)}
            onClick={togglePlay}
          >
            {!isPlaying && <PlayArrowIcon className={classes.togglePlayButton} />}
          </div>

          <div className={classes.bottomPanel}>
            {!isMobile && (
              <div
                className={classNames(classes.togglePlayButton, classes.iconButton)}
                onClick={togglePlay}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </div>
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
