import React from 'react';
import Layout from './Layout';
import TextInput from './TextInput';
import { LoggedContext } from './../LoggedContext'
import LogAreaOutput from './LogAreaOutput';
import { getWalletJSON } from './../utils/functions';
import Wallet from './../models/wallet';
import Button from './Button';
import './css/Home.css';
import Loader from './Loader';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            publicKey: '',
            confirmPassword: false,
            disabled: false,
            loadingInfo: false,
            loading: false,
            error: ''
        }

        this.getInfoAccount = this.getInfoAccount.bind(this);
    }

    componentDidMount() {
        this.getInfoAccount();
    }

    getInfoAccount() {
        const publicAccount = JSON.parse(localStorage.getItem('publicAccount'))
        this.setState({
            ...publicAccount
        });
    }

    render() {
        const {
            address,
            publicKey,
        } = this.state;
        const { logged } = this.context;

        return (
            <Layout>
                <p className="welcome-text">{logged ? 'WELCOME TO YOUR' : 'WELCOME TO'} GRANDPACOIN WALLET</p>
                <div className="welcome-text-container">
                    {
                        !logged ?
                            <React.Fragment>
                                <p className="home-text">Open your wallet or create a new one to fully enjoy your grandpa coins!</p>
                                <p className="home-option-text">Please select an option in the header menu.</p>
                            </React.Fragment>
                            : <p>Account info:</p>
                    }
                    {
                        logged ?
                            <div className="home-input-section">
                                <LogAreaOutput
                                    value={{
                                        'Address': address,
                                        'Public Key': publicKey
                                    }}
                                />
                            </div>
                            : null
                    }
                </div>
            </Layout>
        )
    }
}

Home.contextType = LoggedContext;

export default Home;

