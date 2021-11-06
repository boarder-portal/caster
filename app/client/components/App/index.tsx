import React, { useCallback } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import ApiClient from 'client/helpers/ApiClient';

import Home from 'client/pages/Home';
import Login from 'client/pages/Login';
import Signup from 'client/pages/Signup';
import Stream from 'client/pages/Stream';

import { userAtom } from 'client/recoil/atoms';

import * as classes from './index.pcss';

const apiClient = new ApiClient();

const App: React.FC = () => {
  const [user, setUser] = useRecoilState(userAtom);

  const logout = useCallback(async () => {
    await apiClient.post('/api/auth/logout');

    setUser(null);
  }, [setUser]);

  return (
    <>
      <header className={classes.header}>
        <Link className={classes.logo} to="/">
          Caster
        </Link>

        <div>
          {user ? (
            <div className={classes.loggedIn}>
              Logged in as <span className={classes.login}>{user.login}</span>{' '}

              <span className={classes.logout} onClick={logout}>
                Log out
              </span>
            </div>
          ) : (
            <div className={classes.notLoggedIn}>
              <Link to="/signup">
                Sign up
              </Link>

              <Link to="/login">
                Log in
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className={classes.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/u/:login" element={<Stream />} />
        </Routes>
      </div>
    </>
  );
};

export default React.memo(App);
