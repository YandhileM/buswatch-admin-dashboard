import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Incidents = React.lazy(() => import('./views/incidents/Incidents'))
const CreateIncident = React.lazy(() => import('./views/incidents/CreateIncident'))
const Buses = React.lazy(() => import('./views/buses/Buses'))
const BusDetail = React.lazy(() => import('./views/buses/BusDetail'))
const Routes = React.lazy(() => import('./views/routes/Routes'))
const RouteDetail = React.lazy(() => import('./views/routes/RouteDetail'))
const Devices = React.lazy(() => import('./views/devices/Devices'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/incidents', name: 'Incidents', element: Incidents },
  { path: '/incidents/new', name: 'Create Incident', element: CreateIncident },
  { path: '/buses', name: 'Buses', element: Buses },
  { path: '/buses/:id', name: 'Bus Detail', element: BusDetail },
  { path: '/routes', name: 'Routes', element: Routes },
  { path: '/routes/:id', name: 'Route Detail', element: RouteDetail },
  { path: '/devices', name: 'Devices', element: Devices },
]

export default routes
