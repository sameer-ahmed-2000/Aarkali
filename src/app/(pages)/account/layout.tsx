import React from 'react'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import {
  UserIcon,
  PackageIcon,
  HeartIcon,
  SearchIcon,
  LogoutIcon,
} from '../../_components/Icons'
import { UserInfo } from './UserInfo'

import classes from './index.module.scss'

const accountNavItems = [
  {
    title: 'My Profile',
    url: '/account',
    Icon: UserIcon,
  },
  {
    title: 'My Orders',
    url: '/orders',
    Icon: PackageIcon,
  },
  {
    title: 'My Wishlist',
    url: '/wishlist',
    Icon: HeartIcon,
  },
  {
    title: 'Track Order',
    url: '/track-order',
    Icon: SearchIcon,
  },
  {
    title: 'Logout',
    url: '/logout',
    Icon: LogoutIcon,
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>Customer Portal</h1>
        <p className={classes.heroSubtitle}>Manage your profile, tracked shipments, and boutique wishlist</p>
      </div>

      <Gutter className={classes.gutterWrap}>
        <div className={classes.account}>
          <div className={classes.nav}>
            <UserInfo />

            <ul className={classes.navList}>
              {accountNavItems.map(item => (
                <li key={item.title}>
                  <Link href={item.url} className={classes.navItem}>
                    <item.Icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.contentArea}>{children}</div>
        </div>
      </Gutter>
    </div>
  )
}
