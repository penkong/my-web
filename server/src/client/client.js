// Startup point for the client side application 
//its that same index.js in other react app also
import 'babel-polyfill'; //define some func async that babel can use
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; //for async action creator
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import axios from 'axios';
import Routes from './Routes';
import reducers from './reducers';

const axiosInstance = axios.create({ baseURL: '/api' });

const store = createStore(
  reducers,
  window.INITIAL_STATE, // add init state for rehydrate redux store after first html load up
  applyMiddleware(thunk.withExtraArgument(axiosInstance))
);
//hydrate is center of ssr notation because we send second bundle
//browser router on client  static router on server for good ssr
ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
    {/* to show what set comp show duo to Routes and all load when we are sending html */}
      <div>{renderRoutes(Routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);

//----------------CCCCSSSSSSS GUYSSSSSS ------------- from andrew
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Routes from './router';
import '../style/materialize.css';
import '../style/react-range.css';
import '../style/style.css';

const App = () => {
  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
