'use client'

import React from 'react'

import { useAuth } from '../../../_providers/Auth'
import { UserIcon } from '../../../_components/Icons'

import classes from './index.module.scss'

export const UserInfo = () => {
  const { user } = useAuth()

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A'

  return (
    <div className={classes.profile}>
      <div className={classes.avatar}>
        {user?.name ? <span>{initial}</span> : <UserIcon size={24} color="#ffffff" />}
      </div>

      <div className={classes.profileInfo}>
        <h3 className={classes.name}>{user?.name || 'Valued Member'}</h3>
        <p className={classes.email}>{user?.email || 'Aarkali Boutique Customer'}</p>
      </div>
    </div>
  )
}
