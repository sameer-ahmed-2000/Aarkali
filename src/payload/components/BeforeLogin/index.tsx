import React from 'react'
import { ShieldIcon } from '../../../app/_components/Icons'
import './index.scss'

const BeforeLogin: React.FC = () => {
  return (
    <div className="before-login">
      <div className="before-login__icon">
        <ShieldIcon size={22} />
      </div>
      <div className="before-login__content">
        <span className="before-login__title">Secure Admin Authentication Portal</span>
        <p className="before-login__sub">
          Restricted to authorized store managers, logistics operators, and executive administrators.
        </p>
      </div>
    </div>
  )
}

export default BeforeLogin
