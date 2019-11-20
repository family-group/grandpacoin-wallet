import React from 'react';
import Layout from './Layout';
import Button from './Button';
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
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            nodeUrl: ''
        }

        this.onChange = this.onChange.bind(this);
    }
    onChange(event) {
        const { value, name } = event.target;

        console.log(value)
        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <Layout>
                <div className="account-balance-container">
                    <h3 className="component-title">View Account Balance</h3>
                    <div className="account-balance-inputs">
                        <TextInput
                            className="full-width"
                            placeholder='Address'
                            name="address"
                            value={this.state.address}
                            onChange={this.onChange}
                        />
                        <TextInput
                            className="full-width margin-top"
                            placeholder='Blockchain Node' name="nodeUrl" value={this.state.nodeUrl} onChange={this.onChange}
                        />
                        <Button
                            style={styles.button}
                            onClick={this.onClick}
                        >DISPLAY BALANCE</Button>
                        <LogAreaOutput
                            value={''}
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