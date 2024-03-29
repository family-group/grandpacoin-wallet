import React from 'react';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import { LoggedContext } from './../LoggedContext';
import { validateMnemonic } from 'bip39';
import Wallet from './../models/wallet';
import Loader from './Loader';
import { withRouter } from 'react-router-dom';
import './css/OpenWallet.css';

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
        this.openWalletWithMnemonic = this.openWalletWithMnemonic.bind(this);
    }

    componentDidMount() {
        const { toggleLogged } = this.context;
        toggleLogged();
    }

    openWallet() {
        const { mnemonic, password } = this.state;

        this.setState({
            disabled: true,
            loading: true
        });

        if (!validateMnemonic(mnemonic)) {
            this.setState({
                disabled: false,
                loading: false,
                error: 'Invalid mnemonic'
            })
            return;
        }
        this.openWalletWithMnemonic(mnemonic, password);
    }

    openWalletWithMnemonic(mnemonic, password) {
        const { toggleLogged } = this.context;
        const wallet = new Wallet(mnemonic);
        const { history: { push } } = this.props;
        const { account: { address, publicKey } } = wallet;
        wallet.encrypt(password)
            .then(encryptWallet => {
                localStorage.setItem('json', encryptWallet);
                localStorage.setItem('publicAccount', JSON.stringify({ address, publicKey }));

                this.setState({
                    password: '',
                    disabled: false,
                    loading: false
                });
                push('/');
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
        if (typeof value === 'string') {
            const trimmedValue = value.trim();
            this.setState({
                [name]: trimmedValue
            })
        }
        this.setState({
            [name]: value
        });
    }

    render() {
        const { mnemonic, password, disabled, error, loading } = this.state;
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
                                    value={error ? { 'Error': error } : {}}
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

export default withRouter(props => (<OpenWallet {...props} />));