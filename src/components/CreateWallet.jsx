import React from 'react';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import utils from './../utils/functions';
import Wallet from './../models/wallet';
import { LoggedContext } from './../LoggedContext';
import { withRouter } from 'react-router-dom';
import Loader from './Loader';
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
        const { history: { push } } = this.props;
        const mnemonic = utils.generateMnemonic();
        const wallet = new Wallet(mnemonic);

        const { address, publicKey } = wallet.account;

        this.setState({
            disabled: true,
            loading: true,
        });
        wallet.encrypt(password)
            .then(encryptWallet => {
                localStorage.setItem('json', encryptWallet);
                localStorage.setItem('publicAccount', JSON.stringify({ address, publicKey }));

                this.setState({
                    password: '',
                    disabled: false,
                    loading: false,
                });
                toggleLogged();
                push('/');
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
            password,
            disabled,
            error,
            loading
        } = this.state;
        return (
            <Layout>
                <div className="create-wallet-container">
                    <h3 className="component-title">Create a New Wallet</h3>
                    <p className="component-description">Hint: You can create a new wallet even without a password!</p>
                    <div className="create-wallet-input">
                        <div>
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
                                className="margin-top"
                            >GENERATE NOW</Button>
                        </div>
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

CreateWallet.contextType = LoggedContext;

export default withRouter(props => (<CreateWallet {...props} />));