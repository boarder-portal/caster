import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';

import { WithClassName } from 'client/types';

import { useConstantCallback, useEventListener } from 'client/hooks';

import * as classes from './index.pcss';

interface Props extends WithClassName {
  volume: number;
  onVolumeChange(volume: number): void;
}

const Volume: React.FC<Props> = (props) => {
  const { className, volume, onVolumeChange } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [barWidth, setBarWidth] = useState<number>(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const applyVolumeChange = (e: MouseEvent | React.MouseEvent): number | null => {
    const bar = barRef.current;

    if (!bar) {
      return null;
    }

    const barRect = bar.getBoundingClientRect();
    const boundClientX = Math.min(Math.max(e.clientX, barRect.left), barRect.right);

    return (boundClientX - barRect.left) / barRect.width;
  };

  const onDragStart = useConstantCallback((e: React.MouseEvent) => {
    setIsDragging(true);

    const volume = applyVolumeChange(e);

    if (volume !== null) {
      onVolumeChange(volume);
    }
  });

  useEventListener('mousemove', (e) => {
    if (!isDragging) {
      return;
    }

    const volume = applyVolumeChange(e);

    if (volume !== null) {
      onVolumeChange(volume);
    }
  }, document);

  useEventListener('mouseup', () => {
    setIsDragging(false);
  }, document);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const updateBarWidth = () => {
      const rootRect = root.getBoundingClientRect();

      setBarWidth(rootRect.width - rootRect.height);
    };

    const observer = new ResizeObserver(updateBarWidth);

    observer.observe(root, {
      box: 'border-box',
    });

    updateBarWidth();

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    document.body.style.userSelect = isDragging ? 'none' : '';
  }, [isDragging]);

  return (
    <div
      ref={rootRef}
      className={classNames(classes.root, className)}
      onMouseDown={onDragStart}
    >
      <div ref={barRef} className={classes.bar} style={{ width: barWidth }}>
        <div
          className={classes.activeBar}
          style={{ width: `${volume * 100}%` }}
        />
      </div>

      <div
        className={classes.circle}
        style={{ transform: `translateX(calc(${barWidth * volume}px))` }}
      />
    </div>
  );
};

export default React.memo(Volume);
