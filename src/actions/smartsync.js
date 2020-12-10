import AppDispatcher from '../dispatcher'
import API from '../api'

export default {
  // Resets the current bank form to its defaults in the store
  clearBank () {
    AppDispatcher.handleAction({
      actionType: 'CLEAR_CURRENT_BANK'
    })
  },

  clearBankAccounts () {
    AppDispatcher.handleAction({
      actionType: 'CLEAR_CURRENT_BANK_ACCOUNTS'
    })
  },

  getBelvoBanks (bank) {
    return API.BanksSynchronization.BankAccounts(bank)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'BANKS_RECEIVED',
          data: response
        })
      })
      .catch(error => {
        AppSignal.sendError(new Error(error))
        throw error
      })
  },

  addBank (data) {
    return API.BanksSynchronization.AddBank(data)
  },

  async askStatus (institution) {
    let statusRegistration = 'failed'

    try {
      const { status } = await API.BanksSynchronization.AskStatus(institution)
      statusRegistration = status
    } catch (error) {
      statusRegistration = 'failed'
    }

    return statusRegistration
  },

  getReponseRegister (bank) {
    return API.BanksSynchronization.GetResponse(bank)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'GET_RESPONSE',
          data: response
        })
        return response
      })
      .catch(error => {
        throw error
      })
  },

  saveSelectedAccount (data) {
    return API.BanksSynchronization.SaveSelectedAccount(data)
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'ACCOUNT_SELECTED',
          data: response
        })
        return response
      })
      .catch(error => {
        throw error
      })
  },

  getBankList () {
    return API.BanksSynchronization.GetBankList()
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'SMART_BANK_LIST_RECEIVED',
          data: response
        })
        return response
      })
      .catch(error => {
        throw error
      })
  },

  tokenDefeated () {
    AppDispatcher.handleAction({
      actionType: 'TOKEN_DEFEATED'
    })
  },

  getWidgetToken () {
    return API.BanksSynchronization.WidgetToken()
      .then(response => {
        AppDispatcher.handleAction({
          actionType: 'WIDGET_TOKEN_RECEIVED',
          data: response
        })
        return response
      })
      .catch(error => {
        throw error
      })
  }
}
