import uuid from 'uuid'

import BaseStore from './baseStore'

class NotificationsStore extends BaseStore {
  constructor () {
    super()
    this.notificationsQueue = []

    this.actions = {
      SEND_NOTIFICATION: action => {
        this.createNew(action)
      },
      HIDE_NOTIFICATION: action => {
        this.removeNotification(action.data)
      },
      CLEAR_ALL_NOTIFICATIONS: () => {
        this.clearAll()
      }
    }
  }

  // Creates new notification depending on the type passed and pushes it into the queue
  // Takes default values and overwrites them if params have been passed
  // then emmits a change so the NofificationsContainer can listen and render the queue
  createNew (notification) {
    const defaultNotification = {
      id: uuid(),
      type: 'info',
      message: null,
      timeOut: 5000
    }
    this.notificationsQueue.push(
      Object.assign({}, defaultNotification, notification.data)
    )
  }

  // Looks in the queue and returns a new array without the notification passed in the props
  // then emmits a change so the NofificationsContainer can listen and render the queue
  removeNotification (notificationId) {
    this.notificationsQueue = this.notificationsQueue.filter(
      n => notificationId !== n.id
    )
  }

  getNotificationsQueue () {
    return this.notificationsQueue
  }

  clearAll () {
    this.notificationsQueue = []
  }
}

export default NotificationsStore.getInstance()
