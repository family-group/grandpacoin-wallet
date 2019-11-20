import React from 'react';
import './css/Button.css';

const Button = (props) => {
    const { children, onClick } = props;
    return (
        <button className="button" onClick={onClick}>{children}</button>
    );
}

export default Button;