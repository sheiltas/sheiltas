import React, { useMemo, memo } from 'react';
import { Redirect, Route } from 'react-router';
import { ChildrenProps } from '../types';

interface Props extends ChildrenProps {
  path: string;
}

const PrivateRoute = (props: Props) => {
  const { children, path } = props;

  const isAuthorized = useMemo(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        return exp ? exp * 1000 > Date.now() : false;
      } catch (e) {
        localStorage.removeItem('token');
        return false;
      }
    }
    return false;
  }, []);

  return isAuthorized ? (
    // TODO remove when more routes
    path === '/' ? (
      <Redirect to={'/editor'} />
    ) : (
      <Route path={path}>{children}</Route>
    )
  ) : (
    <Redirect to={'/'} />
  );
};

export default memo(PrivateRoute);
