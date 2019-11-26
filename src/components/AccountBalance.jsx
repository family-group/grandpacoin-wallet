import React from 'react';
import Loader from './Loader';
import Layout from './Layout';
import Button from './Button';
import Xhr from '../utils/xhr';
import TextInput from './TextInput';
import Wallet from './../models/wallet';
import LogAreaOutput from './LogAreaOutput';
import { isValidUrl } from '../utils/validator';
import { getWalletJSON } from './../utils/functions';

import './css/AccountBalance.css';

const styles = {
    button: {
        width: '150px',
        marginTop: '15px'
    },
    logAreaOutput: {
        minHeight: '100px'
    }
}

class AccountBalance extends React.Component {
    constructor() {
        super();
        this.inputErrors = {
            addressInput: false,
            nodeInput: false
        };
        this.balancesRequest = {
            confirmedBalance: '',
            safeBalance: '',
            pendingBalance: '',
        }
        this.state = {
            address: '',
            balanceStatus: false,
            disabled: false,
            active: false,
            error: '',
            ...this.balancesRequest,
            ...this.inputErrors
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.openWallet = this.openWallet.bind(this);
        this.openWalletWithPassword = this.openWalletWithPassword.bind(this);
    }
    onChange({ target: { name, value } }) {
        if (typeof value === 'string') {
            const trimmedValue = value.trim();
            this[name] = trimmedValue;
        }
        this[name] = value;
    }

    onClick() {
        if (!isValidUrl(this.nodeUrl)) {
            this.inputErrors = {
                nodeInput: 'Invalid Url! Please try again.'
            }
            return this.setState({ ...this.inputErrors })
        } else {
            this.inputErrors = {
                addressInput: false,
                nodeInput: false
            }
            this.address = this.state.address.replace('0x', '');
            this.balanceRequest = new Xhr(`/address/${this.address}/balance`, {
                useBaseUrl: this.nodeUrl
            }).result()
                .then(res => {
                    this.balancesRequest = {
                        Confirmed: res.confirmedBalance,
                        Safe: res.safeBalance,
                        Pending: res.pendingBalance,
                    };
                    this.setState({
                        balanceStatus: true,
                        ...this.balancesRequest,
                        ...this.inputErrors
                    })
                })
                .catch(err => console.log('err', err));

            this.setState({ ...this.inputErrors })
        }
    }

    openWallet() {
        if (!this.password) {
            this.password = ''
        }
        this.setState({
            disabled: true,
            loading: true,
            ...this.inputErrors,
        });

        this.openWalletWithPassword(this.password);

    }

    openWalletWithPassword(password) {
        const { encryptedWallet } = getWalletJSON();
        Wallet.fromEncryptedJSON(encryptedWallet, password)
            .then(decryptedWallet => {
                const { address } = decryptedWallet.account;
                this.setState({
                    address,
                    disabled: false,
                    loading: false,
                    active: true,
                    ...this.inputErrors,
                });
            })
            .catch(error => {
                this.setState({
                    disabled: false,
                    error: 'Invalid password! Try again.',
                    loading: false,
                    ...this.balancesRequest,
                    ...this.inputErrors,
                });
            });
    }
    render() {
        return (
            <Layout>
                {
                    !this.state.active ? (
                        <div className="send-transaction-container">
                            <p className="send-transacction-text">PLEASE ENTER YOUR WALLET PASSWORD TO SEE YOUR BALANCE</p>
                            <div className="open-wallet-input-section">
                                <TextInput
                                    name="password"
                                    className="margin-top"
                                    type="password"
                                    onChange={this.onChange}
                                    placeholder="Password"
                                />
                                <Button
                                    onClick={this.openWallet}
                                    className="margin-top"
                                    disabled={this.state.disabled}
                                    style={styles.button}
                                >GET BALANCE</Button>
                            </div>
                            {
                                this.state.loading ?
                                    <Loader /> :
                                    <LogAreaOutput
                                        value={!this.state.error ? '' : { 'Error': this.state.error }
                                        }
                                        className={this.state.error ? 'log-area-output-error' : ''}
                                    />
                            }
                        </div>
                    ) : (
                            <div className="account-balance-container">
                                <h3 className="component-title">View Account Balance</h3>
                                <div className="account-balance-inputs">
                                    <TextInput
                                        className="balance-input"
                                        placeholder="Insert your address"
                                        name="address"
                                        value={this.state.address}
                                        disabled
                                    />
                                    {
                                        this.inputErrors.nodeInput ?
                                            <p className="error-text">{this.inputErrors.nodeInput}</p> : null
                                    }
                                    <TextInput
                                        className="balance-input margin-top"
                                        placeholder='Insert your node url'
                                        name="nodeUrl"
                                        onChange={this.onChange}
                                    />
                                    <Button
                                        style={styles.button}
                                        onClick={this.onClick}
                                        disabled={this.state.disabled}
                                    >DISPLAY BALANCE</Button>
                                    <LogAreaOutput
                                        value={this.state.balanceStatus ? this.balancesRequest : ''}
                                        style={styles.logAreaOutput}
                                        className="margin-top"
                                    />
                                </div>
                            </div>
                        )
                }
            </Layout>
        );
    }
}

export default AccountBalance;