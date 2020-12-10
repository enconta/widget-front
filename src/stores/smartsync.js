import BaseStore from './baseStore'

class BankSynchronization extends BaseStore {
  constructor () {
    super()
    this.current = {
      institution: '',
      username: '',
      password: ''
    }

    this.accounts = []
    this.synchronizedAccounts = []
    this.unsynchronizedAccounts = []
    this.hasToIntroduceToken = false
    this.widgetToken = {}
    this.actions = {
      CLEAR_CURRENT_BANK: () => {
        this.clearCurrentBank()
      },
      BANKS_RECEIVED: action => {
        this.setBankAccounts(action.data)
        this.filterSynchronizedAccounts(action.data)
      },
      CLEAR_CURRENT_BANK_ACCOUNTS: () => {
        this.clearCurrentBankAccounts()
      },
      TOKEN_DEFEATED: action => {
        this.setTokenInfo()
      },
      WIDGET_TOKEN_RECEIVED: action => {
        this.setWidgetToken(action.data.token)
      }
    }
  }

  getCurrent () {
    return this.current
  }

  setBankAccounts (data) {
    this.accounts = data.accounts
  }

  filterSynchronizedAccounts ({ accounts }) {
    accounts.forEach(account => {
      if (account.synchronized) {
        this.synchronizedAccounts.push(account)
      } else {
        this.unsynchronizedAccounts.push(account)
      }
    })
  }

  getSynchronizedAccounts () {
    return this.synchronizedAccounts
  }

  getUnsynchronizedAccounts () {
    return this.unsynchronizedAccounts
  }

  getAccounts () {
    return this.accounts
  }

  getInfoToken () {
    return this.hasToIntroduceToken
  }

  getWidgetToken () {
    return this.widgetToken
  }

  setTokenInfo () {
    this.hasToIntroduceToken = true
  }

  setWidgetToken ({ access }) {
    this.widgetToken = access
  }

  setCurrent () {
    this.current = this.current
  }

  clearCurrentBank () {
    this.current = {
      institution: '',
      username: '',
      password: ''
    }
  }
  clearCurrentBankAccounts () {
    this.accounts = []
    this.synchronizedAccounts = []
    this.unsynchronizedAccounts = []
  }
}

export default BankSynchronization.getInstance()
