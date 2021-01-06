import React, { memo } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login';
import EditorPage from './pages/Editor';
import PrivateRoute from './pages/PrivateRoute';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/*  Should be /login*/}
        {/*<PrivateRoute path="/">*/}
        <Route path="/" exact>
          <LoginPage />
        </Route>
        {/*</PrivateRoute>*/}
        <PrivateRoute path="/editor">
          <EditorPage />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
};

export default memo(Router);
