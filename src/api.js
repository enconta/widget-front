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
import TopbarActions from 'actions/topbar'
import NotificationsActions from 'actions/notifications'
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

  TopbarActions.startLoader()

  // Call the API and return a json response
  return window
    .fetch(url, fetchParams)
    .then(handleServerErrors)
    .then(response => {
      TopbarActions.finishLoader()
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
      TopbarActions.finishLoader()
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
}

export default {
  BanksSynchronization
}
