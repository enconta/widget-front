import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import ReactGa from 'react-ga'

import EditClient from './components/app/views/editClient'

// API
import { unregister } from './registerServiceWorker'

const $app = document.getElementById('app')

const routes = (
  <Route>
    <Route
      path='/entidades/:id'
      component={EditClient}
      tab='entidades'
      title='Editar Cliente'
      content='edit'
    />
    <Route
      path='/entidades'
      component={EditClient}
      tab='entidades'
      title='Editar Cliente'
      content='list'
    />
    <Route
      path='/sucursal/nueva'
      component={EditClient}
      tab='sucursales'
      title='Nueva Sucursal'
      content='edit'
    />
    <Route
      path='/sucursal/:id'
      component={EditClient}
      tab='sucursales'
      title='Editar Sucursal'
      content='edit'
    />
    <Route
      path='/sucursales'
      component={EditClient}
      tab='sucursales'
      title='Editar Cliente'
      content='list'
    />
    <Route
      path='/cuentas-de-pago'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Cuentas de Pago'
      content='list'
    />
    <Route
      path='/cuenta-de-pago/nueva'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Crear Cuenta Bancaria'
      content='edit'
    />
    <Route
      path='/cuenta-de-pago/:id'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Editar Cuenta Bancaria'
      content='edit'
    />
    <Route
      path='/cliente/nuevo'
      component={EditClient}
      tab='clientes'
      title='Nuevo Cliente'
      content='edit'
    />
    <Route
      path='/cliente/:id'
      component={EditClient}
      tab='clientes'
      title='Editar Cliente'
      content='edit'
    />
    <Route
      path='/clientes'
      component={EditClient}
      tab='clientes'
      title='Editar Cliente'
      content='list'
    />
    <Route
      path='/'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Sincronización de cuentas automáticas'
      content='editSecond'
    />
    <Route
      path='/sincronizacion-finalizada'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Sincronización de cuentas automáticas'
      content='finished'
    />
    <Route
      path='/smart-sync'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Sincronización de cuentas automáticas'
      content='smartSync'
    />
    <Route
      path='/seleccionar/banco/:bank'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Seleccionar banco'
      content='continue'
    />
    <Route
      path='/:bank/editar-cuentas/'
      component={EditClient}
      tab='cuentas-de-pago'
      title='Editar cuentas'
      content='edit-sync-accounts'
    />
    <Route
      path='/proveedores'
      component={EditClient}
      tab='proveedores'
      title='Editar Proveedor'
      content='list'
    />
    <Route
      path='/proveedor/nuevo'
      component={EditClient}
      tab='proveedores'
      title='Nuevo proveedor'
      content='edit'
      exact
    />
    <Route
      path='/proveedor/:id'
      component={EditClient}
      tab='proveedores'
      title='Editar Proveedor'
      content='edit'
    />
    <Route
      path='/empleado/nuevo'
      component={EditClient}
      tab='empleados'
      title='Nuevo Empleado'
      content='edit'
    />
    <Route
      path='/empleado/:id'
      component={EditClient}
      tab='empleados'
      title='Editar Empleado'
      content='edit'
    />
    <Route
      path='/empleados'
      component={EditClient}
      tab='empleados'
      title='Editar Cliente'
      content='list'
    />
    {/*
     * When requesting root route, redirects to Login component
     * which looks if a session is active in the browser and if so
     * will replace its own route for /dashboard
     */}
  </Route>
)

// Initializes Storages for the Ap
const onDev =
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '0.0.0.0') &&
  process.env.API_SERVER !== 'https://api.enconta.com/'

// Configure Google Analytics
ReactGa.initialize(process.env.GA_TOKEN, { debug: false })

// If we are on dev, do not send the events
if (onDev) ReactGa.ga('set', 'sendHitTask', null)

// Updates the visited page in Google Analytics
function firePageView () {
  // Get the router object
  const { router } = this
  if (!router) return
  // Get current location with the current params
  const { location, params } = router
  let { pathname: currentLocation } = location
  // Convert param value into param name
  for (const param in params) {
    currentLocation = currentLocation.replace(params[param], param)
  }
  // Call GA library
  ReactGa.pageview(currentLocation)
}

render(
  <Router onUpdate={firePageView} routes={routes} history={browserHistory} />,
  $app
)
unregister()
