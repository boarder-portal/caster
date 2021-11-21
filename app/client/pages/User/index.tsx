import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { PublicUser } from 'shared/types';

import ApiClient from 'client/helpers/ApiClient';

import Loader from 'client/components/Loader';
import Stream from 'client/components/Stream';

import { useAsyncData } from 'client/hooks';

import classes from './index.pcss';

const apiClient = new ApiClient();

const User: React.FC = () => {
  const { login } = useParams<'login'>();

  const {
    data: user,
    isLoading: isLoadingUser,
    error,
    load: loadUser,
  } = useAsyncData(async () => {
    const { user } = await apiClient.get<{ user: PublicUser }>(`/user/${login}`);

    return user;
  });

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoadingUser) {
    return (
      <div className={classes.container}>
        <Loader className={classes.loader} />
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (!user.isLive) {
    return null;
  }

  return (
    <Stream login={user.login} onStreamEnd={loadUser} />
  );
};

export default React.memo(User);
