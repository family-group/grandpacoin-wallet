import React from 'react';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import utils from './../utils/functions';
import Wallet from './../models/wallet';
import { LoggedContext } from './../LoggedContext';
import './css/CreateWallet.css';
import Loader from './Loader';

class CreateWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
            address: '',
            privateKey: '',
            publicKey: '',
            password: '',
            disabled: false,
            error: '',
            loading: false
        }
        this.createWallet = this.createWallet.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const { toggleLogged } = this.context;
        toggleLogged();
    }

    createWallet() {
        const { password } = this.state;
        const { toggleLogged } = this.context;
        const mnemonic = utils.generateMnemonic();
        const wallet = new Wallet(mnemonic);

        const { address, privateKey, publicKey } = wallet.account;

        this.setState({
            disabled: true,
            loading: true,
        });
        wallet.encrypt(password)
            .then(encryptWallet => {
                localStorage.setItem('json', encryptWallet);

                this.setState({
                    mnemonic,
                    address,
                    privateKey,
                    publicKey,
                    password: '',
                    disabled: false,
                    loading: false,
                });
                toggleLogged();
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    password: '',
                    loading: false,
                    disabled: false,
                    error
                })
            });
    }

    onChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    render() {
        const {
            mnemonic,
            address,
            privateKey,
            publicKey,
            password,
            disabled,
            error,
            loading
        } = this.state;
        return (
            <Layout>
                <div className="create-wallet-container">
                    <h3 className="component-title">Create a New Wallet</h3>
                    <p className="component-description">Generate a new wallet: random private key -> public key -> address</p>
                    <div className="create-wallet-input">
                        <TextInput
                            name="password"
                            value={password}
                            type="password"
                            onChange={this.onChange}
                            placeholder="Password"
                        />
                        <Button
                            onClick={this.createWallet}
                            disabled={disabled}
                        >GENERATE NOW</Button>
                        {
                            loading ?
                                <Loader />
                                : <LogAreaOutput
                                    value={!error ? {
                                        'Mnemonic': mnemonic,
                                        'Address': address,
                                        'Public Key': publicKey,
                                        'Private Key': privateKey
                                    } : { 'Error': error }}
                                    className={error ? 'log-area-output-error' : ''}
                                />
                        }
                    </div>
                </div>
            </Layout>
        )
    }
}

CreateWallet.contextType = LoggedContext;

export default CreateWallet;