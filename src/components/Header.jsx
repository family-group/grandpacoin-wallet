import React from 'react';
import GrandpaLogo from '../assets/logos/GRANDPACOIN_WALLET.svg';
import { Link } from 'react-router-dom';
import './css/Header.css';

class Header extends React.Component {
    render() {
        return (
            <header className="grandpa-header">
                <img src={GrandpaLogo} className="grandpa-logo-header" alt="grandpa-logo" />
                <nav className="header-menu">
                    <div><Link to="/">Home</Link></div>
                    <div>
                        <Link to="/open-wallet">Open Wallet</Link>
                    </div>
                    <div>
                        <Link to="/create-wallet">Create Wallet</Link>
                    </div>
                    <div>
                        <Link to="/account-balance">Account Balance</Link>
                    </div>
                    <div>
                        <Link to="/send-transaction">Send Transaction</Link>
                    </div>
                    <div >Log Out</div>
                </nav>
            </header>
        );
    }
}

export default Header;