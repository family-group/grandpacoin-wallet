import React from 'react';
import Loader from './Loader';
import Layout from './Layout';
import Button from './Button';
import Xhr from '../utils/xhr';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import { isValidUrl } from '../utils/validator';

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
            disabled: false,
            active: false,
            loading: false,
            ...this.balancesRequest,
            ...this.inputErrors
        };
        this.address = JSON.parse(localStorage['publicAccount']).address
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
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

            this.setState({
                loading: true,
                ...this.inputErrors
            })

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
                        loading: false,
                        balanceStatus: true,
                        ...this.balancesRequest,
                        ...this.inputErrors
                    })
                })
                .catch(err => console.log('err', err));


        }
    }

    render() {
        return (
            <Layout>
                <div className="account-balance-container">
                    <h3 className="component-title">View Account Balance</h3>
                    <p>Balances are shown in Grandsons</p>
                    <p>1 Grandpa = 1000 Sons = 1000000 Grandsons</p>
                    <div className="account-balance-inputs">
                        <input
                            className="balance-input"
                            placeholder="Insert your address"
                            name="address"
                            value={this.address}
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
                        {
                            this.state.loading ?
                                <Loader /> :
                                <LogAreaOutput
                                    value={this.state.balanceStatus ? this.balancesRequest : ''}
                                    style={styles.logAreaOutput}
                                    className="margin-top"
                                />
                        }
                    </div>
                </div>
            </Layout>
        );
    }
}

export default AccountBalance;