import BaseStore from './baseStore'

class AccountingPeriodsStore extends BaseStore {
  constructor () {
    super()
    this.accountingPeriods = []
    this.totalPages = 1
    this.totalItems = 0
    this.currentPage = 1

    this.actions = {
      ACCOUNTING_PERIODS_RECEIVED: action => {
        this.setAccountingPeriods(action.data)
      }
    }
  }

  // Returns stored total pages, this is used when explicitly you want to know it
  getTotalPages () {
    return this.totalPages
  }

  // Returns stored total pages, this is used when explicitly you want to know it
  getTotalItems () {
    return this.totalItems
  }

  // Returns stored current page, this is used when explicitly you want to know it
  getCurrentPage () {
    return this.currentPage
  }

  // Returns stored accounting preriod list, this is used when explicitly you want to know it
  getAccountingPeriods () {
    return this.accountingPeriods
  }

  // Sets the accounting periods list from the data received from the api
  setAccountingPeriods (data) {
    this.accountingPeriods = data.accounting_periods
    this.totalItems = data.pagination.total_items
    this.totalPages = data.pagination.total_pages
    this.currentPage = data.pagination.current_page
  }
}

export default AccountingPeriodsStore.getInstance()
