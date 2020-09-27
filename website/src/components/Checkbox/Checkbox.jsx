import React, { Component } from 'react'
import './Checkbox.css'

// interface CheckboxProps {
//     id?: string,
//     options: Array<string>,
//     className?: string,
//     name?: string,
//     onChange: Function
// }

export default class Checkbox extends Component{
    render() {
        return (
            <div className="checkbox-container">
                {this.props.options.map(option => {
                    return (
                        <label className="checkbox-label">
                            <input type="checkbox"
                                name={this.props.name}
                                id={this.props.name + '-' + option}
                                value={option}
                                onChange={(event) => { this.props.onChange(event) }}
                            />
                            <span className="checkmark"></span>
                            {option}
                        </label>
                    )
                })
                }
            </div>
        )
    }
}