// Libraries
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Notifications extends Component {
  constructor (props) {
    super(props)
    this.data = {
      notifications: []
    }
    this.state = Object.assign({}, this.data)
  }

  // Get notifications on component mount
  componentDidMount () {
    this.getNotifications()
  }

  // Get a list of notifications, not from the server yet
  getNotifications () {
    let notifications = [
      {
        id: 10,
        date: '2017-06-17',
        description: 'Se descargaron 17 facturas nuevas',
        icon: 'mdi mdi-file-check'
      },
      {
        id: 9,
        date: '2017-06-16',
        description: 'Tus certificados expiran en 7 días',
        icon: 'mdi mdi-alert'
      },
      {
        id: 8,
        date: '2017-06-16',
        description: 'Se descargaron 4 facturas nuevas',
        icon: 'mdi mdi-file-check'
      },
      {
        id: 7,
        date: '2017-06-16',
        description: 'Se descargó 1 factura nueva',
        icon: 'mdi mdi-file-check'
      },
      {
        id: 6,
        date: '2017-06-16',
        description: 'Se descargaron 3 facturas nuevas',
        icon: 'mdi mdi-file-check'
      }
    ]
    this.setState({ notifications: notifications })
  }

  // Render a list of notifications with icons
  renderNotifications () {
    let notifications = (
      <p className='notification'>No tienes notificaciones.</p>
    )

    if (this.state.notifications.length > 0) {
      let renderNotifications = this.state.notifications.map(function (
        notification,
        index
      ) {
        return (
          <div
            key={notification.id}
            className='notificationsList--notification'
          >
            <span className='notificationsList--date'>{notification.date}</span>
            <i className={'notificationsList--icon ' + notification.icon} />
            <span className='notificationsList--description'>
              {notification.description}
            </span>
          </div>
        )
      })
      notifications = (
        <div className='notificationsList'>{renderNotifications}</div>
      )
    }
    return notifications
  }

  // Main render
  render () {
    return (
      <div>
        <h1 className='headline'>{this.props.route.title}</h1>
        <hr />
        <h2 className='title is-5'>
          Tus notificaciones de los últimos 30 días
        </h2>
        {this.renderNotifications()}
      </div>
    )
  }
}

Notifications.propTypes = {
  route: PropTypes.shape({
    title: PropTypes.string
  })
}

export default Notifications
