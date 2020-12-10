import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import NewBank from './synchronization'

import SessionStore from 'stores/session'

import EditClientActions from 'actions/editClient'

function getCurrentState () {
  return {
    checkFeature: SessionStore.getFeatures()
  }
}
class EditClient extends Component {
  state = {
    ...getCurrentState()
  }

  componentDidMount () {
    SessionStore.addChangeListener(this._onChange)
  }

  componentWillUnmount () {
    SessionStore.removeChangeListener(this._onChange)
  }
  _onChange = () => {
    this.setState(getCurrentState())
  }

  render () {
    const { checkFeature } = this.state
    const hasSynchronization = checkFeature.find(
      feature => feature.key === 'synchronization'
    )
    let content = null
    let button = null
    switch (this.props.route.tab) {      
      case 'cuentas-de-pago':
        switch (this.props.route.content) {          
          case 'editSecond':
            content = <NewBank {...this.props} />
            break         
        }
        break     
    }
    return (
      <div>
        <div className='flex-between'>
          <h1 className='headline'>Mi Empresa</h1>
          <div>{button}</div>
        </div>
        <p
          title={[
            { id: 'entidades', label: 'Entidades' },
            { id: 'sucursales', label: 'Sucursales' },
            { id: 'cuentas-de-pago', label: 'Cuentas Bancarias' },
            { id: 'clientes', label: 'Clientes' },
            { id: 'empleados', label: 'Empleados' },
            { id: 'proveedores', label: 'proveedores' }
          ]}
          activeTab={this.props.route.tab}
        >
          {content}
        </p>
      </div>
    )
  }
}

EditClient.propTypes = {
  route: PropTypes.shape({
    tab: PropTypes.number,
    content: PropTypes.element
  })
}
export default EditClient
