import React, { memo } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login';
import EditorPage from './pages/Editor';
import PrivateRoute from './pages/PrivateRoute';
import ContentsPage from './pages/Contents';

const Router = () => (
  <BrowserRouter>
    <Switch>
      {/*  Should be /login */}
      <Route path="/" exact>
        <LoginPage />
      </Route>

      <PrivateRoute path="/editor">
        <EditorPage />
      </PrivateRoute>
      <PrivateRoute path="/contents">
        <ContentsPage />
      </PrivateRoute>
    </Switch>
  </BrowserRouter>
);

export default memo(Router);
