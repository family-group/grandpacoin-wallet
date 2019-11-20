import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import Header from './components/Header';
import './App.css';
import routes from './routes';
import RootReducer from './redux/RootReducer';

const initialState = {};

const store = configureStore(RootReducer, { initialState });

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Header />
          <Switch>
            {
              routes.map((route, index) => (
                <Route key={index} {...route} />
              ))
            }
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
