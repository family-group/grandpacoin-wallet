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
import { LoggedContext, checkLogged } from './LoggedContext';
import { checkLocalStorageForWallet } from './utils/functions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLogged = () => {
      this.setState(state => ({
        logged: checkLocalStorageForWallet()
      }))
    }
    this.state = {
      logged: checkLogged.logged,
      toggleLogged: this.toggleLogged
    }

    this.showLoggedLinks = this.showLoggedLinks.bind(this);
  }

  componentDidMount() {
    this.toggleLogged();
  }

  showLoggedLinks() {
    const logged = checkLocalStorageForWallet();
    this.setState({ logged });
  }

  render() {
    Xhr.baseUrl = 'http://localhost:5555';
    return (
      <Router>
        <LoggedContext.Provider value={this.state}>
          <Header />
          <Switch>
            {
              routes.map((route, index) => {
                return <Route key={index} {...route} />
              })
            }
          </Switch>
        </LoggedContext.Provider>
      </Router>
    );
  }
}

export default App;
