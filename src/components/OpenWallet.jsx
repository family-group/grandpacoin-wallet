import React from 'react';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import { LoggedContext } from './../LoggedContext';
import { getWalletJSON } from './../utils/functions';
import { validateMnemonic } from 'bip39';
import Wallet from './../models/wallet';
import Loader from './Loader';
import './css/OpenWallet.css'

class OpenWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
            password: '',
            address: '',
            privateKey: '',
            publicKey: '',
            disabled: false,
            loading: false,
            error: ''
        }

        this.onChange = this.onChange.bind(this);
        this.openWallet = this.openWallet.bind(this);
        this.openWalletWithPassword = this.openWalletWithPassword.bind(this);
        this.openWalletWithMnemonic = this.openWalletWithMnemonic.bind(this);
    }

    componentDidMount() {
        const { toggleLogged } = this.context;
        toggleLogged();
    }

    openWallet() {
        const { mnemonic, password } = this.state;
        const { logged } = this.context;

        this.setState({
            disabled: true,
            loading: true
        });

        if (logged) {
            this.openWalletWithPassword(password);
            return;
        }

        if (!validateMnemonic(mnemonic)) {
            this.setState({
                disabled: false,
                loading: false,
                error: 'Invalid mnemonic'
            })
        }
        this.openWalletWithMnemonic(mnemonic, password);
    }

    openWalletWithPassword(password) {
        const { encryptedWallet } = getWalletJSON();
        Wallet.fromEncryptedJSON(encryptedWallet, password)
            .then(decryptedWallet => {
                const { address, privateKey, publicKey, } = decryptedWallet.account;
                this.setState({
                    address,
                    privateKey,
                    publicKey,
                    password: '',
                    disabled: false,
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    error: 'Incorrect password!',
                    disabled: false,
                    loading: false
                });
            });
    }

    openWalletWithMnemonic(mnemonic, password) {
        const { toggleLogged } = this.context;
        const wallet = new Wallet(mnemonic);
        const { account: { address, privateKey, publicKey } } = wallet;
        wallet.encrypt(password)
            .then(encryptWallet => {
                localStorage.setItem('json', encryptWallet);
                localStorage.setItem('publicAccount', JSON.stringify({ address, publicKey }));

                this.setState({
                    mnemonic: '',
                    address,
                    privateKey,
                    publicKey,
                    password: '',
                    disabled: false,
                    loading: false
                });

                toggleLogged();
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    password: '',
                    disabled: false,
                    error: 'Error opening wallet!',
                    loading: false
                })
            });
    }

    onChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { mnemonic, password, publicKey, privateKey, address, disabled, error, loading } = this.state;
        const { logged } = this.context;
        return (
            <Layout>
                <div className="open-wallet-container">
                    <h3 className="component-title">Open an Existing Wallet</h3>
                    <p className="component-description">Enter your mnemonic (list of words) and your password to open your wallet</p>
                    <div className="open-wallet-input-section">
                        {
                            !logged ?
                                <TextInput
                                    name="mnemonic"
                                    className="margin-top"
                                    value={mnemonic}
                                    placeholder="Mnemonic"
                                    onChange={this.onChange}
                                /> :
                                null
                        }
                        <TextInput
                            name="password"
                            value={password}
                            className="margin-top"
                            type="password"
                            onChange={this.onChange}
                            placeholder="Password"
                        />

                        <Button
                            onClick={this.openWallet}
                            className="margin-top"
                            disabled={disabled}
                            style={{ width: '140px' }}
                        >OPEN WALLET</Button>
                        {
                            loading ?
                                <Loader />
                                : <LogAreaOutput
                                    value={!error ? {
                                        'Address': address,
                                        'Public Key': publicKey,
                                        'Private Key': privateKey
                                    } : { 'Error': error }
                                    }
                                    className={error ? 'log-area-output-error' : ''}
                                />
                        }
                    </div>
                </div>
            </Layout>
        )
    }
}

OpenWallet.contextType = LoggedContext;

export default OpenWallet;