import React, { memo } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/Login';
import EditorPage from './pages/Editor';
import PrivateRoute from './pages/PrivateRoute';
import ArticlesPage from './pages/Articles';
import SheiltasPage from './pages/Sheiltas';
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
              link: ClientRoutes.ARTICLES
            }}
          />
        </PrivateRoute>

        <PrivateRoute path={ClientRoutes.EDITOR_SHEILTA}>
          <EditorPage
            Form={SheiltaForm}
            data={{
              titleKey: 'editorSheiltaPageTitle',
              toPageKey: 'toSheiltasPage',
              link: ClientRoutes.SHEILTAS
            }}
          />
        </PrivateRoute>

        <PrivateRoute path={ClientRoutes.ARTICLES}>
          <ArticlesPage />
        </PrivateRoute>

        <PrivateRoute path={ClientRoutes.SHEILTAS}>
          <SheiltasPage />
        </PrivateRoute>
      </PageTemplate>
    </Switch>
  </BrowserRouter>
);

export default memo(Router);
