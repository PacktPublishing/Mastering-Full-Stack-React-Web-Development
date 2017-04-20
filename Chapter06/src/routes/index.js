import React from 'react';
import { Route, IndexRoute } from 'react-router';

/* wrappers */
import CoreLayout from '../layouts/CoreLayout';

/* home view */
import PublishingApp from '../layouts/PublishingApp';

/* auth views */
import LoginView from '../views/LoginView';
import LogoutView from '../views/LogoutView';
import RegisterView from '../views/RegisterView';


import DashboardView from '../views/DashboardView';
import AddArticleView from '../views/articles/AddArticleView';
import EditArticleView from '../views/articles/EditArticleView';

export default (
  <Route component={CoreLayout} path='/'>
    <IndexRoute component={PublishingApp} name='home' />
    <Route component={LoginView} path='login' name='login' />
    <Route component={LogoutView} path='logout' name='logout' />
    <Route component={RegisterView} path='register' name='register' />
    <Route component={DashboardView} path='dashboard' name='dashboard' />
    <Route component={AddArticleView} path='add-article' name='add-article' />
    <Route component={EditArticleView} path='/edit-article/:articleID' name='edit-article' />
  
  </Route>
);