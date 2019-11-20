import React from 'react';
import './css/Layout.css';

class Layout extends React.Component {
    render() {
        const { children } = this.props;
        return (
            <section className="main-content">
                <div className="main-content-container">
                    {children}
                </div>
            </section>
        );
    }
}

export default Layout;