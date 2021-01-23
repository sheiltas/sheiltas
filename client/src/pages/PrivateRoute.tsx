import React, { memo } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ChildrenProps, ClientRoutes } from '../types';
import { useClientContext } from '../providers/ClientProvider';

interface Props extends ChildrenProps {
  path: string;
}

const PrivateRoute = (props: Props) => {
  const { children, path } = props;
  const { isAuthorized } = useClientContext();

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
