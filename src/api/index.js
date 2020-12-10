/*
  API Wrapper
  The intent of this module is to have a single place in the app where all API calls are located
  The syntax for a new API call can be inferred from the existing exported clases, it supports the http methods GET, POST, PUT and DELETE
  All four methods call the request function that parses and prepares the data before making the actual request, the url params are converted to a query string and headers / auth are added in this step
  The response is a promise that must be resolved from the place it was called
*/
import { browserHistory } from 'react-router'
import moment from 'moment'
import store from 'store'
import axios from 'axios'

import AppStorage from './appStorage'
import SessionActions from 'actions/session'
import { stringifyQuery } from 'utils'

let initialized = false

// Sepomex API data
const SEPOMEX_CONFIG = {
  baseURL: process.env.CORE_API_URL,
  headers: { Authorization: process.env.CORE_API_TOKEN }
}

// Initializes required data for the app
const init = publicRoutes => {
  if (initialized) return
  ;(() => {
    let throttle = (type, name, obj) => {
      obj = obj || window
      let running = false
      const func = () => {
        if (running) return
        running = true
        window.requestAnimationFrame(() => {
          obj.dispatchEvent(new window.CustomEvent(name))
          running = false
        })
      }
      obj.addEventListener(type, func)
    }

    /* init - you can init any event */
    throttle('resize', 'optimizedResize')
  })()

  AppStorage.init()
  // If there is a session active, gets all the session data
  // and reinserts it on the local storage and in the application stores and for its state management,
  // else, clears all the AppStorage and redirects to the login page (or other public route)
  if (AppStorage.hasSession()) {
    SessionActions.setSession(AppStorage.getAllSessionData(), true)
  } else {
    AppStorage.clearAll()
    let currentLocation = browserHistory.getCurrentLocation().pathname
    let isLocationPublic = publicRoutes.props.children
      .map(child => child.props.path)
      .includes(currentLocation)

    if (!isLocationPublic) {
      SessionActions.setPreloginPage(currentLocation)
      browserHistory.replace('/ingresar')
    }
  }

  initialized = true
}

const handleServerErrors = response => {
  if (response.ok) return response
  switch (response.status) {
    case 404:
      throw Object.create({ error: 'No se encontró el elemento solicitado' })
    case 401:
      AppStorage.clearAll()
      browserHistory.push('/ingresar')
      break
    case 500:
      browserHistory.push('/500')
      break
  }
  return response.json().then(err => {
    throw err
  })
}

// Make the actual request
/**
 *
 * @param {string} method
 * @param {string} endpoint
 * @param {object} queryArray
 * @param {object} body
 * @param {boolean} hasCustomResponse
 * @returns {Promise}
 */
function request (
  method,
  endpoint,
  queryArray,
  body,
  hasCustomResponse = false
) {
  if (typeof endpoint === 'undefined') {
    console.error('FATAL ERROR: endpoint not defined')
    return Promise.reject(new Error('FATAL ERROR: endpoint not defined'))
  }
  // Add the query params
  const query = stringifyQuery(queryArray)

  const url = `${process.env.API_SERVER}${process.env.API_PREFIX}${endpoint}${query}`

  const fetchParams = {
    method: method,
    headers: {
      'content-type': 'application/json',
      Authorization: AppStorage.getAuthToken()
    }
  }
  if (body) Object.assign(fetchParams, { body: JSON.stringify(body) })
  if (process.env.DEBUG) console.log('myRequest', url, fetchParams)


  // Call the API and return a json response
  return window
    .fetch(url, fetchParams)
    .then(handleServerErrors)
    .then(response => {
      if (response.status === 204) return
      if (hasCustomResponse) {
        return response
      }
      return response.json().then(r => {
        if (process.env.DEBUG) {
          console.info(`${method}: ${endpoint}${query}`)
          console.info('resolvedRes', r)
        }
        return r
      })
    })
    .catch(e => {
      console.error('CONNECTION ERROR', e)
      storeErrorLog(e)
      if (e.error) {
        throw e.error
      } else {
        // If error doesn't have an 'error' attribute, it can be inferred as a conection error. Then a null will be thrown
        throw NotificationsActions.error(
          'Error de red. No hay conexión con el servidor.'
        )
      }
    })
}

