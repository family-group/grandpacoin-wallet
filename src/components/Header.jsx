import React from 'react';
import GrandpaLogo from '../assets/logos/GRANDPACOIN_WALLET.svg';
import { Link, withRouter } from 'react-router-dom';
import { dinamicTitle } from './../utils/functions';
import { LoggedContext } from './../LoggedContext';
import './css/Header.css';

const style = {
    link: {
        borderBottom: '2px solid #FBD206'
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.menuUnderline = this.menuUnderline.bind(this);
        this.logoutAndClearLocaStorage = this.logoutAndClearLocaStorage.bind(this);
    }

    componentDidMount() {
        const { toggleLogged } = this.context;
        toggleLogged();
    }

    menuUnderline(route) {
        const { location: { pathname } } = this.props;
        if (route === pathname) {
            return style.link;
        }
        return {};
    }

    logoutAndClearLocaStorage() {
        const { history } = this.props;
        const { toggleLogged } = this.context;
        localStorage.clear();
        history.push('/');
        dinamicTitle('Home');
        toggleLogged();
    }

    render() {
        let { logged } = this.context;
        return (
            <header className="grandpa-header">
                <div className="header-logo">
                    <img src={GrandpaLogo} className="grandpa-logo-header" alt="grandpa-logo" />
                </div>
                <nav className="header-menu">
                    {
                        !logged ?
                            <React.Fragment>
                                <div
                                    onClick={() => dinamicTitle('Open Wallet')}
                                    style={this.menuUnderline('/open-wallet')}
                                >
                                    <Link to="/open-wallet">Open Wallet</Link>
                                </div>
                                <div
                                    onClick={() => dinamicTitle('Create Wallet')}
                                    style={this.menuUnderline('/create-wallet')}>
                                    <Link to="/create-wallet">Create Wallet</Link>
                                </div>
                            </React.Fragment>
                            : null
                    }
                    {
                        logged ?
                            <React.Fragment>
                                <div
                                    onClick={() => dinamicTitle('Home')}
                                    style={this.menuUnderline('/')}
                                >
                                    <Link to="/">Home</Link></div>
                                <div
                                    onClick={() => dinamicTitle('Account Balance')}
                                    style={this.menuUnderline('/account-balance')}
                                >
                                    <Link to="/account-balance">Account Balance</Link>
                                </div>
                                <div
                                    onClick={() => dinamicTitle('Send Transaction')}
                                    style={this.menuUnderline('/send-transaction')}
                                >
                                    <Link to="/send-transaction">Send Transaction</Link>
                                </div>
                                <div
                                    onClick={this.logoutAndClearLocaStorage}
                                    className="logout"
                                    style={{ cursor: 'pointer' }}
                                >Log Out</div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div
                                    onClick={() => dinamicTitle('Home')}
                                    style={this.menuUnderline('/')}
                                >
                                    <Link to="/">Home</Link></div>
                                <div
                                    onClick={() => dinamicTitle('Open Wallet')}
                                    style={this.menuUnderline('/open-wallet')}
                                >
                                    <Link to="/open-wallet">Open Wallet</Link>
                                </div>
                                <div
                                    onClick={() => dinamicTitle('Create Wallet')}
                                    style={this.menuUnderline('/create-wallet')}>
                                    <Link to="/create-wallet">Create Wallet</Link>
                                </div>
                            </React.Fragment>
                    }
                </nav>
            </header>
        );
    }
}

Header.contextType = LoggedContext;

export default withRouter(props => (<Header {...props} />));