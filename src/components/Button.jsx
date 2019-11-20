import React from 'react';
import './css/Button.css';

const Button = (props) => {
    const { children, onClick, style = {}, className = "" } = props;
    return (
        <button
            className={`button ${className}`}
            style={style}
            onClick={onClick}
        >{children}</button>
    );
}

export default Button;