// Store a small log of 50 errors in storage
// RyC
function storeErrorLog (e) {
  const errors = store.get('errors') || []
  const newError = {
    kind: 'API comms error',
    date: moment().format(),
    details: JSON.stringify(e)
  }
  const currentErrors = errors.length >= 50 ? errors.slice(1) : errors
  store.set('errors', [...currentErrors, newError])
}

// HTTP GET
/**
 *
 * @param {string} route
 * @param {object} [params]
 * @param {boolean} [hasCustomResponse]
 * @returns {Promise}
 */
export function Get (route, params = {}, hasCustomResponse) {
  return request('GET', route, params, null, hasCustomResponse)
}
// HTTP POST
export function Post (route, data = null, hasCustomResponse) {
  return request('POST', route, {}, data, hasCustomResponse)
}
// HTTP PUT
export function Put (route, data = null, hasCustomResponse) {
  return request('PUT', route, {}, data, hasCustomResponse)
}
// HTTP DELETE
export function Delete (route, params = {}, hasCustomResponse) {
  return request('DELETE', route, params, null, hasCustomResponse)
}

/**
 * @typedef {{
 *  items: number;
 *  total_items: number;
 *  limit_value: number;
 *  total_pages: number;
 *  current_page: number;
 * }} Pagination
 * @typedef {{
 *  id: number;
 *  term_type: string;
 *  month: number;
 *  year: number;
 *  actual_step: string;
 * }} AccountingPeriod
 * @typedef {{
 *  id: number;
 *  name: string;
 *  alias: string;
 *  bank_name: string;
 *  account_number: string;
 *  active: boolean;
 *  taxable_entity_id: number;
 *  account_type?: any;
 * }} PaymentAccount
 * @typedef {{
 *  id: number;
 *  payment_account: Pick<PaymentAccount, 'id' | 'alias' | 'bank_name'>;
 *  month: number;
 *  upload_status: null | 'no_movements' | 'uploaded' | 'filled';
 *  bank_statement: BankStatement | null;
 *  approved: boolean | null;
 *  rejection_reason: null | 'modified_document' | 'different_period' | 'other';
 *  customer_service_comment: string | null;
 *  original_filename: string;
 *  original_filename_extra: string;
 *  extra_file_approved: boolean;
 *  addedFirstFile: boolean;
 *  addedSecondFile: boolean;
 *  deleteExtraZone: any;
 *  deleteZone: any;
 * }} Assignment
 * @typedef {{
 *  assignment_id: number;
 *  name: string;
 *  attached_file: string;
 *  content_type: string;
 *  original_filename: string;
 * }} AssigmentDocument
 * @typedef {{
 *  id: number;
 *  filename: string;
 *  url: string;
 *  created_at: Date;
 * }} BankStatement
 */

// Exported functions
class User {
  // Update apply for credit status
  static ApplyForCredit () {
    return Put('/dashboard/')
  }
  // Attemps to log in the user with the provided credentials
  static Login (data) {
    return Post('/login', data)
  }
  // Attemps to log out the user with the provided credentials
  static Logout () {
    return Delete('/logout')
  }
  // Creates a new self_service client for Enconta
  static New (data) {
    return Post(`/self_service/`, data)
  }
  // Set current Taxable Entity
  static ChangeCurrentEntity (data) {
    return Post('/change_current_taxable_entity/', data)
  }
  // Request a password reset for the specified client (or demo)
  static ResetPassword (data) {
    return Post(`/reset_password`, data)
  }
  // Send a new password for user after requesting reset
  static ChangePassword (data) {
    return Post(`/change_password`, data)
  }
  // Set first time password
  static FirstPassword (data) {
    return Post(`/new_password`, data)
  }
  // Notifications
  static GetNotifications () {
    return Get(`/app_notifications`)
  }
  // Create a Cancellation Request
  static CreateCancelRequest (data) {
    return Post('/cancellation_request', data)
  }
  static CancellationReasons () {
    return Get('/cancellation_reasons')
  }
  static GetFeatures () {
    return Get('/features')
  }
}

