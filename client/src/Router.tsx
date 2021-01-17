import React, { memo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/Login';
import EditorPage from './pages/Editor';
import PrivateRoute from './pages/PrivateRoute';
import ContentsPage from './pages/Contents';
import ArticleForm from './components/ArticleForm';
import { ClientRoutes } from './types';
import SheiltaForm from './components/SheiltaForm';

const Router = () => (
  <BrowserRouter>
    <Switch>
      {/*  Should be /login */}
      <Route path={ClientRoutes.ROOT} exact>
        <LoginPage />
      </Route>

      <PrivateRoute path={ClientRoutes.EDITOR_ARTICLE}>
        <EditorPage
          Form={ArticleForm}
          data={{
            titleKey: 'editorPageTitle',
            toPageKey: 'toContentsPage',
            link: ClientRoutes.CONTENTS
          }}
        />
      </PrivateRoute>

      <PrivateRoute path={ClientRoutes.EDITOR_SHEILTA}>
        <EditorPage
          Form={SheiltaForm}
          data={{
            titleKey: 'editorSheiltaPageTitle',
            toPageKey: 'toSheiltasPage',
            link: ClientRoutes.CONTENTS
          }}
        />
      </PrivateRoute>

      <PrivateRoute path={ClientRoutes.CONTENTS}>
        <ContentsPage />
      </PrivateRoute>
    </Switch>
  </BrowserRouter>
);

export default memo(Router);
