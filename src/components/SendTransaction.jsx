import React from 'react';
import Loader from './Loader';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import Wallet from './../models/wallet';
import LogAreaOutput from './LogAreaOutput';
import Transaction from '../models/transaction';
import { getWalletJSON } from './../utils/functions';
import { isValidUrl, isValidAddress } from '../utils/validator';

import './css/TextInput.css';
import './css/SendTransaction.css';

const styles = {
    button: {
        width: '150px',
    }
}

class SendTransaction extends React.Component {
    constructor() {
        super();
        this.inputErrors = {
            addressInput: false,
            nodeInput: false,
            valueError: false,
            feeError: false
        };
        this.transactionHash = false;
        this.state = {
            address: '',
            privateKey: '',
            publicKey: '',
            error: '',
            disabled: false,
            active: false,
            loading: false,
            ...this.inputErrors,
            ...this.transactionHash
        }
        this.newTransaction = null;
        this.onChange = this.onChange.bind(this);
        this.onSendTransaction = this.onSendTransaction.bind(this);
        this.getDataTransaction = this.getDataTransaction.bind(this);
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


    getDataTransaction() {
        if (!isValidAddress(this.recipient)) {
            this.inputErrors = {
                addressInput: 'Invalid Address! Please try again.',
            }

            this.setState({
                ...this.state,
                ...this.inputErrors
            })

        } else {
            this.inputErrors = {
                addressInput: false,
                nodeInput: false
            }
            if (!this.fee || this.fee < 10) {
                this.inputErrors = {
                    feeError: "You'r fee must be higher than 10"
                }

                return this.setState({
                    ...this.state,
                    ...this.inputErrors
                })
            }
            if (!this.value) {
                this.inputErrors = {
                    valueError: 'Invalid Value! Please try again.',
                }
                return this.setState({
                    ...this.state,
                    ...this.inputErrors
                })
            }

            let data = {
                from: this.state.address,
                to: this.recipient,
                value: this.value,
                fee: this.fee,
                senderPubKey: this.state.publicKey,
                privKey: this.state.privateKey
            }


            this.newTransaction = new Transaction(data);
            let transactionData = JSON.stringify(this.newTransaction.getTransactionData(), null, "  ")


            this.setState({
                transactionData,
                ...this.inputErrors
            })

        }
    }

    onSendTransaction() {
        if (!isValidUrl(this.nodeUrl)) {
            this.inputErrors = {
                nodeInput: 'Invalid Url! Please try again.'
            }

            this.setState({
                ...this.state,
                ...this.inputErrors
            })
        } else {
            this.inputErrors = {
                nodeInput: false
            }
            if (!this.newTransaction) {
                return this.setState({
                    error: "Please, sign you'r transaction",
                    ...this.inputErrors,
                });
            }

            this.newTransaction.send(this.nodeUrl)
                .then(response => {
                    this.transactionHash = response.result.transactionDataHash;

                    this.setState({
                        ...this.transactionHash,
                        ...this.inputErrors
                    })
                })
                .catch(err => {
                    this.setState({
                        error: err.message,
                        ...this.inputErrors,
                    });
                })
            this.setState({
                ...this.state,
                ...this.inputErrors
            })
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
                const { address, privateKey, publicKey, } = decryptedWallet.account;
                this.setState({
                    address,
                    privateKey,
                    publicKey,
                    password: '',
                    error: '',
                    disabled: false,
                    loading: false,
                    active: true,
                    ...this.inputErrors,
                });
            })
            .catch(error => {
                this.setState({
                    error: 'Incorrect password!',
                    disabled: false,
                    loading: false,
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
                            <p className="send-transacction-text">PLEASE ENTER YOUR WALLET PASSWORD TO COMPLETE THE TRANSACTION</p>
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
                                >GET START</Button>
                            </div>
                            {
                                this.state.loading ?
                                    <Loader /> : <LogAreaOutput
                                        value={!this.state.error ? '' : { 'Error': this.state.error }
                                        }
                                        className={this.state.error ? 'log-area-output-error' : ''}
                                    />
                            }
                        </div>
                    ) : (
                            <div className="send-transaction-container">
                                <h3 className="component-title">Send Transaction</h3>
                                <div className="send-transaction-inputs">
                                    <input
                                        name="sender"
                                        disable="true"
                                        value={this.state.address}
                                        className="full-width  margin-top text-input"
                                        placeholder="Sender"
                                    />
                                    {
                                        this.inputErrors.addressInput ?
                                            <p className="input-error">{this.inputErrors.addressInput}</p> : null
                                    }
                                    <TextInput
                                        name="recipient"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Recipient"
                                    />
                                    {
                                        this.inputErrors.valueError ?
                                            <p className="input-error">{this.inputErrors.valueError}</p> : null
                                    }
                                    <TextInput
                                        name="value"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Value"
                                    />
                                    {
                                        this.inputErrors.feeError ?
                                            <p className="input-error">{this.inputErrors.feeError}</p> : null
                                    }
                                    <TextInput
                                        name="fee"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="fee"
                                    />
                                    <Button
                                        className="margin-top button"
                                        disabled={this.state.disabled}
                                        onClick={this.getDataTransaction}
                                        style={styles.button}
                                    >SIGN TRANSACTION</Button>
                                    <textarea className="transaction-data" disabled value={this.state.transactionData ? this.state.transactionData : ''} />
                                    {
                                        this.inputErrors.nodeInput ?
                                            <p className="input-error">{this.inputErrors.nodeInput}</p> : null
                                    }
                                    <TextInput
                                        name="nodeUrl"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Blockchain Node"
                                    />
                                    <Button
                                        className="margin-top"
                                        disabled={this.state.disabled}
                                        onClick={this.onSendTransaction}
                                        style={styles.button}
                                    >SEND TRANSACTION</Button>
                                    {
                                        this.transactionHash ?
                                            <div className="transaccion-result">
                                                <p className="padding-bottom transaction-tittle-text">TRANSACTION SUCCESSFUL!</p>
                                                <p className="padding-bottom text-amount-send">You send {this.value} grandpas to address:</p>
                                                <p className="padding-bottom">{this.recipient}</p>
                                                <p className="tx-hash-text">Transaction Hash: 0x{this.transactionHash}</p>
                                            </div> :
                                            <LogAreaOutput
                                                value={!this.state.error ? '' : { 'Error': this.state.error }
                                                }
                                                className={this.state.error ? 'log-area-output-error' : ''}
                                            />

                                    }
                                </div>
                            </div>
                        )
                }

            </Layout>
        );
    }
}

export default SendTransaction;