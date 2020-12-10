import BaseStore from './baseStore'

class SessionStore extends BaseStore {
  constructor () {
    super()
    this.preloginPage = '/dashboard'
    this.user = {
      name: '',
      email: '',
      role: 'account_holder',
      keys: false
    }
    this.currentEntity = {
      id: '',
      rfc: '',
      legal_name: '',
      plaform_status: 'demo',
      active: false
    }
    this.taxableEntities = []
    this.features = []

    this.actions = {
      PRELOGIN_PAGE_SET: action => {
        this.setPreloginPage(action.data)
      },
      USER_SET: action => {
        this.setUser(action.data)
      },
      USER_ENTITIES_RECEIVED: action => {
        this.setTaxableEntities(action.data)
      },
      CURRENT_ENTITY_SET: action => {
        this.setCurrentEntity(action.data)
      },
      CLEAR_SESSION: () => {
        this.clearAll()
      },
      FEATURES_RECEIVED: action => {
        this.setFeatures(action.data)
      }
    }
  }

  // Returns stored pre-logon page requested by the user
  getPreloginPage () {
    return this.preloginPage
  }

  // Returns stored User, this is used when explicitly you want to know it
  getUser () {
    return this.user
  }

  // Returns stored Current Entity, this is used when explicitly you want to know it
  getCurrentEntity () {
    return this.currentEntity
  }

  // Returns stored Taxable Entities, this is used when explicitly you want to know it
  getTaxableEntities () {
    return this.taxableEntities
  }

  // Returns the type of legal entity, it can be individual or business
  getLegalEntityKind () {
    return this.getCurrentEntity().legal_type
  }

  // Sets the pre-login page requested by the user
  setPreloginPage (page) {
    this.preloginPage = page === '/' ? '/dashboard' : page
  }

  // Sets the user for the session when succesfully login
  setUser (user) {
    this.user = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      keys: user.keys
    }
  }

  // Sets the available taxable entities for the session
  setTaxableEntities (taxableEntities) {
    this.taxableEntities = taxableEntities
  }

  // Sets the current taxable entity for the session
  setCurrentEntity (currentEntity) {
    this.currentEntity = currentEntity
  }

  clearUser () {
    this.user = {
      name: '',
      email: '',
      role: 'account_holder',
      keys: false
    }
  }

  // Clears the current entity to the default
  clearCurrentEntity () {
    this.currentEntity = {
      id: '',
      rfc: '',
      legal_name: '',
      plaform_status: 'demo',
      active: false
    }
  }

  // Clears the available entities to the default
  clearTaxableEntites () {
    this.taxableEntities = []
  }

  // Clears all to the default values
  clearAll () {
    this.clearUser()
    this.clearCurrentEntity()
    this.clearTaxableEntites()
  }
  setFeatures ({ features }) {
    this.features = features
  }
  getFeatures () {
    return this.features
  }
}

export default SessionStore.getInstance()
