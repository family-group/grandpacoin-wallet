import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import routes from './routes';

class App extends React.Component {

  render() {
    return (
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
    );
  }
}

export default App;
