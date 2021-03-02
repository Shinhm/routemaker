import React, { lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteProps,
  useHistory,
} from 'react-router-dom';

const Trip = lazy(() => import('./trip/index'));
const Edit = lazy(() => import('./trip/edit'));
const Receipt = lazy(() => import('./trip/receipt'));
const User = lazy(() => import('./user'));
const Index = lazy(() => import('./index'));

function PrivateRoute(props: RouteProps) {
  const history = useHistory();

  if (!sessionStorage.getItem('kakaoAuth')) {
    history.replace('/enter');
    return null;
  }

  return <Route {...props} />;
}

function RouterProvider() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path={'/user'}>
          <User />
        </PrivateRoute>
        <Route path="/enter">
          <Index />
        </Route>
        <Route path="/:id/trip">
          <Trip />
        </Route>
        <Route path="/:id/receipt">
          <Receipt />
        </Route>
        <Route path="/:id/:edit">
          <Edit />
        </Route>
        <Route path="/*">
          <Redirect
            to={{
              pathname: '/enter',
            }}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default withRouter(RouterProvider);