class Documents {
  // Get documents
  static List (params) {
    return Get('/regular_documents/', params)
  }
  // Get document
  static GetDocument (id) {
    return Get('/regular_documents/' + id)
  }
  // Create document
  static CreateDocument (data) {
    return Post('/regular_documents/', data)
  }
  // Create document
  static UpdateDocument (id, data) {
    return Put('/regular_documents/' + id, data)
  }
  // Delete document by id
  static DeleteDocument (id) {
    return Delete('/regular_documents/' + id)
  }
}

class Downloads {
  // Get List
  static List (params) {
    return Get('/downloads/', params)
  }
  // Delete one file
  static DeleteFile (id) {
    return Delete('/downloads/' + id)
  }
}

class TaxableEntities {
  // Get Taxable Entities list
  static GetTaxableEntities (params) {
    return Get('/admin/taxable_entities/', params)
  }
}

class EditUser {
  // Get current User data
  static GetUserData () {
    return Get('/profile/')
  }
  // Get User notifications settings
  static GetUserNotifications () {
    return Get('/notifications/')
  }
  // Set updated User data
  static SetUserData (data) {
    return Put('/profile/', data)
  }
  // Set updated User notifications
  static SetUserNotifications (data) {
    return Put('/notifications/', data)
  }
}

class Suscriptions {
  // Gets client's acquired services list
  static GetServices () {
    return Get('/client/services')
  }

  // Gets payments log for a given client
  static GetPaymentsLog () {
    return Get('/client/payment_orders')
  }

  // Gets the pending payments details for a blocked client, so the client can pay the minimum
  static GetPendingPayments () {
    return Get('/client/payment_orders/pending_payments')
  }

  // Gets client's payment sources list
  static GetPaymentSources () {
    return Get('/client/payment_sources')
  }

  // Deletes a given payment source
  static DeletePaymentSource (idCard) {
    return Delete('/client/payment_sources/' + idCard)
  }

  // Makes a card the principal one for paying services
  static MakePrincipalPaymentCard (idCard) {
    return Put('/client/payment_sources/' + idCard)
  }

  // Adds a payment source
  static CreatePaymentSource (cardInfo) {
    return Post('/client/payment_sources', cardInfo)
  }

  // Pay services for a given client
  static PayService (orderIds) {
    return Post('/client/payment_orders', orderIds)
  }
}

