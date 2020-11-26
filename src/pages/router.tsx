import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Trip from './trip/index';
import Edit from './trip/edit';
import Index from './index';
import Receipt from './trip/receipt';

function RouterProvider() {
  return (
    <Router>
      <Switch>
        <Route path="/:id/trip">
          <Trip />
        </Route>
        <Route path="/:id/receipt">
          <Receipt />
        </Route>
        <Route path="/:id/:edit">
          <Edit />
        </Route>
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
