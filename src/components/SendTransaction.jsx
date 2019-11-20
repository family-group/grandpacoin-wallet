import React from 'react';
import Layout from './Layout';
import TextInput from './TextInput';
import './css/SendTransaction.css';
import Button from './Button';
import LogAreaOutput from './LogAreaOutput';

const styles = {
    logAreaOutput: {
        minHeight: '100px',
    },
    button: {
        width: '150px',
    }
}

class SendTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            senderAddress: '',
            recipientAddress: '',
            value: 0,
            urlNode: ''
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        })
    }

    onSignTransaction() {
        console.log('Sign Transaction');
    }

    onSendTransaction() {
        console.log('Send Transaction');
    }

    render() {
        const {
            senderAddress,
            recipientAddress,
            value,
            urlNode
        } = this.state;

        return (
            <Layout>
                <div className="send-transaction-container">
                    <h3 className="component-title">Send Transaction</h3>
                    <div className="send-transaction-inputs">
                        <TextInput
                            name="senderAddress"
                            className="full-width  margin-top"
                            value={senderAddress}
                            onChange={this.onChange}
                            placeholder="Sender"
                        />
                        <TextInput
                            name="recipientAddress"
                            className="full-width  margin-top"
                            value={recipientAddress}
                            onChange={this.onChange}
                            placeholder="Recipient"
                        />
                        <TextInput
                            name="value"
                            className="full-width  margin-top"
                            value={value}
                            onChange={this.onChange}
                            placeholder="Value"
                        />
                        <Button
                            className="margin-top"
                            onClick={this.onSignTransaction}
                            style={styles.button}
                        >SIGN TRANSACTION</Button>

                        <LogAreaOutput
                            value=""
                            style={styles.logAreaOutput}
                        />
                        <TextInput
                            name="urlNode"
                            className="full-width  margin-top"
                            value={urlNode}
                            onChange={this.onChange}
                            placeholder="Blockchain Node"
                        />
                        <Button
                            className="margin-top"
                            onClick={this.onSendTransaction}
                            style={styles.button}
                        >SEND TRANSACTION</Button>
                        <LogAreaOutput
                            value=""
                            style={styles.logAreaOutput}
                        />

                    </div>
                </div>
            </Layout>
        );
    }
}

export default SendTransaction;