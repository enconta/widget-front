import { EventEmitter } from 'events'
import { camelCase } from 'utils'

import AppDispatcher from '../dispatcher'

class BaseStore extends EventEmitter {
  constructor () {
    super()
    this.registeredActions = {}
    this.camelCase = object => camelCase(object)
  }

  // Emits the string 'change' using the method emit(), it is part of the EventEmitter library
  emitChange () {
    this.emit('change')
  }

  // Method used when components mount to attach a callback function when the emmiter emmits the string 'change'
  addChangeListener (callback) {
    this.on('change', callback)
  }

  // Method used when components unmount to unattach the callback function and avoid memory leaks
  removeChangeListener (callback) {
    this.removeListener('change', callback)
  }

  // Static method used to create new Stores, it instatiates this BaseStore,
  // iterates over the child class actions and registers its own actions to the Dispatcher,
  // and then returns the new Instance (the new Store)
  static getInstance () {
    let ClassName = this
    this.instance = new ClassName()
    this.instance.registerAll()

    return this.instance
  }

  // Register all actions to Dispatcher
  registerAll () {
    let actions = Object.keys(this.actions)

    actions.forEach(key => {
      let action = this.actions[key]

      // Keep the reference action each action handler
      this.registeredActions[key] = AppDispatcher.register(payload => {
        let data = payload.action
        let actionType = data.actionType

        if (actionType !== key) {
          return true
        }

        // Invoke callback and emit change in the store only when the keys match
        let triggerChange = action.call(this, data)

        // Allow the callback to return false to avoid triggering change event
        if (triggerChange !== false) {
          this.emitChange()
        }

        return true
      })
    })
  }
}

export default BaseStore
