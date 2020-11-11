import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  withRouter,
} from 'react-router-dom';
import Detail from './trip/detail';
import Edit from './trip/edit';
import Index from './index';
import SessionStorageService from '../services/SessionStorageService';
import EncryptService from '../services/EncryptService';
import qs from 'querystring';
import Receipt from './trip/receipt';

interface IPrivateRoute {
  children: React.ReactNode;
  path: string;
}

function useQuery() {
  return qs.parse(useLocation().search.replace('?', ''));
}
function PrivateRoute({ children, path }: IPrivateRoute) {
  const query = useQuery();
  if (query?.sr) {
    const sr = EncryptService.decrypt(query.sr.toString());
    if (sr === 'codeEnabled') {
      SessionStorageService.set({ key: 'codeEnabled', value: true });
    }
  }
  return (
    <Route
      path={path}
      render={() =>
        SessionStorageService.hasKey('codeEnabled') ? (
          <div className={'App'}>{children}</div>
        ) : (
          <Redirect
            to={{
              pathname: '/enter',
            }}
          />
        )
      }
    />
  );
}

function RouterProvider() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/:id/trip">
          <Detail />
        </PrivateRoute>
        <PrivateRoute path="/:id/receipt">
          <Receipt />
        </PrivateRoute>
        <PrivateRoute path="/:id/:edit">
          <Edit />
        </PrivateRoute>
        <Route path="/enter">
          <Index />
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

export default RouterProvider;
