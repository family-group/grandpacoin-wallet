import React from 'react';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import utils from './../utils/functions';
import Wallet from './../models/wallet';
import './css/CreateWallet.css';

class CreateWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mnemonic: '',
            address: '',
            privateKey: '',
            publicKey: '',
            password: '',
            activeButton: '',
        }
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClick() {
        const { password } = this.state;
        const mnemonic = utils.generateMnemonic();
        const wallet = new Wallet(mnemonic);

        const { address, privateKey, publicKey } = wallet.account;

        this.setState({
            activeButton: false,
        })
        wallet.encrypt(password)
            .then(encryptWallet => {
                localStorage.setItem('json', encryptWallet);

                this.setState({
                    mnemonic,
                    address,
                    privateKey,
                    publicKey,
                    password: '',
                    activeButton: true,
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    password: '',
                    activeButton: true
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
            activeButton
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
                            onClick={this.onClick}
                            active={activeButton}
                        >GENERATE NOW</Button>
                        <LogAreaOutput
                            value={{
                                mnemonic,
                                address,
                                privateKey,
                                publicKey
                            }}
                            style={{ minHeight: '100px' }}
                        />
                    </div>
                </div>
            </Layout>
        )
    }
}

export default CreateWallet;