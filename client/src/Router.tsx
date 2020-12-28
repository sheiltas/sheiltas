import React, { memo } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login';
import EditorPage from './pages/Editor';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/*  Should be /login*/}
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path="/editor">
          <EditorPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default memo(Router);