class EditClient {
  // Get Clients list
  static GetEntityData (id) {
    return Get('/user_taxable_entities/' + id)
  }
  // Get Clients list
  static GetClientsList (params) {
    return Get('/clients/', params)
  }
  // Get Employees list
  static GetEmployeesList (params) {
    return Get('/employees/', params)
  }
  // Get Employees list
  static GetBranchesList (params) {
    return Get('/branches/', params)
  }
  // Get selected Client data
  static GetClientData (id) {
    return Get('/clients/' + id)
  }
  // Get selected Employee data
  static GetEmployeeData (id) {
    return Get('/employees/' + id)
  }
  // Get selected Branch data
  static GetBranchData (id) {
    return Get(`/branches/${id}`)
  }
  // Update entity data
  static SetEntitytData (id, data) {
    return Put('/user_taxable_entities/' + id, data)
  }
  // Set current Employee data
  static SetClientData (id, data) {
    return Put('/clients/' + id, data)
  }
  // Set current Employee data
  static SetEmployeeData (id, data) {
    return Put('/employees/' + id, data)
  }
  // Set current Branch data
  static SetBranchData (id, data) {
    return Put(`/branches/${id}`, data)
  }
  // Create new Employee
  static CreateClient (data) {
    return Post('/clients/', data)
  }
  // Create new Employee
  static CreateEmployee (data) {
    return Post('/employees/', data)
  }
  // Create new Branch
  static CreateBranch (data) {
    return Post('/branches/', data)
  }
  // Change Employee Status (active: true/false)
  static ChangeEmployeeStatus (id, request) {
    return Put(`/employees/${id}/${request}`)
  }
  // Change Client Status (active: true/false)
  static ChangeClientStatus (id, request) {
    return Put(`/clients/${id}/${request}`)
  }
  // Deletes a branch
  static DeleteBranch (id) {
    return Delete(`/branches/${id}`)
  }
  // Deletes a client
  static DeleteClient (id) {
    return Delete(`/clients/${id}`)
  }
  // Deletes an employee
  static DeleteEmployee (id) {
    return Delete(`/employees/${id}`)
  }
  // Edit data for taxable entity
  static EditEntity (data) {
    return Put('/taxable_entity', data)
  }
  // Get URLS for SAT credentials or booleans if permissions don't allow it
  static SatCredentials () {
    return Get(`/sat_credentials`)
  }
  // Gets client summary data
  static Summary () {
    return Get('/taxable_entity/summary')
  }
}

class PaymentAccounts {
  // Create new payment account
  static Create (data) {
    return Post('/payment_accounts/', data)
  }
  // Update payment account
  static Update (id, data) {
    return Put(`/payment_accounts/${id}`, data)
  }
  // List payment accounts
  static List (params) {
    return Get('/payment_accounts/', params)
  }
  // Toggles active/inactive a payment account
  static ToggleStatus (id) {
    return Put(`/payment_accounts/${id}/toggle_payment_account`)
  }
  // Gets the data for a single requested payment account
  static GetPaymentAccount (id) {
    return Get(`/payment_accounts/${id}`)
  }
  // Deletes a single payment account
  static Delete (id) {
    return Delete(`/payment_accounts/${id}`)
  }
  // Banks list
  static GetBanksList () {
    return Get(`/banks`)
  }

  // List payment accounts with cash accounts
  static ListWithCashAccounts (params) {
    return Get('/cash_payment_accounts/', params)
  }
}

class AccountingPeriods {
  /**
   * Get list all the periods with pagination
   */
  static GetAccoutingPeriods (params) {
    return Get('/accounting_periods', params)
  }

  /**
   * Get list all the periods of an taxable entity
   * @returns {Promise<{pagination: Pagination, accounting_periods: AccountingPeriod[]}>}
   */
  static List () {
    return Get('/accounting_periods')
  }
  /**
   * Get details specific period
   * @param {number | string} period
   * @returns {Promise<{accounting_period: AccountingPeriod>}
   */
  static Details (period) {
    return Get(`/accounting_periods/${period}`)
  }

  /**
   * @param {number} periodId
   * @returns {Promise<{assignments: Assignment[]}>}
   */
  static GetAssigments (periodId) {
    return Get(`/client/accounting_periods/${periodId}/assignments/`)
  }

  /**
   * @param {number} assigmentId
   * @returns {Promise<{assigment: Assignment}>}
   */
  static UpdateAssigment (assigmentId) {
    return Put(`/client/assignments/${assigmentId}/no_movements/`)
  }

  /**
   * @param {number} assignmentId
   * @param {AssigmentDocument} data
   * @returns {Promise<{assignments: assignment}>}
   */
  static CreateBankStatement (assignmentId, data) {
    return Put(`/client/assignments/${assignmentId}`, {
      assignment: data
    })
  }
}

