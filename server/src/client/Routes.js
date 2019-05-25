import React from 'react';
import App from './App';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminsListPage from './pages/AdminsListPage';
// it share between 2 side for static and browser routing system
export default [
  {
    ...App,
    routes: [
      {
        ...HomePage,
        path: '/',
        exact: true
      },
      {
        ...AdminsListPage,
        path: '/admins'
      },
      {
        ...UsersListPage,
        path: '/users'
      },
      {
        ...NotFoundPage
      }
    ]
  }
];

//============================================================================
import React from 'react';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory
} from 'react-router';

import Home from './components/Home';
import ArtistMain from './components/artists/ArtistMain';
// import ArtistDetail from './components/artists/ArtistDetail';
// import ArtistCreate from './components/artists/ArtistCreate';
// import ArtistEdit from './components/artists/ArtistEdit';
//code splitting for optimization for load time
//change jsx to plain routs by obj
const componentRoutes = {
  component: Home,
  path: '/',
  indexRoute: {
    component: ArtistMain
  },
  childRoutes: [{
      path: 'artists/new',
      //from react router
      getComponent(location, cb) {
        // its for load up components async.
        //use system import then after call comp with cb func
        System.import('./components/artists/ArtistCreate') // when react see it auto split code 
          .then(module => cb(null, module.default)); //when we run this code all code is there only
      }
    },
    {
      path: 'artists/:id',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistDetail') // when react see it auto split code 
          .then(module => cb(null, module.default)); //when we run this code all code is there only
      }
    },
    {
      path: 'artists/:id/edit',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistEdit') // when react see it auto split code 
          .then(module => cb(null, module.default)); //when we run this code all code is there only
      }
    }
  ]
};


const Routes = () => ( <Router history={hashHistory} routes={componentRoutes}/>);

// const Routes = () => {
//   return (
//     <Router history={hashHistory}>
//       <Route path="/" component={Home}>
//         <IndexRoute component={ArtistMain} />
//         <Route path="artists/new" component={ArtistCreate} />
//         <Route path="artists/:id" component={ArtistDetail} />
//         <Route path="artists/:id/edit" component={ArtistEdit} />
//       </Route>
//     </Router>
//   );
// };

export default Routes; //this was go for main index.js

