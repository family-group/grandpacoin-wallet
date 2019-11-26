import React from 'react';
import Layout from './Layout';
import Button from './Button';
import LogAreaOutput from './LogAreaOutput';
import { LoggedContext } from './../LoggedContext';
import { withRouter } from 'react-router-dom';
import Loader from './Loader';
import './css/CreateWallet.css';

class NewWallet extends React.Component {
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
            loading: true
        }
    }

    componentDidMount() {
        const { toggleLogged, address, mnemonic, publicKey, privateKey, addInfoAccount } = this.context;
        const { push } = this.props.history;
        toggleLogged();
        if (address
            || mnemonic
            || publicKey
            || privateKey) {
            this.setState({
                address,
                mnemonic,
                publicKey,
                privateKey,
                loading: false
            });
            addInfoAccount();
            return;
        }

        push('/');
    }

    render() {
        const {
            mnemonic,
            address,
            privateKey,
            publicKey,
            error,
            loading
        } = this.state;
        const { push } = this.props.history;
        return (
            <Layout>
                <div className="create-wallet-container">
                    <h3 className="component-title">New Wallet Created</h3>
                    <p className="component-description red-font">Store your Mnemonic! It is the only way to recover your account!</p>
                    <p className="component-description red-font">Your mnemonic and private key will be shown only this time!</p>
                    <div className="create-wallet-input">
                        {
                            loading ?
                                <Loader />
                                : <LogAreaOutput
                                    value={!error ? {
                                        'Mnemonic': mnemonic,
                                        'Address': address,
                                        'Private Key': privateKey,
                                        'Public Key': publicKey,
                                    } : { 'Error': error }}
                                    className={error ? 'log-area-output-error' : ''}
                                />
                        }
                    </div>
                    <Button onClick={() => push('/')}>GO TO HOME</Button>
                </div>
            </Layout>
        )
    }
}

NewWallet.contextType = LoggedContext;

export default withRouter(props => (<NewWallet {...props} />));