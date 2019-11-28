import React from 'react';
import Loader from './Loader';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import Wallet from './../models/wallet';
import LogAreaOutput from './LogAreaOutput';
import Transaction from '../models/transaction';
import { getWalletJSON } from './../utils/functions';
import { isValidUrl, isValidAddress, isValidNumber } from '../utils/validator';

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
        this.state = {
            address: '',
            privateKey: '',
            publicKey: '',
            disabled: false,
            active: false,
            loading: false,
            signed: false,
            password: '',
            sender: '',
            recipient: '',
            value: '',
            fee: '',
            data: '',
            nodeUrl: '',
            transactionData: '',
            transactionHash: '',
            addressError: '',
            addressInput: '',
            error: '',
            errorSendingTransaction: {},
            nodeInput: '',
            valueError: '',
            feeError: '',
        }
        this.newTransaction = null;
        this.onChange = this.onChange.bind(this);
        this.onSendTransaction = this.onSendTransaction.bind(this);
        this.signTransaction = this.signTransaction.bind(this);
        this.openWallet = this.openWallet.bind(this);
        this.openWalletWithPassword = this.openWalletWithPassword.bind(this);
    }

    onChange({ target: { name, value } }) {
        if(name === 'recipient'
        || name === 'value'
        || name === 'fee'
        || name === 'data') {
            this.setState({
                signed: false,
                error: '',
                transactionHash: ''
            })
        }

        if (typeof value === 'string') {
            const trimmedValue = value.trim();
            this.setState({
                [name]: trimmedValue,
            });
        }

        this.setState({
            [name]: value,
        });
    }


    signTransaction() {
        const {address, recipient, fee, value, data, publicKey, privateKey } = this.state;
        if (!isValidAddress(recipient)) {
            this.setState({
                addressInput: 'Invalid Address! Please, try again.',
                addressError: '',
                error: '',
                valueError: '',
                feeError: '',
            })
            return;
        }

        if (!isValidNumber(value)) {
            this.setState({
                valueError: 'Value must be a number.',
                addressError: '',
                error: '',
                feeError: '',
            });
            return;
        }

        if (!fee || fee < 10 || !isValidNumber(fee)) {
            this.setState({
                feeError: 'Your fee must be higher than 10.',
                addressError: '',
                error: '',
                valueError: '',
            });
            return;
        }

        if (address === recipient) {
            this.setState({
                addressError: 'You can not sent money to your own account.',
                error: '',
                valueError: '',
                feeError: '',
            });
            return;
        }

        let transactionInfo = {
            from: address,
            to: recipient,
            value: value ? value : '0',
            fee,
            data,
            senderPubKey: publicKey,
            privKey: privateKey
        }

        this.newTransaction = new Transaction(transactionInfo);
        this.newTransaction.senderSignature = Transaction.sign(this.newTransaction);

        this.setState({
            transactionData: JSON.stringify(this.newTransaction, null, "  "),
            signed: true,
            addressInput: '',
            addressError: '',
            error: '',
            valueError: '',
            feeError: '',
        })
    }

    onSendTransaction() {
        const { nodeUrl } = this.state;

        if (!isValidUrl(nodeUrl)) {
            this.setState({
                nodeInput: 'Invalid Url! Please try again.'
            });
            return;
        }

        this.newTransaction.send(nodeUrl)
            .then(response => {
                this.setState({
                    transactionHash: response.result.transactionDataHash
                })
            })
            .catch(err => {
                console.log('Response error: ', err)
                this.setState({
                    error: err.message,
                    nodeInput: '',
                    transactionHash: '',
                    ...Object.assign({}, err.errors ? {errorSendingTransaction: err.errors} : {})
                });
            })
    }

    openWallet() {
        const { password } = this.state;

        this.setState({
            disabled: true,
            loading: true,
        });

        this.openWalletWithPassword(password);

    }

    openWalletWithPassword(password) {
        const encryptedWallet = getWalletJSON();

        if (!encryptedWallet) {
            this.setState({error: 'There is no wallet opened. Please, open your wallet.'})
            return;
        }

        Wallet.fromEncryptedJSON(encryptedWallet, password)
            .then(decryptedWallet => {
                const { address, privateKey, publicKey, } = decryptedWallet.account;
                console.log('decryptedWallet', decryptedWallet)
                this.setState({
                    address,
                    privateKey,
                    publicKey,
                    password: '',
                    error: '',
                    disabled: false,
                    loading: false,
                    active: true,
                });
            })
            .catch(error => {
                this.setState({
                    error: 'Incorrect password!',
                    disabled: false,
                    loading: false,
                });
            });
    }

    render() {
        const { address, recipient, value, data, active, disabled, transactionHash, transactionData, loading, signed, error, errorSendingTransaction, nodeInput, valueError, feeError, addressInput, addressError } = this.state;
        return (
            <Layout>
                {
                    !active ? (
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
                                    disabled={disabled}
                                    style={styles.button}
                                >GET START</Button>
                            </div>
                            {
                                loading ?
                                    <Loader /> : <LogAreaOutput
                                        value={error ? { 'Error': error } : ''}
                                        className={error ? 'log-area-output-error' : ''}
                                    />
                            }
                        </div>
                    ) : (
                            <div className="send-transaction-container">
                                <h3 className="component-title">Send Transaction</h3>
                                <div className="send-transaction-inputs">
                                    <input
                                        name="sender"
                                        disabled
                                        defaultValue={address}
                                        className="full-width  margin-top text-input"
                                        placeholder="Sender"
                                    />
                                    {
                                        addressInput ?
                                            <p className="input-error">{addressInput}</p> : null
                                    }
                                    {
                                        addressError ?
                                            <p className="input-error">{addressError}</p> : null
                                    }
                                    <TextInput
                                        name="recipient"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Recipient"
                                    />
                                    {
                                        valueError ?
                                            <p className="input-error">{valueError}</p> : null
                                    }
                                    <TextInput
                                        name="value"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Value"
                                    />
                                    {
                                        feeError ?
                                            <p className="input-error">{feeError}</p> : null
                                    }
                                    <TextInput
                                        name="fee"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Fee"
                                    />
                                    <TextInput
                                        name="data"
                                        className="full-width  margin-top"
                                        onChange={this.onChange}
                                        placeholder="Message (optional)"
                                    />
                                    <Button
                                        className="margin-top button"
                                        disabled={disabled}
                                        onClick={this.signTransaction}
                                        style={styles.button}
                                    >SIGN TRANSACTION</Button>

                                    {
                                        signed ? 
                                            <React.Fragment>
                                                <textarea className="transaction-data" disabled value={transactionData} />
                                            {
                                                nodeInput ?
                                                    <p className="input-error">{nodeInput}</p> : null
                                            }
                                            <TextInput
                                                name="nodeUrl"
                                                className="full-width  margin-top"
                                                onChange={this.onChange}
                                                placeholder="Blockchain Node"
                                            />
                                            <Button
                                                className="margin-top"
                                                disabled={disabled}
                                                onClick={this.onSendTransaction}
                                                style={styles.button}
                                            >SEND TRANSACTION</Button>
                                            {
                                                transactionHash ?
                                                    <div className="transaccion-result">
                                                        <p className="padding-bottom transaction-tittle-text">TRANSACTION SUCCESSFUL!</p>
                                                        <p className="padding-bottom text-amount-send">You send {value} grandpas to address:</p>
                                                        <p className="padding-bottom">{recipient}</p>
                                                        <p className="tx-hash-text">Transaction Hash: 0x{transactionHash}</p>
                                                    </div> 
                                                    : null

                                            }
                                            </React.Fragment> 
                                        : null
                                    }
                                    {
                                        error ?
                                            <LogAreaOutput
                                                value={!error ? '' : { 
                                                    'Error': error,
                                                    errorSendingTransaction
                                                }
                                                }
                                                className={!error ? '' : 'log-area-output-error'}
                                            />
                                        : null
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