class Conciliation {
  // Get calculation period
  static GetCalculations (period) {
    return Get(`/accounting_periods/${period}/calculations`)
  }
  // Send Conciliation acepted or rejected
  static SendCalculation (periodId, calculationId, params) {
    return Put(
      `/accounting_periods/${periodId}/calculations/${calculationId}`,
      params
    )
  }
}
// Get deductible invoices in a calculation
class InvoicesConsiderated {
  static List (params) {
    return Get('/invoices', params)
  }
}

class Messages {
  // List messages in view accounting periods
  static ListMessages (period, params) {
    return Get(`/accounting_periods/${period}/messages`, params)
  }
  // Create message from accounting periods
  static CreateMessages (period, data) {
    return Post(`/accounting_periods/${period}/messages`, data)
  }
}

class SentEmails {
  // Get Emails List
  static List (params) {
    return Get('/sent_emails/', params)
  }
  // Get email with id
  static Show (id) {
    return Get(`/sent_emails/${id}`)
  }
}

class TaxStatements {
  // Get tax statements list
  static List (periodId) {
    return Get(`/accounting_periods/${periodId}/tax_statements`)
  }
  // Get details from statements
  static GetDetails (periodId, statementId) {
    return Get(`/accounting_periods/${periodId}/tax_statements/${statementId}`)
  }
}

class Invoice {
  // Serie and folio
  static GetSerieAndFolio () {
    return Get('/invoices/new')
  }

  // Cancel invoice
  static Cancel (id) {
    return Get(`/invoices/${id}/cancel`)
  }

  static AskStatus (id) {
    return Get(`/invoices/${id}/cancelation_status`)
  }

  // List invoices
  static List (params) {
    return Get('/invoices', params)
  }
  // Return an invoice
  static Show (id) {
    return Get(`/invoices/${id}`)
  }
  // Create new invoice
  static Create (data) {
    return Post('/invoices', data)
  }
  // Create new regular invoice
  static CreateRegular (data, isPreview) {
    return Post('/create_invoice/regular', data, isPreview)
  }
  // Create new payroll invoice
  static CreatePayroll (data, isPreview) {
    return Post('/create_invoice/payroll', data, isPreview)
  }
  // Create new invoice with ine complement
  static CreateIne (data, isPreview) {
    return Post('/create_invoice/ine', data, isPreview)
  }
  // Create new invoice with local tax complement
  static CreateLocalTax (data, isPreview) {
    return Post('/create_invoice/local_tax', data, isPreview)
  }
  // Create new invoice with foreign trade (type i) complement
  static CreateForeignTrade (data, isPreview) {
    return Post('/create_invoice/foreign_trade', data, isPreview)
  }
  // Download XML
  static Xml (id) {
    return Get(`/invoices/${id}/xml`)
  }
  // Download PDF
  static Pdf (id) {
    return Get(`/invoices/${id}/pdf`)
  }
  // Triggers the Excel creation delayed job
  static ExportInvoiceToExcel (params) {
    return Get('/export_to_excel/regular', params)
  }

  static ExportPayrollToExcel (params) {
    return Get('/export_to_excel/payroll', params)
  }

  static ExportPaymentToExcel (params) {
    return Get('/export_to_excel/payment', params)
  }
  // Triggers the XML creation delayed job
  static ExportToXml (params) {
    return Get('/export_to_xml', params)
  }
  static GetUnits (params) {
    return Get('/cfdi_units', params)
  }
  static GetProducts (params) {
    return Get('/cfdi_products', params)
  }
  // Get frequently used data
  static GetUsedData () {
    return Get('/frequent_products')
  }
  static SendByEmail (invoiceId, data) {
    return Post(`/invoices/${invoiceId}/send_email`, data)
  }
  // Get custom categories (currenty named sat_categories)
  static SetCategory (id, data) {
    return Put(`/invoices/${id}/category`, data)
  }
}

