import AppDispatcher from '../dispatcher'
import API from 'api'

// This action creator sends the type of action and the params (if any) to the dispatcher
export default {
  getClientsList (params) {
    // Gets the Employee List from the API, then triggers the change on the store if success
    API.EditClient.GetClientsList(params)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'CLIENTS_LIST_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  getEmployeesList (params) {
    // Gets the Employee List from the API, then triggers the change on the store if success
    API.EditClient.GetEmployeesList(params)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'EMPLOYEES_LIST_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  getBranchesList (params) {
    // Gets the Branches List from the API, then triggers the change on the store if success
    API.EditClient.GetBranchesList(params)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'BRANCHES_LIST_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  getEntityData (id) {
    // Gets the Employee Data from the API, then triggers the change on the store if success
    API.EditClient.GetEntityData(id)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'ENTITY_DATA_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  getClientData (id) {
    // Gets the Employee Data from the API, then triggers the change on the store if success
    API.EditClient.GetClientData(id)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'CLIENT_DATA_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  getEmployeeData (id) {
    // Gets the Employee Data from the API, then triggers the change on the store if success
    API.EditClient.GetEmployeeData(id)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'EMPLOYEE_DATA_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  getBranchData (id) {
    // Gets the Employee Data from the API, then triggers the change on the store if success
    API.EditClient.GetBranchData(id)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'BRANCH_DATA_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
      })
  },

  createClient (data) {
    // Send the Employee creation data to the API, then triggers the change on the store if success
    return API.EditClient.CreateClient(data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'CLIENT_DATA_SAVED',
          data: response
        })

        return response
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  createEmployee (data) {
    // Send the Employee creation data to the API, then triggers the change on the store if success
    return API.EditClient.CreateEmployee(data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'EMPLOYEE_DATA_SAVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  createBranch (data) {
    // Send the Branch creation data to the API, then triggers the change on the store if success
    return API.EditClient.CreateBranch(data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'BRANCH_DATA_SAVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  setEntityData (id, data) {
    // Send the Employee Data change to the API, then triggers the change on the store if success
    return API.EditClient.SetEntitytData(id, data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'ENTITY_DATA_SAVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  setClientData (id, data) {
    // Send the Employee Data change to the API, then triggers the change on the store if success
    return API.EditClient.SetClientData(id, data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'CLIENT_DATA_SAVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  setEmployeeData (id, data) {
    // Send the Employee Data change to the API, then triggers the change on the store if success
    return API.EditClient.SetEmployeeData(id, data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'EMPLOYEE_DATA_SAVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  setBranchData (id, data) {
    // Send the Branch Data change to the API, then triggers the change on the store if success
    return API.EditClient.SetBranchData(id, data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'BRANCH_DATA_SAVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  toggleClientStatus (id, request) {
    // Send the Employee Status change to the API, then triggers the change on the store if success
    return API.EditClient.ChangeClientStatus(id, request)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'CLIENT_STATUS_CHANGED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  toggleEmployeeStatus (id, request) {
    // Send the Employee Status change to the API, then triggers the change on the store if success
    return API.EditClient.ChangeEmployeeStatus(id, request)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'EMPLOYEE_STATUS_CHANGED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(error)
        throw error
      })
  },

  deleteBranch (id) {
    return API.EditClient.DeleteBranch(id)
  },

  deleteClient (id) {
    return API.EditClient.DeleteClient(id)
  },

  deleteEmployee (id) {
    return API.EditClient.DeleteEmployee(id)
  },

  clearEditingEntity () {
    // Sets current Employee in the store to a blank one
    AppDispatcher.handleAction({
      actionType: 'CLEAR_EDITING_ENTITY'
    })
  },

  clearClient () {
    // Sets current Employee in the store to a blank one
    AppDispatcher.handleAction({
      actionType: 'CLEAR_CURRENT_CLIENT'
    })
  },
  clearProvider () {
    // Sets current Provider in the store to a blank one
    AppDispatcher.handleAction({
      actionType: 'CLEAR_CURRENT_PROVIDER'
    })
  },

  clearEmployee () {
    // Sets current Employee in the store to a blank one
    AppDispatcher.handleAction({
      actionType: 'CLEAR_CURRENT_EMPLOYEE'
    })
  },

  clearBranch () {
    // Sets current Branch in the store to a blank one
    AppDispatcher.handleAction({
      actionType: 'CLEAR_CURRENT_BRANCH'
    })
  }
}
