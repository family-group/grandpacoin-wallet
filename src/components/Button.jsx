import React from 'react';
import './css/Button.css';

const Button = (props) => {
    const { children, onClick, style = {} } = props;
    return (
        <button
            className="button"
            style={style}
            onClick={onClick}
        >{children}</button>
    );
}

export default Button;