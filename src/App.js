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

    this.addInfoAccount = (address = '', mnemonic = '', publicKey = '', privateKey = '') => {
      this.setState(state => ({
        address,
        mnemonic,
        publicKey,
        privateKey
      }));
    }

    this.state = {
      logged: checkLogged.logged,
      toggleLogged: this.toggleLogged,
      mnemonic: checkLogged.mnemonic,
      publicKey: checkLogged.publicKey,
      privateKey: checkLogged.privateKey,
      address: checkLogged.address,
      addInfoAccount: this.addInfoAccount
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
    const { logged } = this.state;
    return (
      <Router>
        <LoggedContext.Provider value={this.state}>
          <Header />
          <Switch>
            {
              routes(logged).map((route, index) => (<Route key={index} {...route} />))
            }
          </Switch>
        </LoggedContext.Provider>
      </Router>
    );
  }
}

export default App;
