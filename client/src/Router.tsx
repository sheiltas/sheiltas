import React, { memo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/Login';
import EditorPage from './pages/Editor';
import PrivateRoute from './pages/PrivateRoute';
import ContentsPage from './pages/Contents';
import ArticleForm from './components/ArticleForm';
import SheiltaForm from './components/SheiltaForm';
import PageTemplate from './pages/PageTemplate';
import { ClientRoutes } from './types';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <PageTemplate>
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
      </PageTemplate>
    </Switch>
  </BrowserRouter>
);

export default memo(Router);
