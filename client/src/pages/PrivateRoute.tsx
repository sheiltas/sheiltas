import React, { useMemo, memo } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ChildrenProps, ClientRoutes } from '../types';

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

  const page =
    // TODO remove when more routes
    path === ClientRoutes.ROOT ? (
      <Redirect to={ClientRoutes.EDITOR_ARTICLE} />
    ) : (
      <Route path={path}>{children}</Route>
    );

  return isAuthorized ? page : <Redirect to={ClientRoutes.ROOT} />;
};

export default memo(PrivateRoute);
