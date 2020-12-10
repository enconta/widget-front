import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import BanksSynchronizationActions from 'actions/smartsync'
import BanksSynchronizationStores from 'stores/smartsync'

function getCurrentState () {
  return {
    widgetToken: BanksSynchronizationStores.getWidgetToken()
  }
}

export class NewBank extends Component {
  defaultState = {}

  state = { ...this.defaultState, ...getCurrentState() }

  componentDidMount () {
    BanksSynchronizationActions.getWidgetToken()
    BanksSynchronizationStores.addChangeListener(this._onChange)
  }

  componentWillUnmount () {
    BanksSynchronizationStores.removeChangeListener(this._onChange)
    BanksSynchronizationActions.clearBank()
  }

  _onChange = () => {
    this.setState(getCurrentState())
  }

  onEventCallbackFunction = data => {
    // Do something with the event data
  }

  onExitCallbackFunction = data => {
    // Do something with the exit data
  }

  successCallbackFunction = (link, institution) => {
    // Do something with the link_id or institution name
  }

  openBelvoWidget = () => {
    const { widgetToken } = this.state
    console.log(widgetToken)
    belvoSDK // eslint-disable-line
      .createWidget(widgetToken, {
        locale: 'es',
        company_name: 'Enconta',
        // institution: 'bancomer_mx_retail', // to start the widget directly on a specific institution credentials page
        // institution_types: ['fiscal', 'retail', 'business', 'gig'], // to select the type of institution to show in the widget
        access_mode: 'recurrent', // to specify the type of link to be created from the widget
        country_codes: ['MX'],
        callback: (link, institution) =>
          this.successCallbackFunction(link, institution),
        onExit: data => this.onExitCallbackFunction(data),
        onEvent: data => this.onEventCallbackFunction(data)
      })
      .build()
  }

  render () {
    return <Fragment>hola mundo</Fragment>
  }
}

export default withRouter(NewBank)
