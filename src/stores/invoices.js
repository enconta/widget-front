import BaseStore from './baseStore'
import moment from 'moment'

class InvoicesStore extends BaseStore {
  constructor () {
    super()
    this.incomes = {
      invoices: [],
      totalPages: 1,
      currentPage: 1,
      totalItems: 0
    }
    this.expenses = {
      invoices: [],
      totalPages: 1,
      currentPage: 1,
      totalItems: 0
    }
    this.payroll_expenses = {
      invoices: [],
      totalPages: 1,
      currentPage: 1,
      totalItems: 0
    }
    this.products = []
    this.units = []
    this.cancelationStatus = false
    this.dateTime = moment()
    this.remainingInvoices = 0
    this.time = {
      hour: '',
      minute: ''
    }

    this.originalDateTime = moment().utc()

    this.invoice = {}
    this.actions = {
      INVOICES_RECEIVED: action => {
        this.setInvoices(action)
      },
      USED_DATA_RECEIVED: action => {
        this.setProducts(action.data)
        this.setUnits(action.data)
      },
      INVOICE_DATA_RECEIVED: action => {
        this.setInvoiceInformation(action.data)
      }
    }
  }

  // Returns stored total pages, this is used when explicitly you want to know it
  getTotalPages (invoiceType) {
    return this[invoiceType].totalPages
  }

  // Returns stored total pages, this is used when explicitly you want to know it
  getTotalItems (invoiceType) {
    return this[invoiceType].totalItems
  }

  // Returns stored current page, this is used when explicitly you want to know it
  getCurrentPage (invoiceType) {
    return this[invoiceType].currentPage
  }

  // Returns stored invoice list, this is used when explicitly you want to know it
  getInvoices (invoiceType) {
    return this[invoiceType].invoices
  }

  // Sets the invoice list from the data received from the api
  setInvoices (action) {
    let { invoiceType, data } = action
    this[invoiceType] = {
      invoices: data.invoices,
      totalPages: data.pagination.total_pages,
      currentPage: data.pagination.current_page,
      totalItems: data.pagination.total_items
    }
  }
  setProducts ({ products }) {
    this.products = products
  }
  getProducts () {
    return this.products
  }
  setUnits ({ units }) {
    this.units = units
  }
  getUnits () {
    return this.units
  }
  setInvoiceInformation ({ new_invoice: newInvoice }) {
    const {
      current_datetime: currentDateTime,
      next_folio: nextFolio,
      next_serie: nextSerie,
      remaining_invoices: remainingInvoices
    } = newInvoice
    this.dateTime = moment.utc(currentDateTime)
    this.remainingInvoices = remainingInvoices
    this.time['hour'] = this.dateTime.format('HH')
    this.time['minute'] = this.dateTime.format('mm')

    this.invoice = {
      folio: nextFolio !== '' ? nextFolio : '0001',
      series: nextSerie !== '' ? nextSerie : 'A',
      issue_date: moment.utc(currentDateTime),
      comments: '',
      exchange_rate: '1.0',
      currency: 'MXN',
      voucher_type: ''
    }
    this.originalDateTime = moment.utc(currentDateTime)
  }
  getDateTime () {
    return this.dateTime
  }
  getRemainingInvoices () {
    return this.remainingInvoices
  }
  getTime () {
    return this.time
  }
  getInvoice () {
    return this.invoice
  }
  getOriginalDateTime () {
    return this.originalDateTime
  }
}

export default InvoicesStore.getInstance()
