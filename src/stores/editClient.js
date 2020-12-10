import BaseStore from './baseStore'

class EditClientStore extends BaseStore {
  constructor () {
    super()
    this.editingEntity = {
      platform_status: 'demo',
      address: '',
      cerFile: '',
      createdAt: '',
      active: false,
      email: '',
      fielCerFile: null,
      fielKeyFile: null,
      id: '',
      keyFile: '',
      lastSignInAt: '',
      legalName: '',
      logo: '',
      rfc: ''
    }
    this.actions = {
      ENTITY_DATA_RECEIVED: action => {
        this.setEditingEntity(action.data)
      },
      CLEAR_EDITING_ENTITY: () => {
        this.clearEditingEntity()
      }
    }
  }

  getEditingEntity () {
    return this.editingEntity
  }

  setEditingEntity (data) {
    this.editingEntity = this.camelCase(data.taxable_entity)
  }

  clearEditingEntity () {
    this.editingEntity = {
      platform_status: 'demo',
      address: '',
      cerFile: '',
      createdAt: '',
      active: false,
      email: '',
      fielCerFile: null,
      fielKeyFile: null,
      id: '',
      keyFile: '',
      lastSignInAt: '',
      legalName: '',
      logo: '',
      rfc: ''
    }
  }
}

export default EditClientStore.getInstance()
