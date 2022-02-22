import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from './subcomponents/Spinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const BasicTable = lazy(() => import('./pages/Trending'));

class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/dashboard/:keyword" component={ Dashboard } />
          <Route path="/trending" component={ BasicTable } />
          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;