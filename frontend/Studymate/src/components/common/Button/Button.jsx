import React from 'react'
import './Button.scss';
const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className
}) => {
  return (
    <button type={type} onClick={onClick} disabled = {disabled} className={`button ${className}`}>{children}</button>
  )
}

export default Button