class MultipleInvoicing {
  // Get list with invoice processes
  static List (params) {
    return Get('/invoice_imports', params)
  }
  // Get detail for process with id
  static Show (id) {
    return Get(`/invoice_imports/${id}`)
  }
  // Upload file for process
  static Create (data) {
    return Post('/invoice_imports', data)
  }
  // Upload file for process
  static CreateThirdParty (data) {
    return Post('/invoice_imports/create_third_party', data)
  }
  // Trigger stamping for regular invoices in process
  static StampRegular (id) {
    return Post(`/invoice_imports/${id}/stamp_regular`)
  }
  // Trigger stamping for third party invoices
  static StampThirdParty (id) {
    return Post(`/invoice_imports/${id}/stamp_third_party`)
  }
}

class CustomCategories {
  // Get custom categories (currenty named sat_categories)
  static List () {
    return Get('/invoice_categories')
  }
  // Get custom categories (currenty named sat_categories)
  static Create (data) {
    return Post('/invoice_categories', data)
  }
}

class Reports {
  // Invoice stats by category
  static Categories (params) {
    return Get('/reports/invoicing_by_category', params)
  }

  static Rankings (params) {
    return Get('/reports/client_rankings', params)
  }

  static Behaviors (params) {
    return Get('/reports/behavior_by_items', params)
  }

  static History (params) {
    return Get('/reports/historical_behavior', params)
  }
}

class Dashboard {
  static GetChartData (params) {
    return Get('/dashboard', params)
  }
}

class Payments {
  static Create (invoiceId, data) {
    return Post(`/invoices/${invoiceId}/payments`, data)
  }
  static Update (id, data) {
    return Put(`/payments/${id}`, data)
  }
  static Delete (id) {
    return Delete(`/payments/${id}`)
  }
}

class Services {
  // Send a postal code, receive address info
  static PostalCode (params = {}) {
    return axios.get(
      'sepomex',
      Object.assign({}, { ...SEPOMEX_CONFIG }, { params })
    )
  }
}

class BanksSynchronization {
  static AddBank (data) {
    return Post(`/client/smart_sync/account_connections`, data)
  }

  static SaveSelectedAccount (data) {
    return Post(`/client/smart_sync/bank_accounts`, data)
  }

  static AskStatus (institution) {
    return Get(`/client/smart_sync/account_connections/status/${institution}`)
  }

  static GetResponse (bank) {
    return Get(`/client/smart_sync/account_connections/${bank}`)
  }

  static BankAccounts (bank) {
    return Get(`/client/smart_sync/bank_accounts?bank_name=${bank}`)
  }
  static GetBankList () {
    return Get(`/client/smart_sync/account_connections`)
  }

  static WidgetToken () {
    return Get('/client/smart_sync/tokens')
  }
}
class Inventories {
  static GetProducts (params) {
    return Get('/products/', params)
  }

  static MassivelyInsertProducts (productsImport) {
    return Post('/product_import', productsImport)
  }

  static CreateProduct (product) {
    return Post('/products', product)
  }

  static DeleteProduct (id) {
    return Delete(`/products/${id}`)
  }

  static UpdateProduct (id, data) {
    return Put(`/products/${id}`, data)
  }

  static GetRecords (params) {
    return Get(`/inventory_records`, params)
  }
}

class Restrictions {
  static GetRestrictions () {
    return Get('/client/restrictions')
  }
}

class Premium {
  static CreatePremium (cardInfo) {
    return Post('/client/subscriptions', cardInfo)
  }
}

export default {
  init,
  User,
  Documents,
  Downloads,
  PaymentAccounts,
  TaxableEntities,
  EditUser,
  Suscriptions,
  EditClient,
  SentEmails,
  TaxStatements,
  Invoice,
  MultipleInvoicing,
  CustomCategories,
  Reports,
  Dashboard,
  Payments,
  Services,
  AccountingPeriods,
  Messages,
  Conciliation,
  InvoicesConsiderated,
  BanksSynchronization,
  Inventories,
  Restrictions,
  Premium
}
