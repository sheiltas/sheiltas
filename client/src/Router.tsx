import React, { lazy, memo, ReactNode, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './pages/PrivateRoute';
import PageTemplate from './pages/PageTemplate';
import { ClientRoutes } from './types';

const LoginPage = lazy(() => import('./pages/Login'));
const EditorPage = lazy(() => import('./pages/Editor'));
const ArticlesPage = lazy(() => import('./pages/Articles'));
const SheiltasPage = lazy(() => import('./pages/Sheiltas'));
const ArticleForm = lazy(() => import('./components/ArticleForm'));
const SheiltaForm = lazy(() => import('./components/SheiltaForm'));
const CategoriesEditor = lazy(() => import('./pages/CategoriesEditor'));

interface RouteType {
  path: ClientRoutes;
  exact?: boolean;
  page: ReactNode;
}

// Should be /login
const publicRoutes: RouteType[] = [
  { path: ClientRoutes.ROOT, exact: true, page: <LoginPage /> }
];

const privateRoutes: RouteType[] = [
  {
    path: ClientRoutes.EDITOR_ARTICLE,
    page: (
      <EditorPage
        Form={ArticleForm}
        data={{
          titleKey: 'editorPageTitle',
          toPageKey: 'toContentsPage',
          link: ClientRoutes.ARTICLES
        }}
      />
    )
  },
  {
    path: ClientRoutes.EDITOR_SHEILTA,
    page: (
      <EditorPage
        Form={SheiltaForm}
        data={{
          titleKey: 'editorSheiltaPageTitle',
          toPageKey: 'toSheiltasPage',
          link: ClientRoutes.SHEILTAS
        }}
      />
    )
  },
  {
    path: ClientRoutes.ARTICLES,
    page: <ArticlesPage />
  },
  {
    path: ClientRoutes.SHEILTAS,
    page: <SheiltasPage />
  },
  {
    path: ClientRoutes.EDITOR_CATEGORIES,
    page: <CategoriesEditor />
  }
];

const Router = () => (
  <Suspense fallback={() => <>Loading...</>}>
    <BrowserRouter>
      <Switch>
        <PageTemplate>
          {publicRoutes.map(({ path, exact = false, page }) => (
            <Route path={path} exact={exact}>
              {page}
            </Route>
          ))}

          {privateRoutes.map(({ path, page }) => (
            <PrivateRoute path={path}>{page}</PrivateRoute>
          ))}
        </PageTemplate>
      </Switch>
    </BrowserRouter>
  </Suspense>
);

export default memo(Router);
