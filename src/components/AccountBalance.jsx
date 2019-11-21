import React from 'react';
import Layout from './Layout';
import Button from './Button';
import Xhr from '../utils/xhr';
import { isValidUrl, isValidAddress } from '../utils/validator';
import LogAreaOutput from './LogAreaOutput';
import TextInput from './TextInput';
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
            balanceStatus: false,
            ...this.balancesRequest,
            ...this.inputErrors
        };
        this.onChange = this.onChange.bind(this);
        this.getInputErrors = this.getInputErrors.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    getInputErrors() {
        if (!isValidAddress(this.address) && !isValidUrl(this.nodeUrl)) {
            return this.inputErrors = {
                addressInput: 'Invalid Address! Please try again.',
                nodeInput: 'Invalid Url! Please try again.'
            }
        }
        if (!isValidAddress(this.address) && isValidUrl(this.nodeUrl)) {
            return this.inputErrors = {
                addressInput: 'Invalid Address! Please try again.'
            }
        }
        if (isValidAddress(this.address) && !isValidUrl(this.nodeUrl)) {
            return this.inputErrors = {
                nodeInput: 'Invalid Url! Please try again.'
            }
        }

        return false;
    }

    onChange({ target: { name, value } }) {
        this[name] = value;
    }

    onClick() {
        if (!this.getInputErrors()) {
            this.inputErrors = {
                addressInput: false,
                nodeInput: false
            }
            this.address = this.address.replace('0x', '');
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
        } else {
            this.setState({ ...this.inputErrors })
        }
    }

    render() {
        console.log(this.state)
        return (
            <Layout>
                <div className="account-balance-container">
                    <h3 className="component-title">View Account Balance</h3>
                    <div className="account-balance-inputs">
                        {
                            this.inputErrors.addressInput ?
                                <p>{this.inputErrors.addressInput}</p> : null
                        }
                        <TextInput
                            className="balance-input"
                            placeholder="Insert your address"
                            name="address"
                            onChange={this.onChange}
                        />
                        {
                            this.inputErrors.nodeInput ?
                                <p>{this.inputErrors.nodeInput}</p> : null
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
                        >DISPLAY BALANCE</Button>
                        <LogAreaOutput
                            value={this.state.balanceStatus ? this.balancesRequest : ''}
                            style={styles.logAreaOutput}
                            className="margin-top"
                        />
                    </div>
                </div>
            </Layout>
        );
    }
}

export default AccountBalance;