import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Incidents = React.lazy(() => import('./views/incidents/Incidents'))
const Buses = React.lazy(() => import('./views/buses/Buses'))
const Routes = React.lazy(() => import('./views/routes/Routes'))
const Devices = React.lazy(() => import('./views/devices/Devices'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/incidents', name: 'Incidents', element: Incidents },
  { path: '/buses', name: 'Buses', element: Buses },
  { path: '/routes', name: 'Routes', element: Routes },
  { path: '/devices', name: 'Devices', element: Devices },
]

export default routes
