import { Button, TextField } from '@mui/material';
import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { PublicUser } from 'shared/types';

import ApiClient from 'client/helpers/ApiClient';

import { useBoolean } from 'client/hooks';
import { userAtom } from 'client/recoil/atoms';

import * as classes from './index.pcss';

const apiClient = new ApiClient();

const Login: React.FC = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const {
    value: isSubmitting,
    setTrue: submit,
    setFalse: stopSubmit,
  } = useBoolean(false);
  const {
    value: isError,
    setTrue: error,
    setFalse: noError,
  } = useBoolean(false);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    submit();

    try {
      const { user } = await apiClient.post<{ user: PublicUser }>('/api/auth/login', {
        login: loginRef.current?.value,
        password: passwordRef.current?.value,
      });

      noError();
      setUser(user);
      navigate('/');
    } catch {
      error();
    } finally {
      stopSubmit();
    }
  }, [error, navigate, noError, setUser, stopSubmit, submit]);

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={onSubmit}>
        <span className={classes.error}>
          {isError ? 'Incorrect login or password' : '\u00a0'}
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
