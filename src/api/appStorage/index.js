/*
 * The AppStorage is used to store data in the LocalStorage for its use
 * even when the page is reloaded/refreshed.
 * The only way to delete this data is logging out from the app
 * or manually delete it with the browser tools.
 * It is encouraged to NOT use this Storage except when it is strictly necessary,
 * use the app stores instead to manage the application state.
 */

// Libraries
import store from 'store'

// Constants
// Key names
const SESSION_DATA = 'SessionData'
const NOTIFICATION_DATA = 'NotificationData'

const AppStorage = {
  // Checks if is there a SessionData key in the local storage, if not, adds it alongside other required keys
  init () {
    ;(this.getAllSessionData() && this.getAllNotifications()) || this.clearAll()
  },

  // Inserts empty objects in the keys in the local storage. If there was data in this mentioned keys, it will be lost
  clearAll () {
    // Keys that will be cleared
    let keys = [SESSION_DATA, NOTIFICATION_DATA]
    keys.map(key => {
      let emptyObject = {}
      store.set(key, emptyObject)
    })
  },

  // Inserts passed attributes with its data in the passed keyNames without losing previous data
  insertIntoKey (keyName, attr) {
    let key = this.getKey(keyName)
    Object.assign(key, attr)
    store.set(keyName, key)
  },

  setAuthToken (token) {
    this.insertIntoKey(SESSION_DATA, { ENCONTA_AUTH_TOKEN: token })
  },

  setUserData (user) {
    this.insertIntoKey(SESSION_DATA, { user })
  },

  setTaxableEntities (taxableEntities) {
    this.insertIntoKey(SESSION_DATA, { taxableEntities })
  },

  setCurrentEntity (id) {
    this.insertIntoKey(SESSION_DATA, { currentEntity: id })
  },

  // Returns all data from a key
  getKey (keyName) {
    return store.get(keyName)
  },

  // Returns passed attribute data from a passed key name
  getValue (keyName, valueName) {
    return store.get(keyName)[valueName]
  },

  getAllSessionData () {
    return this.getKey(SESSION_DATA)
  },

  getAuthToken () {
    return this.getValue(SESSION_DATA, 'ENCONTA_AUTH_TOKEN')
  },

  getUserData () {
    return this.getValue(SESSION_DATA, 'user')
  },

  getTaxableEntities () {
    return this.getValue(SESSION_DATA, 'taxableEntities')
  },

  getCurrentEntity () {
    return this.getValue(SESSION_DATA, 'currentEntity')
  },

  // Checks if session has an auth token and a user stored, if so returns true
  hasSession () {
    this.init()
    return !!(this.getAuthToken() && this.getUserData())
  },

  // Notifications
  // Store notifications
  setNotifications (notifications) {
    this.insertIntoKey(NOTIFICATION_DATA, { notifications })
  },

  // Get all notification info
  getAllNotifications () {
    return this.getKey(NOTIFICATION_DATA)
  },

  // Get notifications
  getNotifications () {
    return this.getValue(NOTIFICATION_DATA, 'notifications')
  },

  // Initialize notifications as empty object
  initNotifications () {
    store.set(NOTIFICATION_DATA, {})
  },

  // Return false if notifications empty, null or undefined
  hasNotifications () {
    return !!this.getNotifications()
  },
  setFeatures (features) {
    this.insertIntoKey(SESSION_DATA, { features })
  },
  getFeatures () {
    return this.getValue(SESSION_DATA, 'features')
  }
}

export default AppStorage
