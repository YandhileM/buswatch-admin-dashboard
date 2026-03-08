import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilWarning,
  cilTruck,
  cilList,
  cilMobile,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Incidents',
    to: '/incidents',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Buses',
    to: '/buses',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Routes',
    to: '/routes',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Devices',
    to: '/devices',
    icon: <CIcon icon={cilMobile} customClassName="nav-icon" />,
  },
]

export default _nav
