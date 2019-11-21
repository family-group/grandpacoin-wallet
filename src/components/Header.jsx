import React from 'react';
import GrandpaLogo from '../assets/logos/GRANDPACOIN_WALLET.svg';
import { Link, withRouter } from 'react-router-dom';
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
    }

    menuUnderline(route) {
        const { location: { pathname } } = this.props;
        if (route === pathname) {
            return style.link;
        }
        return {};
    }

    render() {
        return (
            <header className="grandpa-header">
                <div className="header-logo">
                    <img src={GrandpaLogo} className="grandpa-logo-header" alt="grandpa-logo" />
                </div>
                <nav className="header-menu">
                    <div
                        style={this.menuUnderline('/')}
                    >
                        <Link to="/">Home</Link></div>
                    <div
                        style={this.menuUnderline('/open-wallet')}
                    >
                        <Link to="/open-wallet">Open Wallet</Link>
                    </div>
                    <div
                        style={this.menuUnderline('/create-wallet')}>
                        <Link to="/create-wallet">Create Wallet</Link>
                    </div>
                    <div
                        style={this.menuUnderline('/account-balance')}
                    >
                        <Link to="/account-balance">Account Balance</Link>
                    </div>
                    <div
                        style={this.menuUnderline('/send-transaction')}
                    >
                        <Link to="/send-transaction">Send Transaction</Link>
                    </div>
                    <div style={{ cursor: 'pointer' }}>Log Out</div>
                </nav>
            </header>
        );
    }
}

export default withRouter(props => (<Header {...props} />));