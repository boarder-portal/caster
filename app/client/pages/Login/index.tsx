import { Button, TextField } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { PrivateUser } from 'shared/types';

import ApiClient from 'client/helpers/ApiClient';

import { useAsyncData } from 'client/hooks';
import { userAtom } from 'client/recoil/atoms';

import * as classes from './index.pcss';

const apiClient = new ApiClient();

const Login: React.FC = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const {
    data: user,
    isLoading: isSubmitting,
    error,
    load: submit,
  } = useAsyncData(async () => {
    const { user } = await apiClient.post<{ user: PrivateUser }>('/auth/login', {
      login: loginRef.current?.value,
      password: passwordRef.current?.value,
    });

    return user;
  });
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    submit();
  }, [submit]);

  useEffect(() => {
    if (user) {
      setUser(user);
      navigate('/');
    }
  }, [navigate, setUser, user]);

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={onSubmit}>
        <span className={classes.error}>
          {error ? 'Incorrect login or password' : '\u00a0'}
        </span>

        <TextField
          required
          inputRef={loginRef}
          label="Login"
          variant="standard"
          inputProps={{ pattern: '[a-z\\d_-]+' }}
        />

        <TextField
          required
          inputRef={passwordRef}
          type="password"
          label="Password"
          variant="standard"
        />

        <Button
          className={classes.submit}
          type="submit"
          disabled={isSubmitting}
          variant="contained"
        >
          Log in
        </Button>
      </form>
    </div>
  );
};

export default React.memo(Login);
