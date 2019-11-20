import React from 'react';
import Layout from './Layout';
import Button from './Button';
import TextInput from './TextInput';
import LogAreaOutput from './LogAreaOutput';
import './css/OpenWallet.css'

const styles = {
    input: {
        marginRight: '10px'
    },
    logAreaOutput: {
        minHeight: '50px',
        right: '0px'
    }
}

class OpenWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletPrivateKey: ''
        }

        this.onChange = this.onChange.bind(this);
    }

    openWallet() {
        console.log('Open Wallet');
    }

    onChange(event) {
        const { value } = event.target;
        this.setState({
            walletPrivateKey: value
        });
    }

    render() {
        return (
            <Layout>
                <div className="open-wallet-container">
                    <h3 className="component-title">Open an Existing Wallet</h3>
                    <p className="component-description">Enter your wallet private key (compressed ECDSA key, 65 hex digits)</p>
                    <div className="open-wallet-input-section">
                        <TextInput
                            name="walletPrivateKey"
                            style={styles.input}
                            value={this.state.walletPrivateKey}
                            onChange={this.onChange}
                        />
                        <Button onClick={this.openWallet}>OPEN WALLET</Button>
                        <LogAreaOutput value={''} style={styles.logAreaOutput} />
                    </div>
                </div>
            </Layout>
        )
    }
}

export default OpenWallet;