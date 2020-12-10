import { browserHistory } from 'react-router'

import AppDispatcher from '../dispatcher'
import API from '../api'
import AppStorage from '../api/appStorage'

// This action creator sends the type of action and the params (if any) to the dispatcher
export default {
  // Sends email and password to the API to login, if success, stores the session data in the local
  // storage and sets it in the application state, else throw error
  login (user) {
    return API.User.Login(user)
      .then(response => {
        this.setSession(response)
        return 'success'
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  // Sends token to the API to logout, if success, clears local storage and redirects to Login page
  logout () {
    API.User.Logout(AppStorage.getAuthToken())
      .then(() => {
        AppDispatcher.handleAction({
          actionType: 'CLEAR_SESSION'
        })
        AppStorage.clearAll()
        browserHistory.push('/')
      })
      .catch(error => {
        AppSignal.sendError(error)
        AppDispatcher.handleAction({
          actionType: 'CLEAR_SESSION'
        })
        AppStorage.clearAll()
        browserHistory.push('/')
      })
  },

  // Receives data to store the session data in the local storage and sets it in the application state
  setSession (data, setSessionFromStorage = false, isEntityChange = false) {
    if (setSessionFromStorage) {
      AppStorage.setAuthToken(data['ENCONTA_AUTH_TOKEN'])
      this.setUser(data.user)
      this.setTaxableEntities(data.taxableEntities)
      this.setCurrentEntity(data.currentEntity)
    } else {
      if (!isEntityChange) AppStorage.setAuthToken(data.auth_token)
      this.setUser(data.user)
      this.setTaxableEntities(data.user.taxable_entities)
      this.setCurrentEntity(data.user.current_taxable_entity)
    }
  },

  // Sets the user data in the local storage and sets it in the application state
  setUser (user) {
    AppStorage.setUserData(user)
    AppDispatcher.handleAction({
      actionType: 'USER_SET',
      data: user
    })
  },

  // Sets the available taxable entities list in the local storage and sets it in the application state
  setTaxableEntities (taxableEntities) {
    AppStorage.setTaxableEntities(taxableEntities)
    AppDispatcher.handleAction({
      actionType: 'USER_ENTITIES_RECEIVED',
      data: taxableEntities
    })
  },

  // Sets the current entity in the local storage and sets it in the application state
  setCurrentEntity (currentEntity) {
    AppStorage.setCurrentEntity(currentEntity)
    AppDispatcher.handleAction({
      actionType: 'CURRENT_ENTITY_SET',
      data: currentEntity
    })
  },

  // Stores the page the user wanted to enter to before he realizes there is no active session
  setPreloginPage (page) {
    AppDispatcher.handleAction({
      actionType: 'PRELOGIN_PAGE_SET',
      data: page
    })
  },

  // Get the available taxable entities list for the user, if success, stores it in the local storage
  // and sets it in the application state
  getTaxableEntities () {
    API.TaxableEntities.GetTaxableEntities().then(response => {
      this.setTaxableEntities(response)
    })
  },

  changeCurrentEntity (id) {
    // Send the entity change to the API, if success, stores it in the local storage
    // and sets it in the application state
    return API.User.ChangeCurrentEntity(id)
      .then(response => {
        this.setSession(response, false, true) // data, setSessionFromStorage, isEntityChange
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  resetPassword (data) {
    // Request the password reset for the specified client (or demo)
    return API.User.ResetPassword(data).catch(error => {
      AppSignal.sendError(error)
      throw error
    })
  },

  // Returns true if there is a session active, else false
  hasSession () {
    return AppStorage.hasSession()
  },

  // Get notifications
  getNotifications () {
    return API.User.GetNotifications()
      .then(r => {
        AppStorage.setNotifications(r.notifications)
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },
  /**
   * This gets all the Enconta's features available for an specific client
   */
  setFeatures () {
    return API.User.GetFeatures()
      .then(response => {
        AppStorage.setFeatures(response.features)
        AppDispatcher.handleAction({
          actionType: 'FEATURES_RECEIVED',
          data: response
        })
      })
      .catch(err => console.error(err))
  },
  clearEntity () {
    AppDispatcher.handleAction({
      actionType: 'CLEAR_SESSION'
    })
  }
}
