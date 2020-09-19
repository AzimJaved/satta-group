import React, { Component } from 'react'

import './Textbox.css'

// interface TextboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   validation?: Function[],
//   onValidate?: Function,
//   validationErrorHelptext?: string,
//   hideCheckOnValidatedTrue?: boolean
// }

export class Textbox extends Component {
  state = {
    needsValidation: false,
    isValidated: false
  }

  ErrorHelptext = ''

  runValidation(event) {
    event.persist()
    var validationResult = true
    
    if(this.state.needsValidation) {
      if(this.props.validation)
        for (const validation of this.props.validation) {
          if(!validation(event.target.value)) {
            validationResult = false
            this.ErrorHelptext = this.props.validationErrorHelptext
          }
        }
    }

    if(validationResult && this.props.required && !event.target.value.length){
      validationResult = false
      this.ErrorHelptext = 'This field is required'
    }

    if(this.props.onValidate && validationResult)
      this.props.onValidate(event)

    return {
      isValidated: validationResult
    }
  }

  render() {
    return (
      <div className="textbox-container">
        <div className="input-container">
          <input 
            className={(this.props.className!==undefined ? `textbox ${this.props.className}` : "textbox")}
            id={this.props.id}
            name={this.props.name} 
            type={this.props.type} 
            placeholder={this.props.placeholder}
            defaultValue={this.props.defaultValue}
            required={this.props.required}
            min={this.props.min}
            max={this.props.max}
            onFocus={(event)=>{
              event.persist()

              if(this.props.onFocus)
                this.props.onFocus(event)

              if(this.props.required) this.ErrorHelptext = 'This field is required'

              this.setState((prevState, props)=>{
                if(this.props.validation || this.props.required)
                  return { needsValidation: true }
                else
                  return { needsValidation: false }
              })
            }}
            onChange={(event)=>{
              event.persist()

              let validationResult = this.runValidation(event)
              this.setState(validationResult)
            
              if(validationResult.isValidated)
                if(this.props.onChange)
                  this.props.onChange(event)
            }}
            onBlur={(event)=>{
              event.persist()
              this.setState(this.runValidation(event))

              if(this.props.onBlur)
                this.props.onBlur(event)
            }}
          />

          {
            this.state.needsValidation ? (
              <span className="validation">
                {
                  this.state.isValidated ? (
                    this.props.hideCheckOnValidatedTrue!==undefined ? (
                      this.props.hideCheckOnValidatedTrue ? (
                        <span></span>
                      ) : (
                        <span className="true"></span>
                      )
                    ) : (
                      <span></span>
                    )
                  ) : (
                    <span className="false"></span>
                  )
                }
              </span>
            ) : (
              <span></span>
            )
          }
        </div>

        {
          this.state.needsValidation ? (
            this.state.isValidated ? (
              <span className="val-error-text"> </span>
            ) : (
              <span className="val-error-text">
                {
                  this.ErrorHelptext
                }
              </span>
            )
          ) : (
            <span className="val-error-text"> </span>
          )
        }
      </div>
    )
  }
}

export default Textbox

export function Textarea(props) {
  return (
    <div className="textbox-container">
      <div className="input-container">
        <textarea rows={6} className="textbox"
          name={props.name} 
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}
