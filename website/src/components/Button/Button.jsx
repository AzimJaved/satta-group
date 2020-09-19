import React from 'react'
import './Button.css'

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
//   color?: 'primary' | 'secondary' | 'default',
//   variant?: 'solid' | 'outlined',
//   size?: 'small' | 'medium' | 'large'
// }

const buttonStyles = {
  primary: {
    backgroundColor: '#00b6f1',
    border: 'none',
    color: '#fff'
  },
  secondary: {
    backgroundColor: '#fff',
    border: 'none',
    color: '#000'
  },
  default: {
    backgroundColor: '#000',
    border: '2px solid #00b6f1',
    color: '#fff'
  },

  solid: {},
  outlined: {},

  small: {
    width: '8em',
    fontSize: '0.75em',
    margin: '1rem',
    padding: '1rem'
  },
  medium: {
    width: '15em',
    margin: '1.5rem',
    padding: '1.25rem'
  },
  large: {
    width: '100%',
    margin: '2rem',
    padding: '1.5rem'
  }
}

function createStyle(props) {
  let button = { }
  let { color, variant, size } = props

  if(color) button = { ...button, ...buttonStyles[color] }

  if(variant) button = { ...button, ...buttonStyles[variant] }

  if(size) button = { ...button, ...buttonStyles[size] }

  button = { ...button, ...props.style }
  return button
}

export function Button(props) {
  return (
    <button className="button" 
      style={createStyle(props)}
      id={props.id} 
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className="button-label">
        {
          props.children
        }
      </div>
    </button>
  )
}

export default Button
