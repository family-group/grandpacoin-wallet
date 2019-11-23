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
            mnemonic: '',
            address: '',
            publicKey: '',
            privateKey: '',
            password: '',
            confirmPassword: false,
            disabled: false,
            loadingInfo: false,
            loading: false,
            error: ''
        }

        this.getInfoAccount = this.getInfoAccount.bind(this);
        this.getPrivateKey = this.getPrivateKey.bind(this);
        this.onChange = this.onChange.bind(this);
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

    getPrivateKey() {
        const { encryptedWallet } = getWalletJSON();
        const { password } = this.state;

        this.setState({
            disabled: true,
            loading: true,
        });

        Wallet.fromEncryptedJSON(encryptedWallet, password)
            .then(decryptedWallet => {
                const { privateKey } = decryptedWallet.account;
                this.setState({
                    mnemonic: decryptedWallet.mnemonic,
                    privateKey,
                    password: '',
                    confirmPassword: true,
                    disabled: false,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: 'Incorrect password!',
                    password: '',
                    confirmPassword: true,
                    disabled: false,
                    loading: false
                });
            });
    }

    onChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const {
            mnemonic,
            address,
            publicKey,
            privateKey,
            confirmPassword,
            password,
            loading,
            disabled,
            error } = this.state;
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
                                <p className="margin-top">To see your private key and mnemonic, unlock them with your password!</p>
                                <TextInput
                                    name="password"
                                    value={password}
                                    className="margin-top"
                                    type="password"
                                    onChange={this.onChange}
                                    placeholder="Password"
                                />
                                <Button
                                    onClick={this.getPrivateKey}
                                    className="margin-top"
                                    disabled={disabled}
                                    style={{ width: '140px' }}
                                >UNLOCK</Button>
                                {
                                    loading ? <Loader />
                                        : <React.Fragment>
                                            {
                                                confirmPassword ?
                                                    <React.Fragment>

                                                        <LogAreaOutput
                                                            value={!error ? {
                                                                'Mnemonic': mnemonic,
                                                                'Private Key': privateKey
                                                            } : { 'Error': error }}
                                                            className={error ? 'log-area-output-error' : ''}
                                                        />
                                                    </React.Fragment>
                                                    : null
                                            }
                                        </React.Fragment>
                                }
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

