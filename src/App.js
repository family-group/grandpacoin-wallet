import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import routes from './routes';
import Xhr from './utils/xhr';

class App extends React.Component {

  render() {

    Xhr.baseUrl = 'http://192.168.1.160:5555';

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
