import { Button, TextField } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { PublicUser } from 'shared/types';

import ApiClient, { HttpError } from 'client/helpers/ApiClient';

import { useBoolean } from 'client/hooks';
import { userAtom } from 'client/recoil/atoms';

import * as classes from './index.pcss';

const apiClient = new ApiClient();

const Signup: React.FC = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const {
    value: isSubmitting,
    setTrue: submit,
    setFalse: stopSubmit,
  } = useBoolean(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    submit();

    try {
      const { user } = await apiClient.post<{user: PublicUser}>('/api/auth/signup', {
        login: loginRef.current?.value,
        password: passwordRef.current?.value,
      });

      setErrorCode(null);
      setUser(user);
      navigate('/');
    } catch (err) {
      if (err instanceof HttpError) {
        setErrorCode(err.getResponse().status);
      } else {
        setErrorCode(-1);
      }
    } finally {
      stopSubmit();
    }
  }, [navigate, setUser, stopSubmit, submit]);

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={onSubmit}>
        <span className={classes.error}>
          {
            errorCode
              ? errorCode === 409
                ? 'Login already exists'
                : 'Incorrect login or password'
              : '\u00a0'
          }
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
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default React.memo(Signup);
