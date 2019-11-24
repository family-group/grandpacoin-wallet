import React from 'react';
import Layout from './Layout';
import NotFoundIcon from '../assets/logos/error-404.png';
import './css/NotFound404.css';

const NotFound404 = () => (
    <Layout>
        <div className="not-found-container">
            <div className="not-found-wrapper-icon">
                <img alt="not-found" src={NotFoundIcon} />
            </div>
            <p className="not-found-text">Url Not Found!</p>
        </div>
    </Layout>
)
export default NotFound404;