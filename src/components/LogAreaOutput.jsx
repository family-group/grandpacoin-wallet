import React from 'react';
import './css/LogAreaOutput.css';

export default class LogAreaOutput extends React.Component {
    render() {
        const { value, className = '', style = {} } = this.props;
        return (
            <div className={``} style={style}>
                {
                    typeof value === 'string' ? <p>{value}</p> :
                        Array.isArray(value) ? (
                            <React.Fragment>
                                {
                                    value.map((element, index) => {
                                        return <p className={`label-text log-area-output ${className}`} key={`label-${index}`}>{element}</p>
                                    })
                                }
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    {
                                        Object.keys(value).map((valueLabel, index) => {
                                            return <p className={`label-text log-area-output ${className}`} key={`label-${index}`}>{`${valueLabel}: ${value[valueLabel]}`}</p>
                                        })

                                    }
                                </React.Fragment>
                            )
                }
            </div>
        )
    }
}
