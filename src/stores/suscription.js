import BaseStore from './baseStore'

class SuscriptionStore extends BaseStore {
  constructor () {
    super()
    this.next_billing_date = ''
    this.services = []
    this.total = 0
    this.payment_sources = []
    this.payments = []
    this.pendingPayments = []
    this.minimumPayments = []
    this.totalPages = 1
    this.totalItems = 0
    this.currentPage = 1

    this.actions = {
      SERVICES_LIST_RECEIVED: action => {
        this.setServices(action.data)
      },
      PAYMENT_SOURCES_LIST_RECEIVED: action => {
        this.setPaymentSources(action.data)
      },
      PAYMENT_LOG_RECEIVED: action => {
        this.setPaymentsLog(action.data)
      },
      PENDING_PAYMENTS_RECEIVED: action => {
        this.setPendingPayments(action.data)
      },
      PAYMENT_METHOD_UPDATED: action => {
        this.updatePaymentSourceList(action.data)
      },
      CLEAR_CURRENT_SERVICES: action => {
        this.clearCurrentServices()
      },
      PAYMENT_SOURCE_CREATED: action => {
        this.setNewPaymentSource(action.data)
      }
    }
  }

  getNextBillingDate () {
    return this.next_billing_date
  }

  getListServices () {
    return this.services
  }

  getTotalAmount () {
    return this.total
  }

  getPaymentSourcesList () {
    return this.payment_sources
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

  // Returns the list of payments log
  getPaymentsLog () {
    return this.payments
  }

  // Returns the list of pending payments
  getPendingPayments () {
    return this.pendingPayments
  }

  // Returns a list of ids of the payment order that should be paid to reactivate the platform access
  getMinimumPayments () {
    return this.minimumPayments
  }

  // Returns total of created payment sources
  getTotalPaymentSources () {
    return this.payment_sources.length
  }

  getSumServices () {
    return this.payments.reduce((accumulator, service) => {
      return Number(accumulator) + Number(service.total)
    }, 0)
  }

  // Sets the client's acquired services information
  setServices (data) {
    this.next_billing_date = data.next_billing_date
    this.services = data.services
    this.total = data.total
  }
  // Sets the client's payment sources list
  setPaymentSources (data) {
    this.payment_sources = data.payment_sources
  }

  setNewPaymentSource ({ payment_sources: paymentSources }) {
    return this.payment_sources.push(paymentSources)
  }
  // Sets the list of payment log
  setPaymentsLog (data) {
    this.payments = data.payments
    this.totalItems = data.pagination.total_items
    this.totalPages = data.pagination.total_pages
    this.currentPage = data.pagination.current_page
  }

  // Set the pending payments list, it is not paginated
  setPendingPayments (data) {
    this.pendingPayments = data.payments
    this.minimumPayments = data.minimum_payments
  }

  updatePaymentSourceList (data) {
    let paymentSources = this.payment_sources

    paymentSources.forEach(source => {
      if (source.id === data.payment_sources.id) {
        source.main_card = data.payment_sources.main_card
      } else {
        source.main_card = false
      }
    })
    this.payment_sources = paymentSources
  }

  clearCurrentServices () {
    this.services = []
    this.total = 0
  }
}

export default SuscriptionStore.getInstance()
