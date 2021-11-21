import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { PublicUser } from 'shared/types';

import ApiClient from 'client/helpers/ApiClient';

import Loader from 'client/components/Loader';
import Stream from 'client/components/Stream';

import { useAsyncData, useConstantCallback } from 'client/hooks';
import { userAtom } from 'client/recoil/atoms';

import classes from './index.pcss';

const apiClient = new ApiClient();

const RTMP_SERVER = `rtmp://${location.hostname}:1935/live`;

const User: React.FC = () => {
  const { login } = useParams<'login'>();

  const user = useRecoilValue(userAtom);

  const {
    data: streamer,
    isLoading: isLoadingStreamer,
    error,
    load: loadStreamer,
  } = useAsyncData(async () => {
    const { user } = await apiClient.get<{ user: PublicUser }>(`/user/${login}`);

    return user;
  });

  const copyServer = useConstantCallback(async () => {
    await navigator.clipboard.writeText(RTMP_SERVER);
  });

  const copyStreamKey = useConstantCallback(async () => {
    if (user) {
      await navigator.clipboard.writeText(user.streamToken);
    }
  });

  useEffect(() => {
    loadStreamer();
  }, [loadStreamer]);

  if (isLoadingStreamer) {
    return (
      <div className={classes.container}>
        <Loader className={classes.loader} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.container}>
        <div className={classes.error}>
          Something went wrong
        </div>
      </div>
    );
  }

  if (!streamer) {
    return null;
  }

  if (!streamer.isLive) {
    if (streamer.login === user?.login) {
      return (
        <div className={classes.container}>
          <div className={classes.startStreamingBox}>
            You are currently offline. To start streaming in OBS use the following parameters

            <TextField
              type="text"
              label="Server"
              value={`rtmp://${location.hostname}:1935/live`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={copyServer}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              type="password"
              label="Stream Key"
              value={user.streamToken}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={copyStreamKey}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <div>
          <span className={classes.login}>{streamer.login}</span>
          {' is currently offline'}
        </div>
      </div>
    );
  }

  return (
    <Stream login={streamer.login} onStreamEnd={loadStreamer} />
  );
};

export default React.memo(User